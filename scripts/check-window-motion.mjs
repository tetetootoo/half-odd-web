import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { gsap } from 'gsap';

const source = readFileSync('src/hooks/useWindowDockTransition.ts', 'utf8')
  .replace(/^import .*;\n/gm, '')
  .replace('export function', 'function');
const code = ts.transpile(source, { target: ts.ScriptTarget.ES2022 });
function scenario(reduced = false) {
  const refs = [];
  let cursor = 0, effect, cleanup, completions = 0;
  const preference = { matches: reduced, addEventListener() {}, removeEventListener() {} };
  const element = {
    offsetWidth: 600, offsetHeight: 400,
    contains: () => true,
    parentElement: { getBoundingClientRect: () => ({ left: 100, top: 100 }) },
    x: 0, y: 0, scale: 1, opacity: 1, transformOrigin: '', clearProps: '',
  };
  const dock = { dataset: { dockWindow: 'test' }, getBoundingClientRect: () => ({ left: 700, top: 800, width: 50, height: 50 }) };
  const context = vm.createContext({
    gsap, useRef: value => refs[cursor++] ??= { current: value },
    useLayoutEffect: callback => { effect = callback; },
    window: { matchMedia: () => preference },
    document: { activeElement: {}, querySelectorAll: () => [dock] },
  });
  vm.runInContext(code, context);
  const ref = { current: element };
  function render(phase) {
    cleanup?.(); cursor = 0;
    context.useWindowDockTransition(ref, 'test', phase, hadFocus => { assert(hadFocus); completions++; });
    cleanup = effect();
    return gsap.getTweensOf(refs[0].current)[0];
  }
  return { render, element, progress: () => refs[0].current.value, completions: () => completions, dispose: () => cleanup?.() };
}
try {
  const s = scenario();
  const minimize = s.render('minimizing').pause();
  minimize.progress(.5);
  const position = s.element.x;
  assert(position > 0 && s.element.y > 0 && s.element.scale < 1, 'Travels and shrinks toward dock');
  const restore = s.render('open').pause();
  assert.equal(s.element.x, position, 'Interruption preserves current position');
  restore.progress(.5);
  assert(s.element.x < position && s.element.x > 0, 'Restore reverses toward original position');
  const minimizeAgain = s.render('minimizing').pause();
  minimizeAgain.progress(1);
  assert.equal(s.completions(), 1, 'Only current minimize completes');
  s.render('minimized');
  const fullRestore = s.render('open').pause();
  fullRestore.progress(1);
  assert.equal(s.progress(), 0, 'Full restore returns to original geometry');
  assert.equal(s.element.x, 0);
  s.dispose();

  const reduced = scenario(true);
  reduced.render('minimizing')?.progress(1);
  assert.equal(reduced.completions(), 1, 'Reduced motion completes lifecycle');
  assert.equal(reduced.element.x, 0, 'Reduced motion avoids travel');
  assert.equal(reduced.element.scale, 1, 'Reduced motion avoids scaling');
  reduced.dispose();
  console.log('Window motion checks passed: dock travel, interruption, repeated reversal, restore, reduced motion.');
} finally {
  gsap.globalTimeline.clear();
  gsap.ticker.sleep();
}
