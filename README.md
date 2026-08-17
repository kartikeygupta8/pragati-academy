# Pragati Academy

**Learn with direction.**

A complete education-business platform — marketing site, admissions CRM, counsellor
dashboard, WhatsApp automation engine and student ERP — built as a single, dependency-free
static project.

> **Pragati Academy is a fictional brand.** It was created as a portfolio project by
> **Autopend**. Every student, counsellor, faculty member, rank, testimonial, payment and
> result in this repository is demonstration content. No real person or outcome is
> represented, and nothing on any form is transmitted anywhere.

---

## What is here

| Page | What it demonstrates |
|---|---|
| `index.html` | Marketing site — cinematic hero, scroll typography, program carousel, animated admission flow, results, faculty, student life, testimonials, journal, enquiry modal |
| `programs.html` | All six programs with a live mode filter and a side-by-side comparison table |
| `program.html` | Program detail — overview, curriculum, faculty, schedule, mock tests, doubt solving, mentorship, results, FAQs, with a sticky enquiry rail. Reads `?p=<program-id>` |
| `crm.html` | **Admissions CRM** — ten views, a drag-and-drop pipeline, a sortable/filterable lead table, a sliding lead drawer, plus the counsellor desk |
| `whatsapp.html` | **WhatsApp automation** — a working chat simulator, the five-step follow-up sequence, template library and delivery analytics |
| `portal.html` | **Student ERP** — dashboard, classes, assignments, mock tests, attendance, performance, fees, mentor, messages |
| `v1/` | The original single-file build, preserved and still fully viewable |

Program ids for `program.html?p=…`: `neet-2027`, `jee-2027`, `upsc-foundation`,
`foundation-9-10`, `data-technology`, `career-programs`.

---

## Running it

Everything is static. Open `index.html` directly, or serve the folder so that
`program.html?p=…` and the relative asset paths behave exactly as they would in production:

```bash
python -m http.server 8899
# then open http://localhost:8899
```

There is no build step, no bundler and no npm dependency. Only the webfonts are fetched
from a CDN; without a network the pages fall back to the system stack and stay usable.

---

## Structure

```
assets/
  css/
    base.css      design tokens, reset, type scale, buttons, nav, footer, motion primitives
    site.css      marketing sections — hero, carousel, admission flow, faculty, journal
    app.css       product shell — sidebar, panels, tables, kanban, drawer, portal, WhatsApp
    charts.css    chart marks, tooltip, legends, funnel, calendar
  js/
    data.js       the entire fictional dataset (programs, leads, counsellors, student record)
    ui.js         icon set, generated portraits and avatars, enquiry modal, helpers
    motion.js     the animation engine (see below)
    charts.js     the chart engine (see below)
    site.js       marketing-page renderers
    programs.js   listing filter + comparison table
    program.js    program detail page
    crm.js        admissions CRM
    whatsapp.js   WhatsApp automation
    portal.js     student portal
  media/          drop hero.mp4 here to fill the hero's footage slot
```

### The animation engine — `motion.js`

One `IntersectionObserver` drives every scroll-triggered effect and one `requestAnimationFrame`
loop drives everything pointer-driven, so the page stays cheap no matter how much is moving.

* **Split text** — `data-split="line|word|char"` wraps text into masked units that rise into place
* **Reveal** — `data-rise`, `data-zoom`, `data-clip`, `data-draw`, with `--d` stagger delays
* **Counters** — `data-count` with Indian digit grouping, decimals, prefixes and suffixes
* **Sequences** — `data-seq` lights up timeline steps one after another, optionally looping
* **Custom cursor** — difference-blend ring that grows on interactive elements and can carry a
  label via `data-cursor`; magnetic buttons via `data-magnet`; card tilt via `data-tilt`
* **Marquee** — seamless infinite ticker; **carousel** — drag, wheel, snap and a progress rail
* **Page transitions** — a five-panel curtain wipes out on navigation and back in on arrival
* **Preloader**, scroll progress bar, hide-on-scroll nav, tabs, accordions, toasts

Every effect honours `prefers-reduced-motion`, which collapses transforms and disables loops.

### The chart engine — `charts.js`

Ten hand-built animated SVG chart types — `line`, `area`, `bar`, `hbar`, `donut`, `radial`,
`funnel`, `spark`, `calendar`, `stack` — declared inline:

```html
<figure data-chart='{"type":"line","height":260,"labels":["Jan","Feb"],
                     "series":[{"name":"Enquiries","data":[720,812]}]}'></figure>
```

Lines draw themselves in along their own path length, bars grow from the baseline, donuts
and gauges sweep their arcs, and every chart carries a crosshair or per-mark tooltip.

Colour follows a validated system rather than taste. The categorical palettes were run
through a six-checks validator (lightness band, chroma floor, colour-vision-deficiency
separation, normal-vision floor, contrast against the surface) and both pass every check:

```
light  #3B2AE0  #E8410F  #0E9E6E  #B0801E  #0E86C4  #C13584
dark   #7C6BFF  #E85B32  #16A277  #B08630  #2E93C0  #C4508F
```

Hues are assigned in fixed order and never cycled or re-ranked, sequential ramps stay on a
single hue, status colours are reserved, and text always wears ink tokens rather than the
series colour.

---

## Design

* **Display** — Sora · **Body** — Libre Franklin · **Mono** — IBM Plex Mono
* Ink `#0A0D12` on warm paper `#F7F5F0`, with electric indigo `#241CE0`, vermilion `#FF4D18`
  and mint `#0FB981` carrying the energy
* Modern editorial: oversized type, hairline rules, generous negative space, dark product
  chrome against light workspaces

### Responsive

The CRM pipeline becomes vertical stages on mobile, the app sidebars slide over the content,
the admission flow rotates to a vertical timeline, and a sticky **Enquire Now** bar appears
on the marketing pages once you scroll past the hero.

### The hero footage slot

The hero is built around a `<video>` element pointing at `assets/media/hero.mp4`. Drop real
footage there and it plays behind the type; with no file present the layered animated colour
field, editorial grid and film grain carry the frame on their own.

---

## Accessibility

Semantic landmarks and heading order, visible focus rings, `aria` state on menus, tabs and
accordions, keyboard-dismissible modal and drawer, status conveyed by label as well as
colour, and full `prefers-reduced-motion` support.

---

© 2026 Pragati Academy — a fictional portfolio project built by Autopend.
