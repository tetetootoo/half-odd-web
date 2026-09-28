// A text-kind overlay's content: mostly plain lines, with the odd inline
// image or side-by-side image row mixed in. Kept as a union rather than a
// separate field so existing plain-string textLines (":).txt", Notes, etc.)
// don't need to change at all — only content that actually has images uses
// the object forms.
export type TextBlock = string | { image: string; alt?: string } | { images: string[] };
