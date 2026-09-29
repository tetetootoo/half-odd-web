# Wrestling Octopi

## Designing and engineering a social media workspace from 0→1.

**Product Design · Design Engineering · Full-Stack Development · 2026 · Work in progress**

> Wrestling Octopi is an independent product I am currently designing and building. It is still in active development and moving toward beta launch.

<!-- HERO_MEDIA
Full-width product video / screen recording.
Show the current working product, not a conceptual mockup.
Suggested media: /media/wrestling-octopi-case-study/hero.mp4
-->

I started working more closely with social media and wanted a tool that could simplify the process. The products I found were either expensive, missing functionality I needed, or so feature-heavy that using them became another task in itself.

So I started building the tool I wanted to use.

**Wrestling Octopi brings planning, creating, scheduling, publishing, and managing social content into one connected workspace - designed and engineered by me from the ground up.**

<!-- INTRO_SPLIT
Desktop: 40% text / 60% product visual.
Mobile: text first, visual second.
Use one strong current product screen.
-->

---

## Designing complexity out

My research started with existing social media tools, paying particular attention to the moments where I felt lost, overloaded, or forced through more interface than the task required.

I combined what worked with inspiration from products far outside the category, with one principle:

# A powerful tool shouldn't have to feel like a complicated one.

<!-- FEED_PLANNER_VIDEO
Full-width interaction.
Show drag-and-drop reordering in the real product.
-->

The feed planner became a good example. What looks like a simple draggable grid has to account for drafts, scheduled posts, publishing states, failures, live content, media drops, and persistent ordering.

The challenge wasn't exposing all of that complexity.

**It was deciding when the user actually needed to see it.**

<!-- STATE_GRID
Four equal UI crops:
01 Draft
02 Scheduled
03 Publishing
04 Failed / Retry
-->

---

## AI could build the interface. It couldn't decide what it should feel like.

I initially used AI heavily to explore and generate parts of the product.

Technically, it moved fast. Visually, the results repeatedly converged on the same patterns: excessive cards, predictable dashboards, generic hierarchy, and interfaces that looked increasingly recognisable as AI-generated.

<!-- BEFORE_AFTER
Left: early AI-heavy direction.
Right: current manually refined direction.
Match viewport/crop as closely as possible.
-->

So I moved back into the interface manually - simplifying hierarchy, removing unnecessary containers, refining typography and spacing, and establishing a visual system deliberately.

<!-- DESIGN_DETAILS
Three close crops:
Hierarchy
Typography + spacing
Components + states
-->

# AI remained useful for producing software quickly.
# Taste still had to come from me.

---

## Designing and engineering as one process

There is no handoff between design and engineering on Wrestling Octopi.

An interaction can move from an idea into working software, expose a problem, return to design, and be rebuilt within the same iteration.

<!-- PROCESS_SEQUENCE
01 Idea / rough exploration
02 First implementation
03 Current refined interaction
Use a real feature.
-->

I use AI coding agents extensively, initially Claude Code and increasingly Codex, but manual testing remains essential. I've encountered situations where an agent repeatedly insisted an implementation was correct while using the product made it obvious that it wasn't.

That changed how I work with these systems.

# I use AI for leverage, not authority.

---

## Underneath the interface

<!-- ARCHITECTURE
Render as a simplified editorial diagram.
Only use technologies verified in the repository.
Do not invent stack details.

Suggested conceptual hierarchy:
Frontend
↓
Application / API
↓
Data
↙ integrations / services ↘
-->

The technical goal isn't complexity for its own sake.

It is to build enough infrastructure that complexity doesn't have to become part of the user's workflow.

<!-- FINAL_PRODUCT_INTERACTION
Return to a polished, simple user-facing interaction.
Contrast: complex underneath → simple on the surface.
-->

---

# Observe → Design → Build → Use → Reconsider → Build again.

Wrestling Octopi is still in active development and moving toward beta launch. Building it has become an ongoing experiment in what happens when product thinking, visual design, engineering, testing, and AI-assisted development happen as one continuous process.

<!-- FINAL_SEQUENCE
10-15 second current-product sequence across 2-3 connected interactions.
-->

**View live product ↗**

**View GitHub ↗**
