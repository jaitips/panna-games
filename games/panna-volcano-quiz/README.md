# Panna's Volcano Quiz 🌋

A single-file browser game that drills the อนุบาล 3 end-of-term-1 exam (ปีการศึกษา 2569).
Panna's rules: lava rises while you think → eruption costs a heart; a right answer earns a ⭐ and gives a heart back; a wrong answer earns no star (and the lava does not reset).

## Run it

Open `index.html` in any browser, or serve the folder:

```bash
npx serve .        # or: python3 -m http.server 8080
```

Works on iPad (touch) and laptop (keys 1–4 answer). Best scores are kept in `localStorage`.

## Layout

Everything is in `index.html`:

- `<style>` — tokens in `:root`, menu / game / end screens, volcano SVG animations.
- Markup — three `<section class="screen">` blocks: `#menu`, `#game`, `#end`.
- `<script>` — one IIFE, sections in this order:
  1. helpers (`mc`, `T`, `E`, `sample`, `numWrongs`)
  2. question generators per subject (MATH, THAI, ENGLISH, INTELLIGENCE, GENERAL KNOWLEDGE)
  3. `SUBJECTS` registry (name, Thai label, colour, generators)
  4. storage + WebAudio sound effects
  5. game engine: `startRound`, `showQuestion`, `tickLava`, `answer`, `erupt`, `endRound`

See `CLAUDE.md` for the conventions to keep when extending it.
