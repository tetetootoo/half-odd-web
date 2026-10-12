# Accessibility implementation — Half Odd

## Summary

Reviewed the React/TypeScript Half Odd portfolio, not Wrestling Octopi. This work targets relevant WCAG 2.2 AA criteria while retaining the pink desktop, draggable files/windows, sticky note, dock, typography, case-study layouts, saved coordinates and motion system. No new dependencies were added.

Changes improve text contrast, keyboard and single-pointer movement alternatives, playback controls, focus visibility, mobile modal dismissal, document scrolling and contact feedback. Necessary visible changes are dark desktop/mobile file labels and menu text, darker document links, larger invisible window-control hit areas, native video controls, and compact arrangement controls.

This is a targeted engineering audit, not a complete conformance assessment or certification. Criterion references: [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Findings

| Confirmed issue | Component | Severity | Criterion | Fix / disposition |
| --- | --- | --- | --- | --- |
| White text on the pale pink background and pale blue links on light documents lack minimum contrast | DesktopIcon, Mobile, MenuBar, document/link CSS | High | 1.4.3 | Existing dark ink and darker blue links; numerical palette checks |
| Repositioning files, windows and the introduction requires dragging | Desktop, Window, IntroNote | High | 2.1.1, 2.5.7 | Native selection and direction buttons, usable by keyboard and individual pointer clicks |
| Project previews autoplay/loop without pause controls; reduced motion does not cover every video renderer | Window, Mobile, CaseStudyMedia | High | 2.2.2; reduced-motion improvement also relates to AAA 2.3.3 | Shared native video wrapper exposes controls and disables autoplay/loop with reduced motion; pauses on preference change |
| Mobile modal does not respond to Escape and its focus list omits embedded frames | Mobile overlay | Medium | 2.1.1, 2.1.2, 2.4.3 | Escape dismissal and opener restoration; frames included, hidden/disabled inputs excluded |
| Window-control hit areas are 12px | Window | Medium | 2.5.8 | 24px targets, retaining 12px visual circles |
| Some form styles suppress inherited focus outlines; light desktop rings have weak contrast | Shared motion CSS, DesktopIcon | Medium | 2.4.7, 1.4.11 | Higher-specificity focus-visible rule in existing dark ink; dark icon rings |
| Sending/success/failure feedback is visual only | Desktop and mobile contact forms | Medium | 4.1.3 | Polite sending/success status regions and error alerts; native required/email validation retained |
| Desktop contact fields do not identify input purpose | Window contact form | Medium | 1.3.5 | Name/email autocomplete tokens |
| Plain text and CV scroll containers are not keyboard focus targets | PlainTextDoc, CvDoc | Medium | 2.1.1 | Named, tab-focusable documents for keyboard scrolling |
| Page lacks a main landmark | Desktop, Mobile | Low | 1.3.1, 2.4.1 | Native main elements with names |
| Selected desktop note is only distinguished visually | NotesFrame | Low | 4.1.2 | Native button pressed state |
| Dock labels cannot be dismissed with Escape or hovered across their gap | Dock | Medium | 1.4.13 | Escape hides labels; transparent hover bridge retains pointer access; accessible names remain available |

## Changes implemented

- **Desktop / IntroNote:** Added a native disclosure in the menu area with an object selector, movement buttons and a recoverable Move to Trash action. File moves reuse existing clamping and persistence; note movement reuses its measured geometry. Escape closes the disclosure and focuses its summary. Pointer dragging remains available. Movement feedback uses a polite status region. WCAG 2.1.1, 2.5.7, 4.1.3.
- **Window:** Added a small movement disclosure to the title bar using the existing geometry state. Direction controls keep the title bar reachable. Escape dismisses the movement menu without closing the document. Windows remain non-modal, with no focus trap, and focus continues to raise their stacking order. Enlarged traffic-light targets without enlarging their visible circles. WCAG 2.1.1, 2.5.7, 2.5.8.
- **AccessibleVideo / existing renderers:** Added a shared behavioral wrapper, not a new visual player. Native controls provide pause/play. Reduced-motion preferences suppress automatic playback/looping and pause playback when the preference changes. Existing explicitly controlled recordings remain non-autoplaying. WCAG 2.2.2.
- **Contact forms:** Sending and sent feedback use status regions; network failure messages use alerts. Existing native required/email validation remains the source of input errors, avoiding duplicate error announcements. Desktop autocomplete identifies name/email purposes. WCAG 1.3.5, 3.3.1, 3.3.2, 4.1.3.
- **Mobile:** Retained modal semantics, background inertness, focus entry/return and Tab containment. Added Escape and included iframes in the focusable list. Audio controls expose Play/Pause and pressed state. WCAG 2.1.1, 2.1.2, 2.4.3, 4.1.2.
- **Shared semantics and CSS:** Main landmarks; named scrollable plain-text/CV documents; selected-note pressed state; readable file/menu text, links and focus indicators. No positive tabindex was introduced. WCAG 1.3.1, 1.4.3, 1.4.11, 2.1.1, 2.4.7, 4.1.2.
- **Dock:** Labels remain unnecessary for activation because links/buttons have names. Added keyboard dismissal and hover persistence. Existing magnification and reduced-motion logic remain. WCAG 1.4.13.

## Testing

### Automated tests passed

- `npm run check:accessibility`: Representative desktop/mobile server renders; one main landmark; named dock; no positive tabindex; accessible movement controls; non-modal desktop windows; contact status region and autocomplete; native pause controls; reduced-motion autoplay/loop suppression; numerical contrast checks for desktop labels and document links.
- `npm run check:case-studies`: All four documents, directives, media assets, desktop/mobile registrations and reduced-motion media access.
- `npm run lint`.
- `npm run build`, including TypeScript checking.
- `git diff --check`.

The checks use the existing Vite/React server-rendering infrastructure. They are regression checks, not an axe scan or a substitute for assistive-technology testing.

### Manual tests completed

Local Chrome, using native keyboard input and rendered DOM inspection:

- Enter opens Wrestling Octopi; focus enters the non-modal window. Videos expose controls and the two explicitly controlled recordings do not autoplay.
- Space on a window direction button moves its window 24px; Escape dismisses the movement menu. Closing the window returns focus to the originating file.
- Single-click introduction movement shifts it 24px right; moving left restores its prior location.
- Space opens SAP Graph; Page Down scrolls its focusable article without horizontal document overflow.
- At 390×844: Contact opens as a modal, receives focus and marks home/dock inert. Submitting empty fields triggers native required validation and focuses the name field; no network message is sent. Tab from the message wraps to Close. Escape closes and restores Contact focus.
- At 320×700: Space opens Wrestling Octopi; document width is 320px without horizontal overflow and both videos have controls. Shift+Tab from Close wraps to the final dialog control. Escape closes it.

### Screen-reader tests completed

None. Browser accessibility-tree/DOM inspection is not VoiceOver testing.

### Tests not performed

- Actual VoiceOver/Safari testing and physical touch hardware.
- Actual 200% browser zoom: attempted browser shortcuts did not change the measured viewport or device-pixel ratio. Narrow-viewport reflow was tested separately and is not claimed as equivalent zoom testing.
- Live success/failure contact submissions: no messages were sent. Status/alert semantics were inspected; network outcomes need a mocked browser-level test or a controlled form-service test.
- OS-level reduced-motion switching: automatic playback suppression was verified with server-rendered preference states; the change listener/pause path was inspected, not manually toggled.
- Full cross-origin iframe keyboard interaction, full text-spacing customization, all browser combinations, and an automated axe scan.

### Remaining known issues / evidence needed

- Prerecorded audio and videos need a content inventory for transcripts, captions and audio descriptions where applicable (1.2.1–1.2.5). No transcripts or descriptions of uninspected media were invented.
- External embedded websites are outside this repository; their focus behavior and accessibility cannot be established by this audit.
- Full visual contrast and reflow validation across every media asset, diagram, state and viewport remains necessary before any AA conformance claim.
- Arrangement announcements describe movement direction, not a complete coordinate-based position model. Introduction movement remains session-local, matching its existing drag behavior; saving the icon layout does not save the note.
- Changes to focus and status semantics require real screen-reader validation before claiming screen-reader compatibility.

## Resume-ready evidence

- Improved accessibility in a React/TypeScript desktop-style portfolio with keyboard and single-click alternatives to dragging, preserving existing file and window interactions.
- Implemented native video playback controls, reduced-motion playback handling, accessible contact status feedback and mobile modal dismissal/focus behavior.
- Added accessibility regression checks for rendered semantics, non-modal windows, motion preferences and text contrast, alongside TypeScript, lint and case-study validation.
