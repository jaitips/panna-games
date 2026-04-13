# 🎮 Play Zone

A collection of webcam-powered, browser-based interactive games for kids! Use your body as the controller — jump, punch, dance, and swing your arms to play.

## Games

| Game | Description |
|------|-------------|
| **Dance Party** | Dance along to the beat with body tracking |
| **Shape Draw Party** | Draw shapes in the air with your hands |
| **Angry Birds** | Fling yourself (literally!) at targets |
| **Meteor Smasher Hero** | Punch meteors out of the sky |
| **Balloon Math** | Pop the right balloons to solve math problems |
| **Balloon Pop Party** | Pop as many balloons as you can |
| **Jet Wing Adventure** | Fly through obstacles by spreading your arms |
| **Steve's Adventure** | Jump and run in a side-scrolling adventure |
| **Flower Farm** | Grow and tend a virtual garden |
| **Suika Game** | Drop and merge fruits — watermelon style! |
| **Lightsaber Fruit** | Chop flying fruit with a lightsaber |
| **Jump Ball** | Webcam ping-pong against a robot AI |
| **Pac-Chomp** | Classic Pacman eating viruses — chop like Baby Shark to move! |
| **Patan the Frog** | Guide Patan's tongue to catch mosquitoes before time runs out |

## How It Works

Each game is a **single self-contained HTML file** — no build tools, no install steps. Games use your webcam and MediaPipe for body/hand tracking so your body becomes the controller.

## Running Locally

Just open `index.html` in a browser, or open any individual game file directly. No server required.

## Deployment

This project is designed for **Cloudflare Pages**:

1. Push to GitHub
2. Connect the repo to Cloudflare Pages
3. Set build output directory to `/` (no build step needed)
4. The `_headers` file handles camera permissions automatically

## Adding a New Game

1. Create a folder: `games/my-new-game/`
2. Add your single-file game as `games/my-new-game/index.html`
3. Update the game list in the root `index.html` hub
4. Push to GitHub — auto-deploys!

## Tech Stack

- **Tracking**: MediaPipe Pose & Hands (CDN)
- **Rendering**: HTML5 Canvas
- **Audio**: Web Audio API (procedural)
- **Hosting**: Cloudflare Pages
- **Build tools**: None! Pure HTML/CSS/JS
