# SAP Graph

**frontend engineering · design systems · developer tools**

SAP Graph was an early-stage developer platform inside SAP Technology & Innovation, designed to give developers a unified way to work with business data spread across otherwise disconnected enterprise systems.

I joined the team during its early-access phase, first as a software engineering intern and later as a working student.

My work sat at the intersection of product design and frontend engineering: translating high-fidelity product designs into production software, building reusable interface infrastructure, and helping establish the quality and consistency of an evolving developer product.




## one graph instead of fragmented systems

Enterprise data rarely lives in one place.

A developer building a single application experience may need information from multiple products, APIs, and data models.

SAP Graph approached that problem by introducing a semantic layer across those systems, giving developers a unified way to navigate connected business data instead of requiring every application to handle each underlying source independently.

<!-- SAP_GRAPH_DIAGRAM -->


## translating design into production software

I worked closely with product designers to translate high-fidelity interface and interaction specifications into production-facing React and TypeScript software.

That meant more than reproducing a static design.

Each interaction had to work within an evolving product architecture, SAP's existing frontend ecosystem, accessibility requirements, reusable component patterns, and the constraints of a large engineering organisation.

The work taught me to treat implementation as part of the design process: understanding the intention behind an interaction, identifying where the design met technical constraints, and finding solutions that preserved the experience rather than simply approximating the mockup.




## building for reuse

As the product grew, repeated interface patterns needed to become shared infrastructure rather than one-off implementations.

I built and maintained more than 10 reusable UI components and wrappers within SAP's Fiori/UI5 ecosystem, used across the SAP Graph frontend.

Working inside an established design system changed the way I thought about components.

A component wasn't finished when it matched one screen. It needed to remain predictable across different contexts, expose the right amount of flexibility, preserve shared interaction patterns, and be understandable to the engineers using it later.

<!-- SAP_REUSE_DIAGRAM -->


## software that can change

Reusable components create room for a product to evolve.

The challenge was finding the boundary between what should remain fixed and what should remain configurable.

Too little flexibility creates duplication.

Too much flexibility turns a component into another system that developers have to understand.

I learned to look for the stable interaction or visual pattern underneath individual screens and encode that pattern without prematurely generalising everything around it.


## considered exceptions

Not every interaction fit neatly inside the existing component system.

In one case, the intended tooltip interaction was better supported by an external library than by forcing the behaviour through the available internal primitives.

Rather than treating that as a purely technical decision, I assessed the tradeoff together with a mentor: the value of preserving the intended interaction against introducing a local dependency outside the primary component system.

We chose the exception deliberately.

That experience stayed with me because it reframed consistency for me. A design system is not valuable because every implementation is identical. It is valuable because it gives a team a shared default and makes deviations conscious, explainable decisions.

<!-- SAP_EXCEPTION_DIAGRAM -->


## testing the interface, not just building it

Production UI work also meant proving that interactions continued to behave correctly as the product changed.

I built and maintained automated frontend testing across Jest, Cypress, and Gauge, covering different layers of the interface and development workflow.

Testing made the relationship between design and engineering particularly tangible.

An interface can look correct and still behave incorrectly. Reusable components can work in isolation and fail in context. A seemingly small implementation change can affect interactions elsewhere in the product.

The goal wasn't simply test coverage. It was confidence that the experience we designed would continue to work when the product evolved.


## working inside a product team

SAP Graph was my first experience building software inside a large cross-functional product organisation.

I worked with product managers, designers, engineers, and mentors across planning, implementation, code review, testing, documentation, and delivery.

The scale of SAP introduced constraints I hadn't encountered in university projects: shared architecture, existing design systems, long-lived code, multiple contributors, documentation standards, accessibility considerations, and decisions that had consequences beyond the screen directly in front of me.

It also showed me how much stronger the work becomes when design and engineering aren't treated as a handoff.

The most interesting problems often appeared exactly at that boundary.


## what stayed with me

SAP Graph fundamentally changed how I approached digital product work.

I entered the team primarily from a computer science background.

I left with a much stronger interest in the space between interface design and software engineering.

The experience taught me to ask questions I still use today:

How should this interaction actually behave?

What part of this pattern should become reusable?

Where should the system remain strict?

Where does the product need an exception?

What happens to this decision when another engineer, another screen, or another requirement arrives later?

Those questions now shape the way I work across both design and engineering.


## where it went

I worked on SAP Graph during its early-access phase in 2020-21.

Since then, the capability has evolved into Graph / API Composition within SAP Integration Suite's API Management offering and is now generally available.

The core idea remains recognisable: giving developers a unified, semantically connected way to work with business data distributed across different systems.

Today, SAP describes Business Data Graphs that can be consumed through OData V4 and GraphQL and can connect SAP as well as custom data sources.

I wasn't involved in these later iterations, but seeing an early-stage product I contributed to mature into a generally available platform capability has been particularly rewarding.

<!-- SAP_EVOLUTION -->
