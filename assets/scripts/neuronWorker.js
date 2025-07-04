/**
 * Shimti Multimedia: Web Worker for offloading neuron calculations.
 * Handles neuron updates for smooth animations in the main thread.
 */
const NEURON_CONFIG = {
  MAX_NEURONS: 30, // Aligned with animations.js
  TURN_PROBABILITY: 0.01, // Probability of a neuron changing direction
  DIRECTION_ANGLES: [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2], // Allowed movement angles (radians)
};

/**
 * Represents a single neuron with position and trail logic.
 */
class Neuron {
  /**
   * @param {number} depth - Visual depth for scaling (0.3 to 1.0)
   * @param {number} width - Canvas width for movement bounds
   * @param {number} height - Canvas height for movement bounds
   * @param {number} id - Unique identifier for the neuron
   */
  constructor(depth = 1, width, height, id) {
    this.depth = depth;
    this.width = width;
    this.height = height;
    this.id = id;
    this.reset();
  }

  /**
   * Resets neuron position, speed, and trail.
   */
  reset() {
    this.x = Math.random() * this.width;
    this.y = Math.random() * this.height;
    this.setRandomDirection();
    this.baseSpeed = (0.5 + Math.random() * (Math.random() < 0.2 ? 4.0 : 1.2)) * this.depth;
    this.speed = this.baseSpeed;
    this.size = (0.5 + Math.random() * 1.2) * this.depth;
    this.trail = [];
    this.maxTrailLength = Math.floor(Math.random() * 40) + 2;
    this.fadeCounter = 0;
    this.fadeLimit = Math.random() * 400 + 100;
  }

  /**
   * Sets a random movement direction from allowed angles.
   */
  setRandomDirection() {
    this.angle = NEURON_CONFIG.DIRECTION_ANGLES[Math.floor(Math.random() * NEURON_CONFIG.DIRECTION_ANGLES.length)];
  }

  /**
   * Randomly changes direction based on turn probability.
   */
  maybeTurn() {
    if (Math.random() < NEURON_CONFIG.TURN_PROBABILITY) {
      const directionIndex = NEURON_CONFIG.DIRECTION_ANGLES.indexOf(this.angle);
      const turn = Math.random() < 0.5 ? -1 : 1;
      const newIndex = (directionIndex + turn + NEURON_CONFIG.DIRECTION_ANGLES.length) % NEURON_CONFIG.DIRECTION_ANGLES.length;
      this.angle = NEURON_CONFIG.DIRECTION_ANGLES[newIndex];
    }
  }

  /**
   * Updates neuron position and trail, returning serialized data.
   * @returns {Object} Neuron data {id, x, y, size, depth, trail}
   */
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

    return {
      id: this.id,
      x: this.x,
      y: this.y,
      size: this.size,
      depth: this.depth,
      trail: [...this.trail],
    };
  }
}

// Web Worker logic
let neurons = [];
let width, height;

/**
 * Handles messages from the main thread to initialize or update neurons.
 * @param {MessageEvent} event - The message event containing type and data
 */
self.onmessage = (event) => {
  const { type, data } = event.data;
  if (type === 'init') {
    width = data.width;
    height = data.height;
    neurons = data.neurons.map((n) => new Neuron(n.depth, width, height, n.id));
    console.log('Worker initialized with', neurons.length, 'neurons');
    self.postMessage({ type: 'init', neurons: neurons.map(n => n.update()) });
  } else if (type === 'update') {
    width = data.width;
    height = data.height;
    neurons.forEach(n => {
      n.width = width;
      n.height = height;
    });
    const updatedNeurons = neurons.map(n => n.update());
    self.postMessage({ type: 'update', neurons: updatedNeurons });
  }
};
