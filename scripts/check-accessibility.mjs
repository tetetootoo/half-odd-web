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
    assert(!html.includes('controls='), 'Video player controls are hidden');
    assert(html.includes('autoPlay'), 'Videos autoplay');
    assert(html.includes('loop=""'), 'Videos loop');
    assert(html.includes('muted=""') && html.includes('playsInline=""'), 'Videos stay muted and inline');
  }
  const luminance = hex => {
    assert(/^(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex), `Unsupported hex color: ${hex}`);
    if (hex.length === 3) hex = [...hex].map(value => value.repeat(2)).join('');
    const c = hex.match(/\w\w/g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };
  const contrast = (a,b) => (Math.max(luminance(a),luminance(b)) + .05) / (Math.min(luminance(a),luminance(b)) + .05);
  const hexDeclaration = (css, selector, property) => {
    const declarations = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`))?.[1];
    const hex = declarations?.match(new RegExp(`(?:^|;)\\s*${property}:\\s*#([\\da-f]{6}|[\\da-f]{3})(?=\\s*[;}]|\\s*$)`, 'i'))?.[1];
    assert(hex, `Expected a hex ${property} declaration for ${selector}`);
    return hex;
  };
  assert.equal(contrast('fff', '000'), 21, 'Shorthand hex colors are supported');
  const iconCss = readFileSync('src/components/DesktopIcon/DesktopIcon.module.css','utf8');
  const labelColor = hexDeclaration(iconCss, '\\.label', 'color');
  const desktopCss = readFileSync('src/components/Desktop/Desktop.module.css','utf8');
  const desktopColor = hexDeclaration(desktopCss, '\\.desktop', 'background');
  assert(contrast(labelColor, desktopColor) >= 4.5, 'Desktop labels meet minimum text contrast on the desktop background');
  const linkCss = readFileSync('src/index.css','utf8');
  const linkColor = hexDeclaration(linkCss, 'a', 'color');
  assert(contrast(linkColor, 'ffffff') >= 4.5 && contrast(linkColor, 'f6f2f4') >= 4.5, 'Link color meets contrast on document surfaces');
  console.log('✓ Landmarks, native movement alternatives, non-modal windows, contact semantics, video preferences and contrast');
} finally {
  delete globalThis.window;
  await server.close();
}
