// Capitalizes each space-separated word but leaves anything from a "."
// onward untouched, so file suffixes like ".txt" or ".jpg" stay lowercase
// instead of CSS text-transform treating them as a new word to titlecase.
export function capitalizeLabel(label: string): string {
  return label
    .split(' ')
    .map((word) => {
      const dotIndex = word.indexOf('.');
      const head = dotIndex === -1 ? word : word.slice(0, dotIndex);
      const tail = dotIndex === -1 ? '' : word.slice(dotIndex);
      return head.charAt(0).toUpperCase() + head.slice(1) + tail;
    })
    .join(' ');
}
