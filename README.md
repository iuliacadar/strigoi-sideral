# Strigoi

**A curated, invite-only multi-vendor marketplace for uncanny design from the land of the strigoi: a hand-built frontend prototype.**

> "Not a marketplace category. A vibration — soil in the seams, static from
> somewhere much further out."

**Live demo:** https://iuliacadar.github.io/strigoi-sideral/
**Author:** Iulia-Alexandra Cadar

Strigoi gathers Eastern European designers (garments, jewelry, textiles, decor objects and perfume) whose work stays rooted in the material culture of the "dark East" (wool, wire, bone, embroidery, folklore) while reaching for something not of this world. Every maker is personally invited: there is no open submission form. "The land of the strigoi" is a fictional landscape, drawn from Romanian folklore (strigoi, moroi).

## The rooted/galactic thesis

The brand is built on one duality:

- **The rooted pole:** Carpathian soil, earth, a dark bottom register.
- **The galactic-abyss pole:** violet, starlight, smoke, the cosmic register the designers' work reaches toward.

This is built into the page itself: one continuous vertical gradient runs from soil-dark at the bottom of the homepage to abyss-black at the top. Scrolling down descends into the earth; scrolling up rises into the sky. A hand-drawn SVG wingmark ties the two poles together.

## What's in this repository

A real, working frontend prototype in **plain HTML, CSS and JavaScript**: no framework, no build step.

| Path | What it is |
|---|---|
| `index.html` | Homepage: hero, doctrine, designer roster, specimens, the Room Zero threshold, footer |
| `atlas.html`, `bestiary.html` | The designer atlas and the bestiary wall |
| `shops/` | Sample designer shops (stand-in content) with product pages |
| `summoning/`, `echolocation/`, `account/` | Interaction pages (the "summoning" product reveal, search, login mock-up) |
| `contact/`, `terms/`, `privacy/`, `shipping/`, `returns/`, `sizing/`, `legal/` | Text pages sharing one layout |
| `css/` | One stylesheet per concern: design tokens, background, chrome, page styles, responsive queries, motion |
| `script.js` | The shared script: roster, grid rendering, lightbox viewer, motion and sound controls |
| `assets/` | Founder and placeholder product photography, maker marks, the background's leak-wall stains, the Bestiary's retired torn-paper masks (kept, unused) |
| `room-zero.html` | Public placeholder for the private gallery (see below) |

**Placeholders:** the makers on the roster (Ileana C., Studio Moroi, Vârcolac Atelier) and the demo shops are invented stand-ins, not real makers or shops; any likeness to a real maker is unintended.

Built with attention to **accessibility** (skip links, landmarks, keyboard focus order, `prefers-reduced-motion`, WCAG contrast checks) and **performance** (GPU-composited animation, no heavy libraries).

## Room Zero (private)

Beneath the homepage sits **Room Zero**, a sealed photo archive: a grid with a full-screen lightbox viewer. Its photographs are restricted-audience content, so the gallery page, its images and its data are **not part of this public repository**. The code that drives it (grid and lightbox in `script.js`, styles in `css/gallery.css`) is included. The gallery is available on request.

## Project status

- **Built:** the frontend prototype described above.
- **Designed, not yet built:** the platform behind it: a backend and database, accounts for four roles (visitor, customer, designer, admin), invite-only vendor onboarding and payments with per-designer payouts.
- Most of the design documentation lives in the private working repository, along with the decision log and test suite; four design documents are in `docs/`.

## Running it locally

```bash
python3 -m http.server
```

Then open `http://localhost:8000/`. The custom `404.html` uses `/strigoi-sideral/` paths for GitHub Pages, so it is styled only on the live site.

## Licence

**Licence:** the source code (HTML, CSS, JavaScript) is MIT-licensed; the photographs, images, marks and the names Strigoi, Strigoi Sideral and the shop and maker names are all rights reserved. See [`LICENSE`](LICENSE).

## Related

Strigoi is the sibling of **[Texxturalia](https://github.com/iuliacadar/texxturalia)**: the same conceptual family, but a separate visual form, repository and site.
