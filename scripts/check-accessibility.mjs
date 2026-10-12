import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true, watch: null, ws: false }, appType: 'custom' });
const noop = () => {};
try {
  globalThis.window = { matchMedia: () => ({ matches: false }) };
  const { Desktop } = await server.ssrLoadModule('/src/components/Desktop/Desktop.tsx');
  const { Mobile } = await server.ssrLoadModule('/src/components/Mobile/Mobile.tsx');
  const { Window } = await server.ssrLoadModule('/src/components/Window/Window.tsx');
  const { TrashContext } = await server.ssrLoadModule('/src/components/Trash/TrashContext.ts');
  const { systemWindows } = await server.ssrLoadModule('/src/data/desktopContent.ts');
  const { AccessibleVideo } = await server.ssrLoadModule('/src/components/AccessibleVideo.tsx');
  for (const Component of [Desktop, Mobile]) {
    const html = renderToStaticMarkup(createElement(Component));
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, 'One main landmark');
    assert(html.includes('aria-label="Dock"'), 'Named navigation');
    assert(!/tabindex="[1-9]/.test(html), 'No positive tab index');
  }
  const desktop = renderToStaticMarkup(createElement(Desktop));
  for (const direction of ['left', 'right', 'up', 'down']) assert(desktop.includes(`aria-label="Move object ${direction}"`), 'Non-drag movement alternatives');
  const context = { entries: [], builtIn: [], dropActive: false, onOpen: noop, onPutBack: noop, onDragOutMove: noop, onDragOutCancel: noop, onDragOutEnd: noop };
  const mail = renderToStaticMarkup(createElement(TrashContext.Provider, { value: context }, createElement(Window, {
    item: systemWindows.find(item => item.id === 'mail'),
    managed: { id: 'mail', phase: 'open', restored: false, cascadeIndex: 0, focusToken: 1 },
    isActive: true, zIndex: 1, getWorkArea: noop, onFocus: noop, onClose: noop, onFinishClose: noop, onFinishMinimize: noop, onOpenItem: noop,
  })));
  assert(mail.includes('role="dialog"') && !mail.includes('aria-modal'), 'Desktop windows stay non-modal');
  assert(mail.includes('role="status"'), 'Persistent contact status region');
  assert(mail.includes('autoComplete="name"') && mail.includes('autoComplete="email"'), 'Input purposes identified');
  for (const direction of ['left', 'right', 'up', 'down']) assert(mail.includes(`aria-label="Move window ${direction}"`));
  for (const reduced of [false, true]) {
    globalThis.window.matchMedia = () => ({ matches: reduced });
    const html = renderToStaticMarkup(createElement(AccessibleVideo, { src: '/preview.mp4', autoPlay: true, loop: true }));
    assert(html.includes('controls=""'), 'Pause controls available for every preference');
    assert.equal(html.includes('autoPlay'), !reduced, 'Reduced motion prevents autoplay');
    assert.equal(html.includes('loop=""'), !reduced, 'Reduced motion prevents looping');
  }
  const luminance = hex => {
    const c = hex.match(/\w\w/g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };
  const contrast = (a,b) => (Math.max(luminance(a),luminance(b)) + .05) / (Math.min(luminance(a),luminance(b)) + .05);
  const iconCss = readFileSync('src/components/DesktopIcon/DesktopIcon.module.css','utf8');
  const labelColor = /\.label\s*\{[^}]*color:\s*#([\da-f]{6})/i.exec(iconCss)[1];
  assert(contrast(labelColor, 'f2a7cb') >= 4.5, 'Desktop labels meet minimum text contrast on pink');
  const linkCss = readFileSync('src/index.css','utf8');
  const linkColor = /a\s*\{[^}]*color:\s*#([\da-f]{6})/i.exec(linkCss)[1];
  assert(contrast(linkColor, 'ffffff') >= 4.5 && contrast(linkColor, 'f6f2f4') >= 4.5, 'Link color meets contrast on document surfaces');
  console.log('✓ Landmarks, native movement alternatives, non-modal windows, contact semantics, video preferences and contrast');
} finally {
  delete globalThis.window;
  await server.close();
}
