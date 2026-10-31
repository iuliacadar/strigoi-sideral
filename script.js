/* STRIGOI: THE SUBTLE DYNAMICS (script.js)
   The one script every page loads, twenty-three pages. What it runs, by page:
     the homepage:  §1 the plates' click flash, §1a the roster's day, §1b the specimens'
                    magic-lantern box, §6b the nav's words fading on the way down
     the gallery:   §2 the photo grid drawn from the manifest, §3 the
                    lightbox
     the demo shop: §4a the Séance's summon (the hint at a photo's top
                    summons its facts to its foot), §5 the demo's skin
                    switcher, carried to its pieces (§5b)
     a demo piece:  §4 the Séance (a press summons the piece's words),
                    §4b the strip of photos, §4c the photo grown to
                    meet the Details list, and a long list
                    continued under both columns, §5 and §5b as the shop
     the Summoning: §7 the wheel's rings drawn as it scrolls into view
     the Atlas:     §1 the plates' click flash, §7c the day's sky, on §7b's day order
     the Bestiary:  §7d the day's wall of pieces, on §7b's
     the ten text pages (the log-in placeholder among them): nothing.
   §6 is a removed mechanism's tombstone; §8 starts the rest. Each init
   looks for its own elements first and returns when they are absent,
   so one file is safe on every page (§8 says why one file).
   ========================================================================== */

// --- 1. THE PLATES' CLICK FLASH (the homepage roster and the Atlas index; the plate, chrome/09) ---
// A click on a plate's link, a shop's name (Vârcolac Atelier's,
// TexxturedBeest's), tints the whole plate a faint dark red,
// `--below` at 16%, and clears it 450ms later: press feedback while the
// shop page loads. On a fast connection the page leaves before it is
// seen; on a slow one it is the only sign the click registered. Enter
// fires it too. It appears and clears without a transition.
// Since the plates (2026-10-31) the link is the name (`a.plate-name`) and
// its `::after` covers the plate, so a click anywhere on the plate is the
// link's; the tint goes on the `<li class="plate">`, the box the visitor
// pressed (uiux t_9d6109aa's spec: the same tint, the same 450ms, the
// selector `.plate a.plate-name`). It was on the roster's line
// (`a.roster-card`), the homepage only; the plate is one object on both
// pages, so the Atlas's plates flash too.
// CHOICE, only the links: the plates of makers without a shop are not
// links, with a default cursor and no hover or focus; a flash there
// would say something happened when nothing did (docs/HISTORY.md,
// home/05).
// CHOICE, the token read at click time (`var()` works in an inline
// style), not a copied colour: it follows `--below`. Where
// `color-mix()` is unsupported the declaration is dropped and there
// is no flash, nothing worse.
// CHOICE, an inline style and a timer, not a CSS class: no rule has to
// exist for one effect, and a CSS transition fires on a change of
// state, not on a timer (the reason as recorded with the code).
const initPlateFlash = () => {
  const links = document.querySelectorAll(".plate a.plate-name");
  if (!links.length) return;

  // the tint as an image layer over the plate's own ground (#211f20,
  // chrome/09), not as its `background`: that would replace the opaque
  // ground with a 16% wash and let the sky show through the plate for
  // 450ms, a hole, not a tint. A gradient of one colour is the usual way to
  // lay a colour as an image.
  const TINT = "color-mix(in srgb, var(--below) 16%, transparent)";
  links.forEach((link) => {
    const plate = link.closest(".plate");
    link.addEventListener("click", () => {
      plate.style.backgroundImage = `linear-gradient(${TINT}, ${TINT})`;
      setTimeout(() => {
        plate.style.backgroundImage = "";
      }, 450);
    });
  });
};

// --- 1a. THE ROSTER'S DAY (homepage, home/05; the plate, chrome/09) ---
// WHAT IT DOES: turns the roster's plates once a day, the same order for
// every visitor on that day, shows at most five, and keeps the empty
// plate of the voice being scouted last. Past five makers it says so in
// one line under the row.
// HER WORDS, 2026-10-31 19:50, to uiux's question whether to keep the
// plates' numbers on the homepage, where the order turns: "2. OK, keep
// the numbers on both pages." So "Planche I" is the day's first plate,
// a place and not a rank: on 31 October Ileana C., on 1 November
// Vârcolac Atelier, on 2 November TexxturedBeest (uiux t_9d6109aa, the
// README's "What the numbers say to a visitor").
// HOW: the plates are in the markup A to Z (index.html), the page with
// the script off. The named plates (not `.plate--empty`) are put in
// `shuffleForDay` (§7b) order, salt "roster:", and the first five are
// re-appended in that order before the empty plate; the rest are
// removed from the list (and from Tab and a screen reader with it). The
// numbers follow by themselves: a CSS counter numbers the plates as
// they stand (chrome/09). Moving an element keeps its listeners, so
// §1's flash does not care which runs first.
// THE LINE PAST FIVE, uiux's words (hers to change): "Five of the ten
// shops, turned each day. Every one is on the Atlas." (GRIMOIRE §XV: the
// homepage is a rotating few, the Atlas everyone). The count is written
// in words to twenty, in digits past it.
// SCOPE: runs only where `#roster .plates` exists, the homepage; the
// Atlas's plates stay A to Z (atlas.html says why).
// CHOICE, in the browser: the site is static today. With the backend the
// server does the same, over the full roster, and the page arrives in
// the day's order (§7b's own note).
// CHOICE, the empty plate never turned: it is not a maker; last, with
// the next number, it reads as the next place to fill.
const initRosterDay = () => {
  const list = document.querySelector("#roster .plates");
  if (!list) return; // not the homepage
  const named = Array.from(list.querySelectorAll(":scope > .plate:not(.plate--empty)"));
  if (!named.length) return;
  const empty = list.querySelector(":scope > .plate--empty");
  const MAX = 5; // the homepage's glance (§XV); a row of the plates holds five
  const day = shuffleForDay(named, "roster:");
  day.slice(MAX).forEach((plate) => plate.remove());
  day.slice(0, MAX).forEach((plate) => list.insertBefore(plate, empty)); // null: at the end
  if (named.length > MAX) {
    const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
    const count = WORDS[named.length] || String(named.length);
    const note = document.createElement("p");
    note.className = "plates-note";
    note.textContent = `Five of the ${count} shops, turned each day. Every one is on the Atlas.`;
    list.after(note);
  }
};

// --- 1b. THE SPECIMENS: THE MAGIC-LANTERN BOX (homepage, home/06) ---
// WHAT IT DOES: turns the stacked list into one box of the Bestiary's
// cabinet, standing still in a lantern's light on the red wall, with
// the pieces shown one at a time as slides pushed THROUGH it: the
// operator holds a piece 7 s, then pushes the next in over 1.6 s, right
// to left; the lit piece leaves behind the box's left inner wall and
// the next comes in past the right one, the way a slide passes a magic
// lantern's gate. Pause and Sound sit beside the box, not drawn at rest
// (the stain once laid over them went, 2026-10-31: css/home.css).
// Her picks, 2026-10-30 and 31 (PM ledger t_717bfd87; uiux's spec,
// sketches/home-specimens-lantern/README.md, "For the frontend card
// (her picks)", t_6a358a7d): wall (c), "the red wall as the lantern's
// screen"; movement (i), "the operator"; "alone in the light"; one
// box that stays in the light (her words: "an entire shelf box, not
// just the bottom plank"); 4 pieces; sound (c), the glass slide in a
// brass gate, off at load; Pause and Sound as icons under the stains
// (her words: "could the icons for Play and Sound be covered by stains
// and become visible at hover/action on them (like the links in the
// footer)?"); the caption row fully visible; and, for reduced motion,
// her "(a)": the sliver of the next slide waiting at the box's gate.
// No counter (her ruling of 2026-10-12).
// HOW: the four `.specimen`s stay in the markup (index.html) and are
// read here: photo, alt, figure label, name, maker, availability. The
// list is hidden by `.js-lantern` (home/06), and this builds beside it
// the case (the light, the sliver, the box, the gate with its track of
// slides, and one "Next specimen" button over the lit photo) and the
// foot (Pause, Sound, one caption row). The track holds the pieces
// three times over, one photo's width + 158px apart (28px of niche, a
// 10px wall, 120px of dark: no two slides are ever both whole in the
// box); a push is a CSS transition of its `transform`. After every
// step the track is brought back into its middle copy, the same
// pixels, so it never runs out (`normalize`). The class goes on only
// once everything is wired, so the pieces are never hidden with no way
// to reach them. Fewer than 2 pieces, or a missing element: it returns
// before changing anything, and the stacked boxes stand (no script).
// IT HOLDS (does not push) while a pointer is on the box or the
// caption; while the keyboard is in the section (the piece or the
// door) but not on Pause or Sound, so a mouse press on Play plays at
// once (uiux 1b's fix, the W3C carousel pattern); while less than half
// of the stage is on screen; while the tab is hidden; and after a
// visitor's own step, until Play. Nothing runs off screen, and a
// visitor arrives at a piece at rest (WCAG 2.2.2 with Pause).
// KEPT: the day's first piece (her words, 2026-10-12: "Yes, the daily
// rotation is perfect. In this way, the visitors that are failing to
// find the second and the third specimen photo, still have the chance
// to see some new pieces."): §7b's `dayKey()`, the UTC day count mod
// n, opens the box; the order is the markup's, wrapping (fair to the
// makers: no piece always first). "Next specimen" on the lit piece: a
// click, a tap, Enter or Space brings the next piece in; ArrowRight
// and ArrowLeft while the focus is on it. The live region says
// "Specimen k of n: name" on the visitor's own steps only, never at
// load or on the operator's pushes (WCAG 4.1.3 without chatter). The
// photo's description lives OUTSIDE the button (a button's children
// are presentational): `#lantern-desc`, the lit piece's alt, named by
// the button's `aria-describedby`; the slides are `aria-hidden`.
// REDUCED MOTION, and BELOW 1280px (task 4a's band, uiux's rule until
// phones are designed): a still box. Nothing moves by itself, a step is
// a cut, and the sliver (her "(a)") shows: 16px of the next photo's
// leading edge just past the box's right outer wall, under a .35 black
// veil; a click on it brings that piece in (it is `aria-hidden` and
// not focusable: the keyboard has the arrows and Enter on "Next
// specimen"). No Pause under reduced motion (nothing to pause); below
// 1280px no Pause and no Sound either. Crossing 1280px or
// changing the motion setting rebuilds on the same piece, at rest,
// with no push and no sound.
// THE SOUND (c): OFF when the page opens, always. Nothing audio exists
// before the visitor's first press on Sound: lantern-sound.js isn't
// fetched and no AudioContext is made; the context is made inside the
// press (Safari requires it). It plays only on a push or a visitor's
// step, the tap landing as the piece seats (72% into the push; at once
// on a cut), never at load, on a resize or while held. The choice
// lives in a variable only (no cookie, no storage): the next page view
// is silent again. The engine is suspended 1.5 s after each sound and
// as soon as Sound is turned off.
// CHOICE, the script reads `prefers-reduced-motion` (as §4b's strip
// does): the operator is a timer, and only the script can keep it from
// starting. motion.css still stops every transition.
// No `?day=` override (the Bestiary has none either): QA fixes the date
// with Playwright's clock (`page.clock.setFixedTime`).
const LANTERN_SOUND_SRC = new URL("lantern-sound.js", (document.currentScript && document.currentScript.src) || location.href).href;

const initSpecimensLantern = () => {
  const wrap = document.querySelector(".specimens-wrap");
  if (!wrap) return;
  const list = wrap.querySelector(".specimens-stage");
  const announcer = document.getElementById("specimens-announcer");
  const pieces = Array.from(wrap.querySelectorAll(".specimens-stage .specimen")).map((s) => {
    const img = s.querySelector(".specimen-photo");
    const parts = [".specimen-fig", ".specimen-namewrap h4", ".specimen-maker", ".specimen-avail"].map((q) => s.querySelector(q));
    if (!img || parts.includes(null)) return null;
    const [fig, name, maker, avail] = parts.map((el) => el.textContent.trim());
    return { src: img.currentSrc || img.src, alt: img.alt, fig, name, maker, avail };
  });
  if (!list || !announcer || pieces.length < 2 || pieces.includes(null)) {
    return; // nothing to step through, or an element is missing: the stacked boxes stand
  }
  const n = pieces.length;

  // The timings and the box, uiux's spec at her picks (README, "The
  // exact values"). The box: the Bestiary's cabinet D (bestiary/04),
  // the photo 14px from the niche's sides and top on a 40px floor,
  // 10px walls; at 560×315 that is 608×389. GAP: calm 2's dark wall
  // between two slides ("alone in the light").
  const HOLD = 7000, TRAVEL = 1600, EASE = "cubic-bezier(.45,.05,.25,1)";
  const CAPTION_AT = 0.75, SEAT = 0.72, SLEEP = 1500;
  const SIDE = 14, TOP = 14, FLOOR = 40, WALL = 10, GAP = 120, AR = 16 / 9;
  const RMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const WIDE = matchMedia("(min-width: 1280px)");
  const still = () => RMQ.matches || !WIDE.matches;

  // ---- the markup (static strings only; the pieces' words go in as text) ----
  const stage = document.createElement("div");
  stage.className = "lantern-stage";
  stage.innerHTML =
    '<div class="lantern-case">' +
    '<span class="lantern-next" aria-hidden="true"></span>' +
    '<span class="lantern-box" aria-hidden="true"></span>' +
    '<span class="lantern-gate" aria-hidden="true"><span class="lantern-track"></span></span>' +
    '<button type="button" class="lantern-lit" aria-label="Next specimen" aria-describedby="lantern-desc"></button>' +
    "</div>" +
    '<span class="sr-only" id="lantern-desc"></span>';
  const caption = document.createElement("div");
  caption.className = "lantern-caption";
  caption.innerHTML =
    '<span class="specimen-row"><span class="specimen-fig"></span>' +
    '<span class="specimen-namewrap"><h4></h4><span class="specimen-maker"></span></span>' +
    '<span class="specimen-avail"></span></span>';
  const ctls = document.createElement("div");
  ctls.className = "lantern-ctls";
  const play = document.createElement("button");
  play.type = "button";
  play.className = "lantern-play";
  const snd = document.createElement("button");
  snd.type = "button";
  snd.className = "lantern-sound";
  ctls.append(play, snd); // Tab: the piece, Pause, Sound, then the door
  const foot = document.createElement("div");
  foot.className = "lantern-foot";
  foot.append(ctls, caption);
  list.after(stage);
  stage.after(foot);

  const caseEl = stage.querySelector(".lantern-case");
  const track = stage.querySelector(".lantern-track");
  const lit = stage.querySelector(".lantern-lit");
  const nextEl = stage.querySelector(".lantern-next");
  const desc = stage.querySelector("#lantern-desc");
  const idx = (k) => ((k % n) + n) % n;

  // ---- geometry: the photo 560×315 from 1280px; below, today's column
  //      (the caption's width, min(560px, 72vw)), still 16:9 ----
  let PW = 560, PH = 315, pitch = 0, cur = n;
  const layout = () => {
    PW = WIDE.matches ? 560 : Math.round(caption.getBoundingClientRect().width);
    PH = Math.round(PW / AR);
    PW = Math.round(PH * AR);
    const nw = PW + 2 * SIDE;
    pitch = nw + WALL + GAP;
    const props = { "--lantern-pw": PW, "--lantern-ph": PH, "--lantern-nw": nw, "--lantern-bw": nw + 2 * WALL, "--lantern-shelf": PH + TOP + FLOOR + 2 * WALL };
    Object.entries(props).forEach(([k, v]) => wrap.style.setProperty(k, `${v}px`));
    track.textContent = "";
    for (let k = 0; k < 3 * n; k++) {
      const img = document.createElement("img");
      img.alt = "";
      img.decoding = "async";
      img.src = pieces[k % n].src; // the list's own files, already fetched
      img.style.left = `${WALL + k * pitch + SIDE}px`;
      track.appendChild(img);
    }
    track.style.width = `${3 * n * pitch}px`;
  };
  // the track's x that puts slide k in the box (the box is the case's centre)
  const xFor = (k) => caseEl.clientWidth / 2 - (WALL + k * pitch + (PW + 2 * SIDE) / 2);
  const setX = (x, animate) => {
    track.style.transition = animate ? `transform ${TRAVEL}ms ${EASE}` : "none";
    track.style.transform = `translate3d(${x}px,0,0)`;
  };
  // back into the middle copy, so a run of quick steps never runs out.
  // Before a step, from wherever the track is now (mid-push too: the
  // computed transform, which the new push then starts from); at rest,
  // from the exact target, so no fraction of a pixel is ever kept
  const normalize = (atRest) => {
    if (cur >= n && cur < 2 * n) return;
    const copies = Math.floor(cur / n) - 1;
    const x = atRest ? xFor(cur - copies * n) : new DOMMatrixReadOnly(getComputedStyle(track).transform).m41 + copies * n * pitch;
    cur -= copies * n;
    setX(x, false);
    void track.offsetWidth; // the jump is drawn before the next push starts
  };
  // a push has ended (an interrupted one fires `transitioncancel`, not this)
  track.addEventListener("transitionend", (e) => { if (e.target === track && e.propertyName === "transform") normalize(true); });

  // ---- the caption, the description, the sliver ----
  const fill = (i) => {
    const p = pieces[i];
    caption.querySelector(".specimen-fig").textContent = p.fig;
    caption.querySelector("h4").textContent = p.name;
    caption.querySelector(".specimen-maker").textContent = p.maker;
    caption.querySelector(".specimen-avail").textContent = p.avail;
    desc.textContent = p.alt;
  };
  let capTimer = 0;
  const showCaption = (i, fade) => {
    clearTimeout(capTimer);
    if (!fade) { fill(i); caption.classList.remove("is-out"); return; }
    // out as the push starts, the new words in as the piece arrives
    caption.classList.add("is-out");
    capTimer = setTimeout(() => { fill(i); caption.classList.remove("is-out"); }, Math.round(TRAVEL * CAPTION_AT));
  };
  const placeNext = (i) => { // the slide after piece i, waiting at the gate
    const img = document.createElement("img");
    img.alt = "";
    img.src = pieces[idx(i + 1)].src;
    nextEl.replaceChildren(img);
  };

  // ---- stepping ----
  const land = (i) => { // at rest on piece i: load, resize, a change of mode
    cur = n + i;
    setX(xFor(cur), false);
    showCaption(i, false);
    placeNext(i);
  };
  const step = (d, user) => {
    normalize(false);
    cur += d;
    const i = idx(cur);
    const moving = !still();
    sound(moving);
    setX(xFor(cur), moving);
    showCaption(i, moving);
    placeNext(i);
    if (!moving) normalize(true); // a cut is at rest at once; a push settles on its `transitionend`
    if (user) announcer.textContent = `Specimen ${i + 1} of ${n}: ${pieces[i].name}`;
  };

  // ---- the operator: play, hold, pause ----
  let playing = !RMQ.matches, timer = 0;
  const holds = new Set(["view"]); // why it is held: hover-shelf, hover-caption, focus, view, tab
  const running = () => playing && !still() && holds.size === 0;
  const schedule = (afterPush) => {
    clearTimeout(timer);
    if (!running()) return;
    // the hold is counted from the moment the piece has arrived
    timer = setTimeout(() => { step(1, false); schedule(true); }, HOLD + (afterPush ? TRAVEL : 0));
  };
  const hold = (why, on) => {
    const was = running();
    if (on) holds.add(why); else holds.delete(why);
    if (was !== running()) schedule(false);
  };
  const ICON_PAUSE = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><rect x="2" y="1.5" width="2.6" height="9"/><rect x="7.4" y="1.5" width="2.6" height="9"/></svg>';
  const ICON_PLAY = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 1.5v9l7.5-4.5z"/></svg>';
  const label = () => {
    play.innerHTML = (playing ? ICON_PAUSE : ICON_PLAY) + `<span class="lantern-word">${playing ? "Pause" : "Play"}</span>`;
    play.setAttribute("aria-label", playing ? "Pause the specimens" : "Play the specimens");
    // paused (by Pause, or by the visitor's own step) is a state they
    // chose: Play stays drawn until pressed (condition 3)
    play.classList.toggle("is-set", !playing);
  };
  play.addEventListener("click", () => { playing = !playing; label(); schedule(false); });
  // a visitor's own step takes the operator's place until they press Play
  const userStep = (d) => {
    if (playing && !still()) { playing = false; label(); schedule(false); }
    step(d, true);
  };
  lit.addEventListener("click", () => userStep(1));
  nextEl.addEventListener("click", () => userStep(1));
  // the sliver is no focus target: a press on it leaves the focus where
  // it was (on the piece, the arrows go on working)
  nextEl.addEventListener("mousedown", (e) => e.preventDefault());
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); userStep(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); userStep(-1); }
  });
  // a pointer on the box or the caption holds it (not on the controls:
  // a pointer resting on Play after pressing it must not hold it)
  [[stage, "hover-shelf"], [caption, "hover-caption"]].forEach(([el, key]) => {
    el.addEventListener("mouseenter", () => hold(key, true));
    el.addEventListener("mouseleave", () => hold(key, false));
  });
  wrap.addEventListener("focusin", (e) => hold("focus", !e.target.closest(".lantern-ctls")));
  wrap.addEventListener("focusout", (e) => { if (!wrap.contains(e.relatedTarget)) hold("focus", false); });
  new IntersectionObserver((es) => es.forEach((en) => hold("view", en.intersectionRatio < 0.5)), { threshold: [0, 0.5, 1] }).observe(stage);
  document.addEventListener("visibilitychange", () => hold("tab", document.hidden));

  // ---- the icons' words: shown above the icon on hover and keyboard
  //      focus (home/06); Esc hides them without moving the pointer or
  //      the focus, and they come back once the pointer or focus leaves
  //      (WCAG 1.4.13) ----
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") ctls.querySelectorAll("button").forEach((b) => { if (b.matches(":hover, :focus-visible")) b.classList.add("tip-off"); });
  });
  ctls.addEventListener("mouseout", (e) => { const b = e.target.closest("button"); if (b && !b.contains(e.relatedTarget)) b.classList.remove("tip-off"); });
  ctls.addEventListener("focusout", (e) => { const b = e.target.closest("button"); if (b) b.classList.remove("tip-off"); });

  // ---- the sound (THE SOUND, above) ----
  let soundOn = false, actx = null, sleepTimer = 0;
  const sndLabel = () => {
    snd.setAttribute("aria-pressed", String(soundOn));
    snd.classList.toggle("is-set", soundOn); // sound on: its switch stays drawn (condition 3)
    // a speaker struck through (off) or with two waves (on); the word
    // "Sound" names the toggle, its state is `aria-pressed`
    snd.innerHTML = (soundOn
      ? '<svg viewBox="0 0 14 12" aria-hidden="true" focusable="false"><path d="M1 4h2.5L7 1v10L3.5 8H1z"/><path class="w" d="M9 3.6a3.4 3.4 0 0 1 0 4.8M10.8 1.8a6 6 0 0 1 0 8.4"/></svg>'
      : '<svg viewBox="0 0 14 12" aria-hidden="true" focusable="false"><path d="M1 4h2.5L7 1v10L3.5 8H1z"/><path class="w" d="M9 3.5l4 5M13 3.5l-4 5"/></svg>') +
      `<span class="lantern-word"><span>Sound</span><span aria-hidden="true">${soundOn ? "on" : "off"}</span></span>`;
  };
  const sleepSoon = () => { clearTimeout(sleepTimer); sleepTimer = setTimeout(() => { if (actx && actx.state === "running") actx.suspend(); }, SLEEP); };
  snd.addEventListener("click", () => {
    soundOn = !soundOn;
    sndLabel();
    if (!soundOn) { clearTimeout(sleepTimer); if (actx) actx.suspend(); return; }
    if (!actx) { // made inside the press, so every browser lets it play
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      actx = new AC();
    }
    actx.resume().then(sleepSoon);
    if (!window.StrigoiLanternSound && !document.getElementById("lantern-sound-js")) {
      const sc = document.createElement("script");
      sc.id = "lantern-sound-js";
      sc.src = LANTERN_SOUND_SRC;
      document.head.append(sc);
    }
  });
  // on every step; it plays only once the visitor has turned it on
  function sound(moving) {
    if (!soundOn || !actx || !window.StrigoiLanternSound) return;
    clearTimeout(sleepTimer);
    const fire = () => { window.StrigoiLanternSound.play(actx, moving ? (TRAVEL * SEAT) / 1000 : 0, !moving); sleepSoon(); };
    if (actx.state === "running") fire(); else actx.resume().then(fire);
  }

  // ---- the mode: moving (1280px and wider, motion allowed) or still ----
  const apply = () => {
    const i = idx(cur);
    wrap.classList.toggle("lantern-still", still());
    ctls.hidden = !WIDE.matches; // below 1280px: no Pause, no Sound
    play.hidden = still(); // reduced motion: nothing to pause
    layout();
    land(i);
    label();
    schedule(false);
  };
  WIDE.addEventListener("change", apply);
  RMQ.addEventListener("change", () => { playing = !RMQ.matches; apply(); });
  let caseW = 0;
  new ResizeObserver(() => {
    if (caseEl.clientWidth === caseW) return;
    caseW = caseEl.clientWidth;
    layout();
    land(idx(cur));
  }).observe(caseEl);

  // ---- start: the day's piece (THE DAY'S FIRST PIECE), in the box, at
  //      rest, without an announcement. `Date.parse` reads a bare
  //      "YYYY-MM-DD" as UTC midnight, so the count is whole days ----
  const dayCount = Math.round(Date.parse(dayKey()) / 86400000);
  cur = n + (dayCount % n);
  sndLabel();
  wrap.classList.add("js-lantern");
  apply();
  caseW = caseEl.clientWidth;
};

// --- 2. GALLERY GRID RENDERING (archive) ---
// WHAT IT DOES: draws the archive: one square per photograph, 1,615
// of them, newest first (#0 is July 2023, #1614 February 2017), each
// opening the lightbox (§3) on a click, Enter or Space.
// HOW: `fetch` (the browser's network request, answered later, hence
// the `.then` chain) reads ../manifest/manifest.json: per photo its
// `order_index`, file name, time stamp and caption (358 have one).
// It is sorted by `order_index` anyway (the file is already in that
// order) and handed to renderGrid.
// SCOPE: only the gallery page has #grid; elsewhere it returns at
// once. The photos come from ../originals/, which is not in the
// repository (private, .gitignore). `fetch` is refused on `file://`,
// so the error message names the fix: serve the folder over http.
// CHOICE, a JSON file read at load and not 1,615 cells written in the
// HTML: the gallery is re-ordered or re-captioned in one data file.
// `manifest` and `currentIndex` below are shared with §3.
let manifest = [];
let currentIndex = 0;

const initGalleryGrid = () => {
  const grid = document.getElementById("grid");
  if (!grid) return; // not the gallery page — nothing to do here

  const BASE = "../originals/";

  fetch("../manifest/manifest.json")
    .then((r) => r.json())
    .then((data) => {
      manifest = data.sort((a, b) => a.order_index - b.order_index);
      renderGrid(grid, BASE);
    })
    .catch((err) => {
      // In `--bone`, the site's text ink (tokens/02), not a hex.
      grid.innerHTML =
        '<p style="padding:40px;color:var(--bone);grid-column:1/-1;">Could not load manifest.json — open this page via a local server, not file:// directly (fetch() is blocked on file:// in most browsers). Try: python3 -m http.server, then open the gallery page from http://localhost:8000/</p>';
      console.error(err);
    });
};

// Writes the grid in one pass: the whole list becomes one HTML string,
// set once with `innerHTML`, then a click listener goes on each cell
// (a string can't carry listeners short of inline `onclick=`).
// CHOICE, one string and not a node appended per photo: the recorded
// reason is fewer layout passes for 1,615 cells; not measured.
// Captions are untrusted text, so each goes through escapeHtml first.
// A CELL: a <button>, so Enter and Space open it with no key code of
// its own. Its name is "Photograph {n}, {alt}" (the hidden span, then
// the photo's `alt`: at most 80 characters of the caption; the badge
// and veil are `aria-hidden`), n being the badge's and the HUD's
// number, so a sighted and a listening visitor say the same one. An
// uncaptioned photo is "Photograph 12".
// ACCESSIBILITY: the whole grid is ONE Tab stop (a roving tabindex):
// one cell has tabindex 0, the first at load, then whichever was last
// focused, so Shift+Tab back from the footer returns to that photo.
// The arrow keys, Home and End move inside it (initGridKeys below).
// CHOICE, one stop and not 1,615: with a stop per photo the footer is
// 1,616 presses away (docs/DECISIONS.md, "THE GALLERY'S PHOTOGRAPHS
// BECOME ONE TAB STOP", A).
const renderGrid = (grid, BASE) => {
  grid.innerHTML = manifest
    .map(
      (item, i) => `
      <button type="button" class="cell" data-index="${i}" tabindex="${i === 0 ? 0 : -1}">
        <span class="sr-only">Photograph ${item.order_index}${item.caption ? "," : ""}</span>
        <span class="idx-badge" aria-hidden="true">#${item.order_index}</span>
        <img src="${BASE}${item.filename}" loading="lazy" alt="${escapeHtml(item.caption).slice(0, 80)}" />
        <span class="hover-veil" aria-hidden="true">${item.caption ? escapeHtml(truncate(item.caption, 60)) : "View"}</span>
      </button>
    `,
    )
    .join("");
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", () => openLightbox(parseInt(cell.dataset.index, 10)));
  });
  // The group, named with the count ("The archive, 1,615 photographs")
  // and described by the hint, which is un-hidden only now: over an
  // empty or failed grid there is nothing for it to teach.
  grid.setAttribute("role", "group");
  grid.setAttribute("aria-label", `The archive, ${manifest.length.toLocaleString("en")} photographs`);
  const hint = document.getElementById("grid-hint");
  if (hint) {
    hint.hidden = false;
    grid.setAttribute("aria-describedby", "grid-hint");
  }
  initGridKeys(grid);
};

// Moves the grid's one Tab stop to cell `i` and focuses it. HOW:
// focus with `preventScroll`, then `scrollIntoView` with
// `block: "nearest"` and `behavior: "instant"`: the page's smooth
// scroll (tokens.css) would queue one glide per press behind a held
// arrow key, and focus would run ahead of the screen. The cells'
// `scroll-margin` (gallery/02) keeps the ring whole at the edge.
// Also what the lightbox calls on close (SECTION 3). The cell becomes
// the Tab stop through the grid's `focusin` (initGridKeys).
const focusCell = (i) => {
  const cell = document.querySelectorAll(".cell")[i];
  if (!cell) return;
  cell.focus({ preventScroll: true });
  cell.scrollIntoView({ block: "nearest", behavior: "instant" });
};

// The keys inside the grid: one listener on #grid, not 1,615.
// ← → the previous/next photo in reading order (← at a row's start
// goes to the end of the row above), ↑ ↓ the same column one row
// up/down, Home the first photo, End the last. At an edge nothing
// moves: ↑ in the first row, ↓ where no cell sits below (the last
// row can be short: 1,615 = 3 × 538 + 1), ← on the first, → on the
// last. The column count is read from the grid's computed columns,
// so a breakpoint that changes them stays right. `preventDefault` on
// these six keys only, so they don't also scroll the page; Tab,
// Enter and Space keep their own behaviour, and so does any of the
// six with Alt, Ctrl or ⌘ held (Alt+← is the browser's Back).
// Any focus on a cell, a click's included, makes it the Tab stop
// (`focusin`), so the stop is always the photo last touched.
const initGridKeys = (grid) => {
  grid.addEventListener("focusin", (e) => {
    const cell = e.target.closest(".cell");
    if (!cell || cell.tabIndex === 0) return;
    grid.querySelectorAll('.cell[tabindex="0"]').forEach((c) => (c.tabIndex = -1));
    cell.tabIndex = 0;
  });
  grid.addEventListener("keydown", (e) => {
    const cell = e.target.closest(".cell");
    if (!cell || e.altKey || e.ctrlKey || e.metaKey) return;
    const last = manifest.length - 1;
    const i = parseInt(cell.dataset.index, 10);
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    const to = {
      ArrowLeft: i - 1,
      ArrowRight: i + 1,
      ArrowUp: i - cols,
      ArrowDown: i + cols,
      Home: 0,
      End: last,
    }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    if (to < 0 || to > last || to === i) return; // an edge: no move
    focusCell(to);
  });
};

const truncate = (s, n) => (s.length > n ? s.slice(0, n) + "…" : s);

// Escapes the five characters HTML reads as markup (& < > " ') before a
// caption goes into renderGrid's string: the captions are Instagram
// text, untrusted, and a `<` in one would otherwise become markup.
// CHOICE, five replacements and not a sanitiser library: the input is
// one data file, text only, never a live form.
const escapeHtml = (s) =>
  (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// --- 3. LIGHTBOX OPEN/CLOSE/NAV (archive) ---
// WHAT IT DOES: shows one photograph full screen over the grid. Each
// photo gets its time stamp burned into its corner (the HUD, #lb-hud)
// and, if it has one, its caption on a line beneath (#lb-caption-line).
// × (or Esc, or a click on the dark backdrop) closes it; ‹ › (or the
// ← → keys) step to the previous or next photo, wrapping at both ends.
// HOW: the viewer is one element in the page (#lightbox), hidden until
// `.open` is added (gallery/03). Opening sets `currentIndex`; every
// change goes through updateLightbox, which rewrites the photo, the
// HUD, the caption line and the dialog's name. No DOM is built per
// photo.
// SCOPE: the gallery page's #lightbox only; initLightboxControls
// returns at once where there is none.
// A DIALOG: the markup is role="dialog" aria-modal="true", named
// "Photograph {n}" on every update. On open, everything else in
// <body> becomes `inert` (no focus, no clicks, not read), and focus
// moves onto the dialog itself (tabindex -1), so a screen reader
// says "Photograph 75, dialog" and the caption; the next Tab reaches
// ×. On close, `inert` comes off and focus goes to the grid cell of
// the photo on screen at that moment: the opening cell if the
// visitor didn't move, #9 if they went from #3 to #9, because #9 is
// what they were looking at.
// SCROLLING: `inert` stops focus and clicks, not scrolling; the page
// behind is held still by gallery/03's `:root:has(.lightbox.open)`
// (overflow hidden), which lifts when `.open` comes off, before
// focusCell scrolls.
// CHOICE, `inert` on a <div> and not a native <dialog> with
// showModal(): a <dialog> brings its own margin, border, padding,
// size limits and ::backdrop, each to be undone to keep the open
// viewer as it was; `inert` changes nothing on screen.
const lightboxOutside = () =>
  [...document.body.children].filter((el) => el.id !== "lightbox" && el.tagName !== "SCRIPT");

const openLightbox = (i) => {
  const lb = document.getElementById("lightbox");
  currentIndex = i;
  updateLightbox();
  lightboxOutside().forEach((el) => (el.inert = true));
  lb.classList.add("open");
  lb.focus({ preventScroll: true });
};

const closeLightbox = () => {
  const lb = document.getElementById("lightbox");
  if (!lb || !lb.classList.contains("open")) return;
  lb.classList.remove("open");
  const live = document.getElementById("lb-live");
  if (live) live.textContent = "";
  lightboxOutside().forEach((el) => (el.inert = false));
  focusCell(currentIndex);
};

// The HUD's damage: two characters of the time stamp swapped for block
// glyphs (▓ ▒), as scanline damage on a worn tape (docs/SHOP-TEMPLATE.md
// §7.6). Only letters and digits are damaged, never spaces or `·/:#`.
const GLITCH_CHARS = ["▓", "▒"]; // U+2593, U+2592
const isGlitchable = (c) => /[A-Za-z0-9]/.test(c);

// Picks the positions from `seed`, the photo's `order_index`, so a photo
// is damaged the same way each time it is shown: "a real damaged tape
// doesn't re-damage itself differently each playback" (§7.6). The
// picks index the stamp's own letters and digits; the stamp reads the
// same for every visitor (updateLightbox), so the damage does too.
// When the two picks land on the same character only one is damaged
// (10 of 1,615).
const glitchPositions = (str, seed) => {
  const candidates = [...str].map((c, i) => i).filter((i) => isGlitchable(str[i]));
  const a = candidates[seed % candidates.length];
  const b = candidates[(seed * 7 + 13) % candidates.length];
  return a === b ? [a] : [a, b];
};

// The HUD's HTML: the clean stamp with the picked characters swapped
// for a `.lb-hud-glitch` span (styled in gallery/03), every other
// character escaped.
const buildHud = (clean, seed) => {
  const positions = glitchPositions(clean, seed);
  return [...clean]
    .map((c, i) => {
      const gi = positions.indexOf(i);
      if (gi === -1) return escapeHtml(c);
      return `<span class="lb-hud-glitch">${GLITCH_CHARS[gi % GLITCH_CHARS.length]}</span>`;
    })
    .join("");
};

// Shows photo `currentIndex`: the one function open and every step go
// through. It sets the photo's source, the caption line's text (empty
// when there is none, which hides the line, gallery/03), the HUD and
// the dialog's name, "Photograph {n}". `#lb-img` keeps an empty `alt`:
// the name and the caption line (the dialog's description) say it.
// THE STAMP: "12:29 AM · JUL 09 2023 · #0000/1615", the post's time,
// its place in the order and the total, after the camcorder stamp on
// the found tape she chose as a reference ("AM 3:40 / OCT 12 1980",
// docs/SHOP-TEMPLATE.md §7). Read in Bucharest time, where the
// archive's owner posted (summer and winter time as there), with the
// month in US English upper-case, whatever the visitor's zone and
// language: a camcorder burns its stamp in once, in its owner's clock
// (docs/DECISIONS.md, THE LIGHTBOX STAMP IS BURNED IN ONCE). No zone
// is shown, as on the reference. The number is 0-based and the total
// a count, so the last photo is #1614/1615.
// CHOICE, `Intl.DateTimeFormat` and `padStart`, no date library: not
// a library for one string (the recorded reason). `hourCycle: "h12"`
// gives 12, not 0, for the hour after midnight.
const STAMP_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Bucharest",
  hourCycle: "h12",
  hour: "numeric",
  minute: "2-digit",
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const updateLightbox = () => {
  const BASE = "../originals/";
  const item = manifest[currentIndex];
  document.getElementById("lb-img").src = BASE + item.filename;

  document.getElementById("lb-caption-line").textContent = item.caption || "";

  const p = Object.fromEntries(
    STAMP_PARTS.formatToParts(new Date(item.timestamp * 1000)).map((x) => [x.type, x.value]),
  );
  const idx = String(item.order_index).padStart(4, "0");
  const clean = `${p.hour}:${p.minute} ${p.dayPeriod.toUpperCase()} · ${p.month.toUpperCase()} ${p.day} ${p.year} · #${idx}/${manifest.length}`;
  document.getElementById("lb-hud").innerHTML = buildHud(clean, item.order_index);
  document.getElementById("lightbox").setAttribute("aria-label", `Photograph ${item.order_index}`);
};

// Steps `currentIndex` by ±1, wrapping at both ends: ‹ on #0 shows
// #1614. `+ manifest.length` keeps the index positive before the `%`
// (JavaScript's `%` keeps the sign of the left side: -1 % 1615 is -1).
// The live line then says "Photograph 76 of 1,615" (polite): focus
// doesn't move, so nothing else would tell a listener the photo
// changed. Not on open, where the dialog's own name is read.
// CHOICE, wrap and not stop at the ends: reason not recorded.
const navLightbox = (delta) => {
  currentIndex = (currentIndex + delta + manifest.length) % manifest.length;
  updateLightbox();
  const live = document.getElementById("lb-live");
  if (live) live.textContent = `Photograph ${manifest[currentIndex].order_index} of ${manifest.length.toLocaleString("en")}`;
};

// Wires every way to work the open viewer: ×, ‹, ›, a click on the
// backdrop, and the keys Esc, ← and →.
// The backdrop click checks `e.target.id === "lightbox"`: the backdrop
// is the dialog element itself, so a click on the photo or the
// caption, which bubbles up to it, has another target and doesn't
// close it.
// One keydown listener on the document, bound once and checking
// `.open`, not bound on each open and removed on each close.
// Unlike the grid (§2), the keys don't check where focus is: ← and →
// step even with focus on ×.
// THE TRAP: Tab and Shift+Tab go round ×, ‹, › and never leave
// (Shift+Tab from × goes to ›; from the dialog itself, Tab goes to ×
// and Shift+Tab to ›). The page behind is `inert` already, but with
// nothing else focusable Tab would leave for the browser's own
// toolbar, so the three are cycled here.
const initLightboxControls = () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return; // not the gallery page — nothing to do here

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", () => navLightbox(-1));
  document.getElementById("lb-next").addEventListener("click", () => navLightbox(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  const controls = ["lb-close", "lb-prev", "lb-next"].map((id) => document.getElementById(id));
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navLightbox(-1);
    if (e.key === "ArrowRight") navLightbox(1);
    if (e.key === "Tab") {
      e.preventDefault();
      const at = controls.indexOf(document.activeElement); // -1: the dialog itself
      const step = e.shiftKey ? -1 : 1;
      const to = at === -1 ? (e.shiftKey ? controls.length - 1 : 0) : (at + step + controls.length) % controls.length;
      controls[to].focus();
    }
  });
};

// --- 4. THE SÉANCE: PRODUCT-DETAIL HOLD-TO-REVEAL (a piece's page) ---
// WHAT IT DOES: summons a piece's words (shop/01). A press shows them
// while it lasts; a click, a tap, Enter or Space shows them until the
// next one. The first summon spends that piece's hint.
// HOW: two classes on the stage. `.holding` is momentary: added on
// mousedown, or after a touch held still for 500ms, and removed on
// release (or when the mouse leaves the stage). `.revealed` is the
// toggle, mirrored in `aria-pressed`, so a screen reader hears the
// state that lasts (§11.6.2). Releasing a press removes `.holding`
// only; the toggle comes from the separate click, tap and key paths.
// A touch is timed: released within 350ms and moved under 10px, it is
// a tap and toggles; still down at 500ms, it holds, like a mouse
// press. The spec's reason for the tap path: a touch browser's own
// long-press menu can take a pure hold away (§11.6.1). A mouse press
// is timed too: released still within 500ms (HOLD_MIN_MS), it is a
// click and toggles; held longer, it was a hold and ends unsummoned
// (§11.3: a hold alone leaves nothing).
// The stage ships `disabled`, without `aria-pressed` or
// `aria-describedby`; this sets both and enables it, last (below):
// a toggle that tells you to hold exists only once the script does.
// SCOPE: every `button.stage` on the page, in every skin: on a piece's
// page, its one stage (shops/demo/pieces/<slug>/). On a page without
// one it returns at once. `button.stage` and not `.stage`: the shop's
// cards keep the stage's frame as a <div class="stage"> inside a link
// (shop/07, her P1 = direction 1, 2026-10-15), and a link is not to be
// wired to summon; selecting the element keeps them out with no new
// class.
const TAP_MAX_MS = 350;
const HOLD_MIN_MS = 500;
const DRAG_TOLERANCE_PX = 10;
// how long after a handled touch its compatibility mouse events are
// ignored: Chromium fires them at once; a browser with a tap delay
// fires them up to ~300ms later. The cost, on a device with both a
// touch screen and a mouse: a mouse press within 1s of a tap on the
// same stage is ignored.
const COMPAT_MOUSE_MS = 1000;

const initSeanceStages = () => {
  const stages = document.querySelectorAll("button.stage");
  if (!stages.length) return; // no Séance stage on this page

  stages.forEach((stage) => {
    const hint = stage.querySelector(".hint");

    const spendHint = () => {
      if (hint) hint.classList.add("spent");
    };

    const startHold = () => {
      stage.classList.add("holding");
      spendHint();
    };
    const endHold = () => stage.classList.remove("holding");

    const toggleRevealed = () => {
      const next = !stage.classList.contains("revealed");
      stage.classList.toggle("revealed", next);
      stage.setAttribute("aria-pressed", String(next));
      spendHint();
    };

    // Mouse: a press adds `.holding`; on release, a press that didn't
    // move and was let go within HOLD_MIN_MS also toggles (a click);
    // one that moved, or was held longer, doesn't. Leaving the stage
    // releases. The click is the spec's motor-accessibility path
    // (§11.6.1). The cost: a click held 500ms or more, as a slow or
    // unsteady hand may, shows the words only while held; Enter and
    // Space toggle at any speed. 500ms is a touch's hold threshold, so
    // a mouse and a finger call a press a hold at the same point. A
    // touch's compatibility events (below) come as a pair on release,
    // so they always read as a click.
    let mouseMoved = false;
    let mouseDownAt = 0;
    // set by the touchend handler below; see the touch comment there
    let touchHandledAt = -Infinity;
    const isCompatMouse = (e) => e.timeStamp - touchHandledAt < COMPAT_MOUSE_MS;
    stage.addEventListener("mousedown", (e) => {
      if (isCompatMouse(e)) return;
      mouseMoved = false;
      mouseDownAt = e.timeStamp;
      startHold();
    });
    stage.addEventListener("mousemove", () => {
      if (stage.classList.contains("holding")) mouseMoved = true;
    });
    stage.addEventListener("mouseup", (e) => {
      if (isCompatMouse(e)) return;
      endHold();
      if (!mouseMoved && e.timeStamp - mouseDownAt < HOLD_MIN_MS) toggleRevealed();
    });
    stage.addEventListener("mouseleave", endHold);

    // Touch: tap (short + still) toggles, long-press holds.
    // After a touch, the browser also fires compatibility mouse events
    // (mousedown, mouseup, click) for the same contact. When the
    // touchend handler below has already acted on that touch (a tap
    // toggled, or a hold was released), it stamps `touchHandledAt`,
    // and the mouse handlers above skip anything within
    // COMPAT_MOUSE_MS of it. WHAT WOULD BREAK: without it the mouseup
    // toggles `.revealed` a second time: a tap summons and dismisses at
    // once, and a released long press stays summoned. They are
    // ignored, not cancelled with `preventDefault()`, so the browser's
    // own mousedown still focuses the stage (a focus call from script
    // would also draw the focus ring after a tap; measured, none now).
    // A touch the handler doesn't act on (held 350–500ms) isn't
    // stamped, so the mouse handlers toggle it once (420ms: summoned).
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchMovedPastTolerance = false;
    let longPressTimer = null;

    stage.addEventListener(
      "touchstart",
      (e) => {
        const t = e.changedTouches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchStartTime = Date.now();
        touchMovedPastTolerance = false;
        longPressTimer = setTimeout(() => {
          if (!touchMovedPastTolerance) startHold();
        }, HOLD_MIN_MS);
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchmove",
      (e) => {
        const t = e.changedTouches[0];
        const dx = Math.abs(t.clientX - touchStartX);
        const dy = Math.abs(t.clientY - touchStartY);
        if (dx > DRAG_TOLERANCE_PX || dy > DRAG_TOLERANCE_PX) {
          touchMovedPastTolerance = true;
        }
      },
      { passive: true }
    );

    stage.addEventListener("touchend", (e) => {
      clearTimeout(longPressTimer);
      const elapsed = Date.now() - touchStartTime;
      if (stage.classList.contains("holding")) {
        endHold(); // was a long-press hold; release it, no toggle
        touchHandledAt = e.timeStamp;
        return;
      }
      if (elapsed < TAP_MAX_MS && !touchMovedPastTolerance) {
        toggleRevealed(); // short tap → persistent toggle
        touchHandledAt = e.timeStamp;
      }
    });

    stage.addEventListener("touchcancel", () => {
      clearTimeout(longPressTimer);
      endHold();
    });

    // Keyboard: Enter or Space on the native <button> fires a `click`
    // with `detail` 0 (no mouseup comes with it), so this listener
    // toggles on those alone; a mouse click (`detail` 1 or more) was
    // already handled by mouseup. The end state is the tap's
    // (§11.6.2).
    stage.addEventListener("click", (e) => {
      if (e.detail !== 0) return;
      toggleRevealed();
    });

    // Enabled last, once the listeners above are attached: the markup
    // ships the stage `disabled`, with no `aria-pressed` and no
    // description, so with the script off it is no Tab stop and tells
    // no one to hold (docs/DECISIONS.md, "THE DEMO SHOP: THE SWITCHER
    // KEEPS TO THE ARROWS"). The description is the span with an id
    // inside this stage's hint; a stage with no hint gets none.
    stage.setAttribute("aria-pressed", "false");
    const hintWords = hint && hint.querySelector("[id]");
    if (hintWords) stage.setAttribute("aria-describedby", hintWords.id);
    stage.disabled = false;
  });
};

// --- 4a. THE SÉANCE'S SUMMON, ON THE SHOP (shop/08) ---
// WHAT IT DOES: wires the shop's `button.summon`, one per piece, the
// hint at the top of each photo (her option, 2026-10-16). A click, a
// tap, Enter or Space toggles `aria-pressed`, and shop/08 paints the
// piece's name, quote and facts at the photo's foot; a longer press
// shows them only while it lasts, as on a piece's page (§4), so "hold
// to summon" stays true. Four things the piece page's stage doesn't
// do, because on the shop the hint is the only way in (spec
// sketches/shop-seance-summon/seance-summon-spec.md §9):
//   - Escape, on the focused button, sends the words back;
//   - summoning one piece sends any other back (one at a time);
//   - a dismiss brings the hint back (no `.spent`; her S3);
//   - summoned, a press on the photo sends the words back instead of
//     opening the page (her ruling, 2026-10-17; WHILE SUMMONED below).
// HOW: §4's timing, the same constants: a mouse press released within
// HOLD_MIN_MS and moved under DRAG_TOLERANCE_PX is a click; held
// longer, it is a hold and ends unsummoned. A touch released within
// TAP_MAX_MS and moved under the tolerance is a tap; still down at
// HOLD_MIN_MS, it holds. A touch's compatibility mouse events are
// skipped for COMPAT_MOUSE_MS, as in §4 (the same reason). Enter and
// Space fire a `click` with `detail` 0, which toggles. A real mouse
// click (`detail` 1+) was already decided on mouseup, so the click
// listener ignores it.
// The long-press menu is suppressed on the button only (a touch's
// `contextmenu`), so a hold isn't taken by the browser.
// WHILE SUMMONED, A CLICK ON THE PHOTO SENDS THE WORDS BACK: a pointer
// click or tap anywhere on that piece's link (its photo) dismisses the
// summon instead of opening the page (`preventDefault` on that click
// only), and the hint returns; with nothing summoned there, the next
// click opens the page. Her ruling, 2026-10-17, on the PM's offer:
// "while the facts are summoned, a click anywhere on that photo sends
// them back; the piece page opens only when nothing is summoned there"
// — "1. I agree with you." (docs/DECISIONS.md, the Séance-summon entry,
// item 6). Why (QA t_e50f1bed's note): summoned, the
// hint hides, so a second click where it was landed on the link and
// opened the page; someone toggling left the shop by accident.
// Pointer only: the click must follow a `pointerdown` on this link and
// carry `detail` 1+. Enter on the link (`detail` 0) and a screen
// reader's activation (no pointerdown) always open the page, as
// before; a click with Ctrl/Meta/Shift/Alt (a new tab or window) is
// left to the browser. A pointer click on another piece's photo opens
// that page, as before, and sends any summoned piece back first, so
// the shop is clean if the visitor comes back (bfcache keeps the DOM).
// A hold never reaches the link: it is on the button, and a mouse
// released off the button clicks neither. A tap on the hint ends with
// a compatibility click that Chromium sends to the link (the hint's
// target has gone by then): the link skips it with the button's guard
// (COMPAT_MOUSE_MS), so a tap summons and stays on the shop (at
// 7c78830 it summoned and opened the page).
// The button ships `hidden`; this unhides it, last, once its
// listeners are on: with the script off the shop is its links alone,
// each described by its facts (shop/07, shop/08).
// SCOPE: the shop's `button.summon`s, in every skin; Dossier and
// Transmission hide them (shop/08), so nothing there can press one. On
// a page without one it returns at once.
const initShopSummons = () => {
  const summons = [...document.querySelectorAll("button.summon")];
  if (!summons.length) return; // not the shop

  const setPressed = (button, on) => {
    if (on) {
      summons.forEach((other) => {
        if (other !== button) other.setAttribute("aria-pressed", "false");
      });
    }
    button.setAttribute("aria-pressed", String(on));
  };
  const isPressed = (button) => button.getAttribute("aria-pressed") === "true";
  const toggle = (button) => setPressed(button, !isPressed(button));

  summons.forEach((button) => {
    // A hold paints the words while it lasts; only an unpressed piece
    // can be held (a press on summoned words is a click that dismisses).
    const startHold = () => {
      if (!isPressed(button)) button.classList.add("holding");
    };
    const endHold = () => button.classList.remove("holding");

    // Mouse.
    let mouseDownAt = 0;
    let mouseX = 0;
    let mouseY = 0;
    let mouseMoved = false;
    let touchHandledAt = -Infinity;
    const isCompatMouse = (e) => e.timeStamp - touchHandledAt < COMPAT_MOUSE_MS;
    button.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || isCompatMouse(e)) return;
      mouseDownAt = e.timeStamp;
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseMoved = false;
      startHold();
    });
    button.addEventListener("mousemove", (e) => {
      if (!mouseDownAt) return;
      if (Math.abs(e.clientX - mouseX) > DRAG_TOLERANCE_PX || Math.abs(e.clientY - mouseY) > DRAG_TOLERANCE_PX) {
        mouseMoved = true;
      }
    });
    button.addEventListener("mouseup", (e) => {
      if (!mouseDownAt || isCompatMouse(e)) return;
      const quick = !mouseMoved && e.timeStamp - mouseDownAt < HOLD_MIN_MS;
      mouseDownAt = 0;
      endHold();
      if (quick) toggle(button); // a click; a hold ends unsummoned
    });
    button.addEventListener("mouseleave", () => {
      mouseDownAt = 0;
      endHold();
    });

    // Touch: §4's paths.
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchMoved = false;
    let longPressTimer = null;
    button.addEventListener(
      "touchstart",
      (e) => {
        const t = e.changedTouches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchStartTime = Date.now();
        touchMoved = false;
        longPressTimer = setTimeout(() => {
          if (!touchMoved) startHold();
        }, HOLD_MIN_MS);
      },
      { passive: true }
    );
    button.addEventListener(
      "touchmove",
      (e) => {
        const t = e.changedTouches[0];
        if (Math.abs(t.clientX - touchStartX) > DRAG_TOLERANCE_PX || Math.abs(t.clientY - touchStartY) > DRAG_TOLERANCE_PX) {
          touchMoved = true;
        }
      },
      { passive: true }
    );
    button.addEventListener("touchend", (e) => {
      clearTimeout(longPressTimer);
      if (button.classList.contains("holding")) {
        endHold(); // a long press; released, no toggle
        touchHandledAt = e.timeStamp;
        return;
      }
      if (Date.now() - touchStartTime < TAP_MAX_MS && !touchMoved) {
        toggle(button); // a tap
        touchHandledAt = e.timeStamp;
      }
    });
    button.addEventListener("touchcancel", () => {
      clearTimeout(longPressTimer);
      endHold();
    });
    button.addEventListener("contextmenu", (e) => {
      if (e.pointerType && e.pointerType !== "mouse") e.preventDefault();
    });

    // Keyboard: Enter and Space (a `click` with `detail` 0); Escape.
    button.addEventListener("click", (e) => {
      if (e.detail !== 0) return;
      toggle(button);
    });
    button.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isPressed(button)) {
        setPressed(button, false);
        e.preventDefault();
      }
    });

    // The photo (the link, the button's next sibling): summoned, a
    // pointer click sends the words back instead of opening the page
    // (her ruling, 2026-10-17; see WHILE SUMMONED above).
    const link = button.parentElement.querySelector("a.product-card-link");
    if (link) {
      let pointerDown = false;
      link.addEventListener("pointerdown", (e) => {
        pointerDown = e.isPrimary && e.button === 0;
      });
      link.addEventListener("click", (e) => {
        const byPointer = pointerDown && e.detail > 0;
        const compat = !pointerDown && isCompatMouse(e);
        pointerDown = false;
        // A tap on the hint: the button toggled on touchend, its target
        // went (`pointer-events: none`), and the tap's compatibility
        // click then lands here, on the link, though the press began on
        // the button. It is the tap's, already handled: skip it, as §4
        // and the button skip theirs. (A new press on the photo starts
        // here, so it is never taken for one.)
        if (compat) {
          e.preventDefault();
          return;
        }
        if (!byPointer || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; // keys, a new tab: as before
        if (isPressed(button)) {
          e.preventDefault(); // this click only: the next one opens the page
          setPressed(button, false);
          return;
        }
        summons.forEach((b) => setPressed(b, false)); // leaving: nothing left summoned
      });
    }

    button.hidden = false; // last: it can work now
  });
};

// --- 4b. THE STRIP OF PHOTOS (a piece's page, product/05) ---
// The spec: sketches/product-strip/README.md §1-§2 (uiux t_6c2f42a9,
// fcfe3c0); her words, 2026-10-20: "left-right arrows for the keyboard
// users, lateral scroll for the mouse users if that's possible, and
// swipe left and right for the touchscreen users", then "OK to the
// strip for Strigoi." The sketch's strip.js was the working reference.
// WHAT IT DOES: on a piece with two or more photos (up to 8, then up to
// 2 videos), showing a thumbnail puts its photo in the stage, whole:
// the <img> under the stage takes its file, its alt, its width and
// height; the stage's two colour-split copies take it as `--photo`;
// `aria-pressed` moves to that thumbnail; the Dossier's "EVIDENCE
// 0k/0n" and the Transmission's "FRAME 00k" count it (videos too). A
// summoned description stays summoned (§11.7 item 2): nothing here
// touches `.revealed`.
// The frame takes the shape of the photo shown (product/02). HER WORDS,
// 2026-10-31, on the Cord Cowl Sweater's 4:5 photos letterboxed in its
// first, near-square one's frame: "can the photo's container (?) in the
// product page be adapted to the size of the photo? The empty space
// around the image looks bad in my opinion (e.g. in the screenshot is
// visible the lateral empty space)" (frontend t_960cca6a). So showing a
// photo writes its `data-w / data-h` as `--shown` on `.piece-stage`;
// the frame keeps its height and its left edge and takes that width,
// eased 180ms by product/02 while `.is-reshaping` is set (none with
// reduced motion). `--room` (`fit`, below) is how wide it may go: from
// the stage's left edge to main's right padding, so a wide photo beside
// a tall first one runs on to the right and, past that, gets shorter at
// its own shape (product/02). The stage's width (the first photo's), so
// the Details column, never moves. (Was: the frame kept the first
// photo's shape and another shape got `.is-letterboxed`, shown whole on
// the frame's ground; product/05.)
// HOW: each thumbnail is a link to its photo's file (`href`), with
// `data-alt`, `data-w`, `data-h` (the markup's, as the backend's
// product_media will give them); with the script off it is just that,
// a link that opens the photo (product/05). Here each becomes a toggle
// button: `role="button"`, `aria-pressed`, a tabindex, and
// `aria-describedby` pointing at a hidden copy of its photo's alt, so
// arrowing through says what each photo shows ("Photo 3 of 8, toggle
// button, pressed, Close on three pale, pitted bone beads…"). Its name,
// "Photo 3 of 8" (or "Video", "Video 1 of 2"), is the markup's. Not
// tabs, a listbox or radios: those announce their own "3 of 10", which
// would contradict "Photo 3 of 8" once there are videos. A click's
// `preventDefault` keeps the link from being followed.
// `--photo` is written as the file's absolute address: a `url()` in a
// custom property resolves against the sheet that reads it
// (css/shop.css), not this page, and an absolute address resolves the
// same from anywhere.
// A VIDEO (none in the demo yet; the spec's §1.7): its link has
// `data-video` and `data-poster`, `href` is the video's file. Showing
// it puts its poster in the stage, never the video: nothing here plays
// anything. Playing will be a separate, plain "Play" control outside
// the row and outside the stage's hold-to-summon.
// KEYBOARD: ONE Tab stop for the row (a roving tabindex, as §5): the
// shown thumbnail has tabindex 0, the others -1, so Tab enters on the
// shown one and the next Tab leaves the row. Left / Right focus the
// previous / next thumbnail AND show it, stopping at the ends (no wrap:
// the row has ends you can see; §5's three skins wrap, having none);
// Home / End the first / last. Enter or Space shows the focused one
// (already shown; it is there for a screen reader's browse mode, where
// the buttons stay reachable at tabindex -1). Up, Down, PageUp,
// PageDown and Space outside the row are the page's. The arrows'
// default (scrolling the row natively) is cancelled, and the ROW, never
// the page, scrolls the focused thumbnail wholly into view, 30px clear
// of the fade, onto a snap position: `focus({ preventScroll: true })`
// and the row's own `scrollTo`, not `scrollIntoView`, which can move
// the page too.
// THE WHEEL: a vertical wheel over the row turns the row, but only
// while all four hold (the spec's §1.4, a PM decision within her OK):
//   1. the pointer is over the row and the row overflows;
//   2. the wheel is mostly vertical (|deltaY| > |deltaX|), so a
//      trackpad's sideways move stays native and isn't doubled;
//   3. the row can still go that way: at either end the wheel is the
//      page's again (the event is cancelled and this scrolls the page by
//      the same amount, so no notch is lost to the row; see below);
//   4. the page wasn't being scrolled just now: if the last wheel event
//      outside the row was under 400ms ago, the wheel goes on scrolling
//      the page while that gesture lasts, so a page scroll passing over
//      the row isn't caught. A wheel event that can't be cancelled is
//      the page's too (the browser has already scrolled it): nothing
//      moves here, and the clock runs on.
// Ctrl+wheel (zoom) and Shift+wheel (native sideways) are never touched.
// TOUCH, TRACKPAD, SHIFT+WHEEL: native (the row is a scroll container,
// product/05). A swipe turns the row, never the shown photo or the
// page; a tap that ends a swipe is no click (the browser's).
// NO MOUSE DRAG (the spec's §1.5, a PM decision within her OK): the
// scrollbar is the mouse's handle. `dragstart` is cancelled in the row,
// so a link or an image is never dragged out of it.
// THE FADE: `data-more` on the row ("start", "end", "both") says which
// sides can still scroll; product/05 draws a 24px fade there.
// REDUCED MOTION: every scroll asked for here is instant (`behavior:
// "auto"`); otherwise smooth. The photo swap has no transition; the
// frame's change of shape eases 180ms, and not at all with reduced
// motion (product/02's query).
// SCOPE: a piece's page with a `.piece-strip`; elsewhere it returns.
const initPieceStrip = () => {
  const strip = document.querySelector(".piece-strip");
  const photo = document.querySelector(".piece-photo");
  const stage = document.querySelector(".piece-stage button.stage");
  const wrap = document.querySelector(".piece-stage");
  if (!strip || !photo || !stage || !wrap) return; // one photo, or not a piece's page
  const thumbs = [...strip.querySelectorAll(".piece-thumb")];
  if (thumbs.length < 2) return;
  const tag = stage.querySelector(".dossier-frame-tag");
  const frame = stage.querySelector(".transmission-frame-count");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const two = (n) => String(n).padStart(2, "0");
  const still = (b) => b.dataset.poster || b.getAttribute("href"); // a video shows its poster
  const main = wrap.closest("main") || document.body;

  // How wide the frame may go (product/02's `--room`): from the stage's
  // left edge to main's right padding. product/02 never lets it under
  // the stage's own width (the first photo's; on phones, where the pair
  // runs past the window, task 4a's, a wider photo then gets the first
  // one's width and is shorter). Again whenever main or the stage
  // changes size (the window; §4c's growth), after layout and before
  // paint. Writing it changes only the frame and the strip, never the
  // stage's box: no loop.
  const fit = () => {
    const box = wrap.getBoundingClientRect();
    const right = main.getBoundingClientRect().right - (parseFloat(getComputedStyle(main).paddingRight) || 0);
    wrap.style.setProperty("--room", `${right - box.left}px`);
  };
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(fit);
    ro.observe(main);
    ro.observe(wrap);
  } else window.addEventListener("resize", fit);
  fit();

  // Each thumbnail's description: its photo's alt, in a hidden copy.
  const alts = document.createElement("div");
  alts.hidden = true;
  strip.after(alts);
  thumbs.forEach((b, k) => {
    const d = document.createElement("span");
    d.id = `piece-thumb-alt-${k + 1}`;
    d.textContent = b.dataset.alt;
    alts.append(d);
    b.setAttribute("role", "button");
    b.setAttribute("aria-describedby", d.id);
    b.removeAttribute("aria-current"); // the script-off mark; `aria-pressed` says it now
  });

  // Which thumbnail is shown: pressed, and the row's one Tab stop.
  const mark = (k) => {
    thumbs.forEach((b, i) => {
      b.setAttribute("aria-pressed", String(i === k));
      b.tabIndex = i === k ? 0 : -1;
    });
  };

  // The frame takes the shown photo's shape (product/02's `--shown`).
  // A new shape sets `.is-reshaping` for the ease and, once it is over,
  // brings the shown thumbnail into the row's view again: `reveal` read
  // the row's width at the start of the ease, and the row has since
  // narrowed or widened with the photo.
  const RESHAPE_MS = 180; // product/02's ease
  let shown = 0;
  let reshaping;
  const reshape = (shape) => {
    if (wrap.style.getPropertyValue("--shown") === shape) return;
    wrap.classList.add("is-reshaping");
    wrap.style.setProperty("--shown", shape);
    clearTimeout(reshaping);
    reshaping = setTimeout(() => {
      wrap.classList.remove("is-reshaping");
      reveal(shown);
    }, RESHAPE_MS + 40);
  };

  const show = (k) => {
    const b = thumbs[k];
    const src = still(b);
    photo.src = src;
    photo.alt = b.dataset.alt;
    photo.width = Number(b.dataset.w);
    photo.height = Number(b.dataset.h);
    stage.style.setProperty("--photo", `url('${new URL(src, document.baseURI).href}')`);
    mark(k);
    shown = k;
    reshape(`${Number(b.dataset.w)} / ${Number(b.dataset.h)}`);
    if (tag) tag.textContent = `EVIDENCE ${two(k + 1)}/${two(thumbs.length)}`;
    if (frame) frame.textContent = `FRAME ${String(k + 1).padStart(3, "0")}`;
  };

  // Bring thumbnail k wholly into the row's view, 30px clear of the
  // fade; the first and the last take the row to its end. Only the row
  // scrolls (product/05 makes it the thumbnails' offsetParent).
  // The row only rests on a snap position (product/05: snap x proximity,
  // each thumbnail's start, `scroll-padding-inline`), and proximity pulls
  // anything near one onto it. So the row goes to a snap position: going
  // left, the last one at or before "30px clear on the left"; going
  // right, the first one at or after "30px clear on the right" (rounded
  // up, never back into the fade; sign-off t_4a887e97 item 1), or the
  // row's end. The thumbnail then has 30 to 96px on its right, and the
  // next one shows past it.
  const CLEAR = 30;
  const reveal = (k) => {
    const b = thumbs[k];
    const left = b.offsetLeft;
    const right = left + b.offsetWidth;
    const max = strip.scrollWidth - strip.clientWidth;
    const pad = parseFloat(getComputedStyle(strip).scrollPaddingLeft) || 0;
    const snaps = thumbs.map((t) => Math.max(0, Math.min(max, t.offsetLeft - pad)));
    let to = strip.scrollLeft;
    if (left - CLEAR < strip.scrollLeft) {
      to = Math.max(0, ...snaps.filter((s) => s <= left - CLEAR));
    } else if (right + CLEAR > strip.scrollLeft + strip.clientWidth) {
      to = Math.min(max, ...snaps.filter((s) => s >= right + CLEAR - strip.clientWidth));
    }
    if (k === 0) to = 0;
    if (k === thumbs.length - 1) to = max;
    strip.scrollTo({ left: to, behavior: reduce.matches ? "auto" : "smooth" });
  };

  const go = (k) => {
    const to = Math.max(0, Math.min(thumbs.length - 1, k));
    show(to);
    thumbs[to].focus({ preventScroll: true });
    reveal(to);
  };

  // KEYBOARD
  strip.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const i = thumbs.indexOf(document.activeElement);
    if (i < 0) return;
    const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: thumbs.length - 1 }[e.key];
    if (to !== undefined) {
      e.preventDefault();
      go(to);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // Enter would follow the link, Space scroll the page
      go(i);
    }
  });

  // CLICK OR TAP: show, never follow the link.
  thumbs.forEach((b, k) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      show(k);
      reveal(k);
    })
  );

  // NO DRAG
  strip.addEventListener("dragstart", (e) => e.preventDefault());

  // THE WHEEL (guard 4's clock: the last wheel event outside the row)
  let pageWheelAt = -Infinity;
  window.addEventListener(
    "wheel",
    (e) => {
      if (!strip.contains(e.target)) pageWheelAt = performance.now();
    },
    { passive: true }
  );
  strip.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.shiftKey) return; // zoom; native sideways
      const max = strip.scrollWidth - strip.clientWidth;
      if (max <= 1) return; // 1: nothing to turn
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return; // 2: sideways is native
      // 4, a page scroll that brings the row under a still pointer: Chromium
      // has already scrolled the page for this notch, and sends its event
      // here uncancelable. It is the page's: neither the row nor scrollBy
      // may move anything (scrollBy would scroll the page a second time),
      // and the clock runs on so the gesture's next notches stay the page's
      // (QA t_dabe310b items 1-2). A gesture that starts on the row is
      // cancelable from its first notch, so the row still turns.
      if (!e.cancelable) {
        pageWheelAt = performance.now();
        return;
      }
      const passing = performance.now() - pageWheelAt < 400;
      if (passing) pageWheelAt = performance.now(); // 4's clock runs on
      const px = (page) => (e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * page : e.deltaY);
      const dy = px(strip.clientWidth);
      if ((dy < 0 && strip.scrollLeft <= 0) || (dy > 0 && strip.scrollLeft >= max - 1)) {
        // 3: an end, the page's notch (and 4's, at an end). Scrolled here,
        // not left to the browser: when the row's width isn't a whole
        // number (362.25px at 1440 × 900), a scroll to its end reads 168
        // and Chromium's own end is a fraction short of it; an uncancelled
        // notch then goes to the row, 168 -> 167, and the page doesn't
        // move (sign-off t_4a887e97 item 2). "instant": the page's
        // `scroll-behavior: smooth` would ease it, and eased scrollBy
        // calls in a row fall short (5 × 100 went 290). TRADE-OFF: where
        // the browser eases a wheel, these notches jump, as the row's own
        // turns do. An engine without "instant" throws; the notch is then
        // left to the browser, as before. So is a notch the page can't
        // take (already at its top or foot): nothing moves either way, and
        // the browser keeps its own overscroll.
        const doc = document.scrollingElement || document.documentElement;
        if (dy < 0 ? doc.scrollTop <= 0 : doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 1) return;
        try {
          window.scrollBy({ top: px(doc.clientHeight), behavior: "instant" });
        } catch (err) {
          return;
        }
        e.preventDefault();
        return;
      }
      if (passing) return; // 4: the page's scroll, passing over
      e.preventDefault();
      strip.scrollBy({ left: dy, behavior: "auto" });
    },
    { passive: false }
  );

  // THE FADE
  const more = () => {
    const max = strip.scrollWidth - strip.clientWidth;
    const start = strip.scrollLeft > 1;
    const end = strip.scrollLeft < max - 1;
    if (max <= 1) strip.removeAttribute("data-more");
    else strip.dataset.more = start && end ? "both" : start ? "start" : "end";
  };
  strip.addEventListener("scroll", more, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(more).observe(strip);
  else window.addEventListener("resize", more);

  mark(0);
  more();
};

// --- 4c. THE PHOTO GROWS TO MEET THE DETAILS LIST; A LONG LIST
// CONTINUES UNDER BOTH COLUMNS (a piece's page, product/02 and 06) ---
// WHAT IT DOES, above 700px, in this order:
// 1. THE PHOTO GROWS. When the Details list ends below the stage's foot
//    (the strip's; the photo's on a piece of one photo), writes `--grow`
//    on `.piece-stage`: product/02 makes the frame that much taller, and
//    wider by its own shape (no crop, no letterbox), until the stage's
//    foot is level with the list's. Never closer than FOOT_GAP (24px)
//    to the first screen's foot (the window's), so the photo, or its
//    strip, always ends on its own visible edge; and the frame never
//    over 1280px. (Was "never past the first screen's foot", e9d272f:
//    a one-photo piece could end exactly on the window's edge and read
//    as cut off. uiux t_49f38ef3's recommendation, round5/README.md
//    item 2; HER WORDS, 2026-10-26: "2. Yes.") HER WORDS, on the
//    Draped Mantle: "where the details list is longer with few lines
//    than the photo, it looks a little weird", then "Yes to all three
//    questions!" (uiux
//    t_cada38f7, sketches/page2-final-stills/round4/grow.js, the model,
//    7bc03e8). A wider photo can narrow the column beside it and so
//    lengthen the list: up to three passes, until the feet meet.
// 2. NF. When the list still runs more than 240px past the (grown)
//    stage's foot, moves the rows that start below the foot (or cross
//    it) into a second list, `.piece-details-more`, right after
//    `.piece-details`; product/06 draws it under both columns. The rows
//    that fit beside the photo stay; at least one always does. HER
//    WORDS, 2026-10-24: "1. NF" (uiux t_cb98eeb9,
//    sketches/piece-scroll/ps.js NF, the model, 8c9bc12).
// WHY A SCRIPT: where the photo's foot falls depends on the window's
// height (product/02's frame), and where the list ends on its rows'
// wrapping, so no row count, and no selector, can say how far the photo
// grows or where the list breaks. (CSS alone can't size the photo's
// column from the list's height without the photo losing its shape.)
// HOW: puts the rows back in one list and the frame back to its size,
// grows, measures, splits; again on resize (at most every 120ms while
// the window is being resized, and 120ms after the last change) and once
// the fonts are in (a row's height is its type's). Each pass runs in one
// task, so the page is never painted half-split. The rows are moved, not
// copied: the DOM order, so the reading order, is as before, and nothing
// in a row is a Tab stop.
// WITHOUT IT (script off, an error, <=700px): the frame at product/02's
// size and one list in the column: the sketch's N. Without subgrid the
// photo still grows, and nothing splits.
const initDetailsSplit = () => {
  const piece = document.querySelector(".piece");
  const details = piece && piece.querySelector(".piece-details");
  const stage = piece && piece.querySelector(".piece-stage");
  const frame = stage && stage.querySelector(".piece-frame");
  const list = details && details.querySelector(".piece-details-list");
  if (!list || !frame) return;
  const subgrid = !!(window.CSS && CSS.supports("grid-template-columns", "subgrid"));

  const TAIL = 240; // a tail up to about three rows long stays (product/06)
  const FRAME_MAX = 1280; // product/02's cap on the frame's height
  // The growth stops this far above the window's foot: the photo always
  // ends on its own visible edge. HER WORDS, 2026-10-26, on uiux
  // t_49f38ef3's "stop the growth 24px above the window's foot": "2. Yes."
  // (docs/DECISIONS.md 8d3c57f, (11)).
  // It caps growth only: a stage whose foot already sits closer (none at
  // 701px+ today: 46 / 62px) is not shrunk.
  const FOOT_GAP = 24;
  const twoColumns = window.matchMedia("(min-width: 701px)");
  const top = (el) => el.getBoundingClientRect().top + window.scrollY;
  const foot = (el) => el.getBoundingClientRect().bottom + window.scrollY;

  const unsplit = () => {
    const more = piece.querySelector(".piece-details-more");
    if (!more) return;
    while (more.firstElementChild) list.appendChild(more.firstElementChild);
    more.remove();
    piece.removeAttribute("data-details-split");
  };

  // 1. The photo grows until the stage's foot meets the list's foot.
  const grow = (last) => {
    let g = 0;
    for (let pass = 0; pass < 3; pass++) {
      const stageFoot = foot(stage);
      const over = foot(last) - stageFoot; // the list past the stage
      const room = document.documentElement.clientHeight - FOOT_GAP - stageFoot; // to FOOT_GAP above the first screen's foot
      // The frame's full height, `--frame-h` (product/02): a wide photo
      // shown beside a tall first one may be shorter, the strip's margin
      // under it (product/05) making up the difference.
      const strip = stage.querySelector(".piece-strip");
      const frameH = frame.getBoundingClientRect().height + (strip ? parseFloat(getComputedStyle(strip).marginBottom) || 0 : 0);
      const tall = FRAME_MAX - frameH;
      let next = g + Math.min(over, room, tall);
      if (next < 1) next = 0; // under a pixel: no growth
      if (Math.abs(next - g) < 0.5) break;
      g = next;
      if (g) stage.style.setProperty("--grow", `${g}px`);
      else stage.style.removeProperty("--grow");
    }
  };

  // 2. NF: a list still running more than TAIL past the stage's foot.
  const split = (rows) => {
    const photoFoot = foot(stage);
    if (foot(rows[rows.length - 1]) - photoFoot <= TAIL) return;
    const k = rows.findIndex((r) => top(r) >= photoFoot - 1 || foot(r) > photoFoot);
    const moving = rows.slice(Math.max(1, k));
    const more = document.createElement("dl");
    more.className = "piece-details-list piece-details-more";
    moving.forEach((r) => more.appendChild(r));
    more.style.setProperty("--more-rows", Math.ceil(moving.length / 2));
    details.after(more);
    piece.dataset.detailsSplit = String(rows.length - moving.length);
  };

  const measure = () => {
    // A change of shape in its ease (§4b, product/02) ends at once: the
    // passes below must read the frame where it rests.
    stage.classList.remove("is-reshaping");
    unsplit();
    stage.style.removeProperty("--grow");
    if (!twoColumns.matches) return;
    const rows = [...list.children];
    if (!rows.length) return;
    grow(rows[rows.length - 1]);
    if (subgrid) split(rows);
  };

  let wait;
  let lastRun = 0;
  window.addEventListener("resize", () => {
    clearTimeout(wait);
    const now = performance.now();
    if (now - lastRun >= 120) {
      lastRun = now;
      measure();
    }
    wait = setTimeout(() => {
      lastRun = performance.now();
      measure();
    }, 120);
  });
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
};

// --- 5. DEMO-ONLY SKIN SWITCHER (the demo shop and its pieces) ---
// WHAT IT DOES: wires the demo's three skin buttons (shop/03), on the
// shop and on each piece's page. A click, Enter or Space on one, or an
// arrow key inside the group, sets `data-skin` on the page's one
// `[data-skin]` element (the shop's `.shop-products`, a piece's
// <article>) to a `data-skin-btn` value (seance, dossier or
// transmission), and shop/01–06 and product/02 paint from that
// attribute. A summoned piece stays summoned across a switch. The skin
// it opens on is §5b's: the address, then the tab's last choice, then
// the markup's.
// CHOICE: radios with their keyboard, not three `aria-pressed` toggle
// buttons: one skin is always chosen and choosing one unchooses the
// others, which is what a radio says and a toggle doesn't (a toggle
// can be pressed off, and three of them could all read "pressed").
// HOW: the group is `role="radiogroup"` markup, not native radios, so
// this does what a native group would, as the ARIA radio group pattern
// asks:
//   - `aria-checked`: "true" on the one chosen, "false" on the others,
//     so one is checked at a time.
//   - One Tab stop: the checked button has `tabIndex` 0, the other two
//     -1 (a roving tabindex), set at load and on every change. Tab
//     reaches the chosen skin and leaves the group on the next press.
//   - The arrow keys: Right or Down checks the next skin and moves focus
//     to it, Left or Up the previous, wrapping at the ends. Their
//     default (scrolling the page) is cancelled.
//   - Home and End are left to the page (they scroll it), as in a
//     native radio group and the ARIA radio group pattern; the gallery
//     grid's Home and End (§2) are the grid pattern's.
// The markup keeps no tabindex: the script writes it, so a page whose
// script fails keeps three plain Tab stops rather than two unreachable
// buttons.
// SCOPE: the demo's pages only. A real shop's skin is one value set by
// the admin, written into its markup, with no switcher
// (docs/ARCHITECTURE.md §B.2.3); on a page without the buttons it
// returns at once.
const initSkinSwitcher = () => {
  const skinned = document.querySelector("[data-skin]");
  const buttons = [...document.querySelectorAll("[data-skin-btn]")];
  if (!skinned || !buttons.length) return; // not a demo page

  const setSkin = (skin) => {
    skinned.setAttribute("data-skin", skin);
    buttons.forEach((btn) => {
      const checked = btn.dataset.skinBtn === skin;
      btn.setAttribute("aria-checked", String(checked));
      btn.tabIndex = checked ? 0 : -1;
    });
  };

  const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

  // A visitor's choice: shown, and kept for the tab (§5b).
  const choose = (skin) => {
    setSkin(skin);
    keepDemoSkin(skin);
  };

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => choose(btn.dataset.skinBtn));
    btn.addEventListener("keydown", (e) => {
      const step = STEP[e.key];
      if (!step || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const next = buttons[(i + step + buttons.length) % buttons.length];
      choose(next.dataset.skinBtn);
      next.focus();
    });
  });

  const fromAddress = demoSkinFromAddress();
  if (fromAddress) keepDemoSkin(fromAddress);
  setSkin(fromAddress || keptDemoSkin() || skinned.getAttribute("data-skin") || buttons[0].dataset.skinBtn);

  // Back and Forward: a page the browser restores from its cache keeps
  // the skin it was left in. If the visitor chose another on the next
  // page, the tab's choice is newer: show it.
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    const kept = keptDemoSkin();
    if (kept) setSkin(kept);
  });
};

// --- 5b. THE DEMO'S SKIN, CARRIED ACROSS ITS PAGES (demo only) ---
// WHAT IT DOES: a skin chosen on the demo shop or on one of its pieces
// stays chosen on the others, for this tab: the shop in Dossier opens
// each piece in Dossier, and Back returns to Dossier (product-page spec
// §3.1). Which skin a page opens on, first match wins:
//   1. `?skin=seance|dossier|transmission` in the address (QA, or a link
//      she sends someone). It is also kept, so the pieces opened from
//      that page follow it. The pages' own links never carry it, so
//      addresses stay clean.
//   2. The tab's last choice, in `sessionStorage` (one tab's, gone when
//      the tab closes; another tab starts fresh).
//   3. The markup's `data-skin` (Séance).
// With storage blocked (some private modes) the reads and writes throw;
// they are caught, and a choice then lasts the page.
// One gap, accepted: Back to a page whose address has `?skin=`, after a
// newer choice, shows the newer one only when the browser restores it
// from its cache; reloaded, the address wins again.
// No script: no switcher (shop/06), every page in its markup's skin.
// A real shop: no switcher and nothing carried; its skin is its own.
const DEMO_SKINS = ["seance", "dossier", "transmission"];
const DEMO_SKIN_KEY = "strigoi-demo-skin";
const demoSkinFromAddress = () => {
  const s = new URLSearchParams(location.search).get("skin");
  return DEMO_SKINS.includes(s) ? s : null;
};
const keptDemoSkin = () => {
  try {
    const s = sessionStorage.getItem(DEMO_SKIN_KEY);
    return DEMO_SKINS.includes(s) ? s : null;
  } catch (err) {
    return null; // storage blocked: nothing kept
  }
};
const keepDemoSkin = (skin) => {
  try {
    sessionStorage.setItem(DEMO_SKIN_KEY, skin);
  } catch (err) {
    // storage blocked: the choice lasts the page
  }
};

// --- 5c. (REMOVED) THE WALL'S CAP FROM `?wall=` ---
// The demo shop's temporary switch between a 1400 and a 1600 wall
// (672bf5d) went after her pick, 2026-10-26: "Yes to all three
// questions!" (1600; docs/DECISIONS.md 2dc046d). The cap is shop/02's
// one `max-width`; `?wall=` in an address now does nothing
// (docs/HISTORY.md, shop/02).

// --- 6. (REMOVED) THE NAV TOGGLE ---
// The menu it opened and closed (`.nav-toggle`, `.nav-links`) is gone
// from every page: the star nav has no menu (docs/HISTORY.md, chrome/02).

// --- 6b. NAV FADE ON DESCENT ---
// WHAT IT DOES: when the reader scrolls off the very top of the page,
// the nav's words fade out (the logo and the five star labels); the
// five dots stay. The words come back at the top, or on Tab.
//
// HOW: the function adds or removes one class, `nav--words-hidden`, on
// `nav`; the fade itself is CSS (chrome/02). It listens to the
// `scroll` event and reads `window.scrollY` (how many pixels the page
// has scrolled). A fast trackpad fires many scroll events per frame, so
// the work waits for `requestAnimationFrame`, a browser API that runs a
// function just before the next repaint: at most once per frame.
//   - Within NEAR_TOP_PX (70px) of the top, the words are always shown.
//   - Below that, a downward scroll of more than HYSTERESIS_PX (6px)
//     since the last change hides them. The 6px margin stops trackpad
//     jitter at the boundary from flickering the words on and off.
//   - Once hidden, scrolling up does not bring them back. Only reaching
//     the top does, or a Tab press anywhere in the page: a `keydown`
//     listener on `document` treats Tab as "show me the navigation".
//     If the focus that Tab moves scrolls the page down by more than 6px
//     below where the words last hid (the top, before the first time),
//     that scroll hides them again, as Tab onto the sky's second star or
//     the inscription does. Focus inside the nav shows them (chrome/02).
//
// SCOPE: the homepage only: the one page with a fixed `nav` and a
// `.hero`. Elsewhere it returns at once (the Summoning's header is
// `.summoning-hero`; the gallery has no nav).
// The demo shop has a `.hero` but its nav is chrome/07's
// `.nav--scrolls`, the logo only, which scrolls away with the top:
// there the fade would show nothing and only hide the logo from
// keyboard and screen reader users (`visibility: hidden`), so it
// returns too. Her "same as homepage, for now" was given while that
// nav was fixed; pm scoped it out (docs/DECISIONS.md, "NAVBAR
// RULINGS", 3).
//
// CHOICE: the obvious fix for text colliding under a fixed nav is to
// hide the whole nav. That takes every link out of the keyboard's tab
// order, so a keyboard user loses the navigation. Fading only the words
// keeps every star in place and focusable.
// The words fade almost as soon as the reader leaves the top, so they
// never sit over the title or the wingmark. A fixed pixel number is
// safe here: it measures from the top of the page, not from an element
// whose height can change. Scrolling up mid-page does not recall them:
// that brought them back over the page's own text.
// ACCESSIBILITY: there is no `prefers-reduced-motion` branch here.
// Hiding the words is a change of state, not an animation, and the
// state is right for everyone. For visitors who ask for less motion,
// motion.css's chrome/02 guard makes the fade a cut.
//
// VISION: see the nav comment in index.html.
// History: docs/HISTORY.md, chrome/02.
const initNavFade = () => {
  const nav = document.querySelector("nav");
  const hero = document.querySelector(".hero");
  // No .hero, or a nav that scrolls away (the shop): see SCOPE above.
  if (!nav || !hero || nav.classList.contains("nav--scrolls")) return;

  const HYSTERESIS_PX = 6; // see HOW above
  const NEAR_TOP_PX = 70;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const applyState = () => {
    const scrollY = window.scrollY;
    const delta = scrollY - lastScrollY; // positive = scrolled down

    // Near the top is a fixed place on the page, not a distance travelled.
    const nearTop = scrollY < NEAR_TOP_PX;

    const currentlyHidden = nav.classList.contains("nav--words-hidden");
    let nextHidden;
    if (nearTop) {
      // Near the top: always shown, whichever way the reader moves.
      nextHidden = false;
    } else if (!currentlyHidden && scrollY > NEAR_TOP_PX && delta > HYSTERESIS_PX) {
      // A sustained downward scroll past the threshold: hide the words.
      nextHidden = true;
    } else {
      // Hidden and below the top: no change. Only the top or Tab recalls.
      nextHidden = currentlyHidden;
    }

    const changed = nextHidden !== currentlyHidden;
    if (changed) {
      nav.classList.toggle("nav--words-hidden", nextHidden);
      // lastScrollY moves only when the state changes, so `delta` adds up
      // over several frames; reset every frame, a slow scroll would never
      // pass 6px.
      lastScrollY = scrollY;
    } else if (nearTop) {
      // Inside the top zone, keep lastScrollY current for the next exit.
      lastScrollY = scrollY;
    }

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(applyState);
        ticking = true;
      }
    },
    { passive: true },
  );

  // Tab anywhere recalls the words, as a video player shows its
  // controls on a keypress. The star under focus also shows its own
  // label (chrome/02).
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      nav.classList.remove("nav--words-hidden");
    }
  });
};

// --- 7. DOCTRINE WHEEL: RING DRAW-ON-SCROLL (summoning/index.html) ---
// WHAT IT DOES: draws the wheel's three rings (summoning/02) once, when
// the stage is first in view: it adds `.drawn` to `#orbitStage`, and
// summoning/02's transitions run the rings' dash in, inner ring first,
// 0.35s apart. The class stays; scrolling back up undraws nothing.
// HOW: an `IntersectionObserver` (the browser's callback for when an
// element enters or leaves the screen) at threshold 0.3 fires when 30%
// of the stage is on screen, then disconnects. On a screen tall enough
// to show 30% of it at load (1440×900, 1920×1080) the rings draw at
// once; at 1366×768 after about 100px of scroll. Reason for 0.3 not
// recorded (the sketch's value).
// Without IntersectionObserver the class is added at load, drawn; with
// the script off it is never added, and summoning/02's `scripting: none`
// rule draws the rings whole from the first paint, as reduced motion
// does (motion.css). A browser that doesn't know `scripting` (listed in
// summoning/02) keeps the hidden first frame.
// SCOPE: only the summoning page has `#orbitStage`; elsewhere it returns.
// ACCESSIBILITY: the SVG is `aria-hidden` and this touches nothing else,
// so what a screen reader reads doesn't depend on it.
// History: docs/HISTORY.md, summoning/02.
const initOrbitDraw = () => {
  const stage = document.getElementById("orbitStage");
  if (!stage) return; // not the summoning page: see SCOPE above

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stage.classList.add("drawn");
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(stage);
  } else {
    stage.classList.add("drawn");
  }
};

// --- 7b. THE DAY'S ORDER (shared: the roster, 1a; the Atlas, 7c; the Bestiary, 7d) ---
// WHAT IT DOES: gives a list a new order once a day, the same order for
// every visitor on that day, so no item holds the first place for good
// and nobody's page reshuffles on a reload.
//
// HOW: `dayKey()` is today's date in UTC as year-month-day text, read from
// `Date.prototype.toISOString` (always UTC, whatever the visitor's
// clock zone), so the day turns at the same moment for everyone.
// `seededRandom(text)` turns a text into a stream of numbers between 0
// and 1 that is always the same for the same text: the text is hashed
// to a 32-bit number, and mulberry32 (a small, well-known generator)
// steps from it. `Math.imul` multiplies two numbers as 32-bit integers,
// the way the hash needs; `>>>` shifts bits without keeping the sign.
// `shuffleForDay(items, salt)` copies the array and shuffles the copy
// with Fisher–Yates (walk from the end, swap each place with a random
// earlier or equal one: every order is equally likely), drawing from
// `seededRandom(salt + dayKey())`. The salt keeps two pages' shuffles
// apart: with the same list, the Atlas's order and another page's would
// otherwise be the same.
//
// SCOPE: pure functions, no element touched; the page blocks below call
// them. A page that calls none of them is not affected.
//
// CHOICE, once a day and not on every load or in a fixed order: a fixed
// order (join date, A to Z) gives someone the first place for ever; a
// new order on every load loses the item a returning visitor was
// looking at, and two people can't say "top left". The day is the
// smallest unit that is fair and still stable (docs/DECISIONS.md, "THE
// ATLAS TAKES B", D3).
// CHOICE, a seeded generator and not `Math.random()`: `Math.random` can't
// be seeded, so it could not give everyone the same order.
// CHOICE, in the browser: the site is static today. With the backend
// the same shuffle runs on the server, over the full set, and the page
// arrives in the day's order.
// VISION: "Nobody is elder, everybody is sometimes visible"
// (docs/DECISIONS.md, "CONSTELLATIONS/GALAXY PAGE").
const dayKey = () => new Date().toISOString().slice(0, 10);

const seededRandom = (text) => {
  // the hash: every character mixed into one 32-bit number
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  // mulberry32: each call steps the state and returns a number in [0, 1)
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffleForDay = (items, salt) => {
  const out = items.slice();
  const random = seededRandom(salt + dayKey());
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// --- 7c. THE ATLAS: THE DAY'S SKY (atlas.html) ---
// WHAT IT DOES: turns the Atlas's sky for the day and scatters the
// constellations over it; ties each constellation to its name in the
// index, so pointing at one lights the other.
//
// HOW:
//   1. The shops are in the markup, A to Z (`.atlas-sky-list > li`).
//      `shuffleForDay` (7b), salt "sky:", gives the day's order.
//   2. Places: a "dart throw". For each shop, random points in the
//      field (from `seededRandom`, salt "scatter:" and the day) are
//      tried until one lies at least GAP_PX from every box already
//      placed; if none does in MAX_TRIES, the farthest one tried is
//      kept. The field is as wide as the list and one 250px row tall per
//      three shops, never under 62svh (css/atlas.css, atlas/02).
//   3. The places are sorted top to bottom (by the top of their box; left
//      to right only breaks an exact tie, which a scatter almost never
//      has), and the day's order is dealt onto them: the first shop of
//      the day is the highest one. The <li>s are moved into that order,
//      so Tab and a screen reader go down the sky as the page scrolls.
//   4. Each place is written as two fractions, `--x` and `--y`, of the
//      room the field leaves around a box (css/atlas.css): the scatter
//      keeps its shape if the window is resized.
//   5. `.is-scattered` on the list switches the CSS from the no-JS row to
//      the scatter. It goes on before the places are measured, since the
//      field's height needs it; the rest runs in the same task, so no
//      frame is painted between the class and the places. Before this
//      block runs, the browser may already have painted the no-JS row.
//   6. The lighting: `mouseenter`/`focus` on an index name adds `.is-lit`
//      to its constellation (`mouseleave`/`blur` removes it), and
//      hovering a constellation adds `.is-lit` to its index entry. The
//      two are matched by their link's `href`: one shop, one address.
//
// SCOPE: runs only on a page with `.atlas-sky-list`; anywhere else it
// returns at once. With one shop there is nothing to turn or scatter:
// the CSS centres it (atlas/02) and only the lighting is wired.
// Without JS the sky is the markup's row, A to Z, and nothing lights:
// the page is complete, every shop reachable.
//
// CHOICE, the scatter computed here, not placed by hand in the CSS as on
// the homepage (home/04): the homepage places three clusters; the Atlas
// takes every shop, and a new shop must find a place without anyone
// editing a stylesheet.
// CHOICE, a minimum distance and not a grid: her ruling B, the open sky
// (docs/DECISIONS.md, "THE ATLAS TAKES B"); Direction A, the chart, is kept in
// sketches/atlas/.
// ACCESSIBILITY: the DOM order follows the sky from top to bottom (step
// 3), so focus moves down the sky and never back up. It does swing from
// side to side: in a scatter each next box down can sit anywhere across
// the field. With 12 shops at 1440 the field is 1,296px, so one step can
// move focus as far as 1,106px (the field less a 190px box); the largest
// step on each of 30 days measured was 761 to 1,054px. Rows
// would cost the open sky her ruling B asks for. The names shown on
// hover are the links' own text, read by a screen reader whether shown
// or not.
// SMALL SCREEN: not designed yet: the field keeps the desktop box sizes
// and the places are computed for the width at load.
const initAtlas = () => {
  const list = document.querySelector(".atlas-sky-list");
  if (!list) return; // not the Atlas: nothing to do here
  const stars = Array.from(list.querySelectorAll(":scope > .atlas-star"));
  const index = document.querySelector(".atlas-index-list");

  // 6. The lighting, index ↔ sky, matched by href.
  const byHref = new Map();
  stars.forEach((star) => {
    const link = star.querySelector("a");
    if (link) byHref.set(link.getAttribute("href"), star);
  });
  if (index) {
    index.querySelectorAll("li").forEach((entry) => {
      const link = entry.querySelector("a");
      const star = link && byHref.get(link.getAttribute("href"));
      if (!star) return; // a name with no constellation lights nothing
      const lightStar = (on) => () => star.classList.toggle("is-lit", on);
      link.addEventListener("mouseenter", lightStar(true));
      link.addEventListener("focus", lightStar(true));
      link.addEventListener("mouseleave", lightStar(false));
      link.addEventListener("blur", lightStar(false));
      const lightEntry = (on) => () => entry.classList.toggle("is-lit", on);
      star.addEventListener("mouseenter", lightEntry(true));
      star.addEventListener("mouseleave", lightEntry(false));
    });
  }

  if (stars.length < 2) return; // one shop: nothing to turn (see SCOPE)

  const BOX_W = 190; // a constellation's box (css/atlas.css, atlas/03)
  const BOX_H = 150;
  const GAP_PX = 48; // the least dark between two boxes; the name's plate fits in it
  const MAX_TRIES = 3000;

  // 1. The day's order.
  const order = shuffleForDay(stars, "sky:");

  // 2. The field: its height comes from the CSS once `--rows` is set.
  list.style.setProperty("--rows", Math.ceil(stars.length / 3));
  list.classList.add("is-scattered");
  const roomW = Math.max(0, list.clientWidth - BOX_W);
  const roomH = Math.max(0, list.clientHeight - BOX_H);
  const random = seededRandom("scatter:" + dayKey());
  const places = [];
  stars.forEach(() => {
    let best = null;
    let bestGap = -1;
    for (let t = 0; t < MAX_TRIES; t++) {
      const p = { x: random() * roomW, y: random() * roomH };
      // the gap between two boxes: 0 if they overlap
      let gap = Infinity;
      places.forEach((q) => {
        const gx = Math.max(0, Math.abs(p.x - q.x) - BOX_W);
        const gy = Math.max(0, Math.abs(p.y - q.y) - BOX_H);
        gap = Math.min(gap, Math.hypot(gx, gy));
      });
      if (gap >= GAP_PX) { best = p; break; }
      if (gap > bestGap) { bestGap = gap; best = p; }
    }
    places.push(best);
  });

  // 3. Read top to bottom, then left to right; deal the day's order.
  places.sort((a, b) => a.y - b.y || a.x - b.x);
  order.forEach((star, i) => {
    // 4. Fractions of the room, so a resize keeps the shape.
    star.style.setProperty("--x", roomW ? (places[i].x / roomW).toFixed(4) : 0);
    star.style.setProperty("--y", roomH ? (places[i].y / roomH).toFixed(4) : 0);
    list.appendChild(star); // appending in turn leaves them in this order
  });
};

// --- 7d. THE BESTIARY: THE DAY'S WALL (bestiary.html) ---
// WHAT IT DOES: hangs the Bestiary's pieces for the day in a cabinet of
// curiosities: their order, the size each stands at, the frame shape
// each photo takes, the shelves, each piece's niche and its place in
// it. The same wall for every visitor that day, a new one the next.
// HER WORDS, 2026-10-29 (page 5): "I need it to look like a bestiary or
// a cabinet de curiosités, it's not necessay  to have an ikebana
// setup."; 2026-10-30, "3. (d)": wall D of uiux's sketch (t_65af9177,
// abd79fd; sketches/page5 page5.js `justify` + `hangD` + `drawCabinet`,
// whose rules and values are built here verbatim), untorn (t_5e609701).
//
// HOW (the CSS is css/bestiary.css, bestiary/04):
//   1. ORDER. The pieces are in the markup, in the order bestiary.html
//      gives them (`.bestiary-plane > li`). `shuffleForDay` (7b), salt
//      "plane:", gives the day's order.
//   2. SIZE. A deck of steps, small, medium and large, a third of each
//      (S, M, L, S, M, L, ...), shuffled with salt "size:" and the day,
//      then dealt by catalogue id: the piece with the lowest id
//      (`data-id`, compared as text) takes the first card, and so on.
//      Every day a third of the pieces stand large, and which third
//      turns daily. Every piece needs its own id: two pieces with none
//      (or the same one) would draw the same card.
//   3. FRAME. The photo's own ratio, from its <img>'s width and height,
//      snapped to the nearest of nine shapes (FRAMES), the shapes the
//      wall knows. "Nearest" is by the ratio's logarithm, so 4:5 and 5:4
//      are as far from 1:1. Snapping crops at most about a ninth of one
//      side; today's photos are exactly 9:16 and 16:9, so nothing is.
//   4. SHELVES. Pieces join a shelf in the day's order. Each shelf is
//      scaled so its niches fill the cabinet's width exactly. In a shelf
//      a large piece is the shelf's full height, a medium one 87% of it
//      and a small one 75% (STEP_H), so a small curio has more air round
//      it in its niche. A shelf breaks where its height comes nearest the
//      target, 26% of the width held to 240–360px, and never falls under
//      240px nor leaves a niche under 112px wide when it can break one
//      piece earlier: no caption then starts above its photo (QA's O4,
//      ~700–900px). The last shelf is not stretched past the target.
//   5. NICHES. A niche is as wide as its piece plus 14px each side, as
//      tall as its shelf: 14px of air above the tallest piece and 40px
//      of floor in front (the hanging bite needs 38px, bestiary/06, so
//      it stays in its own niche). The pieces stand on the floor
//      (bottom-aligned), centred in their niches. 10px walls round and
//      between them; the last shelf's niches widen to close the cabinet.
//      A photo is never drawn under 112px wide.
//   6. PLACE. Each piece gets an inline `left`, `top` and `width` (its
//      height is its frame's, `--ar`), its frame shape as `--ar`, and
//      `data-step` and `data-frame` (read by nothing on the page: they
//      show what the day dealt, for whoever inspects it). The list gets
//      `.is-hung` (bestiary/04: the pieces placed absolutely in it) and
//      its height. Each <li> is appended in turn: `appendChild` moves an
//      element already in the document, so the list ends in the day's
//      order, and the DOM is never reordered after that. The furniture
//      is one `<div class="bestiary-cabinet" aria-hidden="true">` before
//      the list, holding one empty `<span class="bestiary-niche">` per
//      niche: decoration only, behind the list, which stays a list of
//      links. Shelves and niches are re-hung when the list's width
//      changes (a resize, zoom); the order, sizes and frames are not.
//   7. TEAR: retired 2026-10-30. The photos are untorn inside the
//      cabinet (uiux t_5e609701's pick, her "OK"; bestiary/05), so the
//      day deals no tear and the markup carries none.
//   8. THE MARK'S PLACE (bestiary/06). Per piece, at the width the page
//      is at: does its caption come up within 8px of the saved mark's
//      plate in the corner? Then, and only for that piece, the <li> gets
//      `.save-hangs` and its mark hangs under the photo's foot, on the
//      niche's floor. HER WORDS, 2026-10-27, on the PM's question (build
//      uiux t_07096feb's rule, sketches/bestiary-bite-corner/, 7ac3d41:
//      the bite in the card's top-right corner unless that card's own
//      caption comes within 8px, only then under the foot): "OK to both
//      questions." The caption is laid out at opacity 0 too, so its
//      words' top is known at rest: the top of a Range's line boxes over
//      it. The corner plate's foot: the <li>'s top + 3% of its height
//      (bestiary/06's `top: 3%`) + 6px (the 44px target's inset round
//      its 32px plate) + 32px. The 8px is shop/11's gap under words. The
//      test is vertical only, so the mark still never shares a row with
//      words. Re-measured when fonts arrive (`document.fonts.ready`) and
//      when the wall or any caption line changes size (a resize, zoom,
//      text size, a name that wraps, a font landing), through one
//      ResizeObserver, at most once a frame (the throttle), after a
//      re-hang if the width changed. At 700px and below it does
//      nothing: task 4a's widths.
//
// SCOPE: runs only on a page with `.bestiary-plane`; anywhere else it
// returns at once. Without JS the pieces stand in the markup's order,
// at one size, each photo at its own ratio, four to a row, with no
// cabinet (bestiary/04): the page is complete, every piece reachable.
//
// CHOICE, the size dealt from a balanced deck by catalogue id and the
// day, and never from the piece's price, maker, newness, sales or
// photo: on a museum wall a large painting reads as an important one,
// and the Bestiary's rule is that none is placed first. A deck, not a
// coin per piece: a coin can make half the wall large one day and none
// the next; the deck gives exactly a third every day.
// CHOICE, shelves read left to right, top to bottom, and not masonry:
// masonry pushes photos up into the gaps, out of order, so the eye, the
// Tab key and a screen reader would each read a different order. Here
// the DOM order is the shelf order, so the three agree; the cabinet
// fills the space masonry would, with furniture instead of reordering
// (uiux README §4, "why is reading order more important").
// CHOICE, the niches drawn by script as empty spans and not as the
// <li>s' own backgrounds: a niche is wider and taller than its photo,
// and an <li> as big as its niche would move every hit area, focus ring
// and the saved mark's place off the photo.
// CHOICE, in the browser: the site is static today. With the backend the
// same steps run on the server, which writes the order and the frame
// into the markup; the shelves depend on the window's width, so they
// stay here. What the server needs per piece: the photo's width and
// height, a stable catalogue id, the link (its page in the shop that
// holds it; a shop's top for a piece no shop holds) and the caption; per
// day, the date (UTC).
// ACCESSIBILITY: one Tab stop per piece, in the wall's order, which is
// the order the eye reads the shelves. Every piece is a link (since
// 2026-10-31 each to its own page: the founder's five went to the demo
// shop's top until TexxturedBeest held them, bestiary.html), so none is
// skipped. The cabinet is `aria-hidden` and takes no pointer events.
// VISION: "Nobody is elder, everybody is sometimes visible"
// (docs/DECISIONS.md, "CONSTELLATIONS/GALAXY PAGE"), the Atlas's rule
// carried to the pieces, and now to their sizes.
const initBestiary = () => {
  const list = document.querySelector(".bestiary-plane");
  if (!list) return; // not the Bestiary: nothing to do here
  const pieces = Array.from(list.querySelectorAll(":scope > .bestiary-piece"));
  if (!pieces.length) return;

  // the nine frame shapes (the shapes the tears were drawn for, kept as
  // the wall's set of frames), as [name (`data-frame`), width ÷ height]
  const FRAMES = [
    ["9x16", 9 / 16], ["2x3", 2 / 3], ["3x4", 3 / 4], ["4x5", 4 / 5], ["1x1", 1],
    ["5x4", 5 / 4], ["4x3", 4 / 3], ["3x2", 3 / 2], ["16x9", 16 / 9],
  ];
  // in a shelf, a step's height as a share of the shelf's (step 4)
  const STEP_H = { S: 0.75, M: 0.87, L: 1 };
  // the niche, px (step 5): air each side, air above, the floor, walls
  const NICHE = { side: 14, top: 14, floor: 40, wall: 10 };
  const SHELF = { share: 0.26, min: 240, max: 360 }; // the target height
  const NARROW = 112; // px: no niche (when breaking), no photo, narrower

  // 1. The day's order.
  const order = shuffleForDay(pieces, "plane:");

  // 2. The deck, dealt by catalogue id.
  const deck = shuffleForDay(order.map((_, i) => ["S", "M", "L"][i % 3]), "size:");
  const ids = pieces.map((li) => li.dataset.id || "").sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const items = order.map((li) => {
    // 3. The frame: the photo's own ratio, snapped. A photo with no
    //    width or height in the markup gets 4:5, the shops' frame.
    const img = li.querySelector("img");
    const w = img && Number(img.getAttribute("width"));
    const h = img && Number(img.getAttribute("height"));
    const ratio = w && h ? w / h : 4 / 5;
    const off = (f) => Math.abs(Math.log(f[1] / ratio));
    const frame = FRAMES.reduce((best, f) => (off(f) < off(best) ? f : best));
    const step = deck[ids.indexOf(li.dataset.id || "")];
    li.style.setProperty("--ar", String(frame[1]));
    li.dataset.step = step;
    li.dataset.frame = frame[0];
    return { li, ratio: frame[1], step, k: STEP_H[step] };
  });

  order.forEach((li) => list.appendChild(li));
  list.classList.add("is-hung");
  const cabinet = document.createElement("div");
  cabinet.className = "bestiary-cabinet";
  cabinet.setAttribute("aria-hidden", "true");
  list.before(cabinet);

  // 4–6. The shelves, the niches, the places, at the list's width.
  let hungAt = 0;
  const hang = () => {
    const W = list.clientWidth;
    if (!W) return;
    hungAt = W;
    const N = NICHE;
    const target = Math.max(SHELF.min, Math.min(W * SHELF.share, SHELF.max));
    // a niche's width at shelf height H; a shelf's width; the H that
    // makes a shelf's niches fill the cabinet's width exactly
    const nicheW = (it, H) => it.ratio * it.k * H + 2 * N.side;
    const rowW = (row, H) => row.reduce((a, it) => a + nicheW(it, H), 0) + (row.length - 1) * N.wall;
    const fill = (row) =>
      (W - 2 * N.wall - row.length * 2 * N.side - (row.length - 1) * N.wall) /
      row.reduce((a, it) => a + it.ratio * it.k, 0);

    // 4. The shelves.
    const rows = [];
    let row = [];
    items.forEach((it) => {
      row.push(it);
      if (rowW(row, target) >= W - 2 * N.wall) {
        const withIt = fill(row);
        const without = row.length > 1 ? fill(row.slice(0, -1)) : Infinity;
        const nearer = Math.abs(Math.log(without / target)) < Math.abs(Math.log(withIt / target));
        const small = withIt < SHELF.min || row.some((u) => nicheW(u, withIt) < NARROW);
        if (row.length > 1 && (nearer || small)) {
          rows.push(row.slice(0, -1));
          row = [it];
        } else {
          rows.push(row);
          row = [];
        }
      }
    });
    if (row.length) rows.push(row);

    // 5–6. The niches and the places.
    const niches = [];
    let y = N.wall;
    rows.forEach((row, r) => {
      let H = fill(row);
      if (r === rows.length - 1 && H > target) H = target;
      const hs = row.map((it) => Math.max(it.k * H, NARROW / it.ratio));
      const tall = Math.max(...hs);
      const nh = N.top + tall + N.floor;
      const ws = row.map((it, i) => it.ratio * hs[i] + 2 * N.side);
      const spare = W - 2 * N.wall - (row.length - 1) * N.wall - ws.reduce((a, b) => a + b, 0);
      let x = N.wall;
      row.forEach((it, i) => {
        const nw = ws[i] + spare / row.length; // the last shelf's widen (0 elsewhere)
        const pw = it.ratio * hs[i];
        niches.push([x, y, nw, nh]);
        it.li.style.left = (x + (nw - pw) / 2).toFixed(2) + "px";
        it.li.style.top = (y + N.top + tall - hs[i]).toFixed(2) + "px";
        it.li.style.width = pw.toFixed(2) + "px";
        x += nw + N.wall;
      });
      y += nh + N.wall;
    });
    const height = Math.ceil(y) + "px";
    list.style.height = height;
    cabinet.style.top = list.offsetTop + "px";
    cabinet.style.left = list.offsetLeft + "px";
    cabinet.style.width = W + "px";
    cabinet.style.height = height;
    cabinet.replaceChildren(...niches.map(([nx, ny, nw, nh]) => {
      const niche = document.createElement("span");
      niche.className = "bestiary-niche";
      niche.style.left = nx.toFixed(1) + "px";
      niche.style.top = ny.toFixed(1) + "px";
      niche.style.width = nw.toFixed(1) + "px";
      niche.style.height = nh.toFixed(1) + "px";
      return niche;
    }));
  };
  hang();

  // 8. The mark's place: in the corner unless this piece's caption
  //    reaches it (see step 8 above; bestiary/06).
  const GAP = 8; // px under the plate's foot that the caption's words keep
  const TOP = 0.03; // bestiary/06: `.save--bestiary { top: 3% }`
  const INSET = 6; // the 44px target round the 32px plate (chrome/08)
  const PLATE = 32;
  const wide = window.matchMedia("(min-width: 701px)");
  const placeMarks = () => {
    if (!wide.matches) return; // 700px and below: task 4a's
    pieces.forEach((li) => {
      const cap = li.querySelector(".bestiary-caption");
      if (!cap) return;
      // the words' own line boxes, a little taller than the elements'
      const range = document.createRange();
      range.selectNodeContents(cap);
      const tops = Array.from(range.getClientRects())
        .filter((b) => b.width && b.height)
        .map((b) => b.top);
      if (!tops.length) return;
      const box = li.getBoundingClientRect();
      const plateFoot = box.top + TOP * box.height + INSET + PLATE;
      li.classList.toggle("save-hangs", Math.min(...tops) < plateFoot + GAP);
    });
  };
  let frame = 0;
  const soon = () => {
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      if (list.clientWidth !== hungAt) hang(); // a new width: re-hang first
      placeMarks();
    });
  };
  placeMarks();
  if (document.fonts) document.fonts.ready.then(placeMarks);
  if ("ResizeObserver" in window) {
    const watch = new ResizeObserver(soon);
    watch.observe(list);
    list.querySelectorAll(".bestiary-caption > *").forEach((line) => watch.observe(line));
  } else {
    window.addEventListener("resize", soon);
  }
};

// --- 8. START-UP ---
// WHAT IT DOES: starts every mechanism above once the page is read.
// HOW: `DOMContentLoaded` fires when the HTML is parsed and its elements
// exist (images may still be loading). All fourteen inits run on every
// page; each looks for its own elements first and returns if they are
// absent.
// SCOPE: all twenty-three pages load this file. The homepage uses 4 of
// the fourteen, a demo piece's page 4 (3 for Grave Soil, one photo), the
// shop 3 (§4a's summon, 2026-10-16), the gallery and the Atlas 2 each,
// the Summoning and the Bestiary 1 each, the ten text pages none.
// CHOICE: one guarded file, not one per page: docs/CSS-JS-SPLIT.md
// §4 (when to split: §4.4).
document.addEventListener("DOMContentLoaded", () => {
  initPlateFlash();
  initRosterDay();
  initSpecimensLantern();
  initGalleryGrid();
  initLightboxControls();
  initSeanceStages();
  initShopSummons();
  initPieceStrip();
  initDetailsSplit();
  initSkinSwitcher();
  initOrbitDraw();
  initNavFade();
  initAtlas();
  initBestiary();
});
