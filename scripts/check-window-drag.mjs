import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync('src/components/Window/Window.tsx', 'utf8');
const dragSource = source.slice(source.indexOf('  const dragGeometryRef ='), source.indexOf('  // Move keyboard focus'));
const maximizeSource = source.slice(source.indexOf('  const toggleMaximize ='), source.indexOf('  // Second half'));
const plain = code => ts.transpile(code, { target: ts.ScriptTarget.ES2022 });
let drag, timer;
const state = {
  geometry: null, geometryAnimating: false, maximized: false,
  box: { left: 140, top: 100, width: 920, height: 640 },
  restoreGeometryRef: { current: null }, pendingGeometryRef: { current: null },
  geometryTimerRef: { current: null }, boundsRef: { current: {} },
  wrapperRef: { current: { offsetParent: { getBoundingClientRect: () => ({ left: 0, top: 0 }) } } },
  TITLE_BAR_REACH_PX: 80, TITLE_BAR_HEIGHT_PX: 38,
  useRef: current => ({ current }), useDrag: options => { drag = options; return {}; },
  measure: () => ({ ...state.box }),
  getWorkArea: () => ({ top: 36, bottom: 820, width: 1200, height: 900 }),
  onFocus() {}, motionDuration: () => 200,
  window: { clearTimeout() {}, setTimeout: fn => { timer = fn; } },
  setGeometry: value => { state.geometry = value; },
  setGeometryAnimating: value => { state.geometryAnimating = value; },
  setMaximized: value => { state.maximized = value; },
  setBasePosition: () => assert.fail('Measured drags must retain explicit geometry'),
  maximizedGeometry: () => ({ left: 8, top: 44, width: 1184, height: 768 }),
};
const context = vm.createContext(state);
vm.runInContext(plain(maximizeSource), context);
function start(origin) {
  // A fresh lexical scope models a React render.
  vm.runInContext(`{ ${plain(dragSource)} }`, context);
  drag.onDragStart({}, origin);
}
start({ x: 600, y: 115 });
drag.onDragEnd({ x: 75, y: 40 });
assert.equal(state.geometry.left, 215);
assert.equal(state.geometry.top, 140);
state.box = { ...state.geometry };
vm.runInContext('toggleMaximize()', context);
assert.equal(state.restoreGeometryRef.current.left, 215);
state.box = state.maximizedGeometry();
state.geometry = state.box;
start({ x: 600, y: 60 });
assert.equal(state.maximized, false);
assert.equal(state.geometry.width, 920);
assert.equal(state.geometry.left, 140, 'Restored window stays beneath the grab point');
drag.onDragEnd({ x: 100, y: 100 });
assert.equal(state.geometry.left, 240);
state.box = { ...state.geometry };
vm.runInContext('toggleMaximize()', context);
state.geometry = state.maximizedGeometry();
state.geometryAnimating = false;
vm.runInContext('toggleMaximize()', context);
timer();
assert.equal(state.geometry.left, 240, 'Restore retains the dropped position after its timer');
assert.equal(state.geometry.width, 920);
console.log('Window drag checks passed: normal drag, maximize, drag to restore, drop, repeated maximize/restore.');
