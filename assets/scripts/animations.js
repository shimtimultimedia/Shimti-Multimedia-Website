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
    this.fadeLimit = Math.random() * 400 + 100;
  }

  setRandomDirection() {
    this.angle = ANIMATION_CONFIG.DIRECTION_ANGLES[Math.floor(Math.random() * ANIMATION_CONFIG.DIRECTION_ANGLES.length)];
  }

  maybeTurn() {
    if (Math.random() < ANIMATION_CONFIG.TURN_PROBABILITY) {
      const directionIndex = ANIMATION_CONFIG.DIRECTION_ANGLES.indexOf(this.angle);
      const turn = Math.random() < 0.5 ? -1 : 1;
      const newIndex = (directionIndex + turn + ANIMATION_CONFIG.DIRECTION_ANGLES.length) % ANIMATION_CONFIG.DIRECTION_ANGLES.length;
      this.angle = ANIMATION_CONFIG.DIRECTION_ANGLES[newIndex];
    }
  }

  update(data) {
    if (this.useWorker) {
      if (!data || !('x' in data)) {
        console.warn('Invalid Web Worker data:', data);
        return;
      }
      this.x = data.x;
      this.y = data.y;
      this.size = data.size;
      this.depth = data.depth;
      this.trail = data.trail || [];
    } else {
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
  }

  draw(ctx) {
    for (let i = 0; i < this.trail.length - 1; i++) {
      const p1 = this.trail[i];
      const p2 = this.trail[i + 1];
      const alpha = (i / this.trail.length) * this.depth * 0.3;
      ctx.strokeStyle = ANIMATION_CONFIG.NEURON_STROKE.replace('{alpha}', alpha);
      ctx.lineWidth = 0.5 * this.depth;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.shadowBlur = 1.5 * this.depth;
    ctx.shadowColor = ANIMATION_CONFIG.NEURON_SHADOW;
    ctx.fillStyle = ANIMATION_CONFIG.NEURON_FILL.replace('{depth}', this.depth);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initAnimations() {
  const gridCanvas = document.getElementById('gridLayer');
  const brainCircuit = document.getElementById('circuitBrain');
  if (!gridCanvas || !brainCircuit) {
    console.error('Canvas elements not found:', { gridCanvas, brainCircuit });
    return;
  }

  const gridCtx = gridCanvas.getContext('2d');
  const ctx = brainCircuit.getContext('2d');
  if (!gridCtx || !ctx) {
    console.error('Canvas contexts not available:', { gridCtx, ctx });
    return;
  }

  console.log('Initializing canvas animations:', { gridCanvas, brainCircuit });

  let width = window.innerWidth;
  let height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  const offscreenGrid = document.createElement('canvas');
  offscreenGrid.width = width * dpr;
  offscreenGrid.height = height * dpr;
  const offscreenCtx = offscreenGrid.getContext('2d');
  offscreenCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  [gridCanvas, brainCircuit].forEach(canvas => {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const context = canvas.getContext('2d');
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  });

  function drawGrid() {
    offscreenCtx.clearRect(0, 0, width, height);
    offscreenCtx.strokeStyle = ANIMATION_CONFIG.GRID_STROKE;
    offscreenCtx.lineWidth = 1;

    for (let x = 0; x < width; x += ANIMATION_CONFIG.GRID_SPACING) {
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(x, 0);
      offscreenCtx.lineTo(x, height);
      offscreenCtx.stroke();
    }
    for (let y = 0; y < height; y += ANIMATION_CONFIG.GRID_SPACING) {
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(0, y);
      offscreenCtx.lineTo(width, y);
      offscreenCtx.stroke();
    }

    gridCtx.clearRect(0, 0, width, height);
    gridCtx.drawImage(offscreenGrid, 0, 0);
  }

  const neurons = [];
  let worker = null;
  let useWorker = true;
  const initialNeurons = [];
  let neuronId = 0;

  try {
    worker = new Worker('neuronWorker.js');
    worker.onerror = (error) => {
      console.warn('Web Worker failed to load:', error);
      useWorker = false;
    };
  } catch (error) {
    console.warn('Web Worker not supported:', error);
    useWorker = false;
  }

  for (let depth = 0.3; depth <= 1.0; depth += 0.2) {
    const count = Math.floor(ANIMATION_CONFIG.MAX_NEURONS * depth);
    for (let i = 0; i < count; i++) {
      neurons.push(new Neuron(depth, neuronId, useWorker, width, height));
      if (useWorker) {
        initialNeurons.push({ depth });
      }
      neuronId++;
    }
  }

  if (useWorker && worker) {
    worker.postMessage({
      type: 'init',
      data: { width: window.innerWidth, height: window.innerHeight, neurons: initialNeurons }
    });

    worker.onmessage = (event) => {
      const { type, neurons: updatedNeurons } = event.data;
      if (type === 'init' || type === 'update') {
        if (!updatedNeurons || updatedNeurons.length !== neurons.length) {
          console.warn('Invalid Web Worker neuron data:', updatedNeurons);
          return;
        }
        updatedNeurons.forEach((data, i) => {
          if (neurons[i]) {
            neurons[i].update(data);
          }
        });
      }
    };
  }

  let lastTime = performance.now();
  let lastWorkerUpdate = 0;
  function animate() {
    const now = performance.now();
    const delta = now - lastTime;
    const frameInterval = 1000 / ANIMATION_CONFIG.TARGET_FPS;

    if (delta >= frameInterval) {
      if (useWorker && worker && now - lastWorkerUpdate >= ANIMATION_CONFIG.WORKER_UPDATE_INTERVAL) {
        worker.postMessage({
          type: 'update',
          data: { width: window.innerWidth, height: window.innerHeight }
        });
        lastWorkerUpdate = now;
      } else if (!useWorker) {
        neurons.forEach(neuron => neuron.update({}));
      }
      ctx.clearRect(0, 0, width, height);
      neurons.forEach(neuron => neuron.draw(ctx));
      lastTime = now - (delta % frameInterval);
    }

    requestAnimationFrame(animate);
  }

  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      width = window.innerWidth;
      height = window.innerHeight;
      [gridCanvas, brainCircuit, offscreenGrid].forEach(canvas => {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        if (canvas !== offscreenGrid) {
          const context = canvas.getContext('2d');
          context.setTransform(dpr, 0, 0, dpr, 0, 0);
        } else {
          offscreenCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      });
      neurons.forEach(neuron => {
        neuron.width = width;
        neuron.height = height;
      });
      if (useWorker && worker) {
        worker.postMessage({
          type: 'update',
          data: { width: window.innerWidth, height: window.innerHeight }
        });
      }
      drawGrid();
    });
  });

  drawGrid();
  animate();
}

window.addEventListener('load', initAnimations);
