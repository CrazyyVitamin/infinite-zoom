# Customization Guide

This guide explains how to customize the Infinite Zoom Experience to create your own unique visual journey.

## 📁 File Structure

```
infinite-zoom/
├── index.html      # Page structure (rarely needs changes)
├── styles.css      # UI styling & colors
├── main.js         # Core logic & configuration
├── assets/         # AI-generated portal images
│   └── layer01-08.png
└── docs/           # Documentation
```

Most customizations happen in `main.js` through the `CONFIG` object or by adding/replacing images.

## ⚙️ Configuration Options

The `CONFIG` object at the top of `main.js` controls all major settings:

### Zoom Settings

```javascript
const CONFIG = {
    zoom: {
        baseSpeed: 0.15,          // Default zoom speed
        minSpeed: 0.02,           // Minimum allowed speed
        maxSpeed: 0.8,            // Maximum allowed speed
        scrollSensitivity: 0.0003,// Scroll wheel sensitivity
        recycleScale: 4.0,        // When to recycle front layer
        initialScale: 0.25,       // Scale of new back layers
        visibleLayers: 4          // Number of simultaneous layers
    },
    // ...
};
```

| Setting | Default | Range | Effect |
|---------|---------|-------|--------|
| `baseSpeed` | 0.15 | 0.02 - 0.8 | How fast the default zoom is |
| `minSpeed` | 0.02 | 0.01 - 0.1 | Slowest the user can go |
| `maxSpeed` | 0.8 | 0.3 - 2.0 | Fastest the user can go |
| `scrollSensitivity` | 0.0003 | 0.0001 - 0.001 | Scroll wheel responsiveness |
| `recycleScale` | 4.0 | 2.0 - 8.0 | Larger = smoother but more overlap |
| `initialScale` | 0.25 | 0.1 - 0.5 | Smaller = more nested depth |
| `visibleLayers` | 4 | 3 - 6 | More = smoother but slower |

**Example: Slower, more meditative experience:**
```javascript
zoom: {
    baseSpeed: 0.05,
    minSpeed: 0.02,
    maxSpeed: 0.3,
    scrollSensitivity: 0.0002
}
```

**Example: Fast, intense zoom:**
```javascript
zoom: {
    baseSpeed: 0.4,
    minSpeed: 0.1,
    maxSpeed: 1.5,
    scrollSensitivity: 0.0005
}
```

### Visual Settings

```javascript
visual: {
    rotationSpeed: 0.003,     // Subtle rotation (radians/sec)
    rotationEnabled: true,
    enableVignette: true,
    vignetteIntensity: 0.4,
    parallaxIntensity: 0.015, // Mouse parallax strength
    parallaxSmoothing: 0.05   // How smoothly parallax follows
}
```

| Setting | Default | Range | Effect |
|---------|---------|-------|--------|
| `rotationSpeed` | 0.003 | 0 - 0.02 | Subtle spinning (0 = off) |
| `vignetteIntensity` | 0.4 | 0 - 0.8 | Edge darkening strength |
| `parallaxIntensity` | 0.015 | 0 - 0.05 | Mouse movement response |

**Example: No rotation, strong vignette:**
```javascript
visual: {
    rotationSpeed: 0,
    rotationEnabled: false,
    enableVignette: true,
    vignetteIntensity: 0.6
}
```

### Performance Settings

```javascript
performance: {
    useHighDPI: true,         // Use retina resolution
    maxPixelRatio: 2          // Cap DPI for performance
}
```

On slower devices, reduce `maxPixelRatio` to 1.

## 🖼️ Customizing Images

### Adding Your Own Images

The most impactful customization is replacing the portal images:

1. **Create or generate images** with these requirements:
   - Square aspect ratio (1024×1024 recommended)
   - Central portal/focal point (~30% of image)
   - Dark portal interior for seamless layering
   - Rich detail around the edges

2. **Replace images** in the `assets/` folder:
   ```
   assets/
   ├── layer01.png  # First world
   ├── layer02.png  # Second world
   ├── layer03.png  # ...continues
   └── layer08.png  # Eighth world
   ```

3. **Update image count** if different from 8:
   ```javascript
   const CONFIG = {
       images: {
           path: 'assets/',
           count: 12,  // Changed from 8 to 12
           filePrefix: 'layer',
           fileExtension: '.png'
       }
   };
   ```

### Image Design Tips

| Element | Guideline |
|---------|-----------|
| Central Portal | 25-35% of image, clearly defined |
| Portal Interior | Dark or blurred (next layer appears here) |
| Edge Details | Rich, interesting patterns |
| Color Scheme | Consistent across all images for flow |
| Resolution | 1024×1024 minimum, 2048×2048 for 4K |

### Using AI Image Generators

Prompt template for AI image generators:

```
[Scene description], in the exact center of the image there is 
a circular portal/tunnel/opening about 30% of the image size 
that leads deeper into [next scene hint], the central opening 
is the focal point for zooming into, ultra detailed, 4K
```

**Example prompts:**
- Underwater coral reef with central whirlpool vortex
- Gothic cathedral with central stained glass window portal
- Cyberpunk city with central holographic tunnel
- Forest clearing with central fairy ring

## 🔊 Audio Customization

### Changing the Drone Sound

Modify the frequencies in `createAmbientDrone()`:

```javascript
// Current: A minor feel
const freqs = [55, 82.5, 110, 165, 220];

// Alternative: C major feel
const freqs = [65.41, 98.0, 130.81, 196.0, 261.63];

// Alternative: Deep bass
const freqs = [27.5, 41.25, 55, 82.5];

// Alternative: Ethereal
const freqs = [110, 220, 330, 440, 550];
```

### Adjusting LFO Modulation

```javascript
const lfo = state.audioContext.createOscillator();
lfo.frequency.value = 0.07; // Default: slow wobble

// Faster pulsing
lfo.frequency.value = 0.3;

// Slower, more subtle
lfo.frequency.value = 0.02;
```

### Adding External Audio

To use an audio file instead of procedural audio:

```javascript
async function loadExternalAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
    
    const source = state.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.connect(state.audioGain);
    
    return source;
}

// Usage: replace createAmbientDrone() call
const audio = await loadExternalAudio('assets/ambient.mp3');
audio.start();
```

## 🖌️ UI Customization

### Colors & Styling

Modify CSS custom properties in `styles.css`:

```css
:root {
    /* Background */
    --color-bg: #050508;
    
    /* Text colors */
    --color-text: #e0e0e0;
    --color-text-muted: #888;
    
    /* Accent (buttons, highlights) */
    --color-accent: #6366f1;
    --color-accent-glow: rgba(99, 102, 241, 0.4);
}
```

**Example: Warm theme:**
```css
:root {
    --color-bg: #1a0f0a;
    --color-accent: #f59e0b;
    --color-accent-glow: rgba(245, 158, 11, 0.4);
}
```

### Cursor Auto-Hide Delay

```javascript
// In CONFIG
cursorHideDelay: 2500  // Milliseconds (default)

// Faster hide (1 second)
cursorHideDelay: 1000

// Disable auto-hide
cursorHideDelay: Infinity
```

### Pause Overlay Styling

In `styles.css`:

```css
#pause-indicator {
    background: rgba(0, 0, 0, 0.7);  /* Adjust opacity */
    font-size: 1.5rem;                /* Text size */
    letter-spacing: 0.3em;            /* Spacing */
}
```

## 🚀 Advanced Customizations

### Adding Post-Processing Effects

Modify the `render()` function to add effects after drawing layers:

```javascript
// After drawing all layers, before vignette
function addChromaticAberration(offset = 2) {
    const imageData = ctx.getImageData(0, 0, state.width, state.height);
    // Shift color channels... (complex implementation)
    ctx.putImageData(imageData, 0, 0);
}

// Or use CSS filters on the canvas
state.canvas.style.filter = 'saturate(1.2) contrast(1.1)';
```

### Dynamic Image Loading

Load images on-demand instead of all at startup:

```javascript
async function loadImageOnDemand(index) {
    if (state.images[index]) return; // Already loaded
    
    const img = new Image();
    img.src = `assets/layer${String(index + 1).padStart(2, '0')}.png`;
    await new Promise(resolve => img.onload = resolve);
    state.images[index] = img;
}
```

### Sharing Configurations

Create preset files:

```json
{
    "name": "Meditative",
    "zoom": {
        "baseSpeed": 0.05,
        "minSpeed": 0.02,
        "maxSpeed": 0.2
    },
    "visual": {
        "rotationSpeed": 0,
        "vignetteIntensity": 0.5
    }
}
```

Load and apply:

```javascript
async function loadPreset(url) {
    const response = await fetch(url);
    const preset = await response.json();
    
    Object.assign(CONFIG.zoom, preset.zoom);
    Object.assign(CONFIG.visual, preset.visual);
}
```

---

## 📚 Quick Reference

| What to Change | Where | Key Variables |
|----------------|-------|---------------|
| Zoom speed | `CONFIG.zoom` | `baseSpeed`, `minSpeed`, `maxSpeed` |
| Layer depth | `CONFIG.zoom` | `recycleScale`, `initialScale` |
| Rotation | `CONFIG.visual` | `rotationSpeed`, `rotationEnabled` |
| Edge darkening | `CONFIG.visual` | `vignetteIntensity` |
| Parallax strength | `CONFIG.visual` | `parallaxIntensity` |
| Images | `assets/` folder | `layer01.png` - `layer08.png` |
| Image count | `CONFIG.images` | `count` |
| Audio frequencies | `createAmbientDrone()` | `freqs` array |
| UI colors | `styles.css` | CSS custom properties |

---

*For technical details, see [ARCHITECTURE.md](./ARCHITECTURE.md)*
