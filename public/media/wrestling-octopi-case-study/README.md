# Wrestling Octopi case study — asset drop folder

The doc was rewritten around a new outline (2026). Every asset below is a
`{ pending: '...' }` marker in `src/data/wrestlingOctopiCaseStudy.ts` —
renders nothing on the site until a real file replaces it. Drop a file in
here with the matching name (any common image/video extension) and ping
Claude to wire it in — it's a one-line swap per slot.

In outline order:

1. **hero-video** — full-width hero video/screen recording. 8-15s seamless
   loop of the finished product: start on the feed planner, drag/reorder a
   post, open a post, then show another core interaction. No device
   mockup — actual interface at a useful scale.
2. **product-overview** — 2-3 large clean interface captures showing
   product breadth: one large feed/planner screen + 1-2 supporting screens
   (content creation, scheduling, analytics, etc). No device mockups.
3. **research-references** — restrained research board: selected
   screenshots from competitor tools studied, annotated with the specific
   patterns reacted to (overloaded nav, excessive info, fragmented
   workflows). Not a generic competitor matrix.
4. **feed-planner-video** — large interactive video, hero of its section:
   feed planner drag-and-drop reordering, 5-8s loop.
5. **feed-state-grid** — 4-up grid, identical crop/scale: 01 Draft, 02
   Scheduled, 03 Publishing, 04 Failed/Retry.
6. **media-drop-interaction** *(optional)* — short clip of media being
   dropped into the planner, or another interaction showing contextual
   functionality. Only include if visually strong.
7. **ai-early-interface** — full-width or 2-up: a genuinely early
   AI-generated version, not beautified retrospectively. Ideally one where
   generic AI patterns (cards, containers, dashboard structure) are
   visible.
8. **before-after-comparison** — same/comparable part of the product, left
   = AI-generated/early direction, right = final manually refined
   direction. Same viewport/crop/scale on both sides.
9. **design-details-3up** — three close crops of the manual intervention
   (not full screens): Hierarchy (nav/page structure), Typography +
   spacing (a clean content area), Components + states (buttons, controls,
   cards, inputs). Small captions, not paragraphs.
10. **process-sequence** — one real interaction across 3 stages: 01 Idea /
    rough exploration → 02 First implementation → 03 Final interaction.
    Use an actual feature, not a generic process diagram.
11. **ai-dev-process** — small supporting visual: a carefully cropped real
    example, e.g. "Agent implementation → manual test reveals issue →
    correction → working implementation." Avoid an unreadable terminal
    screenshot — the point is judgment, not proof of prompting.
12. **architecture-diagram** — full-width simplified architecture graphic
    (not source code): React + TypeScript + Vite → Node.js + Express →
    PostgreSQL + Prisma, branching into Redis + BullMQ (scheduling),
    Instagram API (publishing), Claude API (AI), Cloudinary/S3 (media),
    Stripe (payments), Resend (email). Keep it visually simple.
13. **final-product-detail** — return to something beautifully simple on
    the user-facing side, contrasting with the architecture diagram:
    complex underneath, simple on the surface.
14. **final-sequence** — the strongest finished-product sequence,
    full-width, 10-15s moving through 2-3 connected interactions. The
    payoff, not another feature demo.

## Footer links

"View Live Product" opens the Wrestling Octopi overlay on mobile /
wrestlingoctopi.com in a new tab on desktop, same as before. "View GitHub"
is new — it currently points at the general GitHub profile
(github.com/tetetootoo) since there's no specific repo URL on file. Send
the actual repo URL if it should link there instead.

## Old assets

`image-1.png`, `image-3.png`, `image-4.png`, `image-8.png`, `image-9.png`,
`graphic-1.png` and `brand-image.png` are still sitting in this folder
from the previous version of the doc but are no longer referenced by
anything — the new outline doesn't map cleanly onto the old slots. Left in
place in case any are reusable for the new asset list above; say the word
if you'd rather I delete them.
