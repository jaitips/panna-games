# Play Zone — Claude Code Instructions

## Project Overview

A collection of webcam-powered, browser-based interactive games for a young child.
The child uses their body (jumping, punching, dancing, swinging arms) as the game controller.
Games are hosted via Cloudflare Pages and accessed through a unified "Play Zone" launcher hub.

## Structure

```
play-zone/
├── index.html              ← Play Zone launcher hub
├── games/
│   ├── dance-party/index.html
│   ├── shape-draw-party/index.html
│   ├── angry-birds/index.html        ← uses child's photo as the bird
│   ├── meteor-smasher/index.html
│   ├── balloon-math/index.html
│   ├── balloon-pop/index.html
│   ├── jet-wing-adventure/index.html
│   ├── steves-adventure/index.html
│   ├── flower-farm/index.html
│   ├── suika/index.html               ← watermelon/fruit merging game
│   ├── lightsaber-fruit/index.html
│   ├── jump-ball/index.html           ← webcam ping-pong vs robot AI
│   ├── pacman-virus/index.html        ← Pac-Chomp with Baby Shark chop controls
│   └── patan-frog/index.html          ← Patan the Frog mosquito catcher
├── shared/                 ← shared assets (icons, thumbnails)
├── _headers                ← Cloudflare Pages headers for camera permissions
├── CLAUDE.md               ← this file
└── README.md
```

## Absolute Rules

### Single-File Games
- Every game MUST be a single self-contained HTML file (`index.html`).
- No build tools, no bundlers, no external dependencies beyond CDN-loaded libraries.
- All CSS, JS, and assets (except CDN libs) must be inline.

### MediaPipe Technical Requirements
- Load MediaPipe via `<script>` CDN tags as **globals** (`window.Pose`, `window.Hands`), **NEVER** as ES modules.
- **DO NOT** use `@mediapipe/camera_utils` `Camera` class. Instead use a manual `requestAnimationFrame` loop:
  ```js
  async function sendFrame() {
    if (!poseBusy && video.readyState >= 2) {
      poseBusy = true;
      await model.send({ image: video });
      poseBusy = false;
    }
    requestAnimationFrame(sendFrame);
  }
  ```
- Use `video.onloadedmetadata` and `video.readyState >= 2` checks before sending frames.
- Use a `poseBusy` flag to prevent overlapping frame sends.

### Landmark Preferences
- Hand tracking: Landmark 9 (middle finger MCP) is more stable than landmark 0 (wrist).
- Body horizontal position: Use shoulder midpoint (landmarks 11 & 12).
- Smoothing: Exponential moving average with lerp ~0.45 for reducing jitter.

### Child UX Design Rules
- Controls must be **extremely forgiving** and intuitive.
- **No complex multi-step gestures** or hover-to-fire mechanics.
- Difficulty tuned **LOW**: generous hit detection radii, slow physics, intentionally weak AI opponents.
- Bounce damping ≤ 25% for casual games (high restitution = frustrating).
- Expect and design around "exploit" behaviors (covering the screen with both arms, etc.).
- Camera mode mechanics must mirror the mouse/touch equivalent exactly.

### Responsive Design
- Paddle/element widths must be **percentage-based**, never fixed pixels.
- AI opponent speed should scale relative to screen width.

### Audio
- Use **Web Audio API** for procedural sound generation — no external audio files.

### Physics
- Grace periods for game-over conditions: measure from moment of **drop/release**, not object creation.
- Jump physics: peak height = JV²/(2×G). Balance JUMP_VEL and GRAVITY carefully.

## CDN Libraries Used

- **MediaPipe Pose**: `@mediapipe/pose` via CDN (jsdelivr)
- **MediaPipe Hands**: `@mediapipe/hands@0.4.1675469240` via jsDelivr CDN
- **TensorFlow.js MoveNet**: Used in Steve's Adventure
- **Rendering**: HTML5 Canvas
- **Audio**: Web Audio API

## Deployment

- **Target**: Cloudflare Pages (GitHub-connected for auto-deploy on push)
- The `_headers` file must include `Permissions-Policy` for camera access on all game pages.
- Also works locally via `file://` (if MediaPipe loading follows the globals pattern above).

## Development Workflow

1. Each game lives in `games/<name>/index.html`.
2. Test locally by opening the HTML file directly in a browser.
3. The Play Zone hub (`index.html`) links to all games.
4. Push to GitHub → Cloudflare Pages auto-deploys.
5. When adding a new game, also update the hub's game list.

## Tile-Based Maze Games (Pac-Chomp Lessons)

### Maze Design
- **Always validate start position connectivity**: verify the player can move in all 4 directions from the spawn tile. Walls directly adjacent to the start position = unplayable.
- When editing maze arrays, trace the path from the player start tile in every direction to ensure connectivity.
- Ghost house exit should NOT align with a direct path to the player start — ghosts walk straight into the player.

### Kid-Friendly Turn Mechanics
- **Sticky input buffer** (500ms): remember the kid's desired turn direction and keep trying it. Kids press the key too early/late.
- **Wide turn tolerance** (0.6 tile-center distance): don't require pixel-perfect alignment to turn.
- **Look-ahead pre-snap**: when approaching an intersection, snap early so the turn doesn't get missed.
- **Auto-cornering at dead ends**: if only one non-reverse direction is open, turn automatically.
- **Reduced speed** (PAC_SPD=3.8): slower = more time to react. Kids can't handle fast tile movement.

### Ghost Difficulty for Kids
- **Delayed ghost release**: first ghost at 3s, then every 4s (`relT: 3000 + i*4000`). Never release a ghost at t=0 — the kid hasn't started moving yet.
- **Low chase probability**: 25% chase / 75% random direction keeps ghosts unpredictable but not aggressive.
- **Slow ghost speed** (G_SPD=2.2): must be noticeably slower than Pac-Man (3.8).

### Dual Input Modes
- Always offer both **Camera Mode** and **Keyboard Mode** buttons on title and game-over screens.
- Keyboard mode should skip webcam calibration entirely and go straight to countdown.
- Hide camera UI (video element, direction arrow) in keyboard mode.

### Initialization Safety
- Initialize ALL game state variables at declaration: `let score=0, lives=LIVES_START, pac=null, ghosts=[], frightT=0`.
- Add null guards (`if(!pac)return`) to every render/update function that touches entities — the game loop runs before entities are created.

## Git & Deployment

- **GitHub account**: `jaitips` (SSH key configured)
- **Remote**: `git@github.com:jaitips/panna-games.git`
- **Cloudflare deploy command**: `wrangler pages deploy /Users/sutthichai/workplace/personal/panna-games --project-name panna-games --branch main --commit-dirty=true`
- **Live URL**: `https://panna-games.pages.dev/`

## Testing with agent-browser

- Install: `npm install -g agent-browser && agent-browser install`
- Use `agent-browser eval "..."` to dispatch keyboard events (not `agent-browser key` which can scroll the page):
  ```js
  window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',code:'ArrowUp',bubbles:true}))
  ```
- Use `agent-browser eval "document.getElementById('btn').click()"` to click buttons (text-based click selectors are unreliable).
- Always check `agent-browser console` after testing for JS errors.
- Camera permission is always denied in headless — games must handle this gracefully with `try/catch`.

## Common Bug Patterns to Watch For

- Premature game-over triggers → add grace periods from drop moment
- Excessive bouncing → reduce restitution/damping aggressively
- Jittery tracking → apply EMA smoothing (lerp 0.45)
- Game breaks on mobile → check for fixed-pixel widths, use percentages
- MediaPipe fails on file:// → ensure globals loading pattern, not ES modules
- **Uninitialized state variables** → always init at declaration, add null guards in render/update
- **Maze blocked paths** → always verify player can move in all directions from start position
- **Ghosts too aggressive for kids** → delay release, reduce speed, lower chase probability
