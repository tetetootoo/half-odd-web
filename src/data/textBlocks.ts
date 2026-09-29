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
  | { splitSection: SplitMediaSection };

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
  | { kind: 'splitSection'; data: SplitMediaSection };

// Resolves raw content into what to render: tier assignment (see rules
// below), display text (inline **markers** left intact for parseInline),
// and one blank spacer line auto-inserted before/after every section
// headline (skipped where the data already supplies one, so content that
// wants *extra* space can add its own blank entries on top).
//
// Tier rules, by position/marker — no extra authoring needed beyond the
// '## '/'**...**' conventions above:
//   index 0                     -> h1 (the doc title)
//   index 1                     -> introLarge (the tagline under it)
//   inside the hero block       -> metadata / metadataBold (short facts
//                                  like "SAP · Berlin · 2020-2021" or bold
//                                  field labels like "Role"). The hero
//                                  block runs from index 2 until whichever
//                                  comes first: a '## ' heading, or any
//                                  non-text block (image/pending/link) —
//                                  so a doc that goes straight from its
//                                  meta line into a hero image/video, then
//                                  into real paragraphs, reads as body
//                                  copy even before the first heading.
//   a '## ' line                -> sectionHeading
//   a whole-line '**bold**'     -> majorStatement (pull-quote) once past
//                                  the hero block, metadataBold inside it
//   everything else             -> body (inline **bold** rendered inline)
export function layoutTextDoc(blocks: TextBlock[]): LaidOutBlock[] {
  const out: LaidOutBlock[] = [];
  let inHeroBlock = true;

  const pushText = (tier: TextTier, text: string) => {
    out.push({ kind: 'text', tier, text: text || ' ' });
  };
  const isBlank = (entry: LaidOutBlock | undefined) =>
    !!entry && entry.kind === 'text' && entry.text === ' ';

  blocks.forEach((block, i) => {
    if (typeof block !== 'string') {
      inHeroBlock = false;
      if ('images' in block) {
        out.push({ kind: 'images', images: block.images });
      } else if ('image' in block) {
        out.push({ kind: 'image', image: block.image, alt: block.alt });
      } else if ('pending' in block) {
        out.push({ kind: 'pending' });
      } else if ('splitSection' in block) {
        out.push({ kind: 'splitSection', data: block.splitSection });
      } else if ('openId' in block) {
        out.push({ kind: 'openLink', openId: block.openId, label: block.label });
      } else {
        out.push({ kind: 'hrefLink', href: block.href, label: block.label });
      }
      return;
    }

    if (i === 0) {
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
      pushText(isWholeLineBold(block) ? 'metadataBold' : 'metadata', isWholeLineBold(block) ? block.slice(2, -2) : block);
      return;
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
