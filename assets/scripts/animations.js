/**
 * Shimti Multimedia: Animates the background grid and neural network visualization.
 * Manages canvas rendering and neuron movement with Web Worker fallback for performance.
 */
const ANIMATION_CONFIG = {
  MAX_NEURONS: 30,
  TURN_PROBABILITY: 0.01,
  DIRECTION_ANGLES: [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2],
  GRID_SPACING: 80,
  GRID_STROKE: 'rgba(100, 150, 255, 0.1)',
  NEURON_STROKE: 'rgba(180, 220, 255, {alpha})',
  NEURON_SHADOW: '#8cf',
  NEURON_FILL: 'rgba(234, 255, 255, {depth})',
  TARGET_FPS: 30,
  WORKER_UPDATE_INTERVAL: 100,
};

class Neuron {
  constructor(depth = 1, id, useWorker = false, width, height) {
    this.id = id;
    this.depth = depth;
    this.useWorker = useWorker;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.trail = [];
    this.invalidDataLogged = false; // Flag to log invalid data only once
    if (!useWorker) {
      this.reset();
    }
  }

  reset() {
    if (!this.width || !this.height) {
      console.error('Width or height undefined in Neuron.reset:', { width: this.width, height: this.height });
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
    this.fadeLimit [TRUNCATED]
