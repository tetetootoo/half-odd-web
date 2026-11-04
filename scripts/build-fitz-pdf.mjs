// node scripts/build-fitz-pdf.mjs [--pdf]
// HTML and PDF share the proposal's Markdown source. --pdf requires local Chrome;
// set CHROME_BIN to use another installed Chromium executable.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked, Lexer } from 'marked';
mkdirSync('tmp/pdfs', { recursive: true });
const markdown = readFileSync('src/data/fitz-proposal.md', 'utf8');
const contact = /mail: '([^']+)'/.exec(readFileSync('src/data/mobileContent.ts', 'utf8'))?.[1];
if (!contact) throw new Error('Public portfolio contact address missing');
const mailto = `mailto:${contact}?subject=${encodeURIComponent('FITZ-Website · Projektstart abstimmen')}`;
const linkedMarkdown = markdown.replace('**Projektstart abstimmen**  \nAngebot als PDF herunterladen', `[Projektstart abstimmen](${mailto})  \n[Angebot online ansehen](https://halfodd.com/proposal/fitz)`);
let body = marked.parse(linkedMarkdown);
const playtomic = Lexer.lex(markdown.split('### Playtomic-Termine im FITZ-Design')[1] ?? '').find(token => token.type === 'table');
if (playtomic) {
  body = body.replace(marked.parse(playtomic.raw), `<div class="options">${playtomic.rows.map(row => `<article><h4>${row[0].text.replaceAll('**', '')} · ${row[2].text.replaceAll('**', '')}</h4>${marked.parse(row[1].text)}</article>`).join('')}</div>`);
}
const htmlPath = resolve('tmp/pdfs/fitz-angebot.html');
writeFileSync(htmlPath, `<!doctype html><html lang="de"><meta charset="utf-8"><title>FITZ Sports Club - Angebot</title><style>
@page {size:A4;margin:16mm 17mm 16mm}body{font:10pt/1.5 Arial,sans-serif;color:#1c1319}h1{font-size:25pt;line-height:1.15;margin:0 0 22px;color:#35402f}h2{font-size:17pt;line-height:1.25;margin:30px 0 16px;border-top:1px solid #ddd;padding-top:18px;break-after:avoid}h3{font-size:12pt;margin:22px 0 12px;break-after:avoid}p{margin:0 0 12px}a{color:#1759ab}table{border-collapse:collapse;width:100%;font-size:9pt;line-height:1.5;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;vertical-align:top;text-align:left}th{background:#f3f5f0}tr{break-inside:avoid}thead{display:table-header-group}li{margin-bottom:9px}strong{font-weight:600}td:first-child{width:25%}td:last-child{white-space:normal!important}h2,h3{break-inside:avoid}.options article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0;break-inside:avoid}.options h4{font-size:11pt;margin:0 0 8px}.options p{margin:0}
</style><body>${body}</body></html>`);
if (process.argv.includes('--pdf')) {
  mkdirSync('public/downloads', { recursive: true });
  const chrome = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const result = spawnSync(chrome, ['--headless', '--disable-gpu', '--no-pdf-header-footer', '--user-data-dir=/private/tmp/fitz-pdf-chrome', `--print-to-pdf=${resolve('public/downloads/fitz-angebot.pdf')}`, pathToFileURL(htmlPath).href], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
