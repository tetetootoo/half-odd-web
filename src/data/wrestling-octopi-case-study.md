# Wrestling Octopi

## A social media management product designed and engineered to simplify complex content workflows.

**Role**
Founder · Product Designer · Software Engineer

**Status**
In development toward beta · Work in progress

**Focus**
Product Design · UX/UI · Interaction Design · Reusable Components · Automated Testing

**Technology**
React · TypeScript · API Integrations · Vitest · React Testing Library

<!-- PROJECT_OVERVIEW -->

## the product in practice

A look at how the interface works beyond static screens.

<!-- PRODUCT_WORKFLOW -->

I started working more closely with social media and wanted a tool that could simplify the process. The products I found were either expensive, missing functionality I needed, or so feature-heavy that using them became another task in itself.

So I started building the tool I wanted to use.

**Wrestling Octopi brings planning, creating, scheduling, publishing, and managing social content into one connected workspace - designed and engineered by me from the ground up.**

---

## working with ai, not delegating judgment

I initially used AI heavily to explore and generate parts of the product.

Technically, it moved fast. Visually, the results repeatedly converged on the same patterns: excessive cards, predictable dashboards, generic hierarchy, and interfaces that looked increasingly recognisable as AI-generated.

The problem was hierarchy: too many containers competed with the task itself. I evaluated the generated interface by using it, then decided which elements needed emphasis and which could recede.

So I moved back into the interface manually - simplifying hierarchy, removing unnecessary containers, refining typography and spacing, and establishing a visual system deliberately.

<!-- BEFORE_AFTER -->

**AI remained useful for producing software quickly. Taste still had to come from me.**

---

## Designing complexity out

My research started with existing social media tools, paying particular attention to the moments where I felt lost, overloaded, or forced through more interface than the task required.

I combined what worked with inspiration from products far outside the category, with one principle:

**A powerful tool shouldn't have to feel like a complicated one.**

<!-- FEED_PREVIEW -->

The feed planner became a good example. What looks like a simple draggable grid has to account for drafts, scheduled posts, publishing states, failures, live content, media drops, and persistent ordering.

The challenge wasn't exposing all of that complexity.

It was deciding when the user actually needed to see it.

<!-- PLANNING_PAIR -->

<!-- ANALYTICS -->

<!-- COMMENTS -->

---

## engineering the experience

I built the frontend in React and TypeScript, using shared components to keep the experience consistent across different parts of the product. The same typed Button component serves Feed Preview, Posts, and the post editor, with variants, sizes, and loading states. Vitest and React Testing Library cover the feed interface, while separate API tests check ordering and ownership rules.

### where ai needed direction

I used an AI coding agent to implement the feed planner's initial drag-and-drop interaction. The first version had inconsistent tile sizes, dragging that didn't reliably update the order, too little visual feedback, and rearrangement animations that felt unnatural.

I worked through several rounds of changes with the agent, testing in the browser after each round and identifying what still needed work. I refined tile sizing, feedback, and rearrangement behavior until the ordering and interaction matched the experience I intended.

The current grid uses a consistent tile ratio and a separate drag preview. Completing a drag updates the local order, while saving remains an explicit action.

AI helped me build the interaction, but getting it to feel right still depended on the decisions I made along the way.

<!-- FEED_DRAG_ITERATION -->

<!-- ARCHITECTURE -->

---

## Designing and engineering as one process

There is no handoff between design and engineering on Wrestling Octopi.

An interaction can move from an idea into working software, expose a problem, return to design, and be rebuilt within the same iteration.

I use AI coding agents extensively, initially Claude Code and increasingly Codex, but manual testing remains essential. I've encountered situations where an agent repeatedly insisted an implementation was correct while using the product made it obvious that it wasn't.

That changed how I work with these systems.

**I use AI for leverage, not authority.**

<!-- DEVELOPMENT_PROCESS -->

---

# Observe → Design → Build → Use → Reconsider → Build again.

### Currently building

Wrestling Octopi is still in active development and moving toward beta launch. Building it has become an ongoing experiment in what happens when product thinking, visual design, engineering, testing, and AI-assisted development happen as one continuous process.

**View Wrestling Octopi ↗**

**View GitHub ↗**
