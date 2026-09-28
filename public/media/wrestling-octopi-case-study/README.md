# Wrestling Octopi case study — image drop folder

Drop new images/graphics here using these filenames (.png/.jpg/.webp all
fine, just say which you used if it's not .png) and ping Claude to wire
them into `wrestlingOctopiCaseStudy.ts` — the overlay now supports inline
images, so it's a quick add.

## Wired in already
- `image-1` ✅ — end of section 01
- `image-3`, `image-4` ✅ — end of section 03, shown side by side
- `image-8`, `image-9` ✅ — end of section 05
- `graphic-1` ✅ — inside section 06
- `brand-image` ✅ — end of doc

## Still missing
- `image-2` — end of section 02
- `image-5`, `image-6`, `image-7` — end of section 04
- `image-10` — right before section 06

Images (and the side-by-side image-3/image-4 pair) render at 50% width,
centered. `brand-image` is auto-cropped to its visible content, trimming
the transparent padding around it.

"view wrestling octopi here" at the end is now a bold, working link with
an arrow — on mobile it opens the Wrestling Octopi overlay in place, on
desktop (which has no overlay for it) it opens wrestlingoctopi.com in a
new tab. Nothing to drop for that one.
