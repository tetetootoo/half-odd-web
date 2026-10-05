# Interaction and motion audit — 5 October 2026

## Inventory before implementation

The frontend uses React and CSS modules, with no animation library or smooth-scroll dependency. Inspection covered every CSS transition, animation, keyframe, hover/active/focus rule and transform, and interaction handlers in Desktop, DesktopIcon, Dock, Window, WindowManager, Mobile, the shared hooks, markdown/editorial case studies, plain text, forms, notes, browser embeds and Trash.

| Family | Existing behavior / finding | Resolution |
| --- | --- | --- |
| Desktop files | Single-click selection, double-click opening, native button keyboard opening; five-pixel axis threshold; no explicit press feedback | Preserve activation semantics; radial five-pixel threshold, quiet press response, Space activation for link icons |
| Icon drag | Pointer capture and transform movement; React updates every pointer event; missing cancellation cleanup | Frame-coalesced updates, lost-capture/cancel handling, original direct positioning retained |
| Selection | Existing translucent highlight and distinct white keyboard ring | Retained; no geometry animation or label movement |
| Window lifecycle | Already quiet scale/translate entrances/exits, but separate arbitrary easing and timings | Central tokens; 220ms entrance/minimize/restore, 150ms close; token-based fallback timers |
| Window stack | Stable cascade index, no duplicate windows, immediate pointer focus | Retained; keyboard focus also raises window |
| Window geometry | Explicit maximize/restore geometry and stored prior box | Retained; 220ms shared ease-in-out, timers follow reduced-motion token |
| Window controls | Hover glyphs and disabled yellow restore control; no press feedback | 80ms brightness/press feedback, .94 press scale, preserve disabled behavior |
| Dock | Transform-only 1.18 / 1.07 magnification; 70ms transition, 100ms tooltip delay | 120ms magnification; 450ms tooltip delay, immediate keyboard labels, 80ms exit, .95 press |
| Trash | Valid drop highlighting; immediate removal and restore; ghost not cleaned on cancellation | 1.08 target scale, 150ms icon exit and 180ms restoration; cleanup on cancelled drag |
| Links | Mixed existing underline/opacity feedback, static external badges | Shared link timing, 1px badge arrow movement, hover restricted to fine pointers |
| Preview images | Fixed existing frame; image appears abruptly on load | 180ms image opacity transition, cached-image handling, existing frame retained |
| Case studies / About | Stable editorial content, no generic scroll reveals | Retained; no stagger, parallax, paragraph or portrait animation added |
| Browser embeds | Repeating bouncing scroll hint before timed disappearance | Remove bounce; retain static hint with brief delayed fade |
| Forms | Inputs explicitly remove outline without replacement, disabled send button | Visible focus rings on desktop/mobile fields; shared field/press timing |
| Mobile | Static screens, native scrolling, existing information architecture | Preserve screens and navigation; shared tap/focus feedback, hover gated |
| Loading / routes | Lazy desktop/mobile chunks, existing fixed/aspect-ratio media frames; no route animation framework | Retained; no animated skeleton or new route transition framework |
| Reduced motion | Window-only duration override; dock and press scaling still present | Shared 1ms tokens, disable dock/press/badge/window translations and scaling; preserve drag transforms |

## Shared motion vocabulary

`src/styles/motion.css`: instant 80ms, fast 120ms, standard 180ms, window 220ms, slow 300ms; close 150ms; tooltip delay 450ms. Easing: out `(0.22, 1, 0.36, 1)`, in-out `(0.65, 0, 0.35, 1)`, soft `(0.25, 0.1, 0.25, 1)`. Lifecycle JavaScript reads CSS tokens instead of maintaining a separate geometry duration.

## Validation

- `npm run build`: pass, including `tsc -b`.
- `npm run lint`: pass.
- `git diff --check`: pass.
- `npm run check:case-studies`: fails at the existing mobile icon registration assertion: `/icons/md-icon-mobile.png` versus `/icons/doc-preview.svg`. Neither the content registrations nor this assertion was changed by this task.
- Manual Chrome preview: single-click selection without opening; Space opens text; double-click opens markdown and image; case-study scrolling; maximize/restore; overlapping About and case-study windows; title-bar drag; close and opener focus return; Escape closes image and returns focus; drag text icon into Trash without opening; Trash opens and Put Back restores the icon and updates count. Restored the test icon after testing; did not save a new shipped icon layout.
- Reduced-motion CSS, cancellation paths and the unused minimize/restore lifecycle were code-reviewed. OS reduced-motion runtime, touch hardware, dock-hover timing, rapid-input performance profiling and the complete all-file regression matrix were not manually exercised.

## Intentionally preserved

Visual identity, typography, pink background, content, routes, default icon/window geometry, case-study layouts, native scrolling, window shadows and dock dimensions/order. Existing media/video playback remains content behavior. No new libraries. The yellow control remains restore-default-size: no current UI invokes minimize, so adding a minimize control would change functionality. Geometry transitions still animate left/top/width/height only during maximize/restore; ordinary dragging stays transform-based. No Trash confirmation pulse was added because the icon exit and target highlight already communicate the result.
