/* global document, window */
'use strict';

async function paginate() {
  await document.fonts.ready;
  const pages = document.getElementById('pages');
  const normalize = (value) => value.replace(/\s/g, '');
  const sourceBlocks = Array.from(document.querySelectorAll('#source p,#source li,#source td,#source pre,#source h2,#source h3'))
    .map((el) => normalize(el.textContent)).filter(Boolean);
  const labels = { A: 'A · Cartographie et conformité', B: 'B · Audit de sécurité', C: 'C · Remédiation', D: 'D · Pilotage agile', annexe: 'Annexes · Hors limite de 30 pages' };
  let group = 'front';
  let body;
  const newPage = () => {
    const page = document.createElement('section');
    page.className = 'sheet';
    page.dataset.group = group;
    page.innerHTML = `<header class="page-head"><span>WELLWORK · Audit RGPD et sécurité</span><span>${labels[group] || 'Dossier de remédiation'}</span></header><div class="page-body"></div><footer class="page-foot"><span>${group === 'annexe' ? 'Annexes' : 'Corps du dossier A–D'}</span><span>${pages.children.length + 1}</span></footer>`;
    pages.append(page);
    body = page.querySelector('.page-body');
    return body;
  };
  const fits = () => body.scrollHeight <= body.clientHeight + 1;
  const heading = (node) => /^H[1-4]$/.test(node.tagName) || node.tagName === 'A';
  const nextPage = () => {
    const trailing = [];
    while (body.lastElementChild && heading(body.lastElementChild)) trailing.unshift(body.removeChild(body.lastElementChild));
    newPage();
    trailing.forEach((el) => body.append(el));
  };
  const place = (node) => {
    body.append(node);
    if (!fits()) {
      node.remove();
      nextPage();
      body.append(node);
      if (!fits()) throw new Error(`Block exceeds one page: ${node.textContent.slice(0, 100)}`);
    }
  };
  newPage().append(document.getElementById('cover').content.cloneNode(true));
  const toc = newPage();
  toc.innerHTML = '<h1>Sommaire</h1><p>Les liens conduisent aux sections du dossier. Le code et les sources officielles sont accessibles en ligne.</p><div id="toc-items"></div><p class="toc-note">A–B : constats sur la version initiale. C : corrections et risques restants. D : plan de remédiation proposé.</p>';
  const entries = [];
  for (const article of document.querySelectorAll('#source article')) {
    const id = article.dataset.id;
    if (group === 'front' || article.dataset.group === 'annexe') {
      group = article.dataset.group;
      newPage();
    } else if (article.dataset.group !== group) {
      group = article.dataset.group;
      body.closest('.sheet').querySelector('.page-head span:last-child').textContent = 'Dossier de remédiation · Parties A–D';
    }
    // Headings and explicit source anchors get stable, document-scoped destinations.
    for (const h of article.querySelectorAll('h1,h2,h3,h4')) {
      const slug = h.textContent.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
      h.id = `${id}--${slug}`;
    }
    const title = article.querySelector('h1');
    title.id = id;
    if (group === 'annexe') title.textContent = article.dataset.title;
    entries.push({ id, title: article.dataset.title, annex: group === 'annexe' });
    const blocks = [];
    for (const node of Array.from(article.children)) {
      if (node.tagName === 'TABLE' && node.querySelectorAll('thead th').length >= 4) {
        const heads = Array.from(node.querySelectorAll('thead th')).map((el) => el.textContent);
        for (const row of node.querySelectorAll('tbody tr')) {
          const cells = Array.from(row.children);
          const card = document.createElement('div'); card.className = 'record';
          const h = document.createElement('h4'); h.innerHTML = cells[0].innerHTML; card.append(h);
          for (let i = 1; i < cells.length; i++) {
            const p = document.createElement('p'); const strong = document.createElement('strong');
            strong.textContent = `${heads[i]} : `; p.append(strong); p.insertAdjacentHTML('beforeend', cells[i].innerHTML); card.append(p);
          }
          blocks.push(card);
        }
      } else if (['UL', 'OL'].includes(node.tagName)) {
        Array.from(node.children).forEach((li, i) => { const list = document.createElement(node.tagName); if (node.tagName === 'OL') list.start = i + 1; list.append(li); blocks.push(list); });
      } else blocks.push(node);
    }
    for (const node of blocks) {
      if (node.tagName !== 'TABLE') { place(node); continue; }
      const rows = Array.from(node.querySelectorAll('tbody tr'));
      const weights = Array.from(node.querySelectorAll('thead th')).map((_, i) => {
        const average = rows.reduce((sum, row) => sum + row.children[i].textContent.length, 0) / rows.length;
        return Math.max(6, Math.sqrt(average) * 2);
      });
      const sumWeights = weights.reduce((sum, value) => sum + value, 0);
      let table;
      const makeTable = () => {
        table = document.createElement('table');
        const columns = document.createElement('colgroup');
        weights.forEach((weight) => { const col = document.createElement('col'); col.style.width = `${weight / sumWeights * 100}%`; columns.append(col); });
        table.append(columns);
        table.append(node.querySelector('thead').cloneNode(true), document.createElement('tbody'));
        body.append(table);
      };
      makeTable();
      for (const row of rows) {
        table.querySelector('tbody').append(row);
        if (!fits()) {
          row.remove();
          if (!table.querySelector('tbody').children.length) table.remove();
          nextPage(); makeTable(); table.querySelector('tbody').append(row);
          if (!fits()) throw new Error(`Table row exceeds page: ${row.textContent.slice(0, 80)}`);
        }
      }
    }
  }
  const tocItems = document.getElementById('toc-items');
  let annexLabel = false;
  for (const item of entries) {
    if (item.annex && !annexLabel) { tocItems.insertAdjacentHTML('beforeend', '<div class="toc-divider">Annexes</div>'); annexLabel = true; }
    const destination = document.getElementById(item.id);
    const page = Array.from(pages.children).indexOf(destination.closest('.sheet')) + 1;
    const row = document.createElement('div'); row.className = 'toc-row' + (item.annex ? ' annex' : '');
    const link = document.createElement('a'); link.href = `#${item.id}`; link.textContent = item.title;
    const number = document.createElement('span'); number.textContent = page; row.append(link, number); tocItems.append(row);
  }
  const mainCount = pages.querySelectorAll('.sheet:not([data-group="annexe"])').length;
  document.getElementById('body-count').textContent = mainCount;
  document.getElementById('annex-count').textContent = pages.children.length - mainCount;
  const brokenLinks = Array.from(pages.querySelectorAll('a[href^="#"]')).filter((el) => !document.getElementById(decodeURIComponent(el.hash.slice(1)))).map((el) => el.hash);
  const overflow = Array.from(pages.children).flatMap((page, i) => {
    const content = page.querySelector('.page-body');
    return content.scrollHeight > content.clientHeight + 1 || content.scrollWidth > content.clientWidth + 1 ? [i + 1] : [];
  });
  const renderedText = normalize(pages.textContent);
  const missingContent = sourceBlocks.filter((value) => !renderedText.includes(value));
  window.reportResult = { mainPages: mainCount, annexPages: pages.children.length - mainCount, totalPages: pages.children.length, brokenLinks, overflow,
    sourceBlocksChecked: sourceBlocks.length, missingContent,
    starts: entries.map((entry) => ({ title: entry.title, page: Array.from(pages.children).indexOf(document.getElementById(entry.id).closest('.sheet')) + 1 })) };
}

paginate().catch((error) => { window.reportError = error.message; });
