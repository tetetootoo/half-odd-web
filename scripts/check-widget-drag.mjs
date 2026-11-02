import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = readFileSync('src/components/IntroNote/IntroNote.tsx', 'utf8');
const code = source.slice(source.indexOf('  const { offset, handlers }'), source.indexOf('\n  return ('));
let drag;
const state = {
  desktop: true, position: { x: 40, y: 50 },
  dragOrigin: { current: null }, dragBounds: { current: {} }, draggedPosition: { current: null },
  geometry: () => ({ maxX: 800, maxY: 500, fits: () => false }),
  setPosition: value => { state.position = value; },
  useDrag: options => { drag = options; return {}; },
};
vm.runInNewContext(ts.transpile(code, { target: ts.ScriptTarget.ES2022 }), state);
drag.onDragStart();
const delta = drag.clamp({ x: 160, y: 100 });
drag.onDragEnd(delta);
assert.equal(state.position.x, 200, 'Drops near icons retain the chosen position');
assert.equal(state.position.y, 150);
drag.onDragStart();
state.position = { x: 999, y: 999 };
const edge = drag.clamp({ x: 2000, y: -2000 });
drag.onDragEnd(edge);
assert.equal(state.position.x, 800, 'Bounds use the stable drag origin');
assert.equal(state.position.y, 8);
drag.onDragStart();
drag.onDragCancel();
assert.equal(state.dragOrigin.current, null);
assert.equal(state.position.x, 800, 'Cancellation preserves the previous drop');
console.log('Widget drag checks passed: overlapping drops, repeated dragging, stable bounds, cancellation.');
