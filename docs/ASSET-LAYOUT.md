# ASSET LAYOUT — why there are five directories named `assets`, and why that is correct

Card: `t_4d7279df` (architect) · Founder ruling, 2026-09-18
Status: **binding decision record.** No file was moved, renamed, or deleted by this card.

---

## 0. WHY THIS DOCUMENT EXISTS

The founder, on the asset consultation that preceded this card, verbatim:

> "I accept the ruling but it must be motivated somewhere, and until I asked about it there
> was no explanation of those duplicate folder names (each with their own content and path)."

That is the defect, and it is worth being precise about what the defect *was*. The layout was
not wrong. The layout was **unwritten** — it existed in two agents' heads and nowhere on disk.
Five directories named `assets` sat in the tree across many rounds of work with no recorded
reason, so the founder read her own repository as untidy. She was reading it correctly, because
an undocumented convention is not a convention. It is a coincidence, and a coincidence survives
exactly until the first person who decides to tidy up.

So the deliverable here is not the ruling. It is the *reasoning*, written where the next agent
will hit it before it concludes the tree is a mess.

**If you are that agent: read §5 before you consolidate anything.** Two of these directories
contain byte-identical copies of files in another. That duplication is load-bearing. Deleting
it breaks things that currently pass.

---

## 1. THE PRINCIPLE

> **An asset lives in the smallest tree that can be deployed on its own and still needs it.**

That is the whole rule. Everything below is it applied.

The question the rule answers is not "what kind of file is this?" but "**if I cut this
directory out of the repository and served it by itself, would it still work?**" Wherever the
answer must be yes, that directory owns its assets. The name `assets` repeating is not
duplication; it is the same relationship — *this tree's own files* — appearing at each level
where a tree is separable.

This produces exactly three tiers, and five directories.

| tier | shape | what it means |
|---|---|---|
| **1 — site chrome** | `/assets/` | Painted by the shared root `style.css`, which is loaded by every page on the site. Belongs to the site itself. |
| **2 — deployable unit** | `<unit>/assets/` | Owned by one unit that could be lifted out and served alone (`shops/demo/`). |
| **3 — frozen evidence** | `<experiment>/assets/` | Belongs to one sketch, pinned so the experiment stays reproducible forever (`sketches/**`). |

The tiers are not a hierarchy of importance and they are not a pipeline. A file does not get
"promoted" from tier 3 to tier 1 by becoming good. It is copied, and both copies stay, for the
reason in §5.

---

## 2. THE FIVE DIRECTORIES

Counts are files, measured 2026-09-18 at commit `c6d5834`.

| # | directory | tier | files | what it is for |
|---|---|---|---|---|
| 1 | `assets/` | 1 — site chrome | **8** | The live site's own images. `leak-wall/stain-a.webp` + `stain-b.webp` are the mask textures the root `style.css` paints the blood-leak mechanism with; `placeholder-photography/` holds the 6 photos `index.html` renders in the roster and specimens sections. Every file here is referenced by a page that is actually served. |
| 2 | `sketches/assets/` | 3 — frozen evidence | **18** | The placeholder-photography **library** — the full generated set (16:9 *and* 3:4 of each piece, plus the bright-studio outlier and the no-photo fissuremark), shared by the four `sketches/homepage-populated/` clones that reach it via `../../assets/`. It is a superset: 12 of its 18 files have no counterpart in tier 1 and never will (see §5.2). Includes its own `README.md`. |
| 3 | `shops/demo/assets/` | 2 — deployable unit | **3** | The demo shop's three product photographs (`garment-nyx-mantle`, `jewelry-vertebra-collar`, `perfume-ash-flacon`). Vendor-owned content, not site chrome. See §4. [2026-10-15: moved to `assets/placeholder-photography/`, folder removed; §4's note.] |
| 4 | `sketches/leak-wall/003-painted-texture/assets/` | 3 — frozen evidence | **1** | `stain-mask-generated.png` — the generated mask that sketch 003 was built on. Referenced only by `003-painted-texture/index.html`, exists nowhere else in the repo (md5 `99d1fa46…`, unique). Not a duplicate of anything. |
| 5 | `sketches/leak-wall/004-single-layer/assets/` | 3 — frozen evidence | **1** | `stain-a.webp` — sketch 004's own pinned copy of the approved texture. Byte-identical to `assets/leak-wall/stain-a.webp` and **that is deliberate**. See §5.1. |

Total: 31 files across five directories, at three tiers, with exactly one name.

---

## 3. THE AXIS I REJECTED: generated vs. authored

This is the distinction the founder was reaching for, and she is owed the argument rather than
just the verdict.

The proposal was to split assets by provenance — files a human authored in one place, files a
tool generated in another. It is an intuitive axis. In most repositories it is a good one,
because it separates the precious irreplaceable originals from the cheap reproducible outputs,
and those two classes genuinely want different treatment (backup, licensing, review).

**I killed it because in this repository the axis has one value.**

Every image under every `assets/` directory here is generated. The placeholder photography was
generated (`docs/worksheets/generate-placeholder-photos-card.md`). The leak-wall stain textures
were generated. The 003 mask is literally named `stain-mask-generated.png`. There is no authored
tier for an authored/generated split to separate. The founder's own photography and the external
inspiration references — the genuinely authored material — do not live under `assets/` at all;
they live under `docs/references/images/`, which is a different tree entirely (§8).

A classification that puts 100% of the corpus in one bucket predicts nothing. It cannot tell you
where a new file goes, because the answer is always "the generated one." It cannot tell you what
is safe to delete. It would not have prevented a single one of the questions that produced this
document.

The deployability axis, by contrast, is *decidable and predictive*: point at any new asset, ask
which tree must still work when severed, and the answer places the file. That is the test of a
good taxonomy — not whether the categories are meaningful in the abstract, but whether they
route the next decision without a meeting.

**Worth stating plainly:** the generated/authored distinction is not wrong, it is simply already
satisfied. The repository *does* separate authored from generated material. The boundary is
`assets/` versus `docs/references/images/`, and it has been there the whole time.

---

## 4. WHY `shops/demo/assets/` STAYS WHERE IT IS

> **[2026-10-15: superseded for now by the founder.]** *"for now, I think that all the product and
> shop logo photos must sit in the assets/placeholder-photography/. We will reorganise the photo
> folders later, when we will have real photos."* The three demo photos moved by `git mv` to
> `assets/placeholder-photography/` (same names; frontend t_b7fad0cd) and `shops/demo/assets/` is
> gone; the shop's `--photo` now reads `url('../assets/placeholder-photography/…')`. They are
> AI-generated stand-ins, replaced before launch. The argument below stays as the record, and as
> the case to weigh when real photos arrive (`docs/DECISIONS.md`, top entry, "The folder").

The consistency argument says: three photographs, hoist them to `assets/shops/demo/` so all
images live under one root and the tree reads uniform.

**Ownership beats consistency, and the reason is what happens next.**

`shops/demo/` is the reference implementation of a *multi-vendor marketplace*
(`docs/ARCHITECTURE.md` Part B). Today `shops/` contains one directory. The entire point of the
architecture is that it will not. When it holds twenty vendors, the hoisted layout gives you a
root namespace carrying twenty vendors' product photography, keyed by a path convention that
must be kept in sync by hand with the directory it mirrors — while each vendor's own folder has
had its content hollowed out from underneath it. Deleting a vendor becomes two deletes in two
places, and the second one gets forgotten.

The co-located layout degrades in the opposite direction, which is to say it doesn't. A vendor
is one directory. Everything it owns is inside it. Adding one is `mkdir`; removing one is `rm
-rf`; there is no index to update and nothing to leave orphaned. A per-vendor content boundary
is exactly the seam a marketplace has to cut along, so putting the files anywhere else is
drawing a boundary the domain does not have.

This is the general rule stated in §1 with the stakes visible: **never draw a boundary that
separates a unit from the things it owns.** Consistency of appearance is not worth an ownership
boundary in the wrong place, because the appearance costs nothing to explain — this document —
and the boundary costs a migration.

### 4.1 One genuine subtlety, verified rather than assumed

`shops/demo/index.html` references its photographs as
`style="--photo: url('shops/demo/assets/garment-nyx-mantle.webp');"` — a **root-relative** path,
inside a page that is itself two directories deep. That looks wrong. It is not.

The `url()` sits in a CSS custom property, and a custom property's relative URL resolves against
**the stylesheet that consumes it**, not the document that declares it. The consumer is the root
`style.css` (loaded by the shop page as `../../style.css`), so the path resolves from the repo
root and lands correctly.

Verified in a real browser against a local server rather than reasoned about:

```
GET /shops/demo/assets/garment-nyx-mantle.webp        -> 200  (66062 bytes)
GET /shops/demo/assets/jewelry-vertebra-collar.webp   -> 200  (79798 bytes)
GET /shops/demo/assets/perfume-ash-flacon.webp        -> 200  (45260 bytes)
GET /shops/demo/shops/demo/assets/garment-...webp     -> 404  (the document-relative reading)
```

**Do not "fix" these paths to `assets/...` or `./assets/...`.** They are correct as written, for
a non-obvious reason, and the 404 above is what the intuitive correction would produce. This
trap is noted in `style.css`'s own GROUP comment at the `.stage-visual` rule; it is repeated here
because a future tidier will meet the path before it meets the comment.

---

## 5. ⚠ THE BYTE-IDENTICAL DUPLICATION IS CORRECT — DO NOT DEDUPE IT

**This is the most important section in this document.** It is addressed directly to a future
agent, human or otherwise, who has just run a duplicate-file finder across this repository and
found what looks like obvious waste.

It is not waste. Here is exactly what you found and exactly what breaks.

### 5.1 `stain-a.webp` — the sketch's copy is the sketch's own dependency

```
assets/leak-wall/stain-a.webp                              md5 e6a801ea97e8e1fe8fb6bc633638db76
sketches/leak-wall/004-single-layer/assets/stain-a.webp     md5 e6a801ea97e8e1fe8fb6bc633638db76
                                                            720x1280, identical, cmp-clean
```

Sketch 004 does not reference the root copy. It references **its own**, and it must, because it
is a self-contained page that does not load the root `style.css` at all. Verified live:

```
.leak-single__fill  mask-image resolves to
    /sketches/leak-wall/004-single-layer/assets/stain-a.webp     -> 200
    /sketches/leak-wall/004-single-layer/assets/leak-wall/...    -> 404
```

Delete the sketch's copy and sketch 004 renders an unmasked solid field — the exact failure mode
already recorded in `docs/DECISIONS.md` ("`file://` + `setContent()` silently fails to load mask
assets — the fill renders unmasked as a solid red field"). You would not get an error. You would
get a sketch that silently stops showing what it was built to show.

Two tracked scripts read **both** copies and compare them:

- `tests/e2e/t2649a11c_geom.py` — reads both WebP headers and asserts `same dims: True` before
  doing any reveal arithmetic. Run today, it still prints `same dims: True` (720x1280 both
  sides). This is the fidelity guard for the whole THE BOX, NOT THE MASK decision: that entry
  rests on "the asset is byte-identical, only the *box* changed," and this script is what keeps
  that premise honest.
- `tests/e2e/uiux_fidelity_t0cc55ac2_cover.py` — opens both paths and prints their dimensions
  and byte sizes side by side, for the same reason.

  (A third, `tests/e2e/uiux_fidelity_t0cc55ac2_cover.js`, does the same in the browser but is
  untracked test exhaust — do not rely on it, and do not count it.)

**Dedupe and you do not make these scripts fail. You delete their subject.** A comparison
between two paths that have become one path is not a passing test; it is a test that cannot run.
The guard protecting the premise of a shipped decision would vanish silently, which is strictly
worse than a red failure, because nobody gets told.

### 5.2 `placeholder-photography/` — a subset copy, protected by nothing

```
6 of 6 files in assets/placeholder-photography/ are cmp-clean copies of files in
sketches/assets/placeholder-photography/ (18 files):

  ...jewelry-vertebra-collar-16x9.webp    54ae68cf…
  ...knitwear-molted-texture-16x9.webp    98cacace…
  ...outerwear-winged-cloak-16x9.webp     fde12d28…
  ...roster-ileana-bonemark-1x1.webp      97133072…
  ...roster-moroi-knotmark-1x1.webp       01f40b03…
  ...roster-varcolac-wingmark-1x1.webp    ed5d0aa8…
```

**A correction to the record, because the card that commissioned this document had it wrong,
and the wrong version is more dangerous than the right one.** It stated that two e2e tests exist
to assert these copies match. They do not. Grepping `tests/`, `.verify/` and `scripts/` for
`placeholder-photography` returns **nothing**. The two comparison scripts in §5.1 are about
`stain-a.webp` only.

So this duplication has **no automated guard at all**, which makes it the more fragile of the
two, not the safer one. What protects it is only the fact that the two trees have different
consumers and different contents:

- The live homepage reads the root copies (`index.html`, 6 references, `assets/placeholder-…`).
- The four `sketches/homepage-populated/` clones reach `../../assets/placeholder-…` from two
  levels down, which resolves to **`sketches/assets/`** — never the root tree.
- The sketch tree holds **12 files that have no root counterpart and never will**: every 3:4
  portrait variant, the bright-studio outlier, and the no-photo fissuremark. Verified:
  `/sketches/assets/…outerwear-winged-cloak-3x4.webp` → 200, the same name under `/assets/`
  → 404.

Those 12 exist because the portrait aspect ratio was **tried and rejected** — it regressed the
one-section-per-screen test, and `docs/SUBMISSION-SPEC.md` §1 now requires landscape outright.
The sketch tree is the record of that rejection. It is evidence, and per
`docs/references/README.md` rule 1 the reasoning for a rejected direction is often worth more
later than the direction that won.

Collapse the two trees and you get one of two outcomes, both bad: either the live site starts
serving from a directory full of rejected variants it must never use, or the clones lose the
variants that make them a comparison and silently render broken images. The 6:18 overlap is not
redundancy. It is the intersection of two sets that are kept separate on purpose.

> **[2026-10-15: the overlap grows to 15:18.]** By the founder's photo plan and folder ruling
> (`docs/DECISIONS.md`, top entry), 9 more files were copied, byte-identical, into
> `assets/placeholder-photography/` for the demo shop's piece pages (frontend t_b7fad0cd): the
> bone-cuff 3:4 and 16:9, the winged-cloak, molted-texture and vertebra-collar 3:4, the
> draped-mantle and unravelled-sweater 3:4 and 16:9. So "never will" above no longer holds for
> those 9; the outlier and the fissuremark still have no root copy. The sketch tree is untouched
> (her rule: every generated image is kept). The portrait variants return as a piece page's
> photos, her choice, not as homepage sections. The root folder also holds the shop's three
> photos, moved from `shops/demo/assets/` (see §4's note).

### 5.3 The general rule

> **Frozen evidence is allowed — required — to duplicate live assets.** A sketch that shares a
> file with the live site is not reproducible, because the next change to the live file
> retroactively rewrites what the experiment showed.

A sketch's whole value is that it still renders, years later, exactly what the founder saw when
she ruled on it. That guarantee is worth a few hundred kilobytes. The moment a sketch points at
a live asset it stops being evidence and becomes a second consumer of a moving target — and the
first person to retune the live texture silently falsifies every verdict that sketch supports.

**If you want to reduce duplication here, the answer is no. Record that you asked, and move on.**

---

## 6. WHY ROOT `/assets/` DOES NOT MOVE

Measured at commit `c6d5834`, counting paths that resolve to the **root** assets tree —
excluding `sketches/`-prefixed and `../`-prefixed paths, which resolve elsewhere:

| scope | occurrences | files |
|---|---|---|
| tracked files | **86** | **37** |
| tracked + untracked working tree | 381 | 76 |

Concentrated in `style.css` (10) and `index.html` (6), with the rest spread across ~30 test
scripts and a handful of docs. The counting script is `/tmp/count_assets.py` as run for this
card; the rule it encodes is stated in §6.2 so the number can be reproduced rather than
believed.

A rename is therefore a ~40-file mechanical edit — annoying, but not the argument. This is the
argument:

### 6.1 Two tracked JSON files hold the path inside recorded measurement output

```
tests/e2e/t_cccaf262_regress.json            "http://127.0.0.1:8850/assets/leak-wall/stain-b.webp"
tests/e2e/uiux_t7e88d4c3_direction_1717.json "http://127.0.0.1:8931/assets/leak-wall/stain-b.webp"
```

These are not configuration and not source. They are **captured output** — the recorded result
of a measurement run that actually happened, at a URL that was actually fetched, supporting
verdicts already cited in `docs/DECISIONS.md`.

There is no clean side:

- **Rewrite them** and you have edited a historical record to say something that was not true at
  the time it was recorded. The file now claims a measurement was taken against a path that did
  not exist on that date. Every other number in the file becomes untrustworthy by association,
  because the file has been demonstrated to be editable after the fact.
- **Leave them** and the repository contains a stale path that resolves to nothing, which is the
  precise condition that makes a future reader open a card to "fix stale sketch paths" — and one
  of those already exists in `docs/references/`.

Both options are bad. That is not an argument for choosing carefully; **it is an argument for
not creating the choice.** The rename buys tidiness and pays for it with either a falsified
record or a permanent known-stale reference. Tidiness is not worth either.

### 6.2 The counting rule, stated so it is reproducible

A "root-assets reference" is a path naming `assets/leak-wall/` or
`assets/placeholder-photography/` that resolves to the root tree: **not** prefixed by
`sketches/`, **not** prefixed by `../`. A leading `/` counts, because a URL-form path resolves
to the root tree when served from the repo root.

This matters because the naive greps disagree wildly and every one of them is quotable:
`git grep -c assets/` gives 158 across 64 files; adding untracked test exhaust gives 418. Those
numbers count `../../assets/` (which resolves into `sketches/`) and `sketches/assets/` as though
they were root references. They are not.

**The card commissioning this document quoted 121 occurrences across 46 files. I could not
reproduce that figure under any rule I could state, and I tried several.** The nearest matches
were 123/47 (a rule that wrongly admits `../`-prefixed paths) and 93/42. I am recording my own
number, 86/37, together with the rule that produces it, rather than repeating a figure I cannot
derive. The conclusion does not turn on it — at 86 or at 121 the rename is a large mechanical
edit with an unwinnable JSON problem at the end, and §6.1 is what actually decides it.

---

## 7. THE ONE THING THAT WAS ACTUALLY WRONG

`docs/references/t_be6881a4-below-left-bareness.png` sat loose in `docs/references/`, among
~50 card bodies, specs and verdicts. It was the only image-shaped file in that directory.

**Already fixed** — commit `c6d5834`, 2026-09-18, `R100` (a pure rename, no content change):

```
docs/references/t_be6881a4-below-left-bareness.png
  -> docs/references/images/own-site/t_be6881a4-below-left-bareness.png
```

The rule it violated is `docs/references/README.md` rule 7: nothing image-shaped lives loose in
`docs/references/` itself. Every `.png`/`.jpg`/`.jpeg`/`.webp`/`.gif`/`.svg` belongs under
`images/own-site/` (a capture **of** Strigoi — screenshots, bug reports, QA and uiux
verification captures, sketch renders) or `images/inspiration/` (material brought in **for** the
work — external references, the founder's own photography, generated mood samples). File new
images directly into the correct subfolder at creation time; do not drop them in `images/` and
sort later.

Current state: `images/own-site/` 564 files, `images/inspiration/` 14, loose images in
`docs/references/` **0**. The three remaining non-`.md` files at that level are `.json`
measurement summaries, which belong there.

Current state, 2026-09-30 (`t_2e3fb0da`): `images/own-site/` **890** files, `images/inspiration/`
**14**, and nothing else in `images/`: no other folder, no loose file. Six stray folders
(`founder-target/`, `t_1cef6ea2/`, `t_26c4797c/`, `t_58bedbca/`, `t_d7b740a0/`, `t_fd157fc0/`, 24
files) moved into `own-site/` under their own names, and five loose PNGs from a 2026-09-28 test
re-run went to `own-site/2026-09-28_rerun/` (861 + 24 + 5 = 890). The cause of the loose PNGs,
`tests/e2e/sepulchre-frame.spec.js` writing into `images/` itself, is fixed. See
`docs/references/README.md` rule 3.

Worth noting what this says about the rest of the audit: the founder's instinct that something
was untidy was **correct**, and it found the one real violation in the tree. The instinct was
sound; only its target was misidentified. Five `assets` directories are a convention nobody had
written down. One loose PNG was an actual broken rule.

---

## 8. CORRECTING THE RECORD: `own-site` WAS NEVER UNDER `assets/`

Stated plainly, because the founder believed otherwise and the belief should not survive this
document:

> **`docs/references/images/own-site/` is not, and never has been, a subfolder of `assets/`.**

The two trees have always been separate, at different roots, with different purposes, different
governing documents, and no path relationship of any kind:

| | `assets/` | `docs/references/images/own-site/` |
|---|---|---|
| root | repo root | `docs/` |
| purpose | files the **site serves to visitors** | the visual **record of the site's own evolution** |
| consumers | `index.html`, `style.css` | documents and humans; never a served page |
| governed by | this document | `docs/references/README.md` |
| lifecycle | changes when the site changes | append-only, nothing is ever deleted (rule 1) |

They can look related because both hold images of Strigoi. They are opposites in the only sense
that matters to a layout decision: **`assets/` is what the site *is*; `own-site/` is what the
site *was*.** One is production surface, the other is an archive that must never be pruned. No
file has ever moved between them, and none should.

There is no history to reinterpret here and no migration that was ever done or undone. The
separation is original.

---

## 9. EXPLICITLY DEFERRED — DO NOT RE-LITIGATE

**Subdividing `docs/references/`.** It holds ~50 flat files mixing card bodies
(`4b-leak-card.md`), specs (`2026-09-16_t_87e89ef1_two-texture-systems-spec.md`), verdicts
(`2026-09-17_t_b84e3ec6_contrast-intent-verdict.md`) and JSON measurement summaries, in one
directory with no grouping.

**Decision: defer. Going-forward-only if ever.**

Reasoning, so this does not get reopened by someone who notices the flatness and assumes nobody
did:

- These files are **referenced by path** from `docs/DECISIONS.md`, from each other, and from
  card bodies on a board outside this repository. Moving them breaks references that no tool in
  this repo can find, because some of them are not in this repo.
- The current naming convention (`YYYY-MM-DD_t_<card>_<topic>.md`) **already sorts
  chronologically and already carries the card ID**. That is most of the value a directory split
  would add, at none of the cost. The date prefix is doing the grouping work.
- ~50 files in one directory is not a problem a reader actually has. Nobody browses this folder;
  they arrive at a specific file from a link in `DECISIONS.md`. Optimising the browsing
  experience of a directory nobody browses is effort spent on an imagined user.
- The genuine problem in that folder is **traceability, not layout**: `.verify/docs_consistency.py`
  currently reports 0 failures and **56 traceability warnings** — cards mentioned in
  `docs/references/` that never made it into the binding record in `DECISIONS.md`. Reorganising
  the directory would not close a single one of those. Anyone who wants to improve this folder
  should go after the 56, not the shape.

If a split ever does happen, it is **going-forward-only**: new files land in subdirectories,
existing files stay where they are. A retroactive move is the one version guaranteed to break
outside references, and it buys nothing the date prefix does not already provide.

---

## 10. THE RULE, FOR THE NEXT ASSET

Adding an image? One question:

> **Which tree must still work if I cut it out and serve it alone?**

- The whole site, via `style.css` → `assets/`
- One shop or unit → `<unit>/assets/`
- One sketch or experiment → `<experiment>/assets/`, **copying** rather than referencing
  anything outside itself (§5.3)
- A screenshot, a bug report, a founder reference, a capture of our own page → not `assets/` at
  all → `docs/references/images/{own-site,inspiration}/`, per `docs/references/README.md`
- A site icon (tab, bookmark, home screen) → not `assets/` → `favicon/` at the repo root, except
  `favicon.ico`, which stays at the root itself: browsers ask for `/favicon.ico` without reading
  the page (2026-10-06)

Five directories named `assets` is not five conventions. It is one convention, correctly applied
at five separable boundaries — now finally written down.

---

## Related

- `docs/DECISIONS.md` — the binding decision record (THE BOX, NOT THE MASK depends on §5.1)
- `docs/ARCHITECTURE.md` — repository layout; Part B, the multi-vendor marketplace behind §4
- `docs/references/README.md` — the images archive and its filing rules (§7, §8)
- `docs/SUBMISSION-SPEC.md` §1 — the landscape-photography requirement behind §5.2's 12 orphans
