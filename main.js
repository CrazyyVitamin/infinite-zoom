/**
 * Infinite Zoom Experience - True Zoomquilt Style
 * ================================================
 * A hypnotic, infinite zoom-forward experience using AI-generated images
 * that layer and seamlessly transition into each other.
 * 
 * Inspired by zoomquilt.org (concept only).
 * 
 * The key principle: Each image has a center portal/focal point.
 * As you zoom INTO the image, the portal grows larger.
 * When the portal reaches a certain size, the next layer becomes visible
 * inside it, creating an infinite tunnel effect.
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
    // Image settings
    images: {
        path: 'assets/',
        count: 8,
        filePrefix: 'layer',
        fileExtension: '.png'
    },

    // Zoom settings - calibrated for zoomquilt effect
    zoom: {
        baseSpeed: 0.15,          // Zoom speed multiplier per second
        minSpeed: 0.02,           // Minimum zoom speed
        maxSpeed: 0.8,            // Maximum zoom speed
        scrollSensitivity: 0.0003,// Scroll wheel sensitivity

        // Layer scaling - when front layer reaches this scale, recycle it
        recycleScale: 4.0,        // Scale at which to recycle front layer
        initialScale: 0.25,       // Initial scale of back layers (inside portal)

        // Number of visible layers (for smooth overlap)
        visibleLayers: 4
    },

    // Visual settings
    visual: {
        rotationSpeed: 0.003,     // Subtle rotation (radians per second)
        rotationEnabled: true,
        enableVignette: true,
        vignetteIntensity: 0.4,
        parallaxIntensity: 0.015, // Subtle parallax on mouse

        // Smooth easing
        parallaxSmoothing: 0.05
    },

    // Performance
    performance: {
        useHighDPI: true,
        maxPixelRatio: 2
    },

    // Cursor auto-hide
    cursorHideDelay: 2500
};

// =============================================================================
// STATE
// =============================================================================

const state = {
    // Canvas
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,

    // Images
    images: [],
    imagesLoaded: 0,
    allImagesLoaded: false,

    // Layer system - each layer: { imageIndex, scale, opacity }
    layers: [],

    // Animation
    isPlaying: true,
    isPaused: false,
    lastTime: 0,
    deltaTime: 0,

    // Zoom
    zoomSpeed: CONFIG.zoom.baseSpeed,
    totalZoom: 0, // Track total zoom for rotation

    // Rotation
    currentRotation: 0,

    // Parallax
    targetParallax: { x: 0, y: 0 },
    currentParallax: { x: 0, y: 0 },

    // Cursor
    cursorTimer: null,

    // Audio
    audioContext: null,
    audioGain: null,
    audioOscillators: [],
    audioStarted: false,
    isMuted: true,

    // Accessibility
    reducedMotion: false
};

// =============================================================================
// INITIALIZATION
// =============================================================================

function init() {
    console.log('🌀 Initializing Infinite Zoom...');

    // Check reduced motion
    state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (state.reducedMotion) {
        showReducedMotionFallback();
        return;
    }

    initCanvas();
    loadImages();
    initEventListeners();
    initAudio();

    console.log('📷 Loading images...');
}

function initCanvas() {
    const container = document.getElementById('canvas-container');

    state.canvas = document.createElement('canvas');
    state.ctx = state.canvas.getContext('2d', { alpha: false });

    // Enable image smoothing for better quality
    state.ctx.imageSmoothingEnabled = true;
    state.ctx.imageSmoothingQuality = 'high';

    resizeCanvas();
    container.appendChild(state.canvas);
}

function resizeCanvas() {
    const dpr = CONFIG.performance.useHighDPI
        ? Math.min(window.devicePixelRatio, CONFIG.performance.maxPixelRatio)
        : 1;

    state.width = window.innerWidth;
    state.height = window.innerHeight;

    state.canvas.width = state.width * dpr;
    state.canvas.height = state.height * dpr;
    state.canvas.style.width = state.width + 'px';
    state.canvas.style.height = state.height + 'px';

    state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function loadImages() {
    const { path, count, filePrefix, fileExtension } = CONFIG.images;

    for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            state.imagesLoaded++;
            console.log(`✅ Image ${i}/${count} loaded`);

            if (state.imagesLoaded === count) {
                onAllImagesLoaded();
            }
        };

        img.onerror = () => {
            console.error(`❌ Failed to load image ${i}`);
        };

        // Pad number (01, 02, etc.)
        const paddedNum = String(i).padStart(2, '0');
        img.src = `${path}${filePrefix}${paddedNum}${fileExtension}`;
        state.images.push(img);
    }
}

function onAllImagesLoaded() {
    console.log('🎉 All images loaded! Starting...');
    state.allImagesLoaded = true;
    initLayers();
    state.lastTime = performance.now();
    animate();
}

function initLayers() {
    state.layers = [];

    // Create layers from back (smallest) to front (largest)
    // Each layer starts at a different scale, nested inside the previous
    for (let i = 0; i < CONFIG.zoom.visibleLayers; i++) {
        const scale = CONFIG.zoom.recycleScale * Math.pow(CONFIG.zoom.initialScale, CONFIG.zoom.visibleLayers - 1 - i);

        state.layers.push({
            imageIndex: i % CONFIG.images.count,
            scale: scale
        });
    }

    // Sort so front (largest scale) is rendered last
    state.layers.sort((a, b) => a.scale - b.scale);
}

// =============================================================================
// EVENT HANDLING
// =============================================================================

function initEventListeners() {
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousemove', resetCursorTimer);
    window.addEventListener('touchstart', resetCursorTimer);

    initTouchEvents();

    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) audioToggle.addEventListener('click', toggleAudio);

    document.addEventListener('visibilitychange', onVisibilityChange);

    window.matchMedia('(prefers-reduced-motion: reduce)')
        .addEventListener('change', onReducedMotionChange);

    const enableBtn = document.getElementById('enable-animation');
    if (enableBtn) enableBtn.addEventListener('click', enableAnimation);
}

function initTouchEvents() {
    let lastTouchY = 0;
    let lastPinchDist = 0;

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            lastTouchY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            lastPinchDist = getTouchDistance(e.touches);
        }
        document.body.classList.add('interacting');
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            state.targetParallax.x = (touch.clientX / state.width - 0.5) * CONFIG.visual.parallaxIntensity;
            state.targetParallax.y = (touch.clientY / state.height - 0.5) * CONFIG.visual.parallaxIntensity;

            const deltaY = lastTouchY - touch.clientY;
            if (Math.abs(deltaY) > 5) {
                adjustZoomSpeed(deltaY * 0.0008);
                lastTouchY = touch.clientY;
            }
        } else if (e.touches.length === 2) {
            const newDist = getTouchDistance(e.touches);
            adjustZoomSpeed((newDist - lastPinchDist) * 0.002);
            lastPinchDist = newDist;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        document.body.classList.remove('interacting');
    }, { passive: true });
}

function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function onWindowResize() {
    resizeCanvas();
}

function onMouseMove(e) {
    state.targetParallax.x = (e.clientX / state.width - 0.5) * CONFIG.visual.parallaxIntensity;
    state.targetParallax.y = (e.clientY / state.height - 0.5) * CONFIG.visual.parallaxIntensity;
}

function onWheel(e) {
    e.preventDefault();
    // Scroll down = faster (positive deltaY = speed up)
    adjustZoomSpeed(-e.deltaY * CONFIG.zoom.scrollSensitivity);
}

function adjustZoomSpeed(delta) {
    state.zoomSpeed = Math.max(
        CONFIG.zoom.minSpeed,
        Math.min(CONFIG.zoom.maxSpeed, state.zoomSpeed + delta)
    );
}

function onKeyDown(e) {
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePause();
            break;
        case 'ArrowUp':
            adjustZoomSpeed(0.03);
            break;
        case 'ArrowDown':
            adjustZoomSpeed(-0.03);
            break;
        case 'KeyM':
            toggleAudio();
            break;
    }
}

function togglePause() {
    state.isPaused = !state.isPaused;
    const indicator = document.getElementById('pause-indicator');

    if (state.isPaused) {
        indicator.classList.remove('hidden');
    } else {
        indicator.classList.add('hidden');
        state.lastTime = performance.now();
    }
}

function onVisibilityChange() {
    if (document.hidden) {
        state.wasPlaying = state.isPlaying;
        state.isPlaying = false;
    } else {
        state.isPlaying = state.wasPlaying !== false;
        state.lastTime = performance.now();
    }
}

function onReducedMotionChange(e) {
    if (e.matches) {
        state.reducedMotion = true;
        showReducedMotionFallback();
    } else {
        state.reducedMotion = false;
        hideReducedMotionFallback();
    }
}

function resetCursorTimer() {
    document.body.classList.remove('cursor-hidden');
    document.body.classList.add('controls-visible');

    clearTimeout(state.cursorTimer);
    state.cursorTimer = setTimeout(() => {
        document.body.classList.add('cursor-hidden');
        document.body.classList.remove('controls-visible');
    }, CONFIG.cursorHideDelay);
}

// =============================================================================
// REDUCED MOTION
// =============================================================================

function showReducedMotionFallback() {
    const fallback = document.getElementById('reduced-motion-fallback');
    const container = document.getElementById('canvas-container');
    if (fallback) fallback.classList.remove('hidden');
    if (container) container.classList.add('hidden');
    state.isPlaying = false;
}

function hideReducedMotionFallback() {
    const fallback = document.getElementById('reduced-motion-fallback');
    const container = document.getElementById('canvas-container');
    if (fallback) fallback.classList.add('hidden');
    if (container) container.classList.remove('hidden');
    state.isPlaying = true;
}

function enableAnimation() {
    state.reducedMotion = false;
    hideReducedMotionFallback();
    if (!state.allImagesLoaded) {
        loadImages();
    } else {
        state.isPlaying = true;
        state.lastTime = performance.now();
    }
}

// =============================================================================
// AUDIO
// =============================================================================

function initAudio() {
    try {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.audioGain = state.audioContext.createGain();
        state.audioGain.connect(state.audioContext.destination);
        state.audioGain.gain.value = 0;
        createAmbientDrone();
    } catch (e) {
        console.log('Audio not available');
    }
}

function createAmbientDrone() {
    if (!state.audioContext) return;

    const freqs = [55, 82.5, 110, 165, 220];

    freqs.forEach((freq, i) => {
        const osc = state.audioContext.createOscillator();
        const gain = state.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.1 / (i + 1);

        osc.connect(gain);
        gain.connect(state.audioGain);
        state.audioOscillators.push(osc);
    });

    // Add LFO
    const lfo = state.audioContext.createOscillator();
    const lfoGain = state.audioContext.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    state.audioOscillators.forEach(osc => lfoGain.connect(osc.frequency));
    state.audioOscillators.push(lfo);
}

function toggleAudio() {
    state.isMuted = !state.isMuted;
    const btn = document.getElementById('audio-toggle');

    if (state.isMuted) {
        btn.classList.add('muted');
        state.audioGain.gain.linearRampToValueAtTime(0, state.audioContext.currentTime + 0.5);
    } else {
        btn.classList.remove('muted');
        if (state.audioContext.state === 'suspended') state.audioContext.resume();
        if (!state.audioStarted) {
            state.audioOscillators.forEach(o => o.start());
            state.audioStarted = true;
        }
        state.audioGain.gain.linearRampToValueAtTime(0.35, state.audioContext.currentTime + 0.5);
    }
}

// =============================================================================
// ANIMATION
// =============================================================================

function animate() {
    requestAnimationFrame(animate);

    if (!state.isPlaying || state.isPaused || !state.allImagesLoaded) return;

    const now = performance.now();
    state.deltaTime = Math.min((now - state.lastTime) / 1000, 0.1);
    state.lastTime = now;

    update();
    render();
}

function update() {
    // Grow all layers (zoom in)
    const zoomFactor = 1 + state.zoomSpeed * state.deltaTime;

    state.layers.forEach(layer => {
        layer.scale *= zoomFactor;
    });

    state.totalZoom += state.zoomSpeed * state.deltaTime;

    // Rotation
    if (CONFIG.visual.rotationEnabled) {
        state.currentRotation += CONFIG.visual.rotationSpeed * state.deltaTime;
    }

    // Parallax smoothing
    state.currentParallax.x += (state.targetParallax.x - state.currentParallax.x) * CONFIG.visual.parallaxSmoothing;
    state.currentParallax.y += (state.targetParallax.y - state.currentParallax.y) * CONFIG.visual.parallaxSmoothing;

    // Recycle front layer when it gets too big
    while (state.layers.length > 0 && state.layers[state.layers.length - 1].scale > CONFIG.zoom.recycleScale) {
        recycleFrontLayer();
    }
}

function recycleFrontLayer() {
    // Remove the front (largest) layer
    const frontLayer = state.layers.pop();

    // Find the current back layer to determine next image index
    const backLayer = state.layers[0];

    // Calculate next image index (going backwards through images)
    const prevImageIndex = (backLayer.imageIndex - 1 + CONFIG.images.count) % CONFIG.images.count;

    // Create new back layer at small scale
    state.layers.unshift({
        imageIndex: prevImageIndex,
        scale: backLayer.scale * CONFIG.zoom.initialScale
    });
}

function render() {
    const ctx = state.ctx;
    const w = state.width;
    const h = state.height;
    const cx = w / 2;
    const cy = h / 2;

    // Clear with dark background
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, w, h);

    // Calculate size needed to cover screen (considering rotation)
    const diagonal = Math.sqrt(w * w + h * h);

    // Render layers from back (smallest) to front (largest)
    for (let i = 0; i < state.layers.length; i++) {
        const layer = state.layers[i];
        const img = state.images[layer.imageIndex];

        if (!img || !img.complete) continue;

        // Calculate display size (cover the screen)
        const size = diagonal * layer.scale * 1.05;

        // Skip if too small to see
        if (size < 10) continue;

        // Parallax offset - stronger for front layers
        const parallaxMultiplier = Math.min(layer.scale, 2);
        const px = state.currentParallax.x * w * parallaxMultiplier;
        const py = state.currentParallax.y * h * parallaxMultiplier;

        ctx.save();

        // Position at center with parallax
        ctx.translate(cx + px, cy + py);

        // Apply rotation (subtle, different per layer for depth)
        const layerRotation = state.currentRotation * (0.8 + i * 0.1);
        ctx.rotate(layerRotation);

        // Draw image centered, covering the viewport
        ctx.drawImage(
            img,
            -size / 2,
            -size / 2,
            size,
            size
        );

        ctx.restore();
    }

    // Draw vignette
    if (CONFIG.visual.enableVignette) {
        drawVignette(ctx, w, h);
    }
}

function drawVignette(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.max(w, h) * 0.8;

    const gradient = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${CONFIG.visual.vignetteIntensity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
}

// =============================================================================
// START
// =============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
