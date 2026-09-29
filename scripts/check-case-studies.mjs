import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true, watch: null, ws: false }, appType: 'custom' });
try {
  const { CASE_STUDIES, MARKDOWN_DOCUMENT_ICON } = await server.ssrLoadModule('/src/data/caseStudies.ts');
  const { compileCaseStudy } = await server.ssrLoadModule('/src/components/CaseStudy/markdown.ts');
  const { MarkdownDoc } = await server.ssrLoadModule('/src/components/CaseStudy/MarkdownDoc.tsx');
  const { desktopItems } = await server.ssrLoadModule('/src/data/desktopContent.ts');
  const { gridApps } = await server.ssrLoadModule('/src/data/mobileContent.ts');
  assert.equal(Object.keys(CASE_STUDIES).length, 4);
  for (const config of Object.values(CASE_STUDIES)) {
    const blocks = compileCaseStudy(config);
    const html = renderToStaticMarkup(createElement(MarkdownDoc, { caseStudyId: config.id, onOpenItem() {} }));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${config.id}: one document title`);
    assert(!html.includes('<!--'), `${config.id}: no visible comments`);
    for (const [, name] of config.markdown.matchAll(/<!--\s*([A-Z_]+)/g)) {
      assert(config.directives[name], `${config.id}: missing directive ${name}`);
      assert(!html.includes(name), `${config.id}: leaked directive ${name}`);
    }
    for (const block of blocks.filter(b => b.directive?.layout === 'split')) {
      assert.equal(block.children.length, block.directive.paragraphs, `${config.id}: split retains preceding copy`);
    }
    for (const directive of Object.values(config.directives)) {
      for (const media of directive.media) {
        if (media.src) assert(existsSync(`public${media.src}`), `Missing real media: ${media.src}`);
      }
    }
    for (const entries of [desktopItems, gridApps]) {
      const matching = entries.filter(item => item.id === config.id);
      assert.equal(matching.length, 1);
      assert.equal(matching[0].kind, 'markdown');
      assert.equal(matching[0].label, config.label);
      assert.equal(matching[0].iconSrc, MARKDOWN_DOCUMENT_ICON);
      assert.equal(matching[0].caseStudyId, config.id);
      assert(!matching[0].textLines, 'Old content must not remain wired');
    }
    if (config.artDirection === 'product') {
      assert(html.includes('Work in progress'));
      assert(html.includes('moving toward beta launch'));
    }
    console.log(`✓ ${config.label}: render, directives, assets, desktop/mobile registration`);
  }
  for (const entries of [desktopItems, gridApps]) {
    const note = entries.find(item => item.id === 'smiley-txt');
    assert.equal(note.label, ':).txt');
    assert(note.plainText);
    assert.equal(new Set(entries.map(item => item.id)).size, entries.length);
    assert(!entries.some(item => /case study\.txt/i.test(item.label)));
  }
  const unknown = compileCaseStudy({ ...CASE_STUDIES['sap-graph-case-study'], markdown: '# Example\n\n<!-- UNKNOWN hidden -->\n\n<script>alert(1)</script>\n\n**Visible**', directives: {} });
  assert(!unknown.some(block => block.token?.type === 'html'));
  console.log('✓ Plain-text note, unique IDs, hidden HTML, and migration cleanup');
} finally { await server.close(); }
