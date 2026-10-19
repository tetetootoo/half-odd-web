import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync('src/hooks/useOverlayLink.ts', 'utf8').replace(/import .* from 'react';/, 'const { useEffect, useRef } = hooks;').replace('export function', 'function');
const code = ts.transpile(source, { target: ts.ScriptTarget.ES2022 });
function scenario(initialHash = '') {
  const refs = [], effects = [], listeners = new Map();
  let cursor = 0, effectCursor = 0, active = null, index = 0;
  let entries = [{ url: `https://example.test/${initialHash}`, state: null }];
  const window = {
    location: new URL(entries[0].url),
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: name => listeners.delete(name),
    history: {
      get state() { return entries[index].state; },
      pushState(state, _, url) { entries = entries.slice(0, index + 1); entries.push({ state, url: String(url) }); index++; window.location = new URL(url); },
      replaceState(state, _, url) { entries[index] = { state, url: String(url) }; window.location = new URL(url); },
      back() { travel(-1); },
    },
  };
  function travel(delta) {
    index = Math.max(0, Math.min(entries.length - 1, index + delta));
    window.location = new URL(entries[index].url);
    listeners.get('popstate')?.();
    listeners.get('hashchange')?.();
  }
  const hooks = {
    useRef(value) { const i = cursor++; return refs[i] ??= { current: value }; },
    useEffect(callback, deps) {
      const i = effectCursor++;
      if (!effects[i] || deps.some((value, j) => value !== effects[i].deps[j])) effects[i] = { callback, deps, pending: true };
    },
  };
  const context = vm.createContext({ hooks, window, URL, decodeURIComponent, encodeURIComponent });
  vm.runInContext(code, context);
  function render() {
    for (let i = 0; i < 3; i++) {
      cursor = effectCursor = 0;
      context.useOverlayLink(active, id => id === 'about-me' ? 'about' : id, id => { active = id; }, () => { active = null; });
      for (const effect of effects) if (effect.pending) { effect.pending = false; effect.callback(); }
    }
  }
  render();
  return { open(id) { active = id; render(); }, close() { active = null; render(); }, back() { travel(-1); render(); }, forward() { travel(1); render(); }, get active() { return active; }, get hash() { return window.location.hash; }, get length() { return entries.length; } };
}
const app = scenario();
app.open('about');
assert.equal(app.hash, '#about-me');
assert.equal(app.length, 2);
app.open('notes');
assert.equal(app.length, 2, 'Switching overlays keeps home one Back away');
app.back();
assert.equal(app.active, null);
assert.equal(app.hash, '');
app.forward();
assert.equal(app.active, 'notes');
app.close();
assert.equal(app.hash, '');
assert.equal(app.active, null);
const deepLink = scenario('#about-me');
assert.equal(deepLink.active, 'about');
deepLink.close();
assert.equal(deepLink.hash, '', 'Closing a direct link stays on the site');
console.log('✓ Overlay URLs, Back, Forward, switching, close and direct links');
