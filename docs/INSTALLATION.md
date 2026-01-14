# Installation Guide

Complete instructions for setting up and running the Infinite Zoom Experience locally.

## 📋 Prerequisites

Before you begin, ensure you have the following:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Modern Web Browser | Chrome 80+, Firefox 75+, Safari 13+, Edge 80+ | Runs the application |
| Local Server | Any HTTP server | Required to serve files (see options below) |
| Node.js (optional) | 14.0+ | For `npx serve` method |
| Python (optional) | 2.7+ or 3.x | For Python server method |

### Browser Requirements
- JavaScript enabled
- Canvas 2D API support (available in 99%+ of browsers)
- Web Audio API support (for ambient audio)

---

## 🚀 Quick Installation

### Step 1: Download/Clone the Project

```bash
# Clone from repository (if using git)
git clone <repository-url>
cd infinite-zoom

# Or download and extract the ZIP file
```

### Step 2: Verify Project Structure

Ensure your project folder contains:

```
infinite-zoom/
├── index.html          # Main HTML entry point
├── styles.css          # Styling and responsive design
├── main.js             # Core zoomquilt animation logic
├── assets/             # AI-generated portal images
│   ├── layer01.png     # Cosmic portal world
│   ├── layer02.png     # Enchanted forest
│   ├── layer03.png     # Underwater vortex
│   ├── layer04.png     # Space station wormhole
│   ├── layer05.png     # Steampunk clockwork
│   ├── layer06.png     # Geometric dimension
│   ├── layer07.png     # Mushroom kingdom
│   └── layer08.png     # Volcanic world
└── docs/               # Documentation
    ├── README.md
    ├── INSTALLATION.md # This file
    ├── ARCHITECTURE.md
    └── CUSTOMIZATION.md
```

### Step 3: Start a Local Server

Choose one of the following methods:

---

## 🔧 Server Options

### Option A: Node.js with npx serve (Recommended)

```bash
# Navigate to project directory
cd infinite-zoom

# Start server (installs serve automatically)
npx serve .

# Output: http://localhost:3000
```

### Option B: Python HTTP Server

```bash
# Python 3.x
cd infinite-zoom
python -m http.server 8000

# Python 2.x
cd infinite-zoom
python -m SimpleHTTPServer 8000

# Open: http://localhost:8000
```

### Option C: VS Code Live Server Extension

1. Install "Live Server" extension from VS Code marketplace
2. Right-click `index.html` → "Open with Live Server"
3. Browser opens automatically

### Option D: Node.js http-server

```bash
# Install globally (once)
npm install -g http-server

# Run
cd infinite-zoom
http-server -p 8000

# Open: http://localhost:8000
```

### Option E: PHP Built-in Server

```bash
cd infinite-zoom
php -S localhost:8000

# Open: http://localhost:8000
```

---

## ⚠️ Important Notes

### Why a Local Server is Required

Opening `index.html` directly with `file://` protocol may cause:

- **CORS errors** when loading images from the `assets/` folder
- **Audio API restrictions** preventing procedural audio
- **Inconsistent behavior** across different browsers

Always use an HTTP server (`http://localhost:...`) for best results.

### Firewall/Security Software

If the server fails to start or the browser can't connect:

1. Check if your firewall is blocking the port (8000, 3000, etc.)
2. Try a different port: `npx serve . -p 5000`
3. Temporarily disable security software to test

---

## ✅ Verifying Installation

After starting your server, you should see:

1. **Full-screen animation** with colorful surreal artwork
2. **No black borders** - images fill the entire viewport
3. **Smooth zoom** continuously into the center of each image
4. **Controls visible** after moving the mouse:
   - Audio toggle button (bottom-left)
   - Pause indicator appears when pressing Space

### Test Checklist

| Test | Expected Result |
|------|-----------------|
| Page loads | See colorful AI-generated artwork |
| Animation runs | Continuous zoom into center portal |
| Scroll wheel | Zoom speed changes |
| Space key | Pause/resume with overlay |
| M key | Audio toggles on/off |
| Mouse move | Subtle parallax effect |

---

## 🐛 Troubleshooting

### Images Not Loading

```
Console: "Failed to load image X"
```

**Solutions:**
- Ensure all 8 images exist in `assets/` folder
- Check file names are `layer01.png` through `layer08.png`
- Verify images are not corrupted (try opening in image viewer)
- Use a local server instead of `file://` protocol

### Black Screen

**Possible causes:**
- JavaScript disabled in browser
- Ad blocker interfering
- Console errors (press F12 to check)

**Solutions:**
- Enable JavaScript
- Disable ad blocker for localhost
- Check browser console for specific errors

### Poor Performance / Low FPS

**Solutions:**
- Close other browser tabs
- Disable browser extensions
- Use a Chromium-based browser (Chrome, Edge)
- Reduce browser window size

### Audio Not Working

**Note:** Audio is muted by default due to browser autoplay policies.

**Solutions:**
- Click the audio button or press M to enable
- Ensure browser allows audio for the page
- Check system volume is not muted

---

## 📦 Offline Usage

The application works offline once loaded:

1. Load the page with a server once
2. All assets are cached in browser
3. Open later without internet (same browser)

For true offline deployment, consider:
- PWA (Progressive Web App) configuration
- Service worker for caching

---

## 🚢 Deployment

See [README.md](./README.md#deployment) for deployment options including:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

---

## 📚 Next Steps

- Read [CUSTOMIZATION.md](./CUSTOMIZATION.md) to modify colors, speed, and effects
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Explore [README.md](./README.md) for full feature documentation

---

*Need help? Check the browser console (F12) for error messages.*
