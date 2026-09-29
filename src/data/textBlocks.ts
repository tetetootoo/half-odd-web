// A text-kind overlay's content: mostly plain lines, with the odd inline
// image, side-by-side image row, pending-asset marker, or action link mixed
// in. Kept as a union rather than separate fields so existing plain-string
// textLines (":).txt", Notes, etc.) don't need to change at all — only
// content that actually needs one of these uses the object forms.
//
// Plain strings use literal, ordinary markdown heading syntax — no
// position-based or content-based guessing:
//   '# Text'    -> h1 (the doc's own title)
//   '## Text'   -> section heading
//   '### Text'  -> intro/large text
//   plain text  -> body, with **bold** rendered inline wherever it appears
// Everything else that needs its own visual treatment (a big standalone
// statement, a small-caps metadata fact, an eyebrow label, ...) is an
// explicit block below rather than something inferred from a string.
export type ConceptualDiagram = 'perspective' | 'composition' | 'judgment' | 'change';

export type TextBlock =
  | { conceptualDiagram: ConceptualDiagram }
  | string
  | { image: string; alt?: string }
  | { images: string[] }
  // A not-yet-supplied asset slot — renders nothing on the site, exists so
  // the doc's structure stays correct while real files are pending. `note`
  // is dev-facing only.
  | { pending: string }
  // Opens another item's own overlay/window in place — for a case-study
  // link like "View Wrestling Octopi here" that should reuse the site's
  // existing overlay for that project rather than duplicate it.
  | { openId: string; label: string }
  // Opens an external URL in a new tab — for a platform where the target
  // has no internal overlay to reuse (e.g. a desktop icon that's a direct
  // external link, or a link with no internal overlay at all like GitHub).
  | { href: string; label: string }
  // A reusable text+visual split section (not project-specific): a narrow
  // text column (eyebrow label, body paragraphs, an optional closing
  // statement rendered more prominently than body but well under
  // section-headline scale) beside one dominant visual. `orientation` and
  // `textRatio` control which side the text sits on and how wide it is;
  // both platforms render it (desktop as true side-by-side, mobile always
  // stacked text-first regardless of `orientation` — there's no room for a
  // real column split on a phone). The visual auto-falls-back to a
  // placeholder (matching the same box's dimensions) if `visualSrc` 404s,
  // so the real file can be dropped in later with no layout change.
  | { splitSection: SplitMediaSection }
  // A small caps label rendered above the doc's own H1.
  | { eyebrow: string }
  // A big standalone editorial statement (pull-quote scale) — the
  // explicit way to get majorStatement tier, since it's not inferred from
  // markdown syntax. Supports an embedded '\n' for a manual line break.
  | { statement: string }
  // One or more small-caps facts (a date range, "Role" + its value, ...).
  // A single string is one line; an array renders each on its own line at
  // the same tier, tightly spaced — for label/value pairs, etc.
  | { metadata: string | string[] }
  // A native HTML/CSS node-and-connector diagram — university/SAP-Graph
  // style trees, simple chains, small interaction sketches. See
  // FlowDiagramData below.
  | { flowDiagram: FlowDiagramData }
  // Two small FlowDiagrams side by side, for a restrained comparison
  // (e.g. "internal approach" vs. "considered exception").
  | { flowComparison: { left: FlowDiagramData; right: FlowDiagramData } }
  // An ascending stack of labels suggesting one layer building on the
  // next (e.g. primitive -> wrapper -> component -> interface). Each
  // step renders visibly larger than the last.
  | { layerDiagram: string[] }
  // Body copy constrained to a narrower reading column than usual (for a
  // more intimate, text-led section), not wrapped in a card.
  | { narrow: string[] }
  // Two statements in immediate succession where the second should read
  // as a noticeably bigger escalation of the first (e.g. "How do I build
  // this?" -> "What should remain reusable after I've built this?").
  | { escalatingStatement: { first: string; second: string } };

export interface SplitMediaSection {
  eyebrow?: string;
  body: string[];
  statement?: string;
  visualSrc: string;
  visualType?: 'image' | 'video';
  /** Desktop only — mobile always stacks text first. Default 'text-left'. */
  orientation?: 'text-left' | 'visual-left';
  /** Desktop text column width as a percent of the row. Default 40. */
  textRatio?: number;
}

// One diagram, top to bottom, as an ordered list of lines:
//   { text }       a plain label/caption line, not boxed (e.g. "UNIVERSITY")
//   { nodes }      one or more boxed nodes side by side (wraps on mobile);
//                  `emphasize` renders them larger/bolder as the diagram's
//                  outcome/focal point
//   { connector }  a small glyph row between rows, e.g. '↓' or '↙  ↓  ↘'
export type FlowDiagramLine =
  | { text: string }
  | { nodes: string[]; emphasize?: boolean }
  | { connector: string };

export interface FlowDiagramData {
  lines: FlowDiagramLine[];
  caption?: string;
}

// The editorial type scale for markdown-sourced case studies (both txt-doc
// overlays share it). Ranges as given; components use one concrete value
// per platform, picked from within each range.
//   Element            Desktop    Mobile
//   Case H1            72-88px    42-52px
//   Major statement     48-64px    32-40px
//   Section heading     28-36px    24-28px
//   Intro/body large    20-24px    18-20px
//   Body                17-19px    16-18px
//   Metadata            13-15px    12-14px
//   Captions            12-14px    12-13px
export type TextTier =
  | 'eyebrow'
  | 'h1'
  | 'introLarge'
  | 'metadata'
  | 'sectionHeading'
  | 'majorStatement'
  | 'body';

export type LaidOutBlock =
  | { kind: 'conceptualDiagram'; diagram: ConceptualDiagram }
  | { kind: 'text'; tier: TextTier; text: string }
  | { kind: 'image'; image: string; alt?: string }
  | { kind: 'images'; images: string[] }
  | { kind: 'openLink'; openId: string; label: string }
  | { kind: 'hrefLink'; href: string; label: string }
  | { kind: 'pending' }
  | { kind: 'splitSection'; data: SplitMediaSection }
  | { kind: 'flowDiagram'; data: FlowDiagramData }
  | { kind: 'flowComparison'; left: FlowDiagramData; right: FlowDiagramData }
  | { kind: 'layerDiagram'; steps: string[] }
  | { kind: 'narrow'; paragraphs: string[] }
  | { kind: 'escalatingStatement'; first: string; second: string };

const HEADING_TIER: [prefix: string, tier: TextTier][] = [
  ['### ', 'introLarge'],
  ['## ', 'sectionHeading'],
  ['# ', 'h1'],
];

// Resolves raw content into what to render: literal '#'/'##'/'###' heading
// syntax maps straight to its tier, one blank spacer line is auto-inserted
// before/after every '## ' section heading (skipped where the data already
// supplies one, so content that wants *extra* space can add its own blank
// entries on top), and everything else is body copy with inline **bold**
// left intact for parseInline to render.
export function layoutTextDoc(blocks: TextBlock[]): LaidOutBlock[] {
  const out: LaidOutBlock[] = [];

  const pushText = (tier: TextTier, text: string) => {
    out.push({ kind: 'text', tier, text: text || ' ' });
  };
  const isBlank = (entry: LaidOutBlock | undefined) =>
    !!entry && entry.kind === 'text' && entry.text === ' ';

  blocks.forEach((block, i) => {
    if (typeof block !== 'string') {
      if ('conceptualDiagram' in block) {
        out.push({ kind: 'conceptualDiagram', diagram: block.conceptualDiagram });
      } else if ('eyebrow' in block) {
        pushText('eyebrow', block.eyebrow);
      } else if ('statement' in block) {
        pushText('majorStatement', block.statement);
      } else if ('metadata' in block) {
        const lines = Array.isArray(block.metadata) ? block.metadata : [block.metadata];
        lines.forEach((line) => pushText('metadata', line));
      } else if ('images' in block) {
        out.push({ kind: 'images', images: block.images });
      } else if ('image' in block) {
        out.push({ kind: 'image', image: block.image, alt: block.alt });
      } else if ('pending' in block) {
        out.push({ kind: 'pending' });
      } else if ('splitSection' in block) {
        out.push({ kind: 'splitSection', data: block.splitSection });
      } else if ('flowDiagram' in block) {
        out.push({ kind: 'flowDiagram', data: block.flowDiagram });
      } else if ('flowComparison' in block) {
        out.push({
          kind: 'flowComparison',
          left: block.flowComparison.left,
          right: block.flowComparison.right,
        });
      } else if ('layerDiagram' in block) {
        out.push({ kind: 'layerDiagram', steps: block.layerDiagram });
      } else if ('narrow' in block) {
        out.push({ kind: 'narrow', paragraphs: block.narrow });
      } else if ('escalatingStatement' in block) {
        out.push({
          kind: 'escalatingStatement',
          first: block.escalatingStatement.first,
          second: block.escalatingStatement.second,
        });
      } else if ('openId' in block) {
        out.push({ kind: 'openLink', openId: block.openId, label: block.label });
      } else {
        out.push({ kind: 'hrefLink', href: block.href, label: block.label });
      }
      return;
    }

    const heading = HEADING_TIER.find(([prefix]) => block.startsWith(prefix));
    if (heading) {
      const [prefix, tier] = heading;
      if (tier === 'sectionHeading' && out.length > 0 && !isBlank(out[out.length - 1])) {
        pushText('body', '');
      }
      pushText(tier, block.slice(prefix.length));
      if (tier === 'sectionHeading' && blocks[i + 1] !== '') {
        pushText('body', '');
      }
      return;
    }

    pushText('body', block);
  });

  return out;
}

// Splits a line's **bold** markers into plain/bold runs for inline
// rendering — every tier renders through this, so **bold** works anywhere
// (a whole line, mid-sentence, a heading) without needing its own markup.
export interface InlineRun {
  text: string;
  bold: boolean;
}

export function parseInline(text: string): InlineRun[] {
  const runs: InlineRun[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > cursor) {
      runs.push({ text: text.slice(cursor, match.index), bold: false });
    }
    runs.push({ text: match[1], bold: true });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) {
    runs.push({ text: text.slice(cursor), bold: false });
  }
  if (runs.length === 0) {
    runs.push({ text, bold: false });
  }
  return runs;
}
