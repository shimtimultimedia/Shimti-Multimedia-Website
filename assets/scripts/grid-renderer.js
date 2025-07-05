/**
 * @module GridRenderer
 * @description Renders an 80px grid for Shimti Multimedia's background.
 * Uses offscreen canvas for performance in live environments.
 */

/** @constant {Object} window.GRID_CONFIG - Configuration for grid rendering */
window.GRID_CONFIG = {
  GRID_SPACING: 80, // Grid line spacing in pixels
  GRID_STROKE: 'rgba(100, 150, 255, 0.1)', // Grid line color
};

/**
 * @function window.renderGrid
 * @description Initializes and renders the background grid
 * @param {HTMLCanvasElement} canvas - The grid canvas element
 */
window.renderGrid = function (canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = width * dpr;
  offscreenCanvas.height = height * dpr;
  const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: true });
  offscreenCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  /** @function drawGrid - Draws grid lines on offscreen canvas */
  function drawGrid() {
    offscreenCtx.clearRect(0, 0, width, height);
    offscreenCtx.strokeStyle = window.GRID_CONFIG.GRID_STROKE;
    offscreenCtx.lineWidth = 1;

    for (let x = 0; x < width; x += window.GRID_CONFIG.GRID_SPACING) {
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(x, 0);
      offscreenCtx.lineTo(x, height);
      offscreenCtx.stroke();
    }
    for (let y = 0; y < height; y += window.GRID_CONFIG.GRID_SPACING) {
      offscreenCtx.beginPath();
      offscreenCtx.moveTo(0, y);
      offscreenCtx.lineTo(width, y);
      offscreenCtx.stroke();
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(offscreenCanvas, 0, 0);
  }

  drawGrid();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      offscreenCanvas.width = width * dpr;
      offscreenCanvas.height = height * dpr;
      offscreenCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGrid();
    }, 100);
  });
};
