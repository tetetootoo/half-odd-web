# Wrestling Octopi case-study media

Approved narrative lives in `src/data/wrestling-octopi-case-study.md`. Whole
sections are ordered problem → design evolution → product → system → development
process → current state. Existing prose is unchanged; the ending status label and
product CTA follow the supplied layout request. No other case study was restyled.

## Asset map (visually inspected)

| Role | Source / implementation |
| --- | --- |
| Hero workflow | `Wrestling Octopi Schedule Canva Post Demo.mov` — real Canva creation, return and post workflow |
| Browser playback | `workflow.mp4` — H.264 conversion, original rotated orientation preserved; 2560 × 1380, 13.95 seconds |
| Reduced-motion hero | `workflow-poster.jpg` — representative frame from the same recording |
| Problem | Native fragmented-workflow diagram; the requested problem raster was not found among supplied assets |
| Early direction | `early-direction.png` — previous purple landing capture recovered from Git's `image-3.png`; no missing original file restored in place |
| Current direction | `Bildschirmfoto 2026-10-05 um 12.48.41.png` — black/white landing page |
| Feed Preview | `Bildschirmfoto 2026-10-05 um 12.47.31.png` — three-column image grid |
| Column view | `Bildschirmfoto 2026-10-05 um 12.46.43.png` — caption, schedule and post image |
| Calendar view | `Bildschirmfoto 2026-10-05 um 12.47.20.png` — October 2026 |
| Analytics | `Bildschirmfoto 2026-10-05 um 12.46.25.png` — metrics and suggested times |
| Comments | `Bildschirmfoto 2026-10-05 um 12.47.45.png` — posts, threads and replies |
| System | `Systemarchitektur von Wrestling Octopi.png` plus `graphic-1.png` used as references for native semantic layers |
| Development | `KI-gestützter Entwicklungsprozess.png` used as reference for seven native ordered steps and iteration |

Unused: Home (`12.48.23`), the static Canva-return button (`12.48.07`), brand image,
older/duplicate product captures and marketing-heavy raster diagram treatments.

## Verified architecture

Compared the diagrams against `/Users/theresaschantz/Desktop/wrestling-octopi/README.md`,
web/API manifests and API implementation on 5 October 2026. Native layers list
React/TypeScript/Vite; Node.js/Express/TypeScript; PostgreSQL, Prisma, Redis and BullMQ;
Meta APIs, Anthropic Claude, Cloudinary, Canva, Stripe and Resend. Verified service
implementations include `routes/ai.ts`, `services/canva.ts`, `services/mediaStorage.ts`,
`services/channelPublishing.ts`, `lib/queue.ts`, `lib/stripe.ts` and `services/email.ts`.

The README mentions S3, but no implemented S3 client/storage path was found in the
API source. S3 is therefore omitted rather than presented as confirmed architecture.
The diagrams describe repository implementation, not deployment availability.

## Rendering

Hero uses the existing 40/60 split; its four original opening blocks are owned by
that split. Semantic media measures, borders, radii and spacing are scoped to this
document. Paired images use equal-height contain frames without clipping the UI.
Mobile stacks all pairs; native diagrams retain readable text. No scroll reveals,
new window chrome, screenshots as cards, or playback controls were added. Video
uses metadata preload, muted autoplay, inline looping, and a static poster for
reduced motion. The original MOV remains available as the source asset.
