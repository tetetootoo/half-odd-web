# Working at SAP — no assets needed

The page was rebuilt from scratch around a full new outline: restrained,
typographic, diagram-led rather than product-screenshot-led (SAP Graph's
UI is proprietary, so nothing on the page recreates or implies it).

Every diagram is native HTML/CSS (thin-bordered boxes, connector glyphs,
no fills or gradients) rather than an image — the university/SAP-Graph
tree, the component-layering stack, the tooltip micro-diagram, the
internal-approach/considered-exception comparison, and the "software
that can change" concept flow are all built as data in
`src/data/workingAtSAP.ts` using reusable primitives from
`src/data/textBlocks.ts` (`flowDiagram`, `flowComparison`,
`layerDiagram`, `narrow`, `escalatingStatement`, `eyebrow`). Nothing to
drop in here — this file exists just so the folder isn't empty.

If a future revision wants a real photo or screen recording somewhere on
this page, say where and I'll add a `{ pending: '...' }` slot the way the
Wrestling Octopi case study uses them.
