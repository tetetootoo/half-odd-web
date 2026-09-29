import type { TextBlock } from './textBlocks';

const MEDIA = '/media/wrestling-octopi-case-study';

// Shared between mobile and desktop so the "wrestling octopi case study.txt"
// overlay reads identically on both platforms.
//
// { pending: '...' } marks an asset slot the source outline called for but
// no file exists for yet — renders nothing on the site. See
// public/media/wrestling-octopi-case-study/README.md for the full list,
// filenames to use, and each one's art-direction notes.
export const WRESTLING_OCTOPI_CASE_STUDY: TextBlock[] = [
  '01. Wrestling Octopi',
  'Designing and engineering a social media workspace from 0→1.',
  '**Product Design · Design Engineering · Full-Stack Development · 2026**',
  { pending: 'hero-video' },
  {
    splitSection: {
      eyebrow: 'The problem',
      body: [
        'I started working more closely with social media and wanted a tool that could simplify the process. The products I found were either expensive, missing functionality I needed, or so feature-heavy that using them became another task in itself.',
        'So I started building the tool I wanted to use.',
      ],
      statement:
        'Wrestling Octopi brings planning, creating, scheduling, publishing, and managing social content into one connected workspace - designed and engineered by me from the ground up.',
      visualSrc: `${MEDIA}/intro-visual.mp4`,
      visualType: 'video',
      orientation: 'text-left',
      textRatio: 40,
    },
  },
  '## Designing complexity out',
  'My research started with existing social media tools, paying particular attention to the moments where I felt lost, overloaded, or forced through more interface than the task required.',
  'I combined what worked with inspiration from products far outside the category, with one principle:',
  '**A powerful tool shouldn’t have to feel like a complicated one.**',
  { pending: 'feed-planner-video' },
  'The feed planner became a good example. What looks like a simple draggable grid has to account for drafts, scheduled posts, publishing states, failures, live content, media drops, and persistent ordering.',
  "The challenge wasn't exposing all of that complexity.",
  'It was deciding **when the user actually needed to see it.**',
  { pending: 'feed-detail-draft' },
  { pending: 'feed-detail-scheduled' },
  { pending: 'feed-detail-publishing' },
  { pending: 'feed-detail-failed' },
  "## AI could build the interface. It couldn't decide what it should feel like.",
  { pending: 'ai-exploration' },
  { pending: 'final-direction' },
  'I initially used AI heavily to explore and generate parts of the product.',
  'Technically, it moved fast. Visually, the results repeatedly converged on the same patterns: excessive cards, predictable dashboards, generic hierarchy, and interfaces that looked increasingly recognisable as AI-generated.',
  'So I moved back into the interface manually - simplifying hierarchy, removing unnecessary containers, refining typography and spacing, and establishing a visual system deliberately.',
  '**AI remained useful for producing software quickly.\nTaste still had to come from me.**',
  '## Designing and engineering as one process',
  { pending: 'architecture-graphic' },
  'There is no handoff between design and engineering on Wrestling Octopi.',
  'An interaction can move from an idea into working software, expose a problem, return to design, and be rebuilt within the same iteration.',
  "I use AI coding agents extensively, initially Claude Code and increasingly Codex, but manual testing remains essential. I've encountered situations where an agent repeatedly insisted an implementation was correct while using the product made it obvious that it wasn't.",
  'That changed how I work with these systems.',
  '**I use AI for leverage, not authority.**',
  'The result is a process where design, engineering, testing, and iteration continuously inform one another:',
  '**Observe → Design → Build → Use → Reconsider → Build again.**',
];
