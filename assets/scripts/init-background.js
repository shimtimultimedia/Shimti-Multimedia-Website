/**
 * @module InitBackground
 * @description Initializes particle and grid animations for Shimti Multimedia's background.
 * Orchestrates modular components for live environment stability.
 */

import { Particle, PARTICLE_CONFIG } from './particle-system.js';
import { renderGrid } from './grid-renderer.js';

/** @constant {number} TARGET_FPS - Target frames per second for animations */
const TARGET_FPS = 30;

/**
 * @function initBackground
 * @description Sets up canvases and starts particle and grid animations
 */
function initBackground() {
  const gridCanvas = document.getElementById('gridCanvas');
  const particleCanvas = document.getElementById('particleCanvas');
  if (!gridCanvas || !particleCanvas) return;

  const ctx = particleCanvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  particleCanvas.width = width * dpr;
  particleCanvas.height = height * dpr;
  particleCanvas.style.width = `${width}px`;
  particleCanvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const particles = [];
  let particleId = 0;

  for (let depth = 0.3; depth <= 1.0; depth += 0.2) {
    const count = Math.floor(PARTICLE_CONFIG.MAX_PARTICLES * depth);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(depth, particleId, width, height));
      particleId++;
    }
  }

  let lastTime = performance.now();
  /** @function animate - Updates and renders particles */
  function animate() {
    const now = performance.now();
    const delta = now - lastTime;
    const frameInterval = 1000 / TARGET_FPS;

    if (delta >= frameInterval) {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      lastTime = now - (delta % frameInterval);
    }

    requestAnimationFrame(animate);
  }

  renderGrid(gridCanvas);
  animate();

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    particleCanvas.width = width * dpr;
    particleCanvas.height = height * dpr;
    particleCanvas.style.width = `${width}px`;
    particleCanvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.forEach(particle => {
      particle.width = width;
      particle.height = height;
    });
  });
}

window.addEventListener('load', initBackground);
