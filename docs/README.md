# Infinite Zoom Experience

> *Fall forever into a world of surreal AI-generated portals*

An experimental single-page website that creates a hypnotic, infinite zoom-forward experience through AI-generated surreal worlds, inspired by the motion style of [zoomquilt.org](https://zoomquilt.org).

## 🌀 Concept

This project recreates the mesmerizing "zoom-into-portal" effect where you continuously fly forward through nested images. Each image features a central portal that seamlessly transitions to the next world, creating an infinite tunnel of surreal landscapes.

**8 Unique AI-Generated Worlds:**
1. 🌌 **Cosmic Portal** — Nebula with floating crystalline islands
2. 🌲 **Enchanted Forest** — Ancient oaks forming a mystical tunnel
3. 🌊 **Underwater Abyss** — Bioluminescent vortex with jellyfish
4. 🚀 **Space Station** — Cyberpunk corridor with wormhole
5. ⚙️ **Steampunk Clockwork** — Bronze gears with energy portal
6. 🔷 **Geometric Dimension** — Escher-like impossible architecture
7. 🍄 **Mushroom Kingdom** — Glowing fungi with stone archway
8. 🌋 **Volcanic World** — Lava rivers with purple vortex

## ✨ Features

### Visual Experience
- **Infinite Zoom** — Seamless, never-ending journey through nested worlds
- **Full-Screen Coverage** — Images fill the entire viewport
- **Center-Portal Focus** — Zoom naturally into each image's focal point
- **Smooth Layering** — Multiple worlds visible simultaneously for depth
- **Subtle Rotation** — Gentle spinning adds to the hypnotic effect
- **Vignette Effect** — Cinematic darkening at edges

### Interaction
- **Autoplay** — Starts automatically on page load
- **Scroll Wheel** — Adjust zoom speed (faster/slower)
- **Mouse Parallax** — Subtle offset based on cursor position
- **Touch Support** — Swipe and pinch gestures on mobile
- **Keyboard Controls** — Space (pause), Arrow keys (speed), M (mute)

### Audio
- **Procedural Ambient Drone** — No external audio files needed
- **Toggle Control** — Click audio button or press M
- **Graceful Handling** — Works around browser autoplay policies

### Performance & Accessibility
- **60fps Target** — Optimized for smooth animation
- **High-DPI Support** — Crisp on retina displays
- **Reduced Motion Support** — Respects `prefers-reduced-motion`
- **Responsive Design** — Works on all screen sizes
- **Cursor Auto-Hide** — Minimal UI that fades when inactive

## 🖥️ Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ Full support | ✅ Full support |
| Firefox | ✅ Full support | ✅ Full support |
| Safari | ✅ Full support | ✅ Full support |
| Edge | ✅ Full support | ✅ Full support |

### Requirements
- Canvas 2D API support (99%+ browsers)
- JavaScript enabled
- Images must load from HTTP server (not `file://`)

## 🚀 Quick Start

```bash
# Navigate to project directory
cd infinite-zoom

# Start local server (choose one)
npx serve .          # Port 3000
python -m http.server 8000  # Port 8000

# Open in browser
# http://localhost:3000 or http://localhost:8000
```

> See [INSTALLATION.md](./docs/INSTALLATION.md) for detailed setup instructions.

## 📁 Project Structure

```
infinite-zoom/
├── index.html          # Main HTML entry point
├── styles.css          # Styling and responsive design
├── main.js             # Core zoomquilt animation engine
├── assets/             # AI-generated portal images (8 layers)
│   ├── layer01.png     # Cosmic portal
│   ├── layer02.png     # Enchanted forest
│   ├── layer03.png     # Underwater vortex
│   ├── layer04.png     # Space station
│   ├── layer05.png     # Steampunk clockwork
│   ├── layer06.png     # Geometric dimension
│   ├── layer07.png     # Mushroom kingdom
│   └── layer08.png     # Volcanic world
└── docs/
    ├── README.md           # This file
    ├── INSTALLATION.md     # Setup guide
    ├── ARCHITECTURE.md     # Technical documentation
    └── CUSTOMIZATION.md    # Modification guide
```

## 🎮 Controls

| Input | Action |
|-------|--------|
| Mouse Move | Subtle parallax effect |
| Scroll Wheel | Adjust zoom speed |
| Space | Pause/Resume animation |
| ↑ Arrow | Increase zoom speed |
| ↓ Arrow | Decrease zoom speed |
| M | Toggle audio |
| Touch Drag | Parallax + speed control |
| Pinch | Adjust zoom speed |

## 🌐 Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Set source to main branch
4. Access at `https://CrazyyVitamin.github.io/infinite-zoom/`

### Netlify

Drag and drop the project folder to [netlify.com/drop](https://netlify.com/drop)

### Vercel

```bash
npm i -g vercel
vercel
```

### Static Hosting

This is a static site — upload all files to any static host.

## 📚 Documentation

- **[INSTALLATION.md](./docs/INSTALLATION.md)** — Detailed setup instructions
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — Technical implementation details
- **[CUSTOMIZATION.md](./docs/CUSTOMIZATION.md)** — How to modify and customize

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

- Motion concept inspired by [Zoomquilt](https://zoomquilt.org)
- AI-generated artwork for portal images
- Web Audio API for procedural ambient audio

---

*Created with 🌀 and infinite imagination*
