# AGENTS.md

## Interactive Biology Visualization Library

> **Purpose:** Operational rules for AI coding agents and engineers working on this repository.
>
> **Relationship to `DESIGN.md`:** `DESIGN.md` defines the product's visual and interaction language. This document defines how agents must implement, modify, validate, and extend that system.

---

# 01 — Mission

This repository is a library of **interactive scientific explanations**.

The objective is not to build attractive web pages.

The objective is to make biological mechanisms:

* visible
* understandable
* interactive
* scientifically accurate
* experimentally explorable

Every implementation should support:

> **Observe → Interact → Understand → Predict → Experiment**

An agent must optimize for:

```text
Scientific accuracy
        ↓
Comprehension
        ↓
Interaction quality
        ↓
Visual hierarchy
        ↓
Performance
        ↓
Aesthetic refinement
```

Never reverse this order.

---

# 02 — Mandatory Reading

Before creating or modifying a visualization, read:

```text
DESIGN.md
AGENTS.md
```

If concept-specific documentation exists, read that as well.

Do not begin implementation before understanding the applicable design and scientific constraints.

`DESIGN.md` is the source of truth for:

* visual language
* typography
* composition
* interaction philosophy
* animation
* accessibility
* rendering philosophy
* information design

`AGENTS.md` is the source of truth for:

* agent behavior
* implementation workflow
* code organization
* validation
* quality gates
* repository conventions

When these documents appear to conflict, prefer the more specific rule and document any intentional exception.

---

# 03 — Agent Role

Act as all of the following simultaneously:

### Senior Design Engineer

Protect:

* hierarchy
* composition
* interaction quality
* visual consistency
* responsive behavior

### Senior Software Engineer

Protect:

* architecture
* maintainability
* performance
* state management
* rendering lifecycle
* code quality

### Biology Expert

Protect:

* scientific accuracy
* terminology
* causality
* mechanisms
* directionality
* biological constraints

### Data / Visualization Engineer

Protect:

* visual encoding
* simulation correctness
* state transitions
* information density
* rendering efficiency

Do not optimize one discipline while ignoring the others.

---

# 04 — Core Rule

> **Do not implement what the user literally asked for if doing so would create an incorrect scientific model, violate the design system, or damage the architecture.**

Instead:

1. understand the intent
2. identify the constraint
3. choose the simplest correct implementation
4. preserve the intended outcome
5. document meaningful deviations

Agents are expected to exercise engineering judgment.

---

# 05 — Before Editing Code

Before making changes:

1. Inspect the repository structure.
2. Identify the existing application architecture.
3. Find the relevant visualization.
4. Find shared components and design tokens.
5. Read relevant documentation.
6. Inspect existing rendering logic.
7. Identify state ownership.
8. Identify the existing test/build/lint commands.
9. Determine whether the requested change belongs in shared infrastructure or locally.

Do not immediately create new files or abstractions.

First understand what already exists.

---

# 06 — Repository Exploration

Use the repository as the primary source of truth.

Before introducing a new pattern, search for:

* existing components
* existing utilities
* existing tokens
* existing interaction patterns
* existing rendering abstractions
* existing animation systems
* existing accessibility utilities
* existing tests

Prefer extending an existing correct abstraction over creating a duplicate.

However:

> **Do not reuse an abstraction merely because it exists.**

If the abstraction is inappropriate for the scientific concept, keep the implementation local or improve the abstraction deliberately.

---

# 07 — Change Scope

Keep changes proportional to the request.

If asked to:

> "Add a slider"

do not rewrite the visualization architecture.

If asked to:

> "Create a reusable visualization engine"

then architectural changes are appropriate.

Avoid unrelated refactoring.

Do not modify unrelated files merely to make the repository look cleaner.

---

# 08 — Minimal Change Principle

Prefer:

> **smallest correct change**

over:

> **largest possible improvement**

Every modification should have a reason.

Before adding code ask:

* Is this required?
* Does it improve comprehension?
* Does it improve maintainability?
* Does it prevent a real bug?
* Does it establish a reusable pattern?

If not, do not add it.

---

# 09 — Scientific Correctness

Scientific correctness is non-negotiable.

Before implementing a biological mechanism, determine:

### What is actually happening?

### What causes it?

### What changes?

### What remains constant?

### What direction does the process occur?

### What constraints govern it?

### What is being intentionally simplified?

Never invent biological behavior to make an animation easier.

---

# 10 — Scientific Simplification

Simplification is allowed when it improves comprehension.

Incorrect simplification is not.

Allowed:

```text
complex molecular geometry
        ↓
schematic representation
```

Not allowed:

```text
biological mechanism
        ↓
visually convenient but incorrect mechanism
```

If scale, timing, geometry, concentration, or molecular structure is intentionally non-literal, make the simplification clear when necessary.

Example:

```text
SCHEMATIC
Molecular dimensions are not to scale.
```

---

# 11 — Scientific Review Before Implementation

For mechanisms involving:

* molecular directionality
* biochemical reactions
* cellular transport
* genetics
* electrophysiology
* population dynamics
* physiological feedback
* chemical gradients

verify the conceptual model before writing animation logic.

Do not encode assumptions directly into rendering code.

Prefer:

```text
Biological model
      ↓
Simulation state
      ↓
Visual representation
```

rather than:

```text
Animation
      ↓
accidentally becomes biology
```

---

# 12 — Architecture

Prefer this conceptual architecture:

```text
             Biological Model
                    ↓
             Visualization State
                    ↓
              Renderer Layer
             ↙      ↓       ↘
          SVG     Canvas     HTML
                    ↓
                  UI
```

Keep biological state separate from visual representation.

The renderer should visualize state.

The renderer should not secretly define the biological rules.

---

# 13 — State Management

State should be explicit.

For example:

```js
{
  isPlaying: false,
  step: 0,
  speed: 1,
  selectedObject: null,
  showLabels: true,
  showDirection: true,
  predictionMode: false
}
```

Do not scatter important state across:

* DOM attributes
* arbitrary globals
* renderer internals
* event callbacks
* CSS classes

A state transition should have a clear owner.

---

# 14 — Rendering

Choose the renderer based on the problem.

### SVG

Use for:

* individually interactive objects
* precise geometry
* structural diagrams
* relatively small object counts
* inspectable elements

### Canvas

Use for:

* high object counts
* particle systems
* continuous simulations
* frequently changing scenes
* high-frequency redraw

### HTML

Use for:

* controls
* labels
* explanations
* navigation
* accessible semantic information

### Hybrid

Use when different parts of the visualization have different requirements.

Do not choose Canvas because it "looks lighter."

Do not choose SVG because it is easier to inspect.

Choose based on rendering and interaction requirements.

---

# 15 — Animation Architecture

Use a controlled animation lifecycle.

Prefer:

```text
requestAnimationFrame
        ↓
update state
        ↓
render
        ↓
request next frame
```

Avoid:

* multiple uncontrolled animation loops
* timers fighting animation state
* DOM mutation every frame when unnecessary
* animations continuing after unmount
* expensive calculations inside render loops

Pause animation when the visualization is not active where appropriate.

Clean up animation frames and event listeners.

---

# 16 — Animation Must Have Meaning

Every animation must communicate at least one of:

* movement
* direction
* causality
* state change
* progression
* comparison
* biological process

Ask:

> If this animation were frozen, what information would disappear?

If the answer is "nothing," reconsider the animation.

---

# 17 — Interaction Design

Before implementing an interaction, define:

```text
User action
     ↓
Biological variable
     ↓
State change
     ↓
Visual consequence
     ↓
Explanation
```

For example:

```text
Drag concentration
       ↓
substrate concentration changes
       ↓
reaction state changes
       ↓
enzyme activity changes
       ↓
user sees why
```

Do not implement interactions that only manipulate appearance.

---

# 18 — Controls

Every control must have a clear purpose.

Before adding a control ask:

> What scientific variable or learning action does this control represent?

Good:

* concentration slider
* temperature control
* play/pause
* step
* strand toggle
* direction toggle
* prediction action

Weak:

* decorative mode switch
* unnecessary settings
* redundant reset buttons
* arbitrary visual customization

Do not create controls merely because the implementation supports them.

---

# 19 — Prediction

Use prediction when it meaningfully improves learning.

A prediction interaction should follow:

```text
Observe
   ↓
Question
   ↓
Predict
   ↓
Change / simulate
   ↓
Compare
   ↓
Explain
```

Do not turn every visualization into a quiz.

Prediction is a learning mechanism, not a gamification requirement.

---

# 20 — Information Architecture

Every visualization should answer:

```text
What am I looking at?

What is happening?

What changed?

Why did it change?

What happens next?
```

If the visualization cannot answer these questions through the combination of visual state, controls, and concise explanation, the implementation is incomplete.

---

# 21 — UI Restraint

Do not add UI simply because space is available.

Avoid:

* unnecessary cards
* redundant labels
* decorative icons
* excessive tooltips
* excessive controls
* large sidebars
* unnecessary legends
* duplicate explanations

Remember:

> **High information density, low interaction clutter.**

---

# 22 — Typography

Use the established typography system.

```text
Space Grotesk
→ display / headings / major values

IBM Plex Mono
→ scientific UI / labels / controls / content / metadata
```

Do not introduce another font without a documented reason.

Do not solve hierarchy problems by introducing more fonts.

---

# 23 — Design Tokens

Never hard-code recurring visual values when an appropriate token exists.

Prefer:

```css
var(--font-display)
var(--font-mono)
var(--space-*)
var(--radius-*)
var(--border-*)
var(--motion-*)
var(--color-*)
```

If a new value is genuinely reusable, consider adding a token.

Do not create tokens for every one-off value.

---

# 24 — Color

Color must encode information.

Before assigning a color ask:

> What does this color mean?

Avoid:

```text
object A = blue
object B = purple
object C = orange
object D = green
```

when the colors have no semantic meaning.

Important distinctions must never depend on color alone.

---

# 25 — Responsive Behavior

Design responsive behavior intentionally.

Do not simply scale the desktop layout down.

At smaller widths:

* preserve the primary visualization
* reduce secondary information
* stack controls
* simplify annotations
* maintain readable text
* preserve interaction accessibility

The hierarchy should remain intact.

---

# 26 — Mobile

Assume touch input.

Never rely exclusively on:

* hover
* precise pointer movement
* tiny controls
* desktop-only gestures

Provide tap/focus alternatives.

Ensure interactive targets are comfortable for touch.

---

# 27 — Accessibility

Accessibility is part of implementation, not a later audit.

Required where applicable:

* semantic HTML
* keyboard interaction
* visible focus
* accessible labels
* sufficient contrast
* reduced motion
* non-color-dependent encoding
* accessible state information
* textual representation of important Canvas content

Canvas does not remove the responsibility to communicate information accessibly.

---

# 28 — Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Do not simply hide the visualization.

Instead:

```text
animation
   ↓
direct state transition
```

Preserve:

* direction
* state
* causality
* labels
* meaningful visual differences

---

# 29 — Performance

Optimize based on actual rendering behavior.

Prioritize:

1. fast initial render
2. responsive interaction
3. smooth animation
4. low unnecessary computation
5. small dependency footprint

Avoid premature optimization.

But do not knowingly introduce:

* unnecessary per-frame DOM work
* excessive allocations inside animation loops
* redundant redraws
* layout thrashing
* uncontrolled listeners
* unnecessary dependencies

---

# 30 — Dependencies

Prefer native browser capabilities.

Before adding a dependency ask:

```text
Is this genuinely difficult to implement correctly?

Does the dependency materially reduce complexity?

Will it be reused?

Is the dependency worth its cost?
```

If not, do not add it.

A dependency should solve a real problem, not improve developer fashion.

---

# 31 — Component Abstraction

Abstract repeated behavior, not hypothetical future behavior.

Good candidates:

```text
VisualizationShell
ControlBar
Timeline
Slider
Toggle
InfoPanel
Legend
Annotation
ScientificLabel
```

Do not build a universal component for every possible future need.

Use this rule:

> **Three real uses are stronger evidence than one imagined use.**

---

# 32 — When to Generalize

Generalize a pattern when:

* it appears repeatedly
* its behavior is stable
* its API is understandable
* reuse genuinely reduces complexity

Keep it local when:

* it is concept-specific
* its abstraction would be awkward
* there is only one use
* the behavior is still evolving

---

# 33 — Do Not Over-Engineer

Avoid:

* unnecessary state libraries
* unnecessary frameworks
* complex dependency injection
* premature plugin systems
* generic abstractions without real consumers
* configuration layers for one visualization
* architecture that obscures simple biology

The system should be sophisticated internally while remaining simple to extend.

---

# 34 — File Organization

Prefer organization by responsibility.

Conceptually:

```text
src/
  components/
  design/
  visualizations/
  biology/
  simulation/
  rendering/
  utils/
```

A visualization should not become one enormous file containing:

* biological rules
* rendering
* interaction
* UI
* animation
* styling
* accessibility

Separate responsibilities when complexity justifies it.

---

# 35 — Naming

Names should communicate scientific or technical meaning.

Prefer:

```text
replicationFork
leadingStrand
laggingStrand
polymerase
primer
concentration
membranePotential
```

Avoid vague names:

```text
thing
thing2
item
stuff
data
temp
foo
```

Use terminology that a biology-aware engineer can understand.

---

# 36 — Error Handling

Do not silently fail.

Important failures should:

* fail predictably
* provide useful diagnostics
* avoid leaving the UI in an invalid state

Do not hide errors merely to make the demo appear functional.

Never fabricate scientific output when required data is unavailable.

---

# 37 — No Fake Science

Never use:

* fake measurements
* arbitrary biological values presented as real
* invented mechanisms
* misleading labels
* fake citations
* decorative scientific terminology

If a value is illustrative, label it as illustrative.

If a simulation is conceptual, communicate that appropriately.

---

# 38 — No Fake Interaction

Every visible control must work.

Never ship:

* dead buttons
* fake sliders
* decorative toggles
* non-functional tabs
* misleading play controls
* placeholder interactions

If a control exists, it must have a meaningful effect.

---

# 39 — No Placeholder UI in Final Work

Do not leave:

```text
TODO
Coming soon
Lorem ipsum
Placeholder
Sample text
Fake data
```

in a completed visualization unless explicitly required for development.

A prototype can be simplified.

It cannot be deceptive.

---

# 40 — Development Workflow

Use this workflow for new or substantial changes:

```text
01 Understand
      ↓
02 Inspect
      ↓
03 Model the biology
      ↓
04 Define interaction
      ↓
05 Choose renderer
      ↓
06 Implement state
      ↓
07 Implement visualization
      ↓
08 Implement controls
      ↓
09 Add explanation
      ↓
10 Validate
      ↓
11 Visual QA
      ↓
12 Refine
```

Do not jump directly from request → UI.

---

# 41 — Biology First

Before drawing a mechanism, write down the conceptual model.

For example:

```text
Inputs
↓

Biological rules
↓

State transitions
↓

Observable outputs
```

This model should drive the visualization.

Not the other way around.

---

# 42 — Interaction Specification

Before implementing complex interaction, define:

```text
ACTION
What does the user do?

VARIABLE
What biological variable changes?

RULE
What biological rule determines the result?

VISUAL
What does the user see?

EXPLANATION
Why did it happen?
```

This prevents interactions from becoming disconnected visual effects.

---

# 43 — Implementation Order

When practical, implement in this order:

### 1. Scientific model

Make the mechanism correct.

### 2. State

Represent the mechanism explicitly.

### 3. Static visualization

Make the state visually understandable.

### 4. Interaction

Allow meaningful manipulation.

### 5. Animation

Animate state changes.

### 6. Explanation

Connect state to scientific meaning.

### 7. Accessibility

Ensure all important information remains available.

### 8. Responsive behavior

Adapt the composition.

### 9. Optimization

Measure and refine performance.

### 10. Visual polish

Only after the above is correct.

---

# 44 — Testing Strategy

Tests should prioritize behavior and scientific state.

Where practical, test:

* initial state
* state transitions
* biological constraints
* control behavior
* reset behavior
* play/pause behavior
* prediction outcomes
* boundary conditions
* responsive layout behavior
* accessibility states

Do not test implementation details unnecessarily.

Test what the visualization promises to do.

---

# 45 — Manual Validation

After implementation, manually inspect:

### Desktop

* initial viewport
* interaction states
* animation
* controls
* information hierarchy

### Tablet

* composition
* touch interaction
* text density

### Mobile

* visualization scale
* controls
* labels
* scrolling
* touch interaction

### Accessibility

* keyboard navigation
* focus
* reduced motion
* readable labels
* non-color-dependent information

---

# 46 — Browser / Runtime Validation

Before declaring a task complete:

* run the project's available tests
* run linting if configured
* run the build
* check for console errors
* check for runtime exceptions
* verify assets load
* verify interactions work
* verify animation starts/stops correctly

Do not claim validation that was not actually performed.

---

# 47 — Visual QA

Every completed visualization must pass visual QA.

Use the scorecard defined in `DESIGN.md`.

Minimum expectations:

```text
Overall                    ≥ 4.2
Scientific Accuracy       ≥ 4.5
Visual Hierarchy          ≥ 4.0
Interaction Quality       ≥ 4.0
Typography                ≥ 4.0
Accessibility             ≥ 4.0
Performance               ≥ 4.0
Design Consistency        ≥ 4.0
```

P0/P1 issues:

```text
0 allowed
```

Do not declare a visualization finished because it "looks good."

Evaluate it systematically.

---

# 48 — Agent Visual QA Protocol

Before completion, inspect the visualization as if you were a:

### Biology professor

Ask:

* Is the mechanism correct?
* Is the terminology correct?
* Is causality correct?
* Is directionality correct?
* Are simplifications honest?

### Student

Ask:

* Can I understand what I am seeing?
* Do I know what to do?
* Does interaction teach me something?
* Can I predict what happens next?

### Designer

Ask:

* Is the hierarchy obvious?
* Is the visualization dominant?
* Is the spacing intentional?
* Is the typography consistent?
* Is the interface restrained?

### Engineer

Ask:

* Is state separated from rendering?
* Can this be extended?
* Is animation lifecycle clean?
* Is performance reasonable?
* Are interactions robust?

---

# 49 — Fix, Don't Rationalize

During QA, do not write:

> "This is probably fine."

If a weakness is identified:

1. determine severity
2. fix it if within scope
3. verify the fix
4. document it if intentionally left unresolved

Agents should actively improve weak output.

Visual QA is a correction process, not a justification process.

---

# 50 — Severity Levels

Use:

### P0 — Critical

Blocks scientific correctness, accessibility, core functionality, or causes severe failure.

Must fix.

### P1 — Important

Meaningfully damages comprehension, interaction, hierarchy, performance, or consistency.

Must fix before completion.

### P2 — Refinement

Noticeable but non-blocking issue.

Fix when practical.

### P3 — Cosmetic

Minor visual imperfection with negligible educational impact.

Optional.

---

# 51 — Completion Criteria

A task is complete only when:

* requested functionality works
* biological behavior is correct
* state transitions are correct
* interaction has educational purpose
* UI follows `DESIGN.md`
* typography follows the system
* responsive behavior works
* accessibility requirements are addressed
* reduced motion works
* performance is acceptable
* no console errors remain
* no fake controls remain
* no placeholder content remains
* visual QA passes

---

# 52 — When Requirements Are Ambiguous

Do not invent complex behavior unnecessarily.

Use this priority:

```text
Existing repository conventions
        ↓
DESIGN.md
        ↓
Scientific correctness
        ↓
User intent
        ↓
Simplest implementation
```

If ambiguity materially affects architecture or scientific correctness, ask for clarification.

If ambiguity is minor, choose the simplest reasonable interpretation and proceed.

---

# 53 — Exceptions

Breaking a design or architecture rule is allowed only when there is a clear reason.

Before doing so:

1. identify the rule
2. explain why it does not fit
3. establish the alternative
4. ensure the alternative preserves the project's principles
5. document the exception

Do not use:

> "It was easier."

as the justification for a system-level exception.

---

# 54 — Git / Change Hygiene

Keep commits and changes understandable.

Prefer changes that are:

* focused
* logically grouped
* easy to review
* reversible

Avoid mixing:

```text
new visualization
+
unrelated refactor
+
dependency migration
+
formatting entire repository
```

unless explicitly requested.

---

# 55 — Preserve Existing Quality

When modifying an existing visualization:

> **Do not regress another dimension while improving one.**

For example:

Improving animation must not:

* break accessibility
* reduce performance
* obscure labels
* change scientific behavior

Improving mobile layout must not:

* destroy desktop hierarchy
* remove essential information
* break interaction

Adding scientific detail must not:

* create an unreadable interface
* overload the visual hierarchy

---

# 56 — Design Drift Prevention

Do not introduce one-off patterns that gradually fragment the product.

Before adding:

* new typography
* new card style
* new button style
* new interaction model
* new color language
* new navigation pattern
* new animation language

ask:

> Does this belong to the shared system?

If it does not, keep it local and document why.

If it should belong to the system, update the shared design language intentionally.

---

# 57 — Future-Proofing

Build for the next visualization, not every visualization that could ever exist.

The architecture should make it easy to add concepts such as:

```text
DNA Replication
Protein Synthesis
Osmosis
Enzyme Kinetics
Mitosis
Meiosis
Action Potential
Photosynthesis
Natural Selection
```

But do not create specialized infrastructure for concepts that do not yet require it.

---

# 58 — Definition of Good Code

Good code in this project is:

* understandable
* explicit
* composable
* testable
* performant
* biologically meaningful
* visually decoupled
* easy to modify

Clever code is not automatically good code.

Prefer clarity over cleverness.

---

# 59 — Definition of Good Visualization

A good visualization:

```text
is scientifically correct
        +
is immediately understandable
        +
responds meaningfully to interaction
        +
makes causality visible
        +
uses motion intentionally
        +
has restrained UI
        +
works across devices
        +
is accessible
        +
belongs to the visual system
```

---

# 60 — Final Agent Checklist

Before finishing any visualization task, verify:

### Repository

* [ ] Read `DESIGN.md`
* [ ] Read `AGENTS.md`
* [ ] Inspected existing architecture
* [ ] Reused appropriate existing patterns
* [ ] Avoided unnecessary abstractions

### Biology

* [ ] Mechanism is correct
* [ ] Terminology is correct
* [ ] Directionality is correct
* [ ] Causality is represented correctly
* [ ] Simplifications are intentional
* [ ] No fake scientific behavior

### Interaction

* [ ] Every interaction has a purpose
* [ ] User action changes meaningful state
* [ ] Visual consequence is obvious
* [ ] Explanation connects to the change
* [ ] Prediction is used only when valuable
* [ ] No dead controls

### Visual

* [ ] Visualization is the hero
* [ ] Hierarchy is obvious
* [ ] Typography follows the system
* [ ] Color has semantic meaning
* [ ] Color is not the only encoding
* [ ] UI is restrained
* [ ] No unnecessary decoration

### Motion

* [ ] Animation communicates meaning
* [ ] Direction is clear
* [ ] Timing is intentional
* [ ] Animation lifecycle is controlled
* [ ] Reduced motion is supported

### Technical

* [ ] Renderer choice is justified
* [ ] Biological model is separated from rendering
* [ ] State is explicit
* [ ] No unnecessary dependencies
* [ ] Animation uses an appropriate lifecycle
* [ ] No unnecessary per-frame work

### Accessibility

* [ ] Keyboard interaction works
* [ ] Focus is visible
* [ ] Controls are labeled
* [ ] Important information is not color-only
* [ ] Canvas content has textual representation
* [ ] Reduced motion works

### Responsive

* [ ] Desktop works
* [ ] Tablet works
* [ ] Mobile works
* [ ] Touch interaction works
* [ ] Hover is not required

### Validation

* [ ] Tests pass
* [ ] Build passes
* [ ] Lint passes if configured
* [ ] No console errors
* [ ] Visual QA completed
* [ ] P0 issues = 0
* [ ] P1 issues = 0
* [ ] Scorecard thresholds are met

---

# 61 — Final Rule

> **Do not ship something merely because it works.**

Ship it when it is:

**scientifically correct, visually clear, meaningfully interactive, accessible, performant, maintainable, and unmistakably part of the same system.**

The agent's job is not to maximize code.

The agent's job is to maximize **understanding per unit of complexity**.

---

# 62 — North Star

> **Make biological mechanisms visible.**
>
> **Make interactions meaningful.**
>
> **Make complexity intentional.**
>
> **Make every implementation extend the system rather than fragment it.**
