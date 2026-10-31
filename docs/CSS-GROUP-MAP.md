# CSS group map — the nine sheets, the media-query ruling, `script.js` numbering

**Card:** t_e1288b1c (architect, consultation)
**Date:** 2026-09-23
**Status (2026-10-06): IN FORCE.** The founder decided all four of its open questions on
2026-09-23 (`docs/DECISIONS.md`, "CSS GROUP MAP — `sheet/NN` addressing…"), and the nine sheets
were cut by its §3 (`docs/DECISIONS.md`, "CSS split — the single `style.css` is now nine sheets
in `css/`", 2026-09-24, t_22a5a120; `docs/ARCHITECTURE.md`, the group map paragraph). Every
`sheet/NN` address in the code and in `docs/HISTORY.md` follows it.
**Status (original status):** PROPOSAL. Nothing in `style.css`, `script.js`, `index.html` or any page was edited.
**Builds on:** `docs/CSS-JS-SPLIT.md` §3.3–3.5 (founder-approved 2026-09-23). The nine
sheets and their ownership are **not** reopened here.

---

## 0. HOW TO READ THIS DOCUMENT

§1 is the headline: a defect that is live in `style.css` right now, and a second defect that
the approved split would have introduced. Both were found by building the split for real and
diffing the rendered pages, not by reading. If you read nothing else, read §1.

§2–§7 are the deliverables the card asked for: the numbering scheme, the group map, the
media-query ruling, the reading-guide skeleton, the `script.js` numbering, the history
mechanism. Every structural choice names its alternatives and says why it lost — the
argued-choice rule, applied to my own work.

§8 is what I would change in the approved split spec, stated openly rather than silently.

§9–§10 are the evidence: the cascade re-check the card required, and the log of what I
measured, with what, and how to re-run it.

**A word on what this document is.** The card asked for a grouping scheme. Producing one is
easy; producing one that is *known* not to break the site is not. So I built the nine sheets,
loaded all four pages both ways, and compared every computed CSS property on every element at
seven viewport widths. That is where both defects came from. The map in §3 is the map that
survived that test.

---

## 1. TWO DEFECTS, BOTH FOUND BY MEASUREMENT

### 1.1 ⚠ LIVE DEFECT — a comment closes early and deletes two CSS declarations

**This is happening on the site today. It is not caused by the split, and it is the most
important thing in this document.**

At `style.css` line 402, inside the long comment in the `html` rule, there is this prose:

```
   residual a*/b* vector points into the VIOLET quadrant. Measured
```

**`a*/b*` contains `*/`.** CSS comments do not nest and cannot be escaped: `/*` ends at the
**first** `*/` the parser meets. So the comment that opened at line 379 ends in the middle of
that sentence, and everything after it — 19 lines of measurement notes about violet and
crimson — is handed to the CSS parser as if it were code.

The browser discards the wreckage and resynchronises at the next `;`. The cost is the two
declarations that were sitting in the debris:

| declared in source | line | present in the browser? |
|---|---|---|
| `scroll-behavior: smooth` | 421 | **NO — dropped** |
| `scroll-padding-top` (already commented out) | — | n/a |
| `--nav-h: 128px` | 438 | yes |
| `--frame-void: max(140px, 15svh)` | 479 | yes |
| `scroll-snap-type: y proximity` | 519 | **parsed as `y`, `proximity` lost** |

Verified in Chrome against the live file over HTTP:

```
html { --nav-h: 128px; --frame-void: max(140px, 15svh); scroll-snap-type: y; }
getComputedStyle(document.documentElement).scrollBehavior  ->  "auto"    (source says "smooth")
getComputedStyle(document.documentElement).scrollSnapType  ->  "y"       (source says "y proximity")
```

**What this means in the page.** Every anchor jump — the five nav stars, every skip link, every
in-page link — lands instantly instead of scrolling smoothly. And `scroll-snap-type: y` without
a strictness keyword falls back to **`mandatory`**, not `proximity`. The comment at line 500
argues at length, correctly, that mandatory snap must never be used here because it can trap a
visitor in a section taller than the viewport:

> *"mandatory snap combined with any section taller than the current viewport … makes the
> overflow UNREACHABLE … That would strand a visitor mid-section with the footer and the Room
> Zero inscription permanently below the fold."*

**That is the behaviour the site currently ships.** The decision was made correctly, written
down carefully, and then silently undone by a typo three hundred lines above it.

**Why nobody caught it.** There is no error. No console warning, no red text, nothing in the
network tab. The declarations simply are not there. It is the exact failure mode the split
spec §3.5 warns about — "silent, and nobody testing on a laptop would see it" — except it is
already in the file, and it has nothing to do with splitting.

**The fix is one character.** Break the token so it cannot close the comment:

```
   residual a* / b* vector points into the VIOLET quadrant. Measured
```

**This is not my card to fix** — the card says no live file is edited, and I am keeping to
that. **It should be its own small card, and it should go before the rewrite**, because the
rewrite will move this comment and the bug will move with it.

**What I recommend beyond the one-character fix:** a guard, because this will happen again. The
whole point of the rewrite is more prose in the code, and prose about colour measurement is
exactly where `*/` shows up. Two lines in a pre-commit check:

```bash
# every /* must be matched by exactly one */ per comment; a stray */ inside prose
# silently ends the comment early and turns the rest into CSS
python3 scripts/check-comment-integrity.py css/*.css script.js
```

The check is simple: parse the file the way the browser does, then assert that every non-comment
span is either whitespace or parses as valid CSS. I have a working version of this
(`comment_escape.py`, §10) that found this instance. **I would make it a Must in the rewrite
cards** — the rewrite multiplies the prose, so it multiplies this risk.

**One more consequence, for the writer's card.** The comment template (`COMMENT-TEMPLATE.md`)
asks for more prose in the code, including measurement values. `a*`, `b*`, `L*` and `C*` are
standard colourimetry notation and they will recur. **The comment convention should say: never
write `*/` adjacently, and prefer `a\* / b\*` spaced.** That is a prose rule, so it belongs to
the writer; I am flagging it, not writing it.

### 1.2 ⚠ THE SPLIT AS APPROVED WOULD BREAK THREE PAGES

§3.3's GROUP→sheet table is right about ownership as *documented*. But three GROUP banners
contain rules whose selectors are **live on a page that would not load that sheet**. I found
these by building the nine sheets and diffing rendered output, then confirmed each against the
real DOM.

| GROUP | filed as | rules that break | on which page | what the visitor sees |
|---|---|---|---|---|
| **6a** | `home.css` | **16** | **gallery** | the entire Room Zero threshold header loses its styling |
| **3** | `home.css` | **4** | **shop** | the shop hero loses its type, spacing and centring |
| **4** | `summoning.css` | **1** | **home** | both homepage `.section-eyebrow` labels lose their type |

**GROUP 6a is the serious one.** Its banner says `HOMEPAGE: SEPULCHRE`, and that is true of
half of it. The other half styles the gallery's threshold header, because the two are one
designed object sharing a selector list:

```css
.sepulchre, .threshold            { … }   /* homepage AND gallery */
.sepulchre-inner, .threshold-inner { … }
.sepulchre-kicker, .threshold-kicker { … }
.sepulchre-inscription, .threshold-inscription { … }
.sepulchre-seal, .threshold-seal  { … }
.threshold-hud    { … }   /* gallery only, but filed under a HOMEPAGE banner */
.threshold-divider { … }
```

This is not sloppiness. `docs/GRIMOIRE.md` VI and the GROUP 6a header both record it
deliberately — *"the same door, seen from above, before descending"* versus *"seen from below,
having descended."* **One object, two views, one rule set.** The banner names one page because
a banner has one line; the rules serve two.

Measured, at three viewport widths, with the naive split applied:

| page | elements rendering differently |
|---|---|
| gallery | **14** (the whole threshold header) |
| home | 11 desktop / 20 at 640px / 19 at 500px |
| shop | **6** |
| summoning | 0 |

Screenshot evidence is in the workspace (`shot_naive_gallery.png`): the gallery header
collapses from a centred, monospaced, scanline-glitched inscription to left-aligned browser
default serif. It is not subtle, but **it would only appear on the gallery page**, which is not
the page anyone would open first after a CSS refactor.

**The fix, and why it is this one.** Those rules go to `chrome.css` — the sheet every page
already loads — not to a new `shared-components.css`.

- **Alternative A: a tenth sheet, `shared.css`.** Rejected. It reopens §3.3, which the founder
  has approved and the card tells me not to reopen. It also adds a file whose name says nothing
  about what is in it.
- **Alternative B: duplicate the rules into both surface sheets.** Rejected outright. Two copies
  of one rule is the defect this whole refactor exists to remove; they will diverge.
- **Alternative C (chosen): `chrome.css`.** It already means "the frame every page wears" — nav
  and footer. The threshold/sepulchre inscription, the hero type scale and the section eyebrow
  are the same kind of thing: cross-page furniture. No new file, no duplication, no change to
  the §3.3 sheet list.

34 top-level constructs move this way (including the two `@keyframes` the shared rules drive).
`home.css` drops from 118 constructs to 86; `chrome.css` rises from 32 to 66.

**Verified:** with this fix, all four pages render **identically** to today's single sheet, on
every recorded property, at all seven tested viewports. See §9.

---

## 2. THE NUMBERING SCHEME

**Ruling: numbers restart per sheet, and every group is addressed `sheet/NN`.**

`tokens/01`, `chrome/03`, `home/07`, `responsive/02`. In the file, the banner reads
`GROUP 07 — …`; when one sheet refers to another, it writes the full `home/07`.

**The alternatives, and why they lost:**

- **One global 1..N sequence across all nine sheets** (`tokens` 1–4, `background` 5–9,
  `chrome` 10–15 …). *For:* a single reading order for the whole manual; a group number alone
  tells you where you are. *Against, and decisive:* **inserting a group in sheet 2 renumbers
  every group in sheets 3–9.** That is exactly how today's file became scrambled — GROUP 23 at
  line 24, GROUP 1 at line 131, GROUP 2 at line 2057, and a `12b` wedged in because `13` was
  taken. A scheme whose cost of insertion is "renumber 40 banners across 8 files" will be
  violated the first time it is inconvenient, and then the numbers lie.
- **Keep today's numbers** (GROUP 6a stays GROUP 6a). *For:* the 341 card IDs and dozens of
  cross-references in the existing comments keep resolving; zero translation cost. *Against:*
  the founder's complaint is precisely that these numbers no longer mean anything —
  letter-suffixed (`1a`, `3c`, `11b`, `12b`), out of order, with four numbers (`8`, `9`, `4a`,
  `12b`) that have no rules at all. Preserving them preserves the problem. §3's mapping table
  is the translation, and it is a one-time cost.
- **No numbers, names only** (`GROUP — THE BEACON`). *For:* never goes stale, never needs
  renumbering. *Against:* you lose ordering as a visible property. "Is the beacon before or
  after the skymap?" stops having an answer you can see, and the founder's word for what she
  wants is *"cascading"* — order is the point.

**Why per-sheet wins.** Inserting a group costs renumbering *inside one file*, and the diff
stays in that file. Nine short sequences are each short enough to hold in your head — the
longest is `home` with 9. And `sheet/NN` is unambiguous in a cross-reference, which a bare
number never is once there are nine files.

**Two rules that come with it:**

1. **Two digits, from `01`.** `01`…`09` sort correctly next to `10` in any tool. Today's file
   sorts `1, 11, 11a, 12, 2` in a text editor, which is part of why it reads as chaos.
2. **No letter suffixes, ever.** `3a`/`3b`/`3c`/`11a`/`12b` are what a scheme does when it has
   run out of room. A new group gets the next free integer, or the sequence is renumbered
   within that one file. If a group genuinely subdivides, it becomes a `@sub-group` *inside*
   one numbered group (digital-odyssey's `@sub-module` idiom), never a sibling with a letter.

---

## 3. THE GROUP MAP

### 3.1 The nine sheets, in load order

Unchanged from §3.3 except for the 34 shared constructs moved into `chrome.css` (§1.2). Counts
are **top-level constructs** (a style rule, an `@media` block, an `@supports` block or an
`@keyframes` block) and **declaration blocks** (the 395 figure from the split spec).

| # | sheet | groups | constructs | decl. blocks | loaded by |
|---|---|---|---|---|---|
| 1 | `tokens.css` | 01–03 | 7 | 7 | every page |
| 2 | `background.css` | 01–03 | 18 | 21 | every page |
| 3 | `chrome.css` | 01–06 | 66 | 80 | every page |
| 4 | `home.css` | 01–07 | 86 | 91 | portal only |
| 5 | `gallery.css` | 01–04 | 31 | 31 | gallery only |
| 6 | `shop.css` | 01–05 | 67 | 73 | shops only |
| 7 | `summoning.css` | 01–02 | 29 | 29 | summoning only |
| 8 | `responsive.css` | 01–07 | 7 | 42 | every page, second-to-last |
| 9 | `motion.css` | 01 | 13 | 21 | every page, **last** |
| | **total** | | **324** | **395** | |

> These are counted from the **generated sheets**, not estimated — `sheet_counts.py` parses
> each built file the way the browser does. `chrome.css` gains 48 declaration blocks and
> `home.css` loses 46 relative to the approved §3.3 table, which is the §1.2 fix.

**395 reconciles exactly** against the split spec, and against the browser's own parsed rule
count (Chrome reports 324 top-level rules and 395 declaration blocks for today's file — see §10).

### 3.2 The ordered groups inside each sheet

General-to-specific within each sheet, which is the rule texxturalia already uses.

#### `tokens.css` — the vocabulary every page inherits
| group | scope |
|---|---|
| `tokens/01` | Reset — `*`, box model, margin/padding zeroing |
| `tokens/02` | The palette and the metrics — `:root` custom properties |
| `tokens/03` | Base document — `html`, `a`, `.sr-only`, `.skip-link` |

> `tokens/03` is where the §1.1 defect lives. It must be fixed before this sheet is cut.

#### `background.css` — the world the elements stand on
| group | scope |
|---|---|
| `background/01` | The body gradient — the five-zone descent |
| `background/02` | The continuous background — leak layers, stains, stars |
| `background/03` | The distressed surface — grain, dust, tooth, plate |

> Carries the six `url('assets/leak-wall/…')` references. Split spec §5.1 is the
> only dangerous move in the migration; it is unchanged by this document.

#### `chrome.css` — the furniture every page wears
| group | scope |
|---|---|
| `chrome/01` | Section and header stacking — `section, header`, `.sky-region` |
| `chrome/02` | The nav — logo, the five stars, labels, the words-hidden state |
| `chrome/03` | The shared hero type — `header.hero`, `.hero-tag`, `h1.title`, `.hero-sub` |
| `chrome/04` | The shared section eyebrow — `.section-eyebrow` |
| `chrome/05` | The threshold inscription — the shared `.sepulchre`/`.threshold` object |
| `chrome/06` | The footer |

> `chrome/03`, `/04`, `/05` are the §1.2 fix. Each needs the explanation comment in §3.4.

#### `home.css` — the portal
| group | scope |
|---|---|
| `home/01` | Hero interior — `.hero-inner`, `.wingmark` |
| `home/02` | The sky-seal inscription — "ABYSSUS SUPERIOR" |
| `home/03` | The beacon |
| `home/04` | The skymap — clusters, stars, labels, filters |
| `home/05` | The roster |
| `home/06` | The specimens: the magic-lantern box |
| `home/07` | The sepulchre — the homepage-only half of the glitching tape |

#### `gallery.css` — the archive
| group | scope |
|---|---|
| `gallery/01` | Gallery body gradient — `body.gallery-page` |
| `gallery/02` | The photo grid — cells, hover veil, index badge |
| `gallery/03` | The lightbox — viewer, HUD, caption, close/prev/next |
| `gallery/04` | The Room Zero footer |

#### `shop.css` — the shops
| group | scope |
|---|---|
| `shop/01` | The séance stage — hold-to-reveal, the canonical pattern |
| `shop/02` | Product grid and cards |
| `shop/03` | The skin switcher (demo-only) |
| `shop/04` | The dossier skin |
| `shop/05` | The transmission skin |

#### `summoning.css` — the doctrine page
| group | scope |
|---|---|
| `summoning/01` | The standalone hero |
| `summoning/02` | The wheel — orbit stage, rings, movements |

#### `responsive.css` — every viewport adaptation
| group | scope |
|---|---|
| `responsive/01` | Desktop-up — `min-width: 1150px`, `min-width: 1440px` |
| `responsive/02` | ≤1149px — doctrine knockout |
| `responsive/03` | ≤900px — nav, skymap, sepulchre, sky-seal, beacon, roster, specimens |
| `responsive/04` | ≤800px — lightbox |
| `responsive/05` | ≤780px — orbit stage, doctrine movement |
| `responsive/06` | ≤700px / ≤640px — shop grid, roster card, specimen row |
| `responsive/07` | ≤600px / ≤500px — grid, threshold, nav wrap, lightbox close, sky-seal |

#### `motion.css` — the accessibility guards
| group | scope |
|---|---|
| `motion/01` | `prefers-reduced-motion: reduce` — every guard, site-wide |

### 3.3 Every existing GROUP banner, mapped

All 34 banners. **Nothing is orphaned**; the four empty banners are called out explicitly.

| old | old title | → sheet | → group | decl. blocks |
|---|---|---|---|---|
| 0 | SHARED: RESET, CUSTOM PROPERTIES & BASE TYPE | `tokens` | 01+02+03 | 7 |
| 1 | HOMEPAGE: DECORATIVE BACKGROUND & BODY GRADIENT | `background` | 01 | 2 |
| 1a | HOMEPAGE: THE CONTINUOUS BACKGROUND | `background` | 02 | 13 |
| 21 | SITE-WIDE: THE DISTRESSED SURFACE | `background` | 03 | 6 |
| 2 | HOMEPAGE: NAV DISSOLVED INTO THE SKY | `chrome` | 01+02 | 28 |
| 3 | HOMEPAGE: HERO *(split)* | `chrome` 03 **+** `home` 01 | — | 8 |
| 4 | THE SUMMONING PAGE: DOCTRINE, THE WHEEL *(split)* | `chrome` 04 **+** `summoning` 02 | — | 27 |
| 6a | HOMEPAGE: SEPULCHRE *(split)* | `chrome` 05 **+** `home` 07 | — | 41 |
| 7 | HOMEPAGE: FOOTER | `chrome` | 06 | 4 |
| 3a | HOMEPAGE: SKY-SEAL INSCRIPTION | `home` | 02 | 5 |
| 3b | HOMEPAGE: THE BEACON | `home` | 03 | 13 |
| 3c | HOMEPAGE: SKYMAP | `home` | 04 | 20 |
| **4a** | **HOMEPAGE: DOCTRINE, PLAIN-SET** | — | **RETIRED** | **0** |
| 5 | HOMEPAGE: ROSTER | `home` | 05 | 18 |
| 6 | HOMEPAGE: SPECIMENS | `home` | 06 | 32 |
| **8** | **GALLERY: THRESHOLD HEADER** | — | **RETIRED** | **0** |
| **9** | **GALLERY: THRESHOLD DIVIDER** | — | **RETIRED** | **0** |
| 10 | GALLERY: PHOTO GRID | `gallery` | 02 | 9 |
| 11 | GALLERY: BODY GRADIENT & LIGHTBOX | `gallery` | 01+03 | 6 |
| 11a | GALLERY: LIGHTBOX HUD CORNER LABEL | `gallery` | 03 | 11 |
| 11b | GALLERY: ROOM ZERO FOOTER | `gallery` | 04 | 5 |
| 15 | SHOP: THE SÉANCE STAGE | `shop` | 01+02 | 30 |
| 18 | SHOP: DEMO-ONLY SKIN SWITCHER | `shop` | 03 | 6 |
| 19 | SHOP: THE DOSSIER SKIN | `shop` | 04 | 15 |
| 20 | SHOP: THE TRANSMISSION SKIN | `shop` | 05 | 22 |
| 22 | THE SUMMONING PAGE: STANDALONE HERO | `summoning` | 01 | 4 |
| 11c | HOMEPAGE: DESKTOP-UP HERO WIDTH | `responsive` | 01 | 1 |
| 12 | HOMEPAGE MOBILE ADAPTATION | `responsive` | 03+05 | 21 |
| **12b** | **901–1150px GAP: SKYMAP OVERFLOW** | — | **RETIRED** | **0** |
| 13 | GALLERY MOBILE: GRID & THRESHOLD | `responsive` | 07 | 3 |
| 14 | GALLERY MOBILE: LIGHTBOX | `responsive` | 04 | 1 |
| 16 | SHOP MOBILE: PRODUCT GRID | `responsive` | 06 | 2 |
| 17 | SITE-WIDE MOBILE CALIBRATION | `responsive` | 07 | 14 |
| 23 | SITE-WIDE: REDUCED-MOTION GUARDS | `motion` | 01 | 21 |

Plus the six co-located viewport `@media` blocks inside GROUPs 4, 5, 6 and 6a, which move to
`responsive.css` under the §4 ruling.

**Reconciliation:** 7+2+13+6+28+8+27+41+4+5+13+20+0+18+32+0+0+9+6+11+5+30+6+15+22+4+1+21+0+3+1+2+14+21 = **395**. ✓

**The four empty banners.** GROUPs 4a, 8, 9 and 12b have **no declaration blocks at all** —
they are headers whose rules were deleted or moved, left behind as history. GROUP 9 says so
itself: *"`.threshold-divider`'s actual rule now lives in GROUP 6a."*

**Ruling: they are retired from the code and their content moves to the history file (§7).**
A banner with no rules under it is the purest form of the founder's complaint — you follow the
map to a section and there is nothing there. Their *reasoning* is worth keeping (GROUP 9
explains why a divider exists at all; GROUP 8 explains the "gnostic, not gothic" brief), which
is exactly what the history file is for.

- *Alternative considered:* keep them as empty banners with a "moved to X" pointer. Rejected —
  four dead numbers in a nine-file manual is four chances to think you have lost a rule.

---

## 4. WHERE MEDIA QUERIES AND KEYFRAMES LIVE

### 4.1 Media queries — **Ruling: option (a), separate `responsive.css`, loaded second-to-last, no exceptions**

The card asked me to compare three options and rule. I did, and I tested two of them.

**(a) Separate `responsive.css`, loaded second-to-last.**
*Cascade safety:* one rule, identical on every page, already documented in `ARCHITECTURE.md`.
Verified render-identical at all seven viewports.
*Beginner-legible:* "what happens on a phone" is one file, top to bottom, widest to narrowest.
*Findability:* one `grep` in one file.
*Cost:* the gallery downloads the homepage's mobile rules — 1.1 KB gzipped.

**(b) Each sheet ends with its own responsive group.**
*Cascade safety:* **this is where it fails.** GROUP 17 contains mobile overrides for selectors
owned by three different sheets — `.beacon-label` (home), `.lightbox-close` (gallery),
`.logo`/`.nav-star--1…5` (chrome). It cannot be filed under any one of them. Fold it into
`chrome.css` and, because `chrome.css` loads *before* `home.css`, the mobile override of
`.beacon-label` loads before the desktop rule it exists to override — and loses. **Phone-only,
silent, invisible on a laptop.**
*Findability:* worse — "what happens to the nav on a phone" becomes a search across nine files.
*The one thing in its favour:* a component's mobile rules sit next to the component. That is a
real benefit and it is why I tested it rather than dismissing it.
**Rejected on cascade safety.** The failure mode is invisible and the class of bug is
unbounded.

**(c) Media queries nested next to the rule they modify (native CSS nesting).**
*Cascade safety:* actually fine — nesting preserves source position.
*Beginner-legible:* **this is where it fails, and it is the reason for the ruling.** Native
nesting is a genuinely new syntax. The founder's own digital-odyssey manifesto argues for
vanilla CSS on the grounds that *"the lines you inspect in this log are EXACTLY the raw matter
the browser executes"* — nesting is the one modern feature that makes a selector's real meaning
non-local. And it spends an innovation token on the part of the system that differentiates
nothing.
*Findability:* worst of the three — "what happens on a phone" has no single answer or location.
*Also:* it would rewrite every rule in the file, not just move blocks. The migration risk is
out of all proportion to the benefit.
**Rejected.**

**The ruling, and one place where it tightens the approved plan.** Option (a), applied
**without exception** — which today's file does not do. Six viewport `@media` blocks currently
sit co-located inside component groups:

| group | query | rules |
|---|---|---|
| 4 | `min-width: 1150px` / `max-width: 1149px` | 2 |
| 5 | `max-width: 640px` | 2 |
| 6 | `max-width: 640px` / `max-width: 900px` | 3 |
| 6a | `max-height: 948px), (max-width: 900px)` | 1 |

Leaving them where they are means the rule "every viewport query is in `responsive.css`" is
false the day it is written, and a rule with exceptions is not a rule anyone can rely on. I
built this variant and tested it: **moving all six is render-identical at all seven viewports.**

**Capability queries are a different thing and stay co-located.** `@media (hover: hover)`,
`@media (hover: none)` and `@supports` do not ask about viewport width; they ask what the
device can do. They are not part of the desktop→mobile cascade and moving them into
`responsive.css` would put unrelated logic in a file named for something else. Three such
blocks stay in `chrome/02`, one `@supports` stays in `background/02`.

**Within `responsive.css`, wider before narrower.** Today's file has one inversion: GROUP 12's
`max-width: 780px` sits before GROUP 14's `max-width: 800px`. It is harmless today (the two
groups share no selector), but it is harmless *by luck*, and the ordering rule exists precisely
so that nobody has to check.

**The explanation comment for `responsive.css`** (structure; the writer sets the voice):

```css
/* ============================================================
   responsive.css — EVERY VIEWPORT ADAPTATION ON THE SITE
   Loaded SECOND-TO-LAST on every page. Only motion.css comes after.

   WHY THIS IS ITS OWN FILE, AND NOT SPREAD ACROSS THE SHEETS.
   An @media query adds NO specificity. A mobile rule beats its
   desktop rule for exactly one reason: it comes later in source
   order. Source order, once we split into files, IS <link> order.

   We considered ending each sheet with its own responsive group —
   it keeps a component's mobile rules next to the component. It
   does not work here. responsive/07 overrides selectors owned by
   three different sheets (.beacon-label from home.css,
   .lightbox-close from gallery.css, .logo from chrome.css), so it
   cannot live in any one of them. Put it in chrome.css — which
   loads before home.css — and the mobile .beacon-label rule loads
   BEFORE the desktop rule it is meant to override, and loses.
   The homepage's phone layout breaks, on phones only, silently.

   We also considered nesting each query next to its rule. Native
   nesting works, but it makes a selector's real meaning non-local
   — you can no longer read one line and know what it matches —
   and this file is meant to be read by someone learning CSS.

   So: one file, one position, no exceptions. The cost is that the
   gallery downloads the homepage's mobile rules it never uses:
   1.1 KB gzipped. That is the whole price.

   ORDER INSIDE THIS FILE: min-width (desktop-up) first, then
   max-width WIDEST TO NARROWEST. Two queries of equal specificity
   are decided by source order, so a narrower query placed above a
   wider one would let the wider one win at narrow widths.
   ============================================================ */
```

### 4.2 Keyframes — **Ruling: `@keyframes` stay next to the rule that uses them. `motion.css` holds only the reduced-motion guards.**

This looks like an inconsistency with §4.1 and it is not, for one mechanical reason.

**`@media` is cascade-addressed; `@keyframes` is name-addressed.** A media query's effect
depends on where it sits relative to other rules. A keyframes block is looked up *by name*,
from wherever `animation: beaconBlink` is written. **Its position in the file is irrelevant.**
Move it to the top, the bottom, or another sheet entirely — as long as the name is unique and
the sheet is loaded, it resolves identically.

So the cascade-safety argument that decides §4.1 **does not apply here at all**, and the
question is decided on legibility alone: is `beaconBlink` easier to understand next to
`.beacon-ring`, or in a file of eleven unrelated animations? Next to the component, clearly.

**The safety condition, which today's file already meets.** Name-addressing is only safe if
names are unique, because two `@keyframes` with the same name silently resolve to whichever
loaded last. I verified all 11 across the nine sheets:

| keyframes | sheet |
|---|---|
| `starsFadeWithDescent` | `background` |
| `beaconBlink`, `beaconPing`, `skySealStarPulse` | `home` |
| `sepulchreDotDecay`, `sepulchreSignalDecay` | `chrome` (moved with the shared threshold rules) |
| `rippleGo` | `shop` |
| `transmissionScanShift`, `transmissionGrainShift`, `transmissionRecBlink`, `transmissionCrawl` | `shop` |

**Zero duplicates.** Every name is already component-prefixed, which is the existing
convention (documented in today's header) and is what makes co-location safe. **That convention
must be restated in `tokens.css` as a binding rule**, because it is now load-bearing across
files rather than within one.

> Note `sepulchreDotDecay` and `sepulchreSignalDecay` move to `chrome.css`, because the rules
> that reference them are the shared `.sepulchre`/`.threshold` rules from §1.2. They must
> travel with those rules — the gallery needs them too.

**What `motion.css` keeps:** the 21 `prefers-reduced-motion` rules, and nothing else. These
**are** cascade-addressed — each one turns off an animation declared earlier — so they must load
after everything they guard. Last, on every page.

- *Alternative considered:* all `@keyframes` in `motion.css` with the guards, so "all motion is
  one file." *Rejected:* it reads tidy and it separates every animation from the component it
  animates, for zero cascade benefit, because of the name-addressing fact above. Tidiness that
  costs legibility and buys nothing is not tidiness.

---

## 5. THE READING-GUIDE SKELETON

**Structure only.** The teaching prose belongs to the writer's card
(`COMMENT-TEMPLATE.md`), and where the two touch, the writer's voice wins.

### 5.1 The manual header — `tokens.css` only

Every page loads `tokens.css` first, so it carries the map of the whole nine-sheet manual. This
replaces the 80-line header currently at the top of `style.css`.

```css
/* ============================================================
   STRIGOI — THE STYLE MANUAL
   tokens.css — SHEET 1 OF 9. Every page loads this first.

   [writer: the opening — what this manual is, and that the site
    and the founder's learning are both deliverables]

   HOW TO READ THIS MANUAL
   ───────────────────────
   Nine sheets, read in the order the pages load them. Each sheet
   opens with a header saying what it owns and where it sits.
   Inside a sheet, groups are numbered 01, 02, 03… in file order,
   and are addressed from outside as `sheet/NN` (e.g. home/03).

   Inside a group: general to specific — container, then child,
   then state, then pseudo-element.

   THE LOAD ORDER (and why it is exactly this)
   ───────────────────────────────────────────
     1  tokens.css       the vocabulary: reset, palette, metrics
     2  background.css   the world the elements stand on
     3  chrome.css       the furniture every page wears
     4  ONE surface sheet, whichever page you are on:
          home.css | gallery.css | shop.css | summoning.css
     5  responsive.css   every viewport adaptation
     6  motion.css       the reduced-motion guards

   [writer: why this order — general to specific, world before
    elements, per the founder's law that the background must not
    depend on the elements]

   TWO POSITIONS ARE MANDATORY, NOT PREFERENCES
   ────────────────────────────────────────────
   responsive.css is ALWAYS second-to-last. motion.css is ALWAYS
   last. An @media query adds no specificity — it wins only by
   coming later. Any sheet placed after them silently outranks
   every mobile override and every accessibility guard, at every
   width, with no error. See responsive.css's own header.

   THE SURFACE SHEETS NEVER MEET
   ─────────────────────────────
   No page loads two of them, so they cannot conflict and their
   order relative to each other does not matter.

   TWO RULES THIS MANUAL DEPENDS ON
   ────────────────────────────────
   1. @keyframes names are component-prefixed, always
      (beaconBlink, transmissionScanShift). They are looked up by
      NAME from anywhere, so position doesn't matter — but a
      duplicated name silently resolves to whichever loaded last.
      The prefix is what makes that impossible.
   2. Never write */ inside a comment, not even in prose. CSS
      comments cannot nest: the first */ ends the comment and
      everything after it is parsed as CSS. Colour notation is
      the trap — write `a* / b*`, never `a*/b*`.

   WHERE THE HISTORY WENT
   ──────────────────────
   Why a rule is the way it is lives here, in the comment above
   it. What it used to be, what was tried and rejected, which
   round changed it — that lives in docs/CSS-HISTORY.md, indexed
   by the same sheet/NN addresses.
   ============================================================ */
```

### 5.2 The per-sheet header — the other eight

Fixed five-part shape, so the eight headers are visibly the same kind of object.

```css
/* ============================================================
   <name>.css — SHEET <n> OF 9
   OWNS:      <one line: what lives in this file, nothing else>
   LOADED BY: <which pages, and at which position>
   AFTER:     <the sheets that must come before, and why>
   BEFORE:    <the sheets that must come after, and why>
   GROUPS:    01 <scope>
              02 <scope>
              …
   [writer: one paragraph — what this sheet is for, in her voice]
   ============================================================ */
```

Worked example — `chrome.css`, which carries the §1.2 fix and so needs the argument in it:

```css
/* ============================================================
   chrome.css — SHEET 3 OF 9
   OWNS:      the furniture every page wears — nav, footer, and
              the three components that two pages share
   LOADED BY: every page, third
   AFTER:     tokens.css (uses its palette and metrics),
              background.css (chrome sits ON the world)
   BEFORE:    the surface sheet, responsive.css, motion.css
   GROUPS:    01  section/header stacking
              02  the nav — logo, five stars, labels
              03  the shared hero type
              04  the shared section eyebrow
              05  the threshold inscription
              06  the footer

   WHY GROUPS 03-05 ARE HERE AND NOT IN A SURFACE SHEET
   ────────────────────────────────────────────────────
   These three are used by more than one page, so they cannot
   live in a sheet only one page loads.

   03: .hero-tag / h1.title / .hero-sub are the homepage's hero
       AND every shop page's hero.
   04: .section-eyebrow labels sections on the homepage AND on
       the summoning page.
   05: .sepulchre (homepage) and .threshold (gallery) are one
       designed object seen from two sides — the same door, from
       above before descending and from below having descended
       (docs/GRIMOIRE.md VI). They share one rule set.

   We considered a tenth `shared.css`, and duplicating the rules
   into each surface sheet. A tenth file adds a name that says
   nothing about what is in it; duplication guarantees the two
   copies drift apart. chrome.css already means "what every page
   wears," and these three are exactly that.
   ============================================================ */
```

**Where this touches the writer's card.** The writer owns the `WHAT/ROLE HERE/CHOICE/VISION`
shape for each group's own banner. I own the five-part sheet header and the `sheet/NN`
addressing. They nest: the sheet header lists the groups; each group banner then uses the
writer's four-part template. **I see no conflict between the two documents** — the writer's
template is for blocks *inside* a sheet, mine is for the sheet itself.

---

## 6. `script.js` — THE SAME DISCIPLINE, LIGHTER

It stays one file (split spec §4, already ruled). Its current numbering is
`1, 1b, 2, 3, 4, 5, 6 (REMOVED), 6b, 7, 8` — scrambled the same way the CSS is, with a deleted
`6` still holding its number and two `b` suffixes.

**Ruling: number by LIFECYCLE — shared helpers first, then mechanisms in DOM order, then the
initialiser last. Two digits, no letters.**

| new | mechanism | pages | current |
|---|---|---|---|
| — | file header: what this file is, the guard contract | — | lines 1–9 |
| **01** | Shared helpers — `escapeHtml`, `truncate` | all | scattered (202, 215) |
| **02** | Nav fade on descent | homepage | 6b |
| **03** | Roster card flash | homepage | 1 |
| **04** | Specimens stepper | homepage | 1b |
| **05** | Gallery grid render — `manifest.json` fetch, `renderGrid` | gallery | 2 |
| **06** | Lightbox — open/close/nav, HUD glitch | gallery | 3 |
| **07** | The séance — hold-to-reveal | shop | 4 |
| **08** | Skin switcher (demo-only) | shop | 5 |
| **09** | Doctrine wheel — ring draw-on-scroll | summoning | 7 |
| **10** | Initialisation — the `DOMContentLoaded` block | all | 8 |

**Why lifecycle, and not the alternatives:**

- **By page** (all homepage, then gallery, then shop, then summoning). *For:* mirrors the CSS
  surface sheets exactly — same mental model in both languages. *Against:* the two shared
  helpers (`escapeHtml`, `truncate`) belong to no page, and the init block belongs to all of
  them, so the scheme needs two exceptions out of ten entries. **This is the closest runner-up,
  and 02–09 above are in page order anyway** — lifecycle only differs from it at the two ends.
  So we get the page-ordering benefit without the exceptions.
- **By mechanism type** (all listeners, then all renderers, then all animations). *For:*
  groups similar code. *Against:* it scatters each feature across the file. To understand the
  lightbox you would read three separate sections. The founder's complaint about the CSS is
  exactly this — related things far apart.
- **Keep the existing numbers.** *Against:* `6 (REMOVED)` is a number held by nothing, and
  `1b`/`6b` are the same "ran out of room" symptom as the CSS's `3c`/`12b`.

**Why helpers first and init last.** `escapeHtml` is called by `renderGrid` before it is
defined in reading order today; putting helpers at the top means the file is readable strictly
top-to-bottom with no forward references. And the init block is the *answer* to "when does any
of this run" — it makes sense only after you know what is being initialised. It is already
last; the numbering should say so rather than leave it as an accident.

**Two things to preserve, not renumber:**

1. **The guard contract.** All eight `init*()` functions bail out early when their elements are
   absent (split spec §4.2, verified 8 of 8). That is what makes one file safe on every page.
   It belongs in the file header as a stated contract, not rediscovered per function.
2. **The `6 (REMOVED)` comment.** It explains why the collapsible nav no longer exists, and
   that is worth keeping — but as history, not as a numbered slot in a live file. **It moves to
   the history file (§7).** Its number is freed.

**One latent bug to carry forward, not fix here.** `initLightboxControls` guards `#lightbox`
then calls `getElementById("lb-close").addEventListener(…)` without guarding `lb-close`
(split spec §4.5). Safe today because those elements only ever ship together. **Not in scope,
recorded so it is not rediscovered the hard way.**

---

## 7. THE HISTORY APPENDIX — THE MECHANISM

The founder: *"I don't want a full fat diary… you are free to create a new md file where you
can record all the history, there you can move the big comments that have nothing to do in the
code files."*

`DECISIONS.md` already records the governing rule: comments explain **what the code does and
the role it plays**; card IDs, round numbers, instrument readings and rejected candidates are
diary and belong elsewhere.

**The scale of what moves:** `style.css` contains **341 card-ID references** across 78 distinct
cards. `script.js` contains 9 more. None of them help a reader understand what a rule does.

### Ruling, in three parts

**1. One file: `docs/CSS-HISTORY.md`, indexed by `sheet/NN`.**

- *Alternative: one history file per sheet* (`docs/history/home.md` …). *For:* each file stays
  small; the history sits next to what it describes. *Against:* history is full of
  cross-sheet moves — GROUP 4 relocated from homepage to summoning, GROUP 9's rule moved into
  GROUP 6a, GROUP 21 moved out of the responsive section. Those entries would have to be
  written twice or arbitrarily filed in one of the two. One file keeps a move as one entry.
- *Alternative: rely on `git log`.* *For:* zero maintenance, already exists, complete.
  *Against, and decisive:* the rewrite itself will rewrite every one of these lines. After it,
  `git blame` on any comment points at the rewrite commit, not at the decision. **The history
  has to be extracted before the rewrite, or it becomes unreachable in practice.**
- *Alternative: fold into `DECISIONS.md`.* *Against:* `DECISIONS.md` is 5,252 lines and is
  about project decisions. CSS round-by-round measurement history is a different audience and
  a different question, and it would swamp the file.

**2. Code comments point to history ONLY where a reader would otherwise re-derive a dead end.**

Not a pointer on every group — that is the diary coming back in a smaller font. The test is:
**would someone reasonably try this again, and lose time?** A one-line pointer at the end of a
group banner, nothing more:

```css
   /* Why this is 15svh and not 12%, and the five values tried
      before it: docs/CSS-HISTORY.md#background-02 */
```

Expected: perhaps a dozen across nine sheets, not forty.

- *Alternative: a pointer in every group banner, mechanically.* *Against:* uniformity has a
  cost — if every group has one, none of them is a signal, and you stop reading them. Also
  most groups genuinely have no history worth the trip.
- *Alternative: no pointers at all, history discoverable only by opening the file.* *For:*
  cleanest possible code. *Against:* the dead ends are real. GROUP 21's own comment records an
  effect deliberately left out of the texture layer and folded into a token edit instead;
  someone will try to add it back. A pointer there is worth its line.

**3. The reader's path, and the one rule that keeps it working.**

```
   a group in the code            docs/CSS-HISTORY.md
   ───────────────────            ───────────────────
   /* GROUP 02 — …            →   ## background/02 — the continuous background
      … history:                     2026-09-10  t_4429caac  …
      #background-02 */               2026-09-12  t_a4c8e11f  …
```

**The heading in the history file is the group's address, and nothing else.** That is what makes
the link stable. **And it is also the risk:** renumbering a group inside a sheet (§2 allows
this) silently breaks every pointer to it.

**So one rule, and it is a Must for the rewrite cards:** *a group's address, once written into
the history file, is never reused for a different group.* Renumber freely while a sheet is
being drafted; once shipped, a retired number stays retired, and the history file keeps the old
heading with a "renumbered to X" line. The alternative — renaming headings and fixing every
pointer — is the kind of two-place edit that is wrong within a month.

**What goes in, what stays out:**

| goes to `CSS-HISTORY.md` | stays in the code |
|---|---|
| card IDs, round numbers, dates | what the rule does |
| instrument readings, measurement tables | the role it plays on the page |
| rejected candidates and why | the argued choice among live alternatives |
| "was X, changed to Y because Z" | the constraint a value satisfies |
| retired GROUPs 4a, 8, 9, 12b in full | — |
| `script.js`'s `6 (REMOVED)` note | — |

**Note the third row.** The argued-choice rule means live alternatives stay *in the code* — why
this and not that, for the thing that is there now. History is for what the code used to be.
That line is what keeps "argue every choice" from collapsing back into a diary.

---

## 8. WHAT I WOULD CHANGE IN THE APPROVED SPLIT SPEC

Flagged, not changed. `docs/CSS-JS-SPLIT.md` is approved and I have not edited it.

| § | what it says | what I found | recommendation |
|---|---|---|---|
| 3.3 | GROUP 6a → `home.css` | 16 rules are live on the gallery | **split the group**; shared rules to `chrome.css` |
| 3.3 | GROUP 3 → `home.css` | 4 rules are live on the shop page | **split the group**; shared rules to `chrome.css` |
| 3.3 | GROUP 4 → `summoning.css` | `.section-eyebrow` is live on the homepage | **split the group**; shared rule to `chrome.css` |
| 3.3 | `chrome.css` = GROUPs 2, 7; 32 rules | with the above, 80 | update the table |
| 3.3 | `home.css` 137 rules | with the above, 91 | update the table |
| 3.1 | *"34 GROUP banners … the split follows those labels"* | 4 banners have zero rules; 3 span two surfaces | **the labels are a good starting point but not sufficient** — they were written when it was one file, where "which page" was documentation, not load-bearing |
| 3.5 | responsive/motion last | agreed, and it should be **exceptionless** | move the 6 co-located viewport queries too |

**The honest summary of the correction.** §3.1 says *"the split below follows those labels; it
does not invent a new taxonomy"*, and treats the 34 banners as having done the hard part. They
did do most of it. But a banner naming one page was only ever a comment — in a single file
nothing enforced it, so nothing caught it when a group grew to serve two pages. Splitting into
files turns those labels into load instructions. **Three of them are wrong as load
instructions, and that is not visible by reading; it is visible by rendering.**

Everything else in §3.3–3.5 stands, including the ordering rule, which the measurements confirm.

---

## 9. CASCADE-SAFETY RE-CHECK, AS THE CARD REQUIRED

The card requires the split review's finding — *32 flipped pairs, zero collisions* — to still
hold under the new group order, and to be re-checked if the order changed. The order did change
(§4.1 moves six media-query blocks; §1.2 moves 34 constructs), so I re-ran it, and then went
further and tested the rendered result.

**Reconciling the 32.** At GROUP-pair granularity the current order produces **37** flipped
pairs, not 32 — the difference is that `background.css` now takes GROUP 21 (distressed surface)
from a position late in the file to a position third, which flips it against every group that
used to precede it. The earlier figure counted a slightly different sheet assignment. **At
rule-pair granularity there are 6,706 flips.** The number alone means nothing, which is why the
collision test matters.

**Collision test.** For each of the 6,706 flipped pairs, a flip can only change a pixel if the
two rules (1) match **the same element** on some page, (2) declare a **common property**, and
(3) have **equal specificity** — if specificity differs, it already decided the winner and
order is irrelevant.

I did not evaluate that from the selectors. I loaded all four pages in Chrome and recorded
which **exact elements** each of the 358 style rules matched, then intersected those sets.

```
ordered rule pairs that flip:            6,706
  never match the same element:          6,706
COLLISIONS:                                  0
```

**Zero, on element-identity evidence rather than selector guesswork.**

> An earlier pass using "same page" instead of "same element" reported 279 collisions — all
> false positives (e.g. `.logo` and `.distressed-plate` both exist on the homepage and both
> set `pointer-events`, but never on the same element). Recording this because the weaker test
> is the one you would reach for first, and it would have sent the rewrite chasing 279 ghosts.

**Keyframe names:** 11 names, 0 defined in more than one sheet.

**The test that actually decided things.** Collision analysis proves no *ordering* hazard. It
cannot catch a rule filed in a sheet its page never loads — that is not a flip, it is an
absence. So I built the sheets and diffed the rendered pages:

| build | what it is | non-animation differences, 4 pages × 7 viewports |
|---|---|---|
| naive | §3.3's table applied literally | **110 elements render differently** |
| fixed | + §1.2 shared rules to `chrome.css` | **0** |
| strict | + §4.1 six media queries moved | **0** |

Viewports: 1280, 860, 760, 680, 620, 560, 420 px — chosen to sit either side of every
breakpoint in the file (1440, 1150, 900, 800, 780, 700, 640, 600, 500).

**Method note on "non-animation".** A handful of properties differ between any two loads of the
*same* page because animations are sampled at different moments. I measured that noise floor by
diffing variant A against itself, and excluded exactly those property/element pairs. Without
that control the fixed build appears to have 4 differences; all four are `.nav-star-label`
mid-transition, and they vanish when the page is allowed to settle.

**What this does not cover, stated plainly:** computed styles at seven widths with JS run and
fonts loaded. It does not cover print styles (none exist), hover/focus states beyond those in
the initial DOM, or the `url('assets/…')` path rewrite of split spec §5.1, which I side-stepped
by making those paths absolute in the test build. **§5.1's verification steps remain mandatory
and unchanged.**

---

## 10. EVIDENCE LOG

Scripts in the card workspace
(`~/.hermes/kanban/boards/strigoi/workspaces/t_e1288b1c/`). All read-only against the repo; the
A/B harnesses wrote to `_abtest*/` scratch dirs which have been removed (`git status` clean of
them).

| script | what it establishes |
|---|---|
| `extract3.py` | 34 banners, 395 declaration blocks, correct group attribution |
| `comment_escape.py` | **finds the §1.1 live defect** |
| `crosscheck.py` | validates the parser against Chrome's CSSOM: 395 = 395, 0 real mismatches |
| `orphan_report.py` / `classify.py` | **finds the §1.2 orphans**, live-DOM evidence |
| `collide.py` | 6,706 flips, 0 collisions, element-identity method |
| `order_check.py` | 37 group-pair flips; the 780/800px inversion |
| `build_split.py` / `_fixed` / `_strict` | builds the three variants, 324 constructs each |
| `ab_diff.py` / `verdict.py` / `final_verdict.py` | the A/B render diff |
| `strict_verdict.py` / `fixed_verdict.py` | 7-viewport sweep: 0 differences |
| `naive_verdict.py` | the naive split: 110 elements differ |
| `shot_naive_gallery.png` | screenshot of the broken gallery header |

**Reproducing:** serve the repo (`python3 -m http.server 8731`), run `extract3.py rules3.json`,
then the build and verdict scripts in the order above.

---

## 11. WHAT I RECOMMEND HAPPENS NEXT

Order matters here; the first item is not part of the refactor.

1. **Fix the §1.1 comment-escape defect.** One character, its own card, before anything moves.
   `scroll-behavior: smooth` and `scroll-snap-type: y proximity` are currently not reaching the
   browser, and `y` alone means **mandatory** snapping — the behaviour GROUP 0's own comment
   argues at length must never ship. **This is a live bug independent of the refactor.**
2. **Founder reviews this map**, particularly the §2 numbering ruling, the §4.1 media-query
   ruling, and the §8 corrections to the approved split spec.
3. **Add the comment-integrity check** to the rewrite cards as a Must.
4. **Then the rewrite cards proceed**, sheet by sheet, each verified with the A/B render diff
   in §9 — which is now a script, not a manual check.

**The one thing I would not compromise on:** every rewrite card should end with the render diff
showing zero differences. It took about a minute to run and it caught a class of bug —
"the rules are all still there, just not on the page that needs them" — that no amount of
careful reading was going to find. The naive split passed every static check I threw at it,
including the zero-collision cascade test, and still broke three pages.

---

## 12. OPEN QUESTIONS FOR THE FOUNDER

1. **§2 — `sheet/NN` addressing.** Confirm you are happy reading `home/03` rather than
   `GROUP 3b`. It is the one change that touches how you *talk* about the CSS, not just how it
   is filed.
2. **§4.1 — the six co-located media queries.** I recommend moving them so the rule has no
   exceptions. It is slightly more churn in the rewrite. Verified safe either way.
3. **§3.3 — retiring GROUPs 4a, 8, 9, 12b.** Their prose moves to the history file. Confirm
   you are content for those four headers to leave the code entirely.
4. **§7 — the history pointers.** I propose roughly a dozen, only where someone would otherwise
   repeat a dead end. If you would rather have one in every group banner, say so — I have
   argued against it, but it is your manual.
