// A text-kind overlay's content: mostly plain lines, with the odd inline
// image, side-by-side image row, pending-asset marker, or action link mixed
// in. Kept as a union rather than separate fields so existing plain-string
// textLines (":).txt", Notes, etc.) don't need to change at all — only
// content that actually needs one of these uses the object forms.
//
// Authoring conventions for plain strings:
//   '## Text'        section headline
//   '**Text**'       a whole line wrapped in this is bold emphasis at full
//                     tier weight — a big mid-document pull-quote once past
//                     the doc's opening hero block, or a small bold field
//                     label (like "Role") while still inside it
//   'a **word** mid'  inline emphasis inside an ordinary line — rendered as
//                     a <strong> run within its normal tier, not upgraded
//   plain text        everything else
//
// layoutTextDoc() below turns a raw TextBlock[] into fully-resolved render
// instructions — which type-scale tier each line belongs to, spacing, and
// display text (inline **markers** preserved for the renderer to bold) —
// so components don't re-derive any of this.
export type TextBlock =
  | string
  | { image: string; alt?: string }
  | { images: string[] }
  // A not-yet-supplied asset slot — renders nothing on the site, exists so
  // the doc's structure (and the hero-block/body boundary below) stays
  // correct while real files are pending. `note` is dev-facing only.
  | { pending: string }
  // Opens another item's own overlay/window in place — for a case-study
  // link like "View Wrestling Octopi here" that should reuse the site's
  // existing overlay for that project rather than duplicate it.
  | { openId: string; label: string }
  // Opens an external URL in a new tab — for a platform where the target
  // has no internal overlay to reuse (e.g. a desktop icon that's a direct
  // external link, or a link with no internal overlay at all like GitHub).
  | { href: string; label: string }
  // A reusable text+visual split section (not Wrestling-Octopi-specific):
  // a narrow text column (eyebrow label, body paragraphs, an optional
  // closing statement rendered more prominently than body but well under
  // section-headline scale) beside one dominant visual. `orientation`
  // and `textRatio` control which side the text sits on and how wide it
  // is; both platforms render it (desktop as true side-by-side, mobile
  // always stacked text-first regardless of `orientation` — there's no
  // room for a real column split on a phone). The visual auto-falls-back
  // to a placeholder (matching the same box's dimensions) if `visualSrc`
  // 404s, so the real file can be dropped in later with no layout change.
  | { splitSection: SplitMediaSection }
  // A small caps label rendered above the doc's H1 (e.g. a project name
  // sitting above its own headline sentence). Optional — most docs don't
  // need one and just start straight at the title (index 0 = h1, as
  // always). When present as the very first block, the H1 becomes
  // whichever string block comes next instead of index 0.
  | { eyebrow: string }
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
  | 'metadataBold'
  | 'sectionHeading'
  | 'majorStatement'
  | 'body';

export const HEADING_PREFIX = '## ';

function isHeadingLine(text: string): boolean {
  return text.startsWith(HEADING_PREFIX);
}

// A whole line wrapped in **double asterisks**, vs. just containing one
// somewhere in the middle (that's inline emphasis, handled by parseInline).
function isWholeLineBold(text: string): boolean {
  return text.startsWith('**') && text.endsWith('**') && text.length > 4 && text.indexOf('**', 2) === text.length - 2;
}

export type LaidOutBlock =
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

// Resolves raw content into what to render: tier assignment (see rules
// below), display text (inline **markers** left intact for parseInline),
// and one blank spacer line auto-inserted before/after every section
// headline (skipped where the data already supplies one, so content that
// wants *extra* space can add its own blank entries on top).
//
// Tier rules, by position/marker — no extra authoring needed beyond the
// '## '/'**...**' conventions above:
//   an { eyebrow } block        -> its own 'eyebrow' tier, doesn't affect
//                                  anything else below
//   the first string block      -> h1 (normally index 0, or index 1 if an
//                                  eyebrow sits at index 0)
//   the string right after h1,
//     specifically at index 1   -> introLarge (the tagline under it) — a
//                                  doc that opens with an eyebrow (pushing
//                                  h1 to index 1) skips this automatically,
//                                  since nothing reaches index 1 as a fresh
//                                  string there
//   inside the hero block       -> metadata / metadataBold (short facts
//                                  like "SAP · Berlin · 2020-2021" or bold
//                                  field labels like "Role"). The hero
//                                  block runs from after h1/introLarge
//                                  until whichever comes first: a '## '
//                                  heading, any non-text block (image/
//                                  pending/link/diagram/etc.), or a plain
//                                  line over 150 characters — real prose
//                                  reliably reads longer than hero facts
//                                  even combined, so a doc that goes
//                                  straight from its meta line into real
//                                  paragraphs (no heading or media forcing
//                                  the zone closed first) still reads as
//                                  body copy once the content stops
//                                  looking like a fact.
//   a '## ' line                -> sectionHeading
//   a whole-line '**bold**'     -> majorStatement (pull-quote) once past
//                                  the hero block, metadataBold inside it
//   everything else             -> body (inline **bold** rendered inline)
export function layoutTextDoc(blocks: TextBlock[]): LaidOutBlock[] {
  const out: LaidOutBlock[] = [];
  let inHeroBlock = true;
  let h1Assigned = false;

  const pushText = (tier: TextTier, text: string) => {
    out.push({ kind: 'text', tier, text: text || ' ' });
  };
  const isBlank = (entry: LaidOutBlock | undefined) =>
    !!entry && entry.kind === 'text' && entry.text === ' ';

  blocks.forEach((block, i) => {
    if (typeof block !== 'string') {
      if ('eyebrow' in block) {
        pushText('eyebrow', block.eyebrow);
        return;
      }
      inHeroBlock = false;
      if ('images' in block) {
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

    if (!h1Assigned) {
      h1Assigned = true;
      pushText('h1', block);
      return;
    }
    if (i === 1 && block !== '') {
      pushText('introLarge', block);
      return;
    }
    if (isHeadingLine(block)) {
      inHeroBlock = false;
      if (out.length > 0 && !isBlank(out[out.length - 1])) {
        pushText('body', '');
      }
      pushText('sectionHeading', block.slice(HEADING_PREFIX.length));
      if (blocks[i + 1] !== '') {
        pushText('body', '');
      }
      return;
    }
    if (inHeroBlock) {
      const bold = isWholeLineBold(block);
      const content = bold ? block.slice(2, -2) : block;
      // Hero-zone facts (dates, role/scope lines) read short even
      // combined; real prose reliably doesn't. A doc with no heading or
      // media between its meta line and its opening paragraphs (nothing
      // else forces the zone closed) still needs to fall through to
      // body/majorStatement once the content stops looking like a fact.
      if (content.length <= 150) {
        pushText(bold ? 'metadataBold' : 'metadata', content);
        return;
      }
      inHeroBlock = false;
    }
    if (isWholeLineBold(block)) {
      pushText('majorStatement', block.slice(2, -2));
      return;
    }
    pushText('body', block);
  });

  return out;
}

// Splits a line's remaining **bold** markers into plain/bold runs for
// inline rendering within a tier that isn't already fully bold (body,
// metadata, introLarge). Whole-line-bold text never reaches here with
// markers still attached — layoutTextDoc already strips those.
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
