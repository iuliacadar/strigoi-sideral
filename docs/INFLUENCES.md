# Influences — Strigoi's Cultural & Inspirational Sources

> An index, not a new archive. Every item below already lives somewhere in
> this repo or in a doctrine document — this file exists to make them
> **findable in one place**, so a worker or the founder doesn't have to
> remember which of `BRAND.md`, `DECISIONS.md`, `GRIMOIRE.md`, or
> `docs/references/images/` a given reference is buried in.
>
> This is not `docs/RESOURCES.md`. `RESOURCES.md` is the toolchain — the
> validators, the CDP scripts, the fonts pipeline. This file is the other
> half of "what shaped Strigoi": the videos, images, texts, and other
> people's work that were shared while brainstorming and that ended up load-
> bearing in a shipped decision. See the founder's own framing (2026-09-16):
> "beside texts and books, all the videos, music, movies, photos, etc. we
> share here when we're brainstorming over something that ends up
> implemented in our project — and inspiration we use for strigoi."

---

## Why this file exists (and why a new file, not a new RESOURCES.md section)

`docs/TEAM.md` records a real process failure (2026-09-14): three cards
about the background all passed their acceptance criteria without any
specialist consulting the founder's own reference images, which had been
archived since 2026-09-10 specifically so they would be available. The
standing fix from that incident is that **the card must name the file and
say what it's for** — but that only works if whoever writes the card can
find the file and its meaning in the first place. Today that means
searching filenames in `docs/references/images/` (400+ files, mostly named
after the QA/build card that produced them, not the founder's original
reference) or grepping four different doctrine documents for a phrase
half-remembered from a conversation.

This file does not replace card-level citation discipline — PM must still
name the specific file in the card, every time. It exists one level above
that: so PM (or anyone) has one place to look up "what was the Cryo Chamber
video for" or "which file is the blood-perfect-red target" without already
knowing which doc to search. **This is a safeguard against the TEAM.md
failure repeating, not archival tidiness** — the three founder-reference
items below are exactly the class of thing that got missed.

A new section inside `RESOURCES.md` was considered and rejected: that file
is scoped explicitly to tooling ("Tools Used to Build This Project" /
"Strigoi-Specific Study Notes"), its own header states that scope, and
mixing "here is the W3C validator" with "here is the video that gave us our
palette" would blur a distinction that currently helps a reader (tool
questions vs. taste/lineage questions have different owners and different
half-lives). A separate, short, index-only file keeps both documents doing
one job each.

**What this file is not:** a competing home for doctrine. If a reference
already has a doctrinal treatment (Aeschylus in `GRIMOIRE.md` §XIII, Kant's
sublime in the same section), this file points there rather than
re-explaining it. Duplicating the argument here would create exactly the
two-sources-of-truth problem `.verify/docs_consistency.py` exists to catch.

---

## Video & audio

| source | what it gave the project | archived as | cited in |
|---|---|---|---|
| Cryo Chamber–style dark-ambient cover art, YouTube `keIMfmXcH6w` | "our palette and mood and patterns and noise and distressed look" (founder, verbatim, 2026-09-10) — not just colours, the **distressed quality itself**. Governs the six-effect distressed-surface vocabulary (grain, scanlines, chromatic aberration, etc.) that is now the project's standing name for this look. | `docs/references/images/inspiration/2026-09-10_cryo-chamber_palette-iii-source.png` (a still, not the video itself) | `BRAND.md` (Palette source, distressed-surface section), `DECISIONS.md` (palette laws restated for zone work), `GRIMOIRE.md` (cosmology of the descent, line ~412) |

Other YouTube references appear in `DECISIONS.md` (`wppH_Gm0fCQ` — grey-blue
dark-ambient cover for an early palette idea) but did not become a standing
source the way the Cryo Chamber still did; noted here only so a future
search for "youtube" in this repo isn't a dead end.

---

## Images — founder-supplied visual references

These are the references named in the `TEAM.md` incident. All live in
`docs/references/images/`, all are cited in at least one doctrine document,
and all should be named explicitly (path + purpose) in any future card that
touches the zone they govern — per the standing rule in `TEAM.md`.

| file | what it's for | cited in |
|---|---|---|
| `2026-09-14_founder-ref_blood-PERFECT-RED-hue-target.jpeg` | The crimson hue target — "it would be more than perfect" (founder). The reference for matching `--below`'s red. | `BRAND.md`, `DECISIONS.md` |
| `2026-09-10_adobestock-151518674_blood-drips-white-WATERMARKED.png`, `2026-09-10_adobestock-744422045_blood-wall-leak-WATERMARKED.png`, `2026-09-10_adobestock-995230724_crypt-room-red-leak-WATERMARKED.png` | Adobe Stock crypt/blood-wall references — measured against for the leak's visible drip tips / hard terminations before the founder's "faded out, no visible drip ends" ruling superseded the literal look. Still the source for saturation/leak-shape measurement. | `DECISIONS.md` (palette laws, leak-shape entries) |
| `2026-09-10_cryo-chamber_palette-iii-source.png` | See Video & audio above. | `BRAND.md`, `GRIMOIRE.md` |
| `2026-09-14_founder-ref_blood-drips-splatter-wall.jpg`, `2026-09-14_founder-ref_blood-leak-wall-warm.jpg` | Additional blood-wall reference stills from the same 2026-09-14 sharing session as the hue target. | `BRAND.md` (background zone work) |

**Standing ruling that governs all of the above** (founder, 2026-09-10,
quoted in full in `BRAND.md`): reference images convey *intent*, never a
literal target to reproduce pixel-for-pixel. Cite them for what they are
asking for, not as a spec to copy.

The remaining ~400 files in `docs/references/images/` are QA/build capture
screenshots (named after the card that produced them, e.g.
`2026-09-16_t_f7cb3491_ab_1717x768_...`) — process evidence, not founder
inspiration. They don't belong in this index; `docs/references/images/own-site/`
is their home, and the per-card report files that cite them are in
`docs/worksheets/`.

---

## Texts

Already doctrinally treated — this section only points at where.

| source | role | doctrine location |
|---|---|---|
| Aeschylus, *Agamemnon* (c. 458 BCE) — *πάθει μάθος*, ll. 176–178 | The creed's origin: wisdom through suffering, as the chorus's cosmological law rather than a character's opinion. Source passage added 2026-09-17 (this card). | `GRIMOIRE.md` §XIII |
| Kant, *Critique of Judgment* (1790) — the sublime vs. the beautiful | The distinction between "terrifying beauty" and a moody dark-mode template; the mathematically/dynamically sublime as the target register for Strigoi's emptiness. | `GRIMOIRE.md` §XIII |
| The Emerald Tablet / *Quod est inferius, est sicut quod est superius* | The hermetic axiom the whole above/below cosmology inverts and complicates ("as above so below, but with an essential difference" — the founder's 2026-09-15 statement in `DECISIONS.md`). | `GRIMOIRE.md` §I–II, `DECISIONS.md` "THE BACKGROUND IS THE BACKGROUND STORY" |
| Romanian folklore — strigoi, moroi | The brand's namesake and origin register. | `STRIGOI-DOCTRINE.md` §2, §3a, `BRAND.md` |

`RESOURCES.md` §2 ("Strigoi-Specific Study Notes") remains the place for
*process* study notes (why headless CDP, why one shared stylesheet) — those
are about how the project is built, not what shaped its taste, and stay
there.

---

## Maintenance

Add a row when a founder-shared video/image/text becomes load-bearing in a
shipped decision — i.e. the same bar `TEAM.md`'s standing rule already sets
for citing references in cards. Do not add every reference ever mentioned
in a card; this indexes what governs current work, not a brainstorming log.
If an entry's doctrine moves, update the "cited in" pointer rather than
re-arguing the doctrine here.

---

*Created 2026-09-17 in response to the founder's question ("do we have a
separate document with cultural references... and, more important, do we
need it?"). Answer: a lightweight index was needed — not a new archive,
not a duplicate of `GRIMOIRE.md`'s argument, and not a merge into
`RESOURCES.md`'s tooling scope. See `docs/TEAM.md` for the process failure
this is a safeguard against.*
