/**
 * @module ParticleSystem
 * @description Manages the background grid and particle animations for Shimti Multimedia.
 * Optimizes main-thread rendering at 30 FPS for a smooth sci-fi aesthetic.
 */

/** @constant {Object} PARTICLE_CONFIG - Configuration for particle and grid animations */
const PARTICLE_CONFIG = {
  MAX_PARTICLES: 100, // Number of particles, optimized for performance
  TURN_PROBABILITY: 0.01, // Probability of particle direction change
  DIRECTION_ANGLES: [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2], // Possible movement angles
  GRID_SPACING: 80, // Grid line spacing in pixels
  GRID_STROKE: 'rgba(100, 150, 255, 0.1)', // Grid line color
  PARTICLE_STROKE: 'rgba(180, 220, 255, {alpha})', // Particle trail color template
  PARTICLE_SHADOW: '#8cf', // Particle shadow color
  PARTICLE_FILL: 'rgba(234, 255, 255, {depth})', // Particle fill color template
  TARGET_FPS: 30, // Target frames per second
};

/**
 * @class Particle
 * @description Represents a single animated particle with position, trail, and rendering logic.
 */
class Particle {
  /**
   * @param {number} depth - Visual depth factor (0.3 to 1.0)
   * @param {number} id - Unique particle identifier
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  constructor(depth, id, width, height) {
    this.id = id;
    this.depth = depth;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.trail = [];
    this.reset();
  }

  /** @method reset - Resets particle properties to initial state */
  reset() {
    if (!this.width || !this.height) {
      console.error('Invalid dimensions in Particle.reset:', { width: this.width, height: this.height });
      return;
    }
    this.x = Math.random() * this.width;
    this.y = Math.random() * this.height;
    this.setRandomDirection();
    this.baseSpeed = (0.5 + Math.random() * (Math.random() < 0.2 ? 4.0 : 1.2)) * this.depth;
    this.speed = this.baseSpeed;
    this.size = (0.5 + Math.random() * 1.2) * this.depth;
    this.trail = [];
    this.maxTrailLength = Math.floor(Math.random() * 20) + 2;
    this.fadeCounter = 0;
    this.fadeLimit = Math.random() * 400 + 100;
  }

  /** @method setRandomDirection - Sets a random movement direction */
  setRandomDirection() {
    this.angle = PARTICLE_CONFIG.DIRECTION_ANGLES[Math.floor(Math.random() * PARTICLE_CONFIG.DIRECTION_ANGLES.length)];
  }

  /** @method maybeTurn - Randomly changes particle direction based on probability */
  maybeTurn() {
    if (Math.random() < PARTICLE_CONFIG.TURN_PROBABILITY) {
      const directionIndex = PARTICLE_CONFIG.DIRECTION_ANGLES.indexOf(this.angle);
      const turn = Math.random() < 0.5 ? -1 : 1;
      const newIndex = (directionIndex + turn + PARTICLE_CONFIG.DIRECTION_ANGLES.length) % PARTICLE_CONFIG.DIRECTION_ANGLES.length;
      this.angle = PARTICLE_CONFIG.DIRECTION_ANGLES[newIndex];
    }
  }

  /** @method update - Updates particle position and trail */
  update() {
    this.maybeTurn();
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.fadeCounter++;
    if (
      this.fadeCounter > this.fadeLimit ||
      this.x < -50 ||
      this.x > this.width + 50 ||
      this.y < -50 ||
      this.y > this.height + 50
    ) {
      this.reset();
    }
  }

  /**
   * @method render - Renders the particle and its trail on the canvas
   * @param {CanvasRenderingContext2D} context - Canvas 2D rendering context
   */
  render(context) {
    for (let i = 0; i < this.trail.length - 1; i++) {
      const p1 = this.trail[i];
      const p2 = this.trail[i + 1];
      const alpha = (i / this.trail.length) * this.depth * 0.3;
      context.strokeStyle = PARTICLE_CONFIG.PARTICLE_STROKE.replace('{alpha}', alpha);
      context.lineWidth = 0.5 * this.depth;
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.stroke();
    }

    context.shadowBlur = 1.5 * this.depth;
    context.shadowColor = PARTICLE_CONFIG.PARTICLE_SHADOW;
    context.fillStyle = PARTICLE_CONFIG.PARTICLE_FILL.replace('{depth}', this.depth);
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }
}

/**
 * @function initializeParticleSystem
 * @description Initializes the particle system and grid animation
 */
function initializeParticleSystem() {
  const gridCanvas = document.getElementById('gridLayer');
  const particleCanvas = document.getElementById('circuitBrain');
  if (!gridCanvas || !particleCanvas) {
    console.error('Canvas elements not found:', { gridCanvas, particleCanvas });
    return;
  }

  const gridContext = gridCanvas.getContext('2d', { alpha: true });
  const particleContext = particleCanvas.getContext('2d', { alpha: true });
  if (!gridContext || !particleContext) {
    console.error('Canvas contexts not available:', { gridContext, particleContext });
    return;
  }

  let width = window.innerWidth;
  let height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  const offscreenGrid = document.createElement('canvas');
  offscreenGrid.width = width * dpr;
  offscreenGrid.height = height * dpr;
  const offscreenContext = offscreenGrid.getContext('2d', { alpha: true });
  offscreenContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  [gridCanvas, particleCanvas].forEach(canvas => {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const context = canvas.getContext('2d');
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  });

  /** @function renderGrid - Renders the background grid to an offscreen canvas */
  function renderGrid() {
    offscreenContext.clearRect(0, 0, width, height);
    offscreenContext.strokeStyle = PARTICLE_CONFIG.GRID_STROKE;
    offscreenContext.lineWidth = 1;

    for (let x = 0; x < width; x += PARTICLE_CONFIG.GRID_SPACING) {
      offscreenContext.beginPath();
      offscreenContext.moveTo(x, 0);
      offscreenContext.lineTo(x, height);
      offscreenContext.stroke();
    }
    for (let y = 0; y < height; y += PARTICLE_CONFIG.GRID_SPACING) {
      offscreenContext.beginPath();
      offscreenContext.moveTo(0, y);
      offscreenContext.lineTo(width, y);
      offscreenContext.stroke();
    }

    gridContext.clearRect(0, 0, width, height);
    gridContext.drawImage(offscreenGrid, 0, 0);
  }

  const particles = [];
  let particleId = 0;

  for (let depth = 0.3; depth <= 1.0; depth += 0.2) {
    const count = Math.floor(PARTICLE_CONFIG.MAX_PARTICLES * (depth / 1.0));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(depth, particleId, width, height));
      particleId++;
    }
  }

  let lastTime = performance.now();
  /** @function animate - Updates and renders particles at target FPS */
  function animate() {
    const now = performance.now();
    const delta = now - lastTime;
    const frameInterval = 1000 / PARTICLE_CONFIG.TARGET_FPS;

    if (delta >= frameInterval) {
      particleContext.clearRect(0, 0, width, height);
      particles.forEach(particle => {
        particle.update();
        particle.render(particleContext);
      });
      lastTime = now - (delta % frameInterval);
    }

    requestAnimationFrame(animate);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = window.innerWidth;
      height = window.innerHeight;
      [gridCanvas, particleCanvas, offscreenGrid].forEach(canvas => {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        if (canvas !== offscreenGrid) {
          const context = canvas.getContext('2d');
          context.setTransform(dpr, 0, 0, dpr, 0, 0);
        } else {
          offscreenContext.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      });
      particles.forEach(particle => {
        particle.width = width;
        particle.height = height;
      });
      renderGrid();
    }, 100);
  });

  renderGrid();
  animate();
}

window.addEventListener('load', initializeParticleSystem);
