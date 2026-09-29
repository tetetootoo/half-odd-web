# Wrestling Octopi case-study media

Content now comes from `src/data/wrestling-octopi-case-study.md`.
Layout and media slots are configured in `src/data/caseStudies.ts`.
The old TypeScript case-study content has been retired.

Add real assets at these paths, then set the corresponding slot's `src`
in the shared case-study configuration. Missing assets retain their intended
layout with a neutral placeholder. Do not substitute invented product UI.

- `hero.mp4`: current working product
- `intro-visual.mp4`: product overview beside the opening copy
- `feed-planner.mp4`: actual drag-and-drop interaction
- `feed-state-1.png` through `feed-state-4.png`: draft, scheduled, publishing, failed/retry
- `ai-exploration.png`, `final-direction.png`: matched before/after captures
- `design-detail-1.png` through `design-detail-3.png`: hierarchy, typography/spacing, components/states
- `process-1.png` through `process-3.png`: one real feature's development sequence
- `final-interaction.mp4`: polished current interaction
- `final-sequence.mp4`: 10–15 seconds across connected current-product interactions

The existing numbered images and brand/graphic assets are preserved but
not automatically assigned to new slots: their role in this outline has
not been verified. Project status remains “Work in progress”, moving toward beta.

See `src/components/CaseStudy/README.md` for rendering, media playback,
icon replacement, and verification details.
