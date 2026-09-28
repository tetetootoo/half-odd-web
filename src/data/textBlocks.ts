// A text-kind overlay's content: mostly plain lines, with the odd inline
// image, side-by-side image row, or action link mixed in. Kept as a union
// rather than separate fields so existing plain-string textLines (":).txt",
// Notes, etc.) don't need to change at all — only content that actually
// needs one of these uses the object forms.
//
// A plain string starting with '## ' is a section headline: the renderer
// strips the prefix and bolds it with extra spacing, same convention the
// Notes app already uses for its own subheadings.
export type TextBlock =
  | string
  | { image: string; alt?: string }
  | { images: string[] }
  // Opens another item's own overlay/window in place — for a case-study
  // link like "view wrestling octopi here" that should reuse the site's
  // existing overlay for that project rather than duplicate it.
  | { openId: string; label: string }
  // Opens an external URL in a new tab — for a platform where the target
  // has no internal overlay to reuse (e.g. a desktop icon that's a direct
  // external link).
  | { href: string; label: string };

export const HEADING_PREFIX = '## ';

export function isHeading(block: TextBlock): block is string {
  return typeof block === 'string' && block.startsWith(HEADING_PREFIX);
}

export function stripHeadingPrefix(block: string): string {
  return block.slice(HEADING_PREFIX.length);
}

// A whole line wrapped in **double asterisks** — a bold pull-quote inside a
// section rather than a new section headline, so it gets bold weight but
// none of a headline's extra top/bottom spacing (reuses the plain
// .textLine/.textLineBold treatment the doc title already uses).
export function isBoldLine(block: TextBlock): block is string {
  return typeof block === 'string' && block.startsWith('**') && block.endsWith('**') && block.length > 4;
}

export function stripBoldMarkers(block: string): string {
  return block.slice(2, -2);
}

// Inserts one blank spacer line before and after every headline, so authors
// don't need to hand-place blank-string entries around every '## ' line in
// the source data. Skips inserting a spacer where the data already
// supplies one, so content that wants *extra* space can still add its own
// blank entries on top. Deliberately doesn't touch the doc's own title
// (block 0) — the hero block (title, tagline, Role/Scope/Stack-style
// labels) stays tight; only real section headlines get this treatment.
export function withHeadingSpacers(blocks: TextBlock[]): TextBlock[] {
  const out: TextBlock[] = [];
  blocks.forEach((block, i) => {
    const headline = isHeading(block);

    if (headline && out.length > 0 && out[out.length - 1] !== '') {
      out.push('');
    }

    out.push(block);

    if (headline && blocks[i + 1] !== '') {
      out.push('');
    }
  });
  return out;
}
