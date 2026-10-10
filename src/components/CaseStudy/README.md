# Markdown case studies

All four documents are registered in `src/data/caseStudies.ts`. The original
Markdown files remain the content source. Desktop and mobile entries use
`kind: 'markdown'` and the same stable `caseStudyId`; existing window open,
focus, drag and close behavior stays in the platform shells. The portfolio
has no URL router or document deep links.

## Shared icon

`MARKDOWN_DOCUMENT_ICON` (`public/icons/doc-preview.svg`) is the only
Markdown icon setting — a generic "little preview" page glyph (folded
corner, faint content lines), matching real macOS document icons rather
than a plain folder/text glyph. The `:).txt` icon uses the same SVG. The
system Notes glyph has independent rendering and is unaffected.

## Content and layout

Marked tokenizes the Markdown. `markdown.ts` interprets named HTML comments
using each project's directive configuration. Comments and arbitrary HTML
are never injected into the page. Headings, paragraphs, emphasis, lists,
blockquotes, links, rules and code blocks render through React.

The first two headings supply the project title/subtitle (SAP keeps its
eyebrow/title ordering). Later H1s become editorial statements. The first
paragraph after the hero is metadata. Explicit `<br>` sequences in SAP
supply capped total gaps rather than accumulating with element margins.
SAP diagrams use accessible SVG assets in `public/media/sap-graph-case-study`
through explicit media directives instead of Markdown code sketches.

`INTRO_SPLIT` and `BOOKING_SPLIT` move the immediately preceding paragraph
blocks into the text column without duplicating or rewriting their copy.
The configuration specifies how many paragraphs each split owns.

Layout directives select full-width media, splits, galleries, aligned bento
print grids, comparisons, or the explicitly conceptual software-layer
diagram. That diagram names no unverified technology or implementation.

## Media replacement

Each configured slot has a descriptive label, intended `path`, aspect ratio,
and optional `src`. Missing slots deliberately render a neutral placeholder.
To supply one, add the real asset at its `public` + `path` location, then set
that slot's `src` to its `/media/...` URL. A different filename is also fine:
update `path`, `src`, and `type` together. Existing Antispace assets already
have `src` values. Failed image/video requests use the same stable placeholder.

Ambient videos retain muted looping playback. The Wrestling Octopi working
product recording uses native controls, a poster, no autoplay, and no initial
video preload. Reduced-motion visitors can manually play every case-study
video through native controls. No scroll reveal hides content. Portrait print images use contain to preserve
whole designs. The old Half a Love Letter envelope emoji is deliberately
not presented as evidence of the final hand-drawn interaction.

The verified GitHub destination currently available in the portfolio is the
owner's profile. Replace the per-project links with repository URLs when
those are supplied; no project repository URLs have been guessed.

## Checks

`npm run check:case-studies` checks server rendering, one H1 per document,
directive coverage and split copy, real media paths, shared icon settings,
unique desktop/mobile entries, WIP status, and preservation of `:).txt`.
`npm run build` includes TypeScript checks. `npm run lint` runs Oxlint.

For browser QA, open all four files at desktop, laptop, tablet and mobile
widths. Check close/reopen and next-project navigation, vertically stacked
splits/comparisons, the bento grid's mobile alignment, and SAP diagram legibility. Check the controlled Wrestling Octopi workflow and ambient looping videos. Browser
visual and interaction QA needs an available browser connection.

## Project overviews and verified evidence

`PROJECT_OVERVIEW` consumes the four preceding Markdown paragraphs, each with
a bold field label on its first line and its value on the next. They render
once as a semantic definition list, in two columns when the document has room
and one column below its existing 700px container breakpoint.

The Wrestling Octopi engineering example was checked against the local product
repository: `apps/web/src/pages/FeedPage.tsx` (`handleDragEnd`, `saveOrder`,
`handleBulkDelete`), `apps/api/src/routes/feed.ts`, `apps/api/prisma/schema.prisma`
(`feedPosition`, `hiddenFromFeed`, `status`), and `apps/api/src/__tests__/feed.test.ts`.
The architecture image is reused unchanged. Its existing Cloudinary / S3 label
is supplied artwork; S3 implementation is not claimed by the new prose.

The AI section builds on the author's existing account and existing early/current
screenshots. No prompt, generated patch, numerical productivity claim, or specific
undocumented debugging incident was added. To strengthen this further, capture
one actual agent suggestion, the issue found during use, and the reviewed correction.

Both the original workflow recording and its web conversion are 13.95 seconds.
For a 20–40-second replacement, record one continuous sequence: open a draft,
edit its design in Canva, return with the imported media, choose a date/time,
confirm scheduling, and show the resulting scheduled post in Posts or Calendar.
Use a staging/test post; successful external publication is not needed.
