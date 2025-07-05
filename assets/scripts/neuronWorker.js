/**
 * @module NeuronWorker
 * @description Web Worker for offloading neuron calculations for Shimti Multimedia.
 * Handles neuron updates for smooth animations in the main thread.
 */

/** @constant {Object} NEURON_CONFIG - Configuration for neuron updates */
const NEURON_CONFIG = {
  MAX_NEURONS: 40, // Maximum number of neurons (mirrors main thread config)
  TURN_PROBABILITY: 0.01, // Probability of a neuron changing direction
  DIRECTION_ANGLES: [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2], // Allowed movement angles (radians)
};

/**
 * @class Neuron
 * @description Represents a single neuron with position and trail logic
 */
class Neuron {
  /**
   * @param {number} depth - Visual depth for scaling (0.3 to 1.0)
   * @param {number} width - Canvas width for movement bounds
   * @param {number} height - Canvas height for movement bounds
   * @param {number} id - Unique identifier for the neuron
   */
  constructor(depth, width, height, id) {
    this.depth = depth;
    this.width = width;
    this.height = height;
    this.id = id;
    this.reset();
  }

  /** @method reset - Resets neuron position, speed, and trail */
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

  /** @method setRandomDirection - Sets a random movement direction */
  setRandomDirection() {
    this.angle = NEURON_CONFIG.DIRECTION_ANGLES[Math.floor(Math.random() * NEURON_CONFIG.DIRECTION_ANGLES.length)];
  }

  /** @method maybeTurn - Randomly changes direction based on probability */
  maybeTurn() {
    if (Math.random() < NEURON_CONFIG.TURN_PROBABILITY) {
      const directionIndex = NEURON_CONFIG.DIRECTION_ANGLES.indexOf(this.angle);
      const turn = Math.random() < 0.5 ? -1 : 1;
      const newIndex = (directionIndex + turn + NEURON_CONFIG.DIRECTION_ANGLES.length) % NEURON_CONFIG.DIRECTION_ANGLES.length;
      this.angle = NEURON_CONFIG.DIRECTION_ANGLES[newIndex];
    }
  }

  /**
   * @method update - Updates neuron position and trail
   * @returns {Object} Neuron data {id, x, y, size
