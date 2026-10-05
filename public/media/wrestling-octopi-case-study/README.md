# Wrestling Octopi case-study media

Approved narrative lives in `src/data/wrestling-octopi-case-study.md`. Whole
sections are ordered problem → design evolution → product → system → development
process → current state. Existing prose is unchanged; the ending status label and
product CTA follow the supplied layout request. No other case study was restyled.

## Asset map (visually inspected)

| Role | Source / implementation |
| --- | --- |
| Hero workflow | `canva-design-and-post-scheduling-source.mov` — real Canva creation, return and post workflow |
| Browser playback | `canva-design-and-post-scheduling-workflow.mp4` — H.264 conversion, original rotated orientation preserved; 2560 × 1380, 13.95 seconds |
| Reduced-motion hero | `canva-design-and-post-scheduling-poster.jpg` — representative frame from the same recording |
| Problem | No supplied problem diagram found; no replacement graphic is generated |
| Early direction | `landing-page-early-purple.png` — previous purple landing capture recovered from Git's `image-3.png`; no missing original file restored in place |
| Current direction | `landing-page-current-monochrome.png` — black/white landing page |
| Feed Preview | `instagram-feed-grid-preview.png` — three-column image grid |
| Column view | `post-column-caption-and-schedule.png` — caption, schedule and post image |
| Calendar view | `post-calendar-october-2026.png` — October 2026 |
| Analytics | `analytics-engagement-and-posting-times.png` — metrics and suggested times |
| Comments | `post-comments-and-replies.png` — posts, threads and replies |
| System | `system-architecture-overview.png` plus `system-architecture-service-integrations.png` — supplied system-architecture image displayed directly; `system-architecture-service-integrations.png` remains unused |
| Development | `ai-assisted-development-iteration-process.png` — supplied process image displayed directly |

Unused: `home-dashboard-posting-overview.png`, `canva-return-to-wrestling-octopi-button.png`, `octopus-brand-mascot.png`,
older/duplicate product captures and marketing-heavy raster diagram treatments.

## Supplied diagrams

The architecture and AI-assisted development graphics are displayed as provided,
not redrawn. Their embedded labels are preserved; duplicate captions are hidden.
The generated native diagram components have been removed.

The repository README mentions S3, while no implemented S3 storage path was found
in the API source during the earlier review. The supplied architecture graphic
retains its original Cloudinary / S3 label; this is the author's source graphic.

## Rendering

The introduction places title/subtitle/metadata beside the existing status text.
The workflow video spans the full content width below both columns. Mobile stacks
the introductory text first and video below. Semantic media measures, borders, radii and spacing are scoped to this
document. Paired images use equal-height contain frames without clipping the UI.
Mobile stacks all pairs; supplied diagrams occupy the full content width. No scroll reveals,
new window chrome, screenshots as cards, or playback controls were added. Video
uses metadata preload, muted autoplay, inline looping, and a static poster for
reduced motion. The original MOV remains available as the source asset.
