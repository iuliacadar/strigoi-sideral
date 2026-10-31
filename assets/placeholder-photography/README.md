# assets/placeholder-photography/: the live site's placeholder photos

**AI-generated stand-ins. Not real product photography. Every file here is replaced before launch.**

The founder, 2026-10-15: *"for now, I think that all the product and shop logo photos must sit in the
assets/placeholder-photography/. We will reorganise the photo folders later, when we will have real photos."*
(`docs/DECISIONS.md`, top entry, "The folder".)

What is here:
- `2026-09-14_placeholder_*.webp`: copies, byte-identical, of files in `sketches/assets/placeholder-photography/`
  (the full generated library, which stays untouched: her rule that every generated image is kept; its README
  says how they were made). Only the files a live page needs are copied here.
- `garment-nyx-mantle.webp`, `jewelry-vertebra-collar.webp`, `perfume-ash-flacon.webp`: the demo shop's three
  photos, moved here from `shops/demo/assets/` (`git mv`, frontend t_b7fad0cd; `git log --follow` keeps their
  history).
- `2026-10-20_placeholder_jewelry-vertebra-collar-crop-<name>-9x16.webp` (pendant, beads, chain, short-pendant,
  spiral): copies, byte-identical, of `sketches/product-strip/assets/sketch-crop_vertebra-collar_<name>.webp`, close
  crops of the Vertebra Collar's own three photos made by uiux t_6c2f42a9 for the 8-photo strip; the Collar's piece
  page shows them as photos 2, 3, 5, 6 and 8 (frontend t_3cb71d22, 2026-10-20). Not new photography.
- `2026-10-31_placeholder_roster-texxturedbeest-coilmark-1x1.webp`: TexxturedBeest's mark on the plates (the
  homepage roster and the Atlas index), a copy, byte-identical, of
  `sketches/roster-atlas-magazine/plates/marks/tb-coil-1x1.webp` (256², rendered from `tb-coil.svg` there). Not a
  photograph and not AI-generated: a placeholder emblem uiux drew (t_9d6109aa, candidate 1, "the coil"), in the
  family of the three 2026-09-14 roster marks. Her pick, 2026-10-31: *"1. I like the Candidate 1 mark."* (frontend
  t_b2265449). Her own mark replaces it when she sends one.

Readers: `index.html` (roster marks, specimens), `atlas.html` (the index's plates), `bestiary.html`,
`shops/demo/index.html` (`--photo`, read by `css/shop.css`, so written `../assets/placeholder-photography/…`), and
the piece pages once built.
