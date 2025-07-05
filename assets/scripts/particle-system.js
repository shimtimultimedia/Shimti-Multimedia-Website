/**
 * @module ParticleSystem
 * @description Manages particle animations (neural-like dots with trails) for Shimti Multimedia.
 * Optimized for main-thread rendering at 30 FPS, compatible with Brave browser.
 */

/** @constant {Object} window.PARTICLE_CONFIG - Configuration for particle animations */
window.PARTICLE_CONFIG = {
  MAX_PARTICLES: 30, // Number of particles
  TURN_PROBABILITY: 0.01, // Probability of direction change
  DIRECTION_ANGLES: [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2], // Cardinal movement angles
  STROKE_COLOR: 'rgba(180, 220, 255, {alpha})', // Trail color
  SHADOW_COLOR: '#8cf', // Particle shadow
  FILL_COLOR: 'rgba(234, 255, 255, {depth})', // Particle fill
};

/**
 * @class Particle
 * @description Represents a single particle with position, trail, and rendering logic.
 */
window.Particle = class {
  /**
   * @param {number} depth - Visual depth (0.3 to 1.0) for scaling
   * @param {number} id - Unique identifier
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  constructor(depth, id, width, height) {
    this.id = id;
    this.depth = depth;
    this.width = width;
    this.height = height;
    this.reset();
  }

  /** @method reset - Initializes or resets particle properties */
  reset() {
    if (!this.width || !this.height) return;
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

  /** @method setRandomDirection - Sets a random cardinal direction */
  setRandomDirection() {
    this.angle = window.PARTICLE_CONFIG.DIRECTION_ANGLES[Math.floor(Math.random() * window.PARTICLE_CONFIG.DIRECTION_ANGLES.length)];
  }

  /** @method maybeTurn - Randomly changes direction based on probability */
  maybeTurn() {
    if (Math.random() < window.PARTICLE_CONFIG.TURN_PROBABILITY) {
      const directionIndex = window.PARTICLE_CONFIG.DIRECTION_ANGLES.indexOf(this.angle);
      const turn = Math.random() < 0.5 ? -1 : 1;
      const newIndex = (directionIndex + turn + window.PARTICLE_CONFIG.DIRECTION_ANGLES.length) % window.PARTICLE_CONFIG.DIRECTION_ANGLES.length;
      this.angle = window.PARTICLE_CONFIG.DIRECTION_ANGLES[newIndex];
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
   * @method draw - Renders particle and trail
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    for (let i = 0; i < this.trail.length - 1; i++) {
      const p1 = this.trail[i];
      const p2 = this.trail[i + 1];
      const alpha = (i / this.trail.length) * this.depth * 0.3;
      ctx.strokeStyle = window.PARTICLE_CONFIG.STROKE_COLOR.replace('{alpha}', alpha);
      ctx.lineWidth = 0.5 * this.depth;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.shadowBlur = 1.5 * this.depth;
    ctx.shadowColor = window.PARTICLE_CONFIG.SHADOW_COLOR;
    ctx.fillStyle = window.PARTICLE_CONFIG.FILL_COLOR.replace('{depth}', this.depth);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
};
