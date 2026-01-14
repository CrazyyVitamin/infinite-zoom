# Architecture Documentation

This document explains the technical architecture of the Infinite Zoom Experience, including how the zoomquilt illusion works, the rendering pipeline, and the layer management system.

## 🎯 Overview

The application creates a hypnotic, infinite zoom-forward experience using:

- **Canvas 2D API** for hardware-accelerated image rendering
- **Layer Recycling System** for infinite seamless looping
- **AI-Generated Images** with centered portals for zoom-through effect
- **Procedural Audio** via Web Audio API

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Window                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Canvas 2D Context                       │   │
│   │  ┌─────────────────────────────────────────────┐    │   │
│   │  │           Layer Stack (4 layers)            │    │   │
│   │  │  ┌─────────────────────────────────────┐    │    │   │
│   │  │  │  Layer 4 (front) - largest scale    │    │    │   │
│   │  │  │  Layer 3                            │    │    │   │
│   │  │  │  Layer 2                            │    │    │   │
│   │  │  │  Layer 1 (back) - smallest scale    │    │    │   │
│   │  │  └─────────────────────────────────────┘    │    │   │
│   │  └─────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 How the Infinite Zoom Works

### The Core Illusion

The zoomquilt effect is achieved through **layer stacking and recycling**. Multiple images are rendered at different scales, creating the illusion of infinite depth:

```
Time T1                Time T2                Time T3
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│ ┌───────────┐ │      │               │      │               │
│ │ ┌───────┐ │ │ →    │ ┌───────────┐ │ →    │               │
│ │ │ ┌───┐ │ │ │      │ │ ┌───────┐ │ │      │ ┌───────────┐ │
│ │ │ │ ● │ │ │ │      │ │ │ ┌───┐ │ │ │      │ │ ┌───────┐ │ │
│ │ │ └───┘ │ │ │      │ │ │ │ ● │ │ │ │      │ │ │ ┌───┐ │ │ │
│ │ └───────┘ │ │      │ │ └───────┘ │ │      │ │ │ │ ● │ │ │ │
│ └───────────┘ │      │ └───────────┘ │      │ │ └───────┘ │ │
└───────────────┘      └───────────────┘      └───────────────┘
  Back layer recycles    All layers grow       Front recycled
```

### Key Principles

1. **Cover-Fill Rendering** — Each layer is scaled to cover the entire viewport
2. **Center Portal Focus** — Images have a central focal point for seamless nesting
3. **Exponential Scaling** — Each nested layer is 0.25x the size of its parent
4. **Front-to-Back Recycling** — When front layer exceeds 4x scale, it moves to back

### Mathematical Basis

```javascript
// Layer initialization - nested scales
for (let i = 0; i < visibleLayers; i++) {
    const scale = recycleScale * Math.pow(initialScale, visibleLayers - 1 - i);
    layers.push({ imageIndex: i, scale: scale });
}

// Animation loop - exponential zoom
const zoomFactor = 1 + zoomSpeed * deltaTime;
layers.forEach(layer => layer.scale *= zoomFactor);

// Recycling - move front to back
while (layers[layers.length - 1].scale > recycleScale) {
    const front = layers.pop();
    front.scale = layers[0].scale * initialScale;
    front.imageIndex = (layers[0].imageIndex - 1 + imageCount) % imageCount;
    layers.unshift(front);
}
```

## 🎨 Image Layer System

### Image Requirements

Each of the 8 AI-generated images follows these design principles:

| Requirement | Purpose |
|-------------|---------|
| Central Portal | 30% of image area, focal point for zoom |
| Detailed Edges | Rich scenery around the portal |
| Dark Portal Interior | Blends with next layer appearing inside |
| Square Aspect Ratio | Maintains consistency during rotation |
| High Resolution | ~1MB per image for quality at scale |

### Layer Stack Configuration

```javascript
const CONFIG = {
    zoom: {
        recycleScale: 4.0,      // Scale at which front layer recycles
        initialScale: 0.25,     // Scale of new back layer (nested inside)
        visibleLayers: 4        // Number of simultaneous layers
    }
};
```

**Why 4 layers?**
- Fewer than 4: Visible "pop-in" when new layers appear
- More than 4: Unnecessary rendering overhead
- 4 provides smooth overlap with minimal performance cost

## 🖼️ Rendering Pipeline

### Frame-by-Frame Process

```
┌──────────────────────────────────────────────────────────────┐
│                    Animation Frame                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Calculate Delta Time                                     │
│     └─ deltaTime = min((now - lastFrame) / 1000, 0.1)        │
│                                                              │
│  2. Update Layer Scales                                      │
│     └─ scale *= (1 + zoomSpeed * deltaTime)                  │
│                                                              │
│  3. Recycle Front Layers                                     │
│     ├─ If scale > recycleScale, move to back                 │
│     └─ Reset scale and advance image index                   │
│                                                              │
│  4. Update Parallax                                          │
│     └─ Smooth interpolation toward target                    │
│                                                              │
│  5. Render Back-to-Front                                     │
│     ├─ Clear canvas with dark background                     │
│     ├─ For each layer (smallest to largest):                 │
│     │   ├─ Calculate cover-fill size                         │
│     │   ├─ Apply parallax offset                             │
│     │   ├─ Apply rotation                                    │
│     │   └─ Draw image centered                               │
│     └─ Draw vignette overlay                                 │
│                                                              │
│  6. Request Next Frame                                       │
│     └─ requestAnimationFrame(animate)                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Cover-Fill Algorithm

```javascript
function render() {
    const diagonal = Math.sqrt(width * width + height * height);
    
    for (const layer of layers) {
        // Size = viewport diagonal × scale × safety margin
        const size = diagonal * layer.scale * 1.05;
        
        ctx.save();
        ctx.translate(centerX + parallaxX, centerY + parallaxY);
        ctx.rotate(rotation * layerFactor);
        ctx.drawImage(image, -size/2, -size/2, size, size);
        ctx.restore();
    }
}
```

The diagonal calculation ensures the image covers the screen even during rotation.

## ⚡ Performance Optimization

### Techniques Used

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| High-DPI Capping | `Math.min(devicePixelRatio, 2)` | Prevents excessive resolution |
| Delta Time Clamping | `Math.min(deltaTime, 0.1)` | Prevents huge frame skips |
| Image Smoothing | `ctx.imageSmoothingQuality = 'high'` | Quality at various scales |
| Visibility Pause | `document.hidden` check | Saves resources when tab hidden |
| Layer Culling | Skip layers with `size < 10` | Don't render invisible layers |

### Memory Management

```javascript
// Pre-load all images at startup
const images = [];
for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `assets/layer${i.toString().padStart(2, '0')}.png`;
    images.push(img);
}

// Layers reference images by index, not copies
layers.push({ imageIndex: 0, scale: 1.0 });
```

Only 8 images are ever loaded; layers just reference them by index.

## 🎵 Audio System

### Procedural Audio Generation

```javascript
// Harmonic drone (A minor feel)
const frequencies = [55, 82.5, 110, 165, 220]; // A1, E2, A2, E3, A3

frequencies.forEach((freq, i) => {
    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const gain = audioContext.createGain();
    gain.gain.value = 0.1 / (i + 1); // Quieter upper harmonics
    
    osc.connect(gain).connect(masterGain);
});

// LFO for subtle movement
const lfo = audioContext.createOscillator();
lfo.frequency.value = 0.07; // Very slow oscillation
lfo.connect(lfoGain).connect(osc.frequency);
```

## 🔧 System Components

```
┌──────────────────────────────────────────────────────────────┐
│                        main.js                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐      │
│  │   CONFIG     │   │    STATE     │   │   IMAGES     │      │
│  │              │   │              │   │              │      │
│  │ - zoom       │   │ - canvas     │   │ - 8 layers   │      │
│  │ - visual     │   │ - layers[]   │   │ - preloaded  │      │
│  │ - parallax   │   │ - parallax   │   │              │      │
│  │ - performance│   │ - rotation   │   │              │      │
│  └──────────────┘   └──────────────┘   └──────────────┘      │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                    INITIALIZATION                     │   │
│  │  init() → initCanvas() → loadImages() → initEvents()  │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │                    ANIMATION LOOP                     │   │
│  │  animate() → update() → recycleLayers() → render()    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐      │
│  │   EVENTS     │   │    AUDIO     │   │   EFFECTS    │      │
│  │              │   │              │   │              │      │
│  │ - mouse      │   │ - context    │   │ - vignette   │      │
│  │ - touch      │   │ - oscillators│   │ - rotation   │      │
│  │ - keyboard   │   │ - gain       │   │ - parallax   │      │
│  │ - resize     │   │              │   │              │      │
│  └──────────────┘   └──────────────┘   └──────────────┘      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 📊 Technical Specifications

| Aspect | Specification |
|--------|---------------|
| Rendering | Canvas 2D API |
| Image Format | PNG with transparency-compatible edges |
| Image Count | 8 layers |
| Image Size | ~1MB each (1024×1024 approx) |
| Target FPS | 60 fps |
| Visible Layers | 4 simultaneous |
| Dependencies | None (vanilla JavaScript) |
| Browser Support | All modern browsers |

## 🔮 Potential Enhancements

1. **WebGL Rendering** — Use GPU textures for even smoother scaling
2. **More Images** — Expand to 16+ layers for more variety
3. **Dynamic Loading** — Load images on-demand for faster initial load
4. **Post-Processing** — Add bloom, color grading, film grain
5. **VR Support** — WebXR integration for immersive experience
6. **Audio Reactivity** — Zoom speed responds to music input
7. **Custom Image Upload** — Let users add their own portal images

---

*For customization options, see [CUSTOMIZATION.md](./CUSTOMIZATION.md)*
