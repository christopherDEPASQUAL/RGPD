'use strict';

// Local PDF renderer: Node >= 22 with WebSocket, Chrome/Edge, no added dependency.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const browser = process.env.PRESENTATION_BROWSER || [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/chromium', '/usr/bin/google-chrome',
  ].find((file) => fs.existsSync(file));
  if (!browser || !fs.existsSync(browser)) throw new Error('Set PRESENTATION_BROWSER to a Chrome/Edge executable');
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'wellwork-slides-'));
  const profile = path.join(temporary, 'profile');
  const child = spawn(browser, [
    '--headless=new', '--disable-background-networking', '--disable-extensions',
    '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
    '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, 'about:blank',
  ], { windowsHide: true, stdio: 'ignore' });
  let launchError;
  child.on('error', (error) => { launchError = error; });
  let ws;
  const pending = new Map();
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; !fs.existsSync(portFile); i++) {
      if (launchError) throw launchError;
      if (child.exitCode !== null || i >= 100) throw new Error('Browser did not start within 20 seconds');
      await pause(200);
    }
    const port = Number(fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0]);
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(pages.find((page) => page.type === 'page').webSocketDebuggerUrl);
    await once(ws, 'open');
    let sequence = 0;
    ws.addEventListener('message', ({ data }) => {
      const response = JSON.parse(data);
      const request = pending.get(response.id);
      if (!request) return;
      clearTimeout(request.timer);
      pending.delete(response.id);
      if (response.error) request.reject(new Error(JSON.stringify(response.error)));
      else request.resolve(response.result);
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, 15000);
      pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async (expression) => {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: pathToFileURL(path.join(__dirname, 'partie-e.html')).href });
    for (let i = 0; i < 100; i++) {
      if (await evaluate('document.readyState === "complete" && document.querySelectorAll(".slide").length === 5')) break;
      if (i === 99) throw new Error('Slides did not load');
      await pause(100);
    }
    await evaluate('document.fonts.ready.then(() => true)');
    const layout = await evaluate(`Array.from(document.querySelectorAll('.slide')).map((slide, index) => {
      const bounds = slide.getBoundingClientRect();
      const footer = slide.querySelector('.footer').getBoundingClientRect();
      const overflow = Array.from(slide.children).filter(el => !el.classList.contains('footer')).filter(el => {
        const r = el.getBoundingClientRect();
        return r.bottom > footer.top - 10 || r.right > bounds.right || r.left < bounds.left;
      }).map(el => el.className || el.tagName);
      return { page: index + 1, overflow };
    })`);
    console.log(JSON.stringify({ layout }));
    // Write browser-generated previews outside the repository for visual review.
    const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: false, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
    const output = path.join(__dirname, 'partie-e.pdf');
    if (layout.every((page) => page.overflow.length === 0)) {
      fs.writeFileSync(output, Buffer.from(pdf.data, 'base64'));
      console.log(`PDF: ${output}`);
    }
    for (let page = 0; page < 5; page++) {
      await evaluate(`Array.from(document.querySelectorAll('.slide')).forEach((slide,index) => {
        slide.style.display = index === ${page} ? 'block' : 'none'; slide.style.margin = '0';
      }); window.scrollTo(0,0);`);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(temporary, `slide-${page + 1}.png`), Buffer.from(shot.data, 'base64'));
    }
    console.log(`Previews: ${temporary}`);
    if (layout.some((page) => page.overflow.length)) throw new Error('Layout overflow: PDF was not overwritten');
  } finally {
    for (const request of pending.values()) clearTimeout(request.timer);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ id: 0, method: 'Browser.close' }));
      await pause(200);
    }
    if (ws) ws.close();
    if (child.exitCode === null) child.kill();
    // Keep the isolated profile and previews in the system temp directory.
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
