'use strict';

// Local renderer: Python + markdown-it-py, Node >= 22 and Chrome/Edge.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn, execFileSync } = require('node:child_process');
const { once } = require('node:events');
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  execFileSync(process.env.PYTHON || 'python', [path.join(__dirname, 'build.py')], {
    stdio: 'inherit', windowsHide: true, env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  const browser = process.env.REPORT_BROWSER || [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/chromium', '/usr/bin/google-chrome',
  ].find((file) => fs.existsSync(file));
  if (!browser) throw new Error('Set REPORT_BROWSER to a Chrome/Edge executable');
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'wellwork-report-'));
  const profile = path.join(temporary, 'profile');
  const child = spawn(browser, ['--headless=new', '--disable-background-networking',
    '--disable-extensions', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1',
    `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let launchError;
  child.on('error', (error) => { launchError = error; });
  let ws;
  const pending = new Map();
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; !fs.existsSync(portFile); i++) {
      if (launchError) throw launchError;
      if (child.exitCode !== null || i >= 100) throw new Error('Browser startup failed');
      await pause(200);
    }
    const port = Number(fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0]);
    const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl);
    await once(ws, 'open');
    let sequence = 0;
    ws.addEventListener('message', ({ data }) => {
      const response = JSON.parse(data);
      const request = pending.get(response.id);
      if (!request) return;
      clearTimeout(request.timer); pending.delete(response.id);
      if (response.error) request.reject(new Error(JSON.stringify(response.error)));
      else request.resolve(response.result);
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, 30000);
      pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async (expression) => {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1.5, mobile: false });
    await send('Page.navigate', { url: pathToFileURL(path.join(__dirname, 'Dossier_remediation_WellWork.html')).href });
    let result;
    for (let i = 0; i < 150; i++) {
      const error = await evaluate('typeof window.reportError === "string" ? window.reportError : null');
      if (error) throw new Error(error);
      result = await evaluate('window.reportResult');
      if (result) break;
      await pause(100);
    }
    if (!result) throw new Error('Pagination timed out');
    console.log(JSON.stringify(result));
    fs.writeFileSync(path.join(__dirname, 'verification.json'), JSON.stringify(result, null, 2) + '\n');
    const valid = result.mainPages <= 30 && !result.overflow.length && !result.brokenLinks.length && !result.missingContent.length;
    const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: false, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
    const output = path.join(valid ? __dirname : temporary, 'Dossier_remediation_WellWork.pdf');
    fs.writeFileSync(output, Buffer.from(pdf.data, 'base64'));
    console.log(`PDF: ${output}`);
    const samples = [...new Set([1, 2, 4, 8, result.mainPages, ...result.starts.map((item) => item.page)])];
    for (const page of samples) {
      await evaluate(`Array.from(document.querySelectorAll('.sheet')).forEach((sheet,index) => {
        sheet.style.display = index === ${page - 1} ? 'block' : 'none'; sheet.style.margin = '0';
      }); window.scrollTo(0,0);`);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(temporary, `page-${page}.png`), Buffer.from(shot.data, 'base64'));
    }
    console.log(`Previews: ${temporary}`);
    if (!valid) throw new Error('Pagination/link checks failed; final PDF not overwritten');
  } finally {
    for (const request of pending.values()) clearTimeout(request.timer);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ id: 0, method: 'Browser.close' })); await pause(200);
    }
    if (ws) ws.close();
    if (child.exitCode === null) child.kill();
  }
}
main().catch((error) => { console.error(error.stack || error); process.exitCode = 1; });
