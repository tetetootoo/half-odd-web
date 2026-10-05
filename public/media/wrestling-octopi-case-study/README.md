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
| Problem | No supplied problem diagram found; no replacement graphic is generated |
| Early direction | `early-direction.png` — previous purple landing capture recovered from Git's `image-3.png`; no missing original file restored in place |
| Current direction | `Bildschirmfoto 2026-10-05 um 12.48.41.png` — black/white landing page |
| Feed Preview | `Bildschirmfoto 2026-10-05 um 12.47.31.png` — three-column image grid |
| Column view | `Bildschirmfoto 2026-10-05 um 12.46.43.png` — caption, schedule and post image |
| Calendar view | `Bildschirmfoto 2026-10-05 um 12.47.20.png` — October 2026 |
| Analytics | `Bildschirmfoto 2026-10-05 um 12.46.25.png` — metrics and suggested times |
| Comments | `Bildschirmfoto 2026-10-05 um 12.47.45.png` — posts, threads and replies |
| System | `Systemarchitektur von Wrestling Octopi.png` plus `graphic-1.png` — supplied system-architecture image displayed directly; `graphic-1.png` remains unused |
| Development | `KI-gestützter Entwicklungsprozess.png` — supplied process image displayed directly |

Unused: Home (`12.48.23`), the static Canva-return button (`12.48.07`), brand image,
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
