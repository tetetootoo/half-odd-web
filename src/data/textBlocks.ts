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
