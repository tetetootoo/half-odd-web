// node scripts/build-fitz-pdf.mjs [--pdf]
// HTML and PDF share the proposal's Markdown source. --pdf requires local Chrome;
// set CHROME_BIN to use another installed Chromium executable.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';
mkdirSync('tmp/pdfs', { recursive: true });
const markdown = readFileSync('src/data/fitz-proposal.md', 'utf8');
const contact = /mail: '([^']+)'/.exec(readFileSync('src/data/mobileContent.ts', 'utf8'))?.[1];
if (!contact) throw new Error('Public portfolio contact address missing');
const mailto = `mailto:${contact}?subject=${encodeURIComponent('FITZ-Website · Projektstart abstimmen')}`;
const linkedMarkdown = markdown.replace('**Projektstart abstimmen**  \nAngebot als PDF herunterladen', `[Projektstart abstimmen](${mailto})  \n[Angebot online ansehen](https://halfodd.com/proposal/fitz)`);
const body = marked.parse(linkedMarkdown)
  .replace('<p><strong>* Zu Pos. 07a und 07b</strong></p>', '<p class="note-heading"><strong>* Zu Pos. 07a und 07b</strong></p>')
  .replace('<p>Ich habe mir die Playtomic-API angesehen.', '<p class="note">Ich habe mir die Playtomic-API angesehen.')
  .replace('<p>Pos. 07a und 07b stehen alternativ zur Auswahl.', '<p class="note">Pos. 07a und 07b stehen alternativ zur Auswahl.');
const htmlPath = resolve('tmp/pdfs/fitz-angebot.html');
writeFileSync(htmlPath, `<!doctype html><html lang="de"><meta charset="utf-8"><title>FITZ Sports Club - Angebot</title><style>
@page {size:A4;margin:16mm 17mm 16mm}body{font:10pt/1.5 Arial,sans-serif;color:#1c1319}h1{font-size:25pt;line-height:1.15;margin:0 0 22px;color:#35402f}h2{font-size:17pt;line-height:1.25;margin:30px 0 16px;border-top:1px solid #ddd;padding-top:18px;break-after:avoid}h3{font-size:12pt;margin:22px 0 12px;break-after:avoid}p{margin:0 0 12px}a{color:#1759ab}table{border-collapse:collapse;width:100%;font-size:9pt;line-height:1.5;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;vertical-align:top;text-align:left}th{background:#f3f5f0}tr{break-inside:avoid}thead{display:table-header-group}li{margin-bottom:9px}strong{font-weight:600}td:first-child{width:25%}td:last-child{white-space:normal!important}h2,h3{break-inside:avoid}.options article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0;break-inside:avoid}.options h4{font-size:11pt;margin:0 0 8px}.options p{margin:0}
table:has(th:nth-child(4)) th:first-child,table:has(th:nth-child(4)) td:first-child{width:6%}table:has(th:nth-child(4)) th:nth-child(2),table:has(th:nth-child(4)) td:nth-child(2){width:24%}table:has(th:nth-child(4)) th:nth-child(3),table:has(th:nth-child(4)) td:nth-child(3){width:52%}table:has(th:nth-child(4)) th:last-child,table:has(th:nth-child(4)) td:last-child{width:18%}
h2:last-of-type{break-before:page}
.note-heading{margin-bottom:4px;break-after:avoid}.note{font-size:9pt;line-height:1.5;margin-bottom:8px}
</style><body>${body}</body></html>`);
if (process.argv.includes('--pdf')) {
  mkdirSync('public/downloads', { recursive: true });
  const chrome = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const result = spawnSync(chrome, ['--headless', '--disable-gpu', '--no-pdf-header-footer', '--user-data-dir=/private/tmp/fitz-pdf-chrome', `--print-to-pdf=${resolve('public/downloads/fitz-angebot.pdf')}`, pathToFileURL(htmlPath).href], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
