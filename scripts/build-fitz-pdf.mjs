import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';
const markdown = readFileSync('src/data/fitz-proposal.md', 'utf8');
writeFileSync('tmp/pdfs/fitz-angebot.html', `<!doctype html><html lang="de"><meta charset="utf-8"><title>FITZ Sports Club - Angebot</title><style>
@page {size:A4;margin:16mm 17mm 16mm}body{font:10pt/1.5 Arial,sans-serif;color:#1c1319}h1{font-size:25pt;line-height:1.15;margin:0 0 22px;color:#35402f}h2{font-size:17pt;line-height:1.25;margin:30px 0 16px;border-top:1px solid #ddd;padding-top:18px;break-after:avoid}h3{font-size:12pt;margin:22px 0 12px;break-after:avoid}p{margin:0 0 12px}a{color:#1759ab}table{border-collapse:collapse;width:100%;font-size:9pt;line-height:1.5;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;vertical-align:top;text-align:left}th{background:#f3f5f0}tr{break-inside:avoid}thead{display:table-header-group}li{margin-bottom:9px}strong{font-weight:600}td:first-child{width:25%}td:last-child{white-space:normal!important}h2,h3{break-inside:avoid}
</style><body>${marked.parse(markdown)}</body></html>`);
