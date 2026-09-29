# Wrestling Octopi case study — asset drop folder

The doc was trimmed down to a final outline. Every asset below is a
`{ pending: '...' }` marker in `src/data/wrestlingOctopiCaseStudy.ts` —
renders nothing on the site until a real file replaces it. Drop a file in
here with the matching name (any common image/video extension) and ping
Claude to wire it in — it's a one-line swap per slot.

In outline order:

1. **hero-video** — full-width hero video/screen recording, right under
   the title block.
2. **intro-visual.mp4** — the 60% side of "The problem" text+visual
   section, right after the hero video. One strong static/subtly-animated
   overview or dashboard screen that establishes the product — not the
   drag interaction (that's feed-planner-video below, where it works as
   evidence for "Designing complexity out"). Component looks for this
   exact filename (`intro-visual.mp4`); showing a placeholder until it's
   there — drop it in and it'll pick it up automatically, no code change
   needed.
3. **feed-planner-video** — full-width feed planner interaction, right
   after "A powerful tool shouldn't have to feel like a complicated one."
4. **feed-detail-draft**, **feed-detail-scheduled**,
   **feed-detail-publishing**, **feed-detail-failed** — four tightly
   cropped interface details, same crop/scale, right after "It was
   deciding when the user actually needed to see it."
5. **ai-exploration**, **final-direction** — a two-up comparison right
   after the "AI could build the interface..." heading: left = early
   AI-generated exploration, right = final manually refined direction.
6. **architecture-graphic** — simplified architecture diagram, right
   after the "Designing and engineering as one process" heading.

## "The problem" text+visual section

Built as a reusable block (`{ splitSection: {...} }` in
`textBlocks.ts`), not specific to this doc — same component would work
anywhere else a text+visual split is wanted. Desktop: true 40/60
side-by-side, text left / visual right, both configurable per instance
(`orientation`, `textRatio`). The visual stretches to match whatever
height the text column ends up needing (object-fit: cover), rather than
a fixed aspect-ratio, so it stays the dominant element and the real
video drops in with zero layout shift. Mobile: always stacks text first,
regardless of desktop `orientation` — no room for a real column split on
a phone.

## Footer links

"View Live Product" → wrestlingoctopi.com, "View GitHub" →
github.com/tetetootoo. Already wired in via `mobileContent.ts` /
`desktopContent.ts`, not part of this file.

## Old assets

`image-1.png`, `image-3.png`, `image-4.png`, `image-8.png`, `image-9.png`,
`graphic-1.png` and `brand-image.png` are left over from an earlier outline
and no longer referenced by anything — the current outline doesn't map
onto those slots either. Still sitting in this folder in case any are
reusable; say the word if you'd rather I delete them.
