// Regenerate the downloadable proposal after editing its Markdown source.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';

const name = 'suzaan-sauerman-proposal';
const markdown = readFileSync(`src/data/${name}.md`, 'utf8')
  .replace(/^\[Download offer as PDF\]\(\/downloads\/suzaan-sauerman-proposal\.pdf\)$/gm, '');
const tokens = marked.lexer(markdown);
for (const token of tokens) {
  if (token.type !== 'table') continue;
  const column = token.header.findIndex(cell => cell.text === 'What’s included');
  if (column < 0) continue;
  for (const row of token.rows) {
    const cell = row[column];
    const items = cell.text.split('<br>').map(entry => `<li>${marked.parseInline(entry.trim())}</li>`);
    const list = `<ul>${items.join('')}</ul>`;
    cell.tokens = [{ type: 'html', raw: list, text: list, block: false }];
  }
}

const html = `<!DOCTYPE html>
<html lang="en">
<meta charset="utf-8">
<title>Content, personal brand and website proposal · Suzaan Sauerman</title>
<style>
@page { size: A4; margin: 16mm 17mm; }
body { font: 10pt/1.45 Arial, sans-serif; color: #1c1319; }
h1 { font-size: 24pt; line-height: 1.15; margin: 0 0 8px; color: #422735; }
h1 + p { color: #6b5a62; margin-bottom: 20px; }
h2 { font-size: 15pt; margin: 22px 0 10px; padding-top: 10px; border-top: 1px solid #e9e2e5; }
h3 { font-size: 11.5pt; margin: 16px 0 8px; }
h1, h2, h3 { break-after: avoid; }
p { margin: 0 0 10px; orphans: 2; widows: 2; }
a { color: #1759ab; }
ul, ol { margin: 6px 0 12px; padding-left: 20px; }
li { margin-bottom: 4px; break-inside: avoid; }
table { width: 100%; border-collapse: collapse; margin: 8px 0 12px; font-size: 9pt; }
thead { display: table-header-group; }
th, td { padding: 6px; text-align: left; vertical-align: top; border-bottom: 1px solid #e9e2e5; }
th { background: #f6f2f4; }
tr { break-inside: avoid; }
td ul { margin: 0; padding-left: 14px; }
table:has(th:nth-child(4)) th:first-child { width: 10%; }
table:has(th:nth-child(4)) th:nth-child(2) { width: 23%; }
table:has(th:nth-child(4)) th:last-child { width: 17%; }
</style>
<body>${marked.parser(tokens)}</body>
</html>`;

const work = mkdtempSync(join(tmpdir(), 'suzaan-proposal-'));
try {
  const htmlPath = join(work, `${name}.html`);
  writeFileSync(htmlPath, html);
  mkdirSync('public/downloads', { recursive: true });
  const output = resolve(`public/downloads/${name}.pdf`);
  const chrome = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const result = spawnSync(chrome, [
    '--headless', '--disable-gpu', '--no-pdf-header-footer',
    `--user-data-dir=${join(work, 'chrome')}`,
    `--print-to-pdf=${output}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Chrome PDF export exited with status ${result.status}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
