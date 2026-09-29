# Wrestling Octopi case study — asset drop folder

The doc was trimmed down to a final outline. Every asset below is a
`{ pending: '...' }` marker in `src/data/wrestlingOctopiCaseStudy.ts` —
renders nothing on the site until a real file replaces it. Drop a file in
here with the matching name (any common image/video extension) and ping
Claude to wire it in — it's a one-line swap per slot.

In outline order:

1. **hero-video** — full-width hero video/screen recording, right under
   the title block.
2. **feed-planner-video** — full-width feed planner interaction, right
   after "A powerful tool shouldn't have to feel like a complicated one."
3. **feed-detail-draft**, **feed-detail-scheduled**,
   **feed-detail-publishing**, **feed-detail-failed** — four tightly
   cropped interface details, same crop/scale, right after "It was
   deciding when the user actually needed to see it."
4. **ai-exploration**, **final-direction** — a two-up comparison right
   after the "AI could build the interface..." heading: left = early
   AI-generated exploration, right = final manually refined direction.
5. **architecture-graphic** — simplified architecture diagram, right
   after the "Designing and engineering as one process" heading.

## Deferred — not built yet

The outline calls for the introduction paragraph to sit in a 40% text /
60% product visual two-column layout instead of full-width stacked text.
That's a real layout change (nothing in the overlay does a side-by-side
split right now) and there's no visual named for the 60% side yet, so I
left the intro as a normal full-width paragraph for now. Send the visual
and confirm you want the two-column treatment built and I'll do both
together.

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
