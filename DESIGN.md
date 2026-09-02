# Design System & Visual Integrity

## Interactive Biology Visualization Library

> **Status:** Foundational
> **Purpose:** Preserve visual, interaction, typographic, and information-design integrity across every visualization in this project.

---

# 01 — Design Principle

This project is a collection of **interactive scientific explanations**, not a collection of animated illustrations.

Every visualization should help the user understand a biological system by allowing them to:

> **Observe → Interact → Understand → Predict → Experiment**

The interface exists to make the science understandable.

The science does not exist to justify the interface.

---

# 02 — Product Character

The product should feel like:

* a modern scientific instrument
* an interactive textbook from the future
* a high-quality scientific publication
* a digital laboratory
* a carefully designed data visualization

It should NOT feel like:

* an ed-tech dashboard
* a generic SaaS application
* a children's educational app
* a game UI
* a marketing website
* a collection of flashy animations
* a PowerPoint presentation

### The desired feeling

**Precise. Curious. Intelligent. Calm. Tactile. Scientific.**

---

# 03 — Design North Star

Every visualization should satisfy five principles.

## 1. Scientific clarity

The user should understand what is happening.

## 2. Visual hierarchy

The important information should be visually dominant.

## 3. Interaction with purpose

Every interaction should reveal or manipulate something meaningful.

## 4. Restraint

Do less, but make every element intentional.

## 5. Consistency

Different biological concepts should feel like different instruments built by the same design team.

---

# 04 — The Golden Rule

> **If removing an element does not reduce understanding, remove it.**

This applies to:

* decorations
* labels
* cards
* buttons
* icons
* borders
* animations
* colors
* explanatory text
* UI controls

Minimalism is not about having fewer pixels.

Minimalism is about having **no unnecessary pixels**.

---

# 05 — Visual Hierarchy

Every visualization must have a clear hierarchy:

```text
LEVEL 01
Concept

LEVEL 02
Primary visualization

LEVEL 03
Current state / active process

LEVEL 04
Controls

LEVEL 05
Explanatory information

LEVEL 06
Metadata / secondary information
```

The user should know where to look within approximately one second.

The visualization is almost always the primary visual object.

UI should support the visualization rather than compete with it.

---

# 06 — Composition

Favor:

* asymmetric compositions
* generous whitespace
* strong alignment
* large visual canvas
* editorial spacing
* deliberate information density

Avoid creating a grid of equally weighted cards.

Do not turn every piece of information into a card.

Cards should be used only when grouping information genuinely improves comprehension.

---

# 07 — The Visualization Is the Hero

A typical composition should prioritize:

```text
             TITLE
               ↓
        MAIN VISUALIZATION
               ↓
        INTERACTION CONTROLS
               ↓
      CONTEXT / EXPLANATION
```

The visualization should occupy the largest meaningful area.

Controls should not dominate the screen.

Explanations should not obscure the visualization.

---

# 08 — Typography

Only two primary typefaces should be used.

## Display — Space Grotesk

Use for:

* page titles
* visualization titles
* section headings
* large numerical values
* major statements
* navigation when appropriate

Space Grotesk provides the editorial / human layer.

---

## Content / Scientific UI — IBM Plex Mono

Use for:

* body content
* annotations
* scientific terminology
* labels
* controls
* numerical values
* units
* metadata
* nucleotide sequences
* system state
* technical descriptions

IBM Plex Mono provides the scientific / instrument layer.

---

# 09 — Typography Rules

Do not introduce additional fonts casually.

Avoid:

* excessive font weights
* decorative type
* giant paragraph text
* excessively tight line-height
* overly small body text

Typography should create hierarchy primarily through:

* size
* weight
* spacing
* position
* contrast

not through constant changes in font family.

---

# 10 — Typography Hierarchy

A typical visualization may use:

```text
Eyebrow
IBM Plex Mono
small / uppercase / tracked

TITLE
Space Grotesk
large / strong

Description
IBM Plex Mono
compact

Visualization labels
IBM Plex Mono
small / precise

Controls
IBM Plex Mono
compact

Annotations
IBM Plex Mono
small

Scientific emphasis
Space Grotesk
when appropriate
```

Do not make everything large.

Information density should come from **organization**, not tiny text.

---

# 11 — Color Philosophy

Color must encode meaning.

Never use color merely because an interface looks empty.

A visualization should remain understandable if most colors are removed.

Use color primarily for:

* active state
* selection
* biological categories
* directional relationships
* changes in state
* warnings
* experimental variables

Avoid assigning a unique color to every object.

---

# 12 — Semantic Color

Create a shared semantic palette rather than concept-specific arbitrary colors.

For example:

```text
Background
Foreground
Muted
Border
Primary Accent
Secondary Accent
Active
Success
Warning
Error
```

Individual visualizations may introduce scientific colors where scientifically appropriate, but those colors must still respect the overall visual language.

---

# 13 — Color Is Never the Only Encoding

Never communicate an important scientific distinction through color alone.

Combine color with:

* shape
* position
* line style
* texture
* opacity
* direction
* animation
* labels

Example:

Bad:

> New DNA = blue
> Old DNA = gray

Better:

> New DNA = accent + different line treatment + directional animation + label

This improves accessibility and comprehension.

---

# 14 — Borders & Surfaces

Prefer:

* thin borders
* subtle separators
* flat surfaces
* restrained contrast

Avoid:

* heavy card borders
* excessive shadows
* floating glass panels
* excessive gradients
* neumorphism
* decorative containers

The visualization should feel like one coherent surface.

---

# 15 — Corner Radius

Use corner radius sparingly.

Controls can have modest rounding.

Large visualization surfaces should generally feel structured rather than bubbly.

Avoid:

```text
╭──────────────╮
│ EVERYTHING   │
│ IS A CARD    │
╰──────────────╯
```

The product should not look like a collection of UI components assembled from a component library.

---

# 16 — Interaction Philosophy

Every interaction must answer:

> **Why would a learner want to do this?**

Good interaction:

> Drag substrate concentration → enzyme activity changes.

Weak interaction:

> Drag molecule around because it looks cool.

Good interaction:

> Step through DNA replication → observe how the leading and lagging strands differ.

Weak interaction:

> Press a button → animation plays automatically with no explanation.

---

# 17 — Interaction Hierarchy

Use interaction in this order of preference:

### 01 — Explore

Hover, inspect, zoom.

### 02 — Manipulate

Drag, toggle, adjust sliders.

### 03 — Sequence

Play, pause, step through a mechanism.

### 04 — Predict

Ask the learner to anticipate an outcome.

### 05 — Experiment

Change variables and observe system behavior.

Not every visualization needs all five.

Use the lowest level that adequately explains the concept.

---

# 18 — Interaction Density

Do not make everything interactive.

Interactive elements should be obvious enough to discover but not so obvious that the visualization feels like a video game.

Target:

> **High information density, low interaction clutter.**

A user should not see dozens of buttons.

---

# 19 — Animation Philosophy

Animation is a communication tool.

It should answer:

> **What changed?**

or:

> **What is moving where?**

or:

> **What process is occurring over time?**

Never animate something solely because animation is available.

---

# 20 — Animation Characteristics

Prefer:

* subtle easing
* continuous physical movement
* directional motion
* progressive reveal
* state transitions
* controlled timing

Avoid:

* bouncing
* excessive spring effects
* decorative particle explosions
* constant background motion
* exaggerated transitions
* attention-grabbing UI animations

Scientific animation should feel **mechanical and purposeful**.

---

# 21 — Motion Should Encode Biology

Whenever possible, animation should correspond to a biological mechanism.

Examples:

### DNA replication

Nucleotides move toward the growing strand.

### Osmosis

Water movement reflects concentration differences.

### Action potential

Ion movement corresponds to membrane state.

### Protein synthesis

Ribosome movement corresponds to codon progression.

### Natural selection

Population characteristics change across generations.

The motion itself should teach.

---

# 22 — Timing

Use animation duration according to meaning.

### Micro interaction

~100–200ms

Hover, selection, focus.

### UI transition

~200–400ms

Panel, toggle, state change.

### Biological process

Variable.

The duration should reflect the conceptual process, not real biological time.

If real biological time is represented, explicitly communicate that it is a conceptual or compressed timescale.

---

# 23 — Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

* disable unnecessary continuous animation
* preserve state transitions
* replace movement with direct state changes
* retain arrows and visual indicators
* retain educational meaning

Reduced motion must not remove the user's ability to understand the concept.

---

# 24 — Information Design

Never present a wall of text beside an interactive visualization.

Use progressive disclosure.

Example:

```text
OBJECT
DNA POLYMERASE

Function
Adds nucleotides to a growing strand.

Direction
5' → 3'

Key idea
Requires a free 3' OH group.
```

This is preferable to:

> "DNA polymerase is an enzyme that catalyzes..."

The detailed explanation can exist elsewhere if needed.

---

# 25 — Information Density

The goal is:

> **Information-rich, not information-heavy.**

Use:

* short labels
* concise explanations
* diagrams
* visual relationships
* numerical readouts
* annotations
* progressive disclosure

Do not solve information density by shrinking text.

Solve it through hierarchy.

---

# 26 — Labels

Labels should appear when they help answer:

> "What am I looking at?"

Avoid labeling every object permanently.

Use:

* persistent labels for major structures
* contextual labels for secondary structures
* hover labels for discoverable objects
* detail panels for deeper information

---

# 27 — Scientific Notation

Use scientifically standard notation.

Examples:

```text
5′ → 3′
Na⁺
K⁺
CO₂
ATP
NADH
H₂O
```

Do not replace scientific notation with casual equivalents.

Units should be displayed consistently.

---

# 28 — Scientific Accuracy

Visual simplification is allowed.

Scientific distortion is not.

Every visualization must distinguish between:

### Conceptual simplification

Allowed.

### Incorrect mechanism

Not allowed.

When geometry, scale, timing, or molecular structure is intentionally simplified, communicate this where relevant.

Example:

> SCHEMATIC — molecular dimensions are not to scale.

---

# 29 — Biological Visual Language

Create recurring visual conventions.

For example:

### Molecules

Simple geometric forms.

### DNA

Consistent strand representation.

### Enzymes

Distinct but restrained molecular silhouettes.

### Membranes

Consistent layered representation.

### Particles

Small, high-contrast shapes.

### Direction

Arrows / movement / directional indicators.

### New material

Consistent visual treatment across concepts.

A user should gradually learn the visual language without being explicitly taught it.

---

# 30 — Canvas vs SVG vs HTML

Use the rendering technology according to the problem.

## SVG

Use when:

* objects are individually interactive
* geometry matters
* accessibility benefits from semantic elements
* there are relatively few objects
* precise selection is required

Good for:

* cell diagrams
* chromosome structures
* DNA diagrams
* pathways
* anatomical structures

---

## Canvas

Use when:

* many objects are changing every frame
* particle counts are high
* continuous simulation is required
* frequent redraw is expected
* individual DOM elements would be wasteful

Good for:

* molecular motion
* diffusion
* populations
* particle systems
* continuous simulations

---

## HTML

Use for:

* controls
* labels
* descriptions
* navigation
* semantic information
* accessibility

---

## Hybrid

Preferred for complex concepts.

```text
HTML
  ↓
Controls / explanation

SVG
  ↓
Interactive scientific structures

Canvas
  ↓
Continuous simulation / animation
```

Do not use Canvas just because it is fashionable or because it may produce a smaller file.

Choose the renderer based on interaction and rendering requirements.

---

# 31 — Component Philosophy

Reusable components should emerge from repeated needs.

Examples:

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

Do not create abstractions before they are needed.

Avoid building a massive design system that makes simple visualizations difficult to implement.

---

# 32 — Consistent Visualization Shell

Every visualization should share a recognizable structural language.

For example:

```text
CATEGORY / NUMBER

CONCEPT TITLE

Short explanatory statement

────────────────────────────

PRIMARY VISUALIZATION

────────────────────────────

Controls / timeline

Current state

Contextual explanation
```

Individual concepts can diverge when the science requires it.

Consistency should be structural, not restrictive.

---

# 33 — Navigation

Navigation should be quiet.

The user should be able to understand:

* which concept they are viewing
* which category it belongs to
* how to return to the library
* optionally what concept comes next

Avoid turning navigation into a large application sidebar unless the product eventually requires it.

---

# 34 — Empty Space

Whitespace is a functional element.

Use it to:

* separate conceptual groups
* focus attention
* establish hierarchy
* reduce cognitive load
* give scientific diagrams room to breathe

Do not fill whitespace simply because it exists.

---

# 35 — Responsive Design

Responsive design is not:

> desktop layout × smaller screen

Instead:

> **same information hierarchy × different composition**

On smaller screens:

* reduce secondary information
* stack controls
* simplify annotations
* preserve the visualization
* prioritize current state
* maintain readable typography

Never allow the visualization to become unusably small just to preserve a desktop composition.

---

# 36 — Mobile Interaction

Do not depend on hover.

Every hover interaction must have an alternative:

* tap
* focus
* explicit selection

Touch targets should be large enough for comfortable interaction.

Dragging should account for touch input.

---

# 37 — Accessibility

Accessibility is part of the visual design.

Required:

* keyboard navigation
* visible focus
* semantic HTML
* accessible control labels
* reduced-motion support
* sufficient contrast
* non-color-dependent communication
* meaningful text descriptions

Canvas-based content must have an accessible textual representation of important information.

---

# 38 — Performance Philosophy

Optimize for perceived responsiveness.

Priorities:

1. fast initial render
2. responsive interaction
3. smooth animation
4. low unnecessary computation
5. small dependency footprint

Avoid:

* unnecessary libraries
* massive frameworks for tiny interactions
* unnecessary DOM nodes
* expensive reflows
* redundant rendering
* unoptimized animation loops

---

# 39 — Dependency Philosophy

Prefer native web platform capabilities.

Before adding a dependency ask:

> Does this solve a genuinely difficult problem?

If the answer is no, do not add it.

A visualization that can be implemented cleanly with Canvas, SVG, CSS, and JavaScript should not require a large dependency tree.

---

# 40 — Code & Design Separation

Visual styling should not become scattered throughout JavaScript.

Prefer:

```text
Design tokens
      ↓
CSS
      ↓
Components
      ↓
Visualization
```

Scientific state should remain separate from visual rendering.

Conceptually:

```text
Biological Model
      ↓
Visualization State
      ↓
Renderer
      ↓
UI
```

---

# 41 — Design Tokens

Maintain shared tokens for:

* typography
* spacing
* borders
* radius
* color
* animation
* layout
* breakpoints

Example:

```css
:root {
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;

  --space-1: ...;
  --space-2: ...;
  --space-3: ...;

  --border-width: ...;
  --radius-sm: ...;

  --motion-fast: ...;
  --motion-normal: ...;
}
```

Exact values may evolve.

The important requirement is that they are centralized.

---

# 42 — Do Not Over-Standardize

Consistency does not mean every visualization must look identical.

DNA replication and blood circulation have different visual requirements.

The goal is:

> **Same design language, different scientific expression.**

A visualization may break the normal layout when the scientific concept genuinely benefits from it.

Document the reason for the deviation.

---

# 43 — Visual Complexity Budget

Every visualization has a complexity budget.

Complexity can come from:

* number of objects
* colors
* labels
* animations
* controls
* panels
* text
* simultaneous states

If one area becomes complex, simplify another.

Do not allow everything to become complex simultaneously.

---

# 44 — Interaction Complexity Budget

Start with the simplest useful interaction.

Do not add:

* unnecessary simulations
* unnecessary sliders
* unnecessary modes
* unnecessary controls
* unnecessary quizzes

The user should never wonder:

> "What am I supposed to click?"

---

# 45 — The "One Screen" Test

When possible, the primary scientific concept should be understandable without scrolling.

The user should be able to:

1. identify the concept
2. see the mechanism
3. interact with it
4. understand the current state

within one primary viewport.

Additional depth may exist below.

---

# 46 — The "No Decoration" Test

Before shipping, temporarily remove:

* gradients
* shadows
* decorative particles
* icons
* illustrations
* unnecessary borders

If the visualization becomes worse because information disappeared, those elements were meaningful.

If it still works, consider leaving them out.

---

# 47 — The "Professor Test"

Ask:

> Could a biology professor approve this visualization?

Check:

* mechanism
* terminology
* directionality
* causality
* sequence
* scale
* simplifications

No visual polish compensates for incorrect biology.

---

# 48 — The "Student Test"

Ask:

> Could a student understand this without a lecturer standing beside them?

The visualization should answer:

* What am I looking at?
* What is happening?
* What changed?
* Why did it change?
* What happens next?

---

# 49 — The "Designer Test"

Ask:

> Does this look intentionally designed?

Check:

* hierarchy
* alignment
* spacing
* typography
* contrast
* visual rhythm
* restraint
* consistency

Nothing should feel accidental.

---

# 50 — The "Engineer Test"

Ask:

> Can another engineer extend this without rewriting everything?

Check:

* state management
* rendering separation
* reusable components
* event handling
* animation lifecycle
* responsive behavior
* accessibility
* performance

---

# 51 — The "Future Visualization" Test

Before introducing a pattern, ask:

> Would this pattern make sense in at least three other biology visualizations?

If yes:

Consider making it reusable.

If no:

Keep it local to the visualization.

This prevents premature abstraction while still maintaining consistency.

---

# 52 — New Visualization Checklist

Every new visualization must define:

### Scientific

* What concept is being explained?
* What is the core mechanism?
* What can be simplified?
* What cannot be simplified?

### Interaction

* What can the user inspect?
* What can they manipulate?
* What changes as a result?
* Can they predict something?
* Is simulation actually useful?

### Visual

* What is the primary visual?
* What is the hierarchy?
* What does color encode?
* What does motion encode?
* What needs a label?

### Technical

* Canvas?
* SVG?
* HTML?
* Hybrid?
* Expected object count?
* Animation frequency?
* Accessibility strategy?

---

# 53 — Before Shipping

A visualization is not finished when it technically works.

It is finished when:

* the biology is correct
* the interaction is intuitive
* the hierarchy is obvious
* the visual system feels consistent
* the animation communicates meaning
* the typography is consistent
* mobile works
* keyboard interaction works
* reduced motion works
* there are no unnecessary UI elements
* performance is smooth
* there are no console errors

---

# 54 — What We Optimize For

In order:

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

A beautiful visualization that teaches the wrong mechanism is a failure.

A technically perfect visualization that nobody can understand is also a failure.

---

# 55 — Final Design Principle

The ultimate goal is not:

> "Make biology interactive."

It is:

> **Make biological mechanisms visible.**

The best visualization should make the user think:

> "Oh. That's why it works that way."

If the interface disappears and the biological idea becomes clearer, the design is working.

If the interface becomes the thing the user notices, simplify it.

---

# 56 — Design Integrity Rule

Future contributors, AI agents, and engineers must read this document before creating or modifying a visualization.

When a new implementation conflicts with this document:

1. Identify the conflict.
2. Determine whether the scientific concept genuinely requires an exception.
3. If yes, document the exception.
4. If no, follow the design system.

Do not allow local convenience to gradually redefine the product.

**The system should evolve intentionally, not accidentally.**

---

# 57 — North Star

> **Minimal interface.
> Maximum clarity.
> Scientific accuracy.
> Meaningful interaction.
> Beautiful information.**


# 58 — Visual QA Scorecard

Every visualization must pass a visual QA review before being considered production-ready.

The purpose of this scorecard is not to reward visual decoration.

It measures whether the visualization successfully combines:

> **Scientific accuracy + comprehension + visual hierarchy + interaction quality + design integrity**

Score every category from **1–5**.

---

## Scoring

| Score | Meaning                          |
| ----- | -------------------------------- |
| **1** | Broken / unacceptable            |
| **2** | Weak / significant problems      |
| **3** | Functional / acceptable          |
| **4** | Strong / polished                |
| **5** | Exceptional / production quality |

### Minimum thresholds

A visualization should achieve:

* **Overall:** ≥ 4.2 / 5
* **Scientific Accuracy:** ≥ 4.5
* **Visual Hierarchy:** ≥ 4.0
* **Interaction Quality:** ≥ 4.0
* **Typography:** ≥ 4.0
* **Accessibility:** ≥ 4.0
* **Performance:** ≥ 4.0

A score below the minimum in any critical category requires revision.

---

# 58.1 — Scientific Accuracy

**Weight: Critical**

### Questions

* Is the biological mechanism correct?
* Are all scientific terms used correctly?
* Are directions and relationships accurate?
* Are cause-and-effect relationships represented correctly?
* Are animations consistent with the actual biological process?
* Are simplifications clearly understood as schematic?
* Could the visualization accidentally teach a misconception?

### Score

**1** — Major scientific errors
**2** — Several inaccuracies
**3** — Generally correct but simplified/rough
**4** — Scientifically strong
**5** — Expert-level accuracy and clarity

### Gate

**Minimum: 4.5**

Any major biological misconception is an automatic failure regardless of visual quality.

---

# 58.2 — First-Glance Clarity

**Weight: High**

Within approximately **3 seconds**, can the user identify:

* what concept they are looking at?
* what the primary visualization represents?
* where the main interaction is?
* what is currently happening?

### Score

**1** — Confusing
**2** — Requires reading
**3** — Understandable
**4** — Immediately clear
**5** — Instantly legible

---

# 58.3 — Visual Hierarchy

**Weight: High**

Evaluate:

* title hierarchy
* visualization dominance
* control hierarchy
* information grouping
* whitespace
* visual focus
* contrast

Ask:

> Does my eye naturally move toward the most important information?

### Score

**1** — Everything competes
**2** — Weak hierarchy
**3** — Functional hierarchy
**4** — Strong hierarchy
**5** — Exceptional visual direction

### Failure indicators

* controls visually overpower the visualization
* excessive cards
* excessive headings
* everything has equal visual weight
* important scientific information looks secondary

---

# 58.4 — Information Density

**Weight: High**

Evaluate whether the visualization is:

> **Information-rich without being information-heavy.**

Check:

* amount of text
* number of labels
* annotation density
* simultaneous visual elements
* cognitive load
* progressive disclosure

### Score

**1** — Overwhelming or empty
**2** — Significant clutter
**3** — Reasonable
**4** — Efficient
**5** — Exceptional information compression

Ask:

> Could I remove anything without losing understanding?

If yes, consider removing it.

---

# 58.5 — Interaction Quality

**Weight: Critical**

Evaluate:

* discoverability
* responsiveness
* feedback
* state transitions
* predictability
* interaction purpose
* touch interaction
* keyboard interaction

Every major interaction should produce an understandable consequence.

### Score

**1** — Broken/confusing
**2** — Functional but awkward
**3** — Usable
**4** — Intuitive
**5** — Feels inevitable and deeply connected to the concept

### Critical question

> Does interacting with the visualization actually improve understanding?

If the answer is no, remove or redesign the interaction.

---

# 58.6 — Scientific Causality

**Weight: Critical**

This is separate from basic scientific correctness.

Ask:

> Does the visualization visually communicate **why** something happens?

For example:

Bad:

```text
Temperature ↑
       ↓
Activity ↑
```

Better:

```text
Temperature ↑
       ↓
Molecular collisions ↑
       ↓
Reaction rate ↑
       ↓
Visible enzyme activity ↑
```

The visualization should expose relationships whenever possible.

### Score

**1** — No meaningful causality
**2** — Mostly decorative interaction
**3** — Some causal relationships
**4** — Strong causal representation
**5** — The mechanism becomes obvious through interaction

---

# 58.7 — Typography

**Weight: Medium**

Check:

* Space Grotesk usage
* IBM Plex Mono usage
* hierarchy
* size
* line height
* letter spacing
* consistency
* readability

### Score

**1** — Poor typography
**2** — Inconsistent
**3** — Acceptable
**4** — Strong
**5** — Highly intentional

### Rules

Do not introduce additional fonts without a strong reason.

Typography should communicate hierarchy, not decoration.

---

# 58.8 — Color & Visual Encoding

**Weight: High**

Evaluate:

* semantic color use
* consistency
* contrast
* accessibility
* scientific meaning
* non-color redundancy

Ask:

> If I removed most of the colors, would the visualization still make sense?

### Score

**1** — Random/confusing
**2** — Over-colored
**3** — Functional
**4** — Strong semantic encoding
**5** — Elegant and highly informative

---

# 58.9 — Motion Quality

**Weight: Medium**

Check:

* Is motion meaningful?
* Does it communicate biological process?
* Is timing understandable?
* Are transitions restrained?
* Is there unnecessary animation?
* Does reduced-motion mode work?

### Score

**1** — Distracting/broken
**2** — Excessive
**3** — Functional
**4** — Purposeful
**5** — Motion itself teaches the concept

### Rule

> **No animation without meaning.**

---

# 58.10 — Interaction Feedback

**Weight: Medium**

When the user:

* hovers
* clicks
* drags
* changes a parameter
* selects an object
* advances a step

the system should clearly communicate the resulting state.

Check for:

* visual highlighting
* state changes
* numerical changes
* explanatory updates
* directional feedback

### Score

**1** — No feedback
**2** — Ambiguous
**3** — Adequate
**4** — Clear
**5** — Immediate and informative

---

# 58.11 — Layout & Spacing

**Weight: Medium**

Check:

* alignment
* margins
* padding
* whitespace
* rhythm
* component spacing
* viewport composition

Look for:

* cramped areas
* unexplained gaps
* inconsistent margins
* accidental alignment
* unnecessary containers

### Score

**1** — Broken
**2** — Uneven
**3** — Acceptable
**4** — Polished
**5** — Exceptional spatial composition

---

# 58.12 — UI Restraint

**Weight: High**

Count unnecessary:

* buttons
* cards
* labels
* icons
* toggles
* panels
* decorative elements

Ask:

> Could this interface be simpler without losing functionality?

### Score

**1** — UI dominates
**2** — Too much interface
**3** — Reasonable
**4** — Restrained
**5** — Almost invisible interface

The highest score is not the UI with the fewest controls.

It is the UI with **exactly the controls required**.

---

# 58.13 — Accessibility

**Weight: Critical**

Check:

* keyboard navigation
* visible focus
* semantic controls
* accessible names
* screen-reader information
* color contrast
* non-color encoding
* touch target sizes
* reduced motion
* Canvas alternative representation

### Score

**1** — Inaccessible
**2** — Major issues
**3** — Basic support
**4** — Strong accessibility
**5** — Accessibility considered throughout the design

### Gate

**Minimum: 4.0**

---

# 58.14 — Responsive Quality

**Weight: High**

Review at minimum:

```text
1440px
1280px
1024px
768px
390px
```

Check:

* hierarchy
* visualization scale
* controls
* labels
* text wrapping
* touch interaction
* horizontal overflow
* clipping
* information prioritization

### Score

**1** — Broken
**2** — Desktop-only
**3** — Functional
**4** — Strong responsive adaptation
**5** — Feels intentionally designed for every viewport

---

# 58.15 — Performance

**Weight: Critical**

Check:

* initial load
* animation smoothness
* interaction latency
* CPU usage
* memory growth
* Canvas redraw efficiency
* DOM size
* unnecessary dependencies

The visualization should feel immediate.

### Score

**1** — Unusable
**2** — Noticeable performance problems
**3** — Acceptable
**4** — Smooth
**5** — Extremely responsive and efficient

### Watch particularly for

* unnecessary re-rendering
* excessive DOM nodes
* expensive event handlers
* unnecessary Canvas redraws
* animation continuing when offscreen
* memory leaks
* unbounded particle creation

---

# 58.16 — Design System Consistency

**Weight: Critical**

Compare the visualization against the existing library.

Check:

* typography
* spacing
* controls
* borders
* color semantics
* labels
* interaction patterns
* animation behavior
* information panels

Ask:

> Could someone tell that this belongs to the same product without seeing the source code?

### Score

**1** — Completely inconsistent
**2** — Weak relationship
**3** — Generally consistent
**4** — Strong consistency
**5** — Feels native to the system

---

# 58.17 — Content Quality

**Weight: High**

Check:

* grammar
* terminology
* concise explanations
* labels
* capitalization
* scientific notation
* units
* punctuation

Avoid:

* unnecessary prose
* repetitive explanations
* vague language
* generic educational filler

### Score

**1** — Poor
**2** — Several issues
**3** — Acceptable
**4** — Strong
**5** — Extremely precise

---

# 58.18 — Interaction-to-Explanation Relationship

**Weight: Critical**

Whenever the user changes something, ask:

> Does the explanatory layer acknowledge the change?

Example:

User increases substrate concentration.

The visualization changes.

The information layer should be capable of reflecting:

```text
SUBSTRATE CONCENTRATION
HIGH

Reaction rate
Increasing

Why?
More substrate molecules are available
for enzyme binding.
```

The explanation should respond to the interaction rather than remain static.

### Score

**1** — Completely disconnected
**2** — Weak connection
**3** — Partial
**4** — Strong
**5** — Seamlessly synchronized

---

# 58.19 — Prediction & Learning Value

**Weight: High**

Where appropriate, evaluate whether the visualization gives the user an opportunity to:

* predict
* test
* observe
* compare
* reason

A visualization should ideally produce moments of:

> "I expected X, but Y happened — why?"

### Score

**1** — Passive
**2** — Mostly passive
**3** — Some exploration
**4** — Strong learning interaction
**5** — Encourages genuine scientific reasoning

Not every concept requires prediction mode.

Do not add it merely to increase the score.

---

# 58.20 — Visual QA Summary

After scoring, calculate:

```text id="v9bqpg"
Scientific Accuracy       / 5
First-Glance Clarity      / 5
Visual Hierarchy          / 5
Information Density       / 5
Interaction Quality       / 5
Scientific Causality      / 5
Typography                / 5
Color & Encoding          / 5
Motion Quality            / 5
Interaction Feedback      / 5
Layout & Spacing          / 5
UI Restraint              / 5
Accessibility             / 5
Responsive Quality        / 5
Performance               / 5
Design Consistency        / 5
Content Quality           / 5
Interaction/Explanation   / 5
Learning Value            / 5
```

Calculate the average score.

---

# 58.21 — Severity Classification

Not all problems are equal.

### 🔴 P0 — Critical

Must fix before release.

Examples:

* scientifically incorrect mechanism
* broken primary interaction
* inaccessible primary functionality
* severe mobile breakage
* data/state corruption
* major performance failure

### 🟠 P1 — Important

Should fix before production.

Examples:

* weak hierarchy
* confusing interaction
* incorrect labeling
* excessive UI
* inconsistent typography
* significant responsive issues

### 🟡 P2 — Refinement

Fix when practical.

Examples:

* spacing inconsistencies
* minor animation issues
* subtle alignment problems
* secondary copy improvements

### ⚪ P3 — Cosmetic

Optional.

Examples:

* tiny visual imperfections
* minor stylistic refinements
* nonessential polish

---

# 58.22 — AI / Agent Visual QA Protocol

When an AI coding agent implements or modifies a visualization, it must perform a self-review before declaring completion.

The agent should inspect the visualization at:

```text
Desktop
Tablet
Mobile
```

and evaluate:

1. First-glance hierarchy
2. Scientific representation
3. Interaction discoverability
4. Typography
5. Spacing
6. Color
7. Motion
8. Responsive behavior
9. Accessibility
10. Performance
11. Design-system consistency

The agent must not simply report:

> "Looks good."

It should identify at least the most likely weaknesses and correct them where possible.

---

# 58.23 — Final Gate

A visualization is considered **READY** only when:

```text
Overall Score             ≥ 4.2

Scientific Accuracy       ≥ 4.5
Visual Hierarchy          ≥ 4.0
Interaction Quality       ≥ 4.0
Typography                ≥ 4.0
Accessibility             ≥ 4.0
Performance               ≥ 4.0
Design Consistency        ≥ 4.0
```

And:

```text
P0 issues = 0
P1 issues = 0
```

P2/P3 issues may remain if they do not materially affect comprehension or design integrity.

---

# 58.24 — Final Human Test

Before shipping, ask five questions:

### 01

**Can I understand what this is within 3 seconds?**

### 02

**Can I understand what is happening without reading a wall of text?**

### 03

**Does interacting with it teach me something?**

### 04

**Is the biology scientifically trustworthy?**

### 05

**Does it feel like it belongs to the same library as every other visualization?**

If any answer is **no**, the visualization is not finished.

---

# 58.25 — Scorecard Philosophy

The scorecard is not a mechanism for making every visualization perfect.

It exists to prevent **design drift**.

As the library grows, individual contributors will naturally introduce:

* different spacing
* different colors
* different controls
* different typography
* different animation styles
* different information density

The scorecard provides a common quality bar.

The goal is not:

> **Every visualization looks identical.**

The goal is:

> **Every visualization feels intentionally designed by the same system.**

---

## Final Rule

> **Do not ship visualizations that are merely functional.**
>
> **Ship visualizations that are scientifically correct, visually clear, meaningfully interactive, and unmistakably part of the same system.**
