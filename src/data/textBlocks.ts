// A text-kind overlay's content: mostly plain lines, with the odd inline
// image, side-by-side image row, or action link mixed in. Kept as a union
// rather than separate fields so existing plain-string textLines (":).txt",
// Notes, etc.) don't need to change at all — only content that actually
// needs one of these uses the object forms.
//
// Authoring conventions for plain strings:
//   '## Text'      section headline
//   '**Text**'     bold emphasis — a big mid-document pull-quote once past
//                  the first headline, or a small bold field label (like
//                  "Role") while still in the doc's opening hero block
//   plain text     everything else
//
// layoutTextDoc() below turns a raw TextBlock[] into fully-resolved render
// instructions — which type-scale tier each line belongs to, spacing, and
// stripped display text — so components don't re-derive any of this.
export type TextBlock =
  | string
  | { image: string; alt?: string }
  | { images: string[] }
  // Opens another item's own overlay/window in place — for a case-study
  // link like "View Wrestling Octopi here" that should reuse the site's
  // existing overlay for that project rather than duplicate it.
  | { openId: string; label: string }
  // Opens an external URL in a new tab — for a platform where the target
  // has no internal overlay to reuse (e.g. a desktop icon that's a direct
  // external link).
  | { href: string; label: string };

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

function isBoldLine(text: string): boolean {
  return text.startsWith('**') && text.endsWith('**') && text.length > 4;
}

export type LaidOutBlock =
  | { kind: 'text'; tier: TextTier; text: string }
  | { kind: 'image'; image: string; alt?: string }
  | { kind: 'images'; images: string[] }
  | { kind: 'openLink'; openId: string; label: string }
  | { kind: 'hrefLink'; href: string; label: string };

// Resolves raw content into what to render: tier assignment (see rules
// below), stripped display text, and one blank spacer line auto-inserted
// before/after every section headline (skipped where the data already
// supplies one, so content that wants *extra* space can add its own blank
// entries on top).
//
// Tier rules, by position/marker — no extra authoring needed beyond the
// '## '/'**...**' conventions above:
//   index 0                        -> h1 (the doc title)
//   index 1                        -> introLarge (the tagline under it)
//   before the first '## ' heading -> metadata / metadataBold (hero block
//                                     facts like "SAP · Berlin · 2020-2021"
//                                     or bold field labels like "Role")
//   a '## ' line                   -> sectionHeading
//   a '**bold**' line after that   -> majorStatement (pull-quote)
//   everything else                -> body
export function layoutTextDoc(blocks: TextBlock[]): LaidOutBlock[] {
  const out: LaidOutBlock[] = [];
  let headingSeen = false;

  const pushText = (tier: TextTier, text: string) => {
    out.push({ kind: 'text', tier, text: text || ' ' });
  };

  blocks.forEach((block, i) => {
    if (typeof block !== 'string') {
      if ('images' in block) {
        out.push({ kind: 'images', images: block.images });
      } else if ('image' in block) {
        out.push({ kind: 'image', image: block.image, alt: block.alt });
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
      if (out.length > 0 && !(out[out.length - 1].kind === 'text' && out[out.length - 1].text === ' ')) {
        pushText('body', '');
      }
      headingSeen = true;
      pushText('sectionHeading', block.slice(HEADING_PREFIX.length));
      const next = blocks[i + 1];
      if (next !== '') {
        pushText('body', '');
      }
      return;
    }
    if (!headingSeen) {
      pushText(isBoldLine(block) ? 'metadataBold' : 'metadata', isBoldLine(block) ? block.slice(2, -2) : block);
      return;
    }
    if (isBoldLine(block)) {
      pushText('majorStatement', block.slice(2, -2));
      return;
    }
    pushText('body', block);
  });

  return out;
}
