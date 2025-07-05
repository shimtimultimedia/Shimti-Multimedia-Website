/**
 * @module ConnectionLinesAndRings
 * @description Initializes connection lines, outer ring, a rotating ring of squares, and a segmented counter-rotating ring for Shimti Multimedia.
 * Handles SVG rendering for a sci-fi aesthetic.
 */

/** @constant {string} SVG_NS - SVG namespace for elements */
const SVG_NS = 'http://www.w3.org/2000/svg';

/** @constant {Object} RING_CONFIG - Configuration for rings and connection lines */
const RING_CONFIG = {
  LINE_STROKE: 'rgba(255, 255, 255, 0.3)', // Connection line stroke
  CIRCLE_STROKE: '#ffffff', // Circle and ring stroke
  STROKE_WIDTH: '2', // Thickness for lines and most rings
  SEGMENTED_STROKE_WIDTH: '1', // Thinner segmented ring
  CIRCLE_RADIUS: 5, // Endpoint circle radius
  OUTER_RADIUS: 240, // Stationary ring outer radius
  INNER_RADIUS: 205, // Stationary ring inner radius
  SQUARE_RING_RADIUS: 222.5, // Center of stationary ring for squares
  SQUARE_SIZE: 8, // Size of each square
  SQUARE_COUNT: 24, // Number of squares
  SQUARE_ROTATION_SPEED: 60, // Seconds for square orbit
  SQUARE_SELF_ROTATION_SPEED: 2, // Seconds for square self-rotation
  SQUARE_FILL: 'rgba(180, 220, 255, 0.08)', // Matches sector fill
  NEW_OUTER_RADIUS: 257.5, // Segmented ring outer radius
  NEW_INNER_RADIUS: 240, // Segmented ring inner radius
  NEW_RING_ROTATION_SPEED: 80, // Seconds for segmented ring
  SEGMENT_COUNT: 4, // Number of segments
};

/**
 * @function createTopConnectionLine
 * @description Creates a connection line from the branding panel to the radial menu
 * @param {SVGElement} svg - The SVG container for connection lines
 */
function createTopConnectionLine(svg) {
  const titleRect = document.getElementById('shimtiPanel')?.getBoundingClientRect();
  const wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();

  if (!titleRect || !wheelRect || !svg) {
    console.error('Failed to create top connection line: Missing DOM elements', { titleRect, wheelRect, svg });
    return;
  }

  const startPoint = {
    x: titleRect.left + titleRect.width,
    y: titleRect.top + titleRect.height / 2
  };
  const endPoint = {
    x: wheelRect.left + wheelRect.width / 2,
    y: wheelRect.top + wheelRect.height / 18
  };
  const bendX = endPoint.x;
  const bendY = startPoint.y;

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${bendX} ${bendY} L ${endPoint.x} ${endPoint.y}`);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', RING_CONFIG.LINE_STROKE);
  path.setAttribute('stroke-width', RING_CONFIG.STROKE_WIDTH);
  svg.appendChild(path);

  const startCircle = document.createElementNS(SVG_NS, 'circle');
  startCircle.setAttribute('cx', startPoint.x);
  startCircle.setAttribute('cy', startPoint.y);
  startCircle.setAttribute('r', RING_CONFIG.CIRCLE_RADIUS);
  startCircle.setAttribute('fill', 'none');
  startCircle.setAttribute('stroke', RING_CONFIG.CIRCLE_STROKE);
  startCircle.setAttribute('stroke-width', '1');
  svg.appendChild(startCircle);

  const endCircle = document.createElementNS(SVG_NS, 'circle');
  endCircle.setAttribute('cx', endPoint.x);
  endCircle.setAttribute('cy', endPoint.y);
  endCircle.setAttribute('r', RING_CONFIG.CIRCLE_RADIUS);
  endCircle.setAttribute('fill', 'none');
  endCircle.setAttribute('stroke', RING_CONFIG.CIRCLE_STROKE);
  endCircle.setAttribute('stroke-width', '1');
  svg.appendChild(endCircle);
}

/**
 * @function createBottomConnectionLine
 * @description Creates a connection line from the radial menu to the bottom panel
 * @param {SVGElement} svg - The SVG container for connection lines
 */
function createBottomConnectionLine(svg) {
  const wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
  const bottomPanelRect = document.getElementById('shimtiPanelBottom')?.getBoundingClientRect();

  if (!wheelRect || !bottomPanelRect || !svg) {
    console.error('Failed to create bottom connection line: Missing DOM elements', { wheelRect, bottomPanelRect, svg });
    return;
  }

  const startPoint = {
    x: wheelRect.left + wheelRect.width / 2,
    y: wheelRect.top + wheelRect.height / 1.05
  };
  const endPoint = {
    x: bottomPanelRect.left + bottomPanelRect.width / 2,
    y: bottomPanelRect.top
  };

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', RING_CONFIG.LINE_STROKE);
  path.setAttribute('stroke-width', RING_CONFIG.STROKE_WIDTH);
  svg.appendChild(path);

  const startCircle = document.createElementNS(SVG_NS, 'circle');
  startCircle.setAttribute('cx', startPoint.x);
  startCircle.setAttribute('cy', startPoint.y);
  startCircle.setAttribute('r', RING_CONFIG.CIRCLE_RADIUS);
  startCircle.setAttribute('fill', 'none');
  startCircle.setAttribute('stroke', RING_CONFIG.CIRCLE_STROKE);
  startCircle.setAttribute('stroke-width', '1');
  svg.appendChild(startCircle);

  const endCircle = document.createElementNS(SVG_NS, 'circle');
  endCircle.setAttribute('cx', endPoint.x);
  endCircle.setAttribute('cy', endPoint.y);
  endCircle.setAttribute('r', RING_CONFIG.CIRCLE_RADIUS);
  endCircle.setAttribute('fill', 'none');
  endCircle.setAttribute('stroke', RING_CONFIG.CIRCLE_STROKE);
  endCircle.setAttribute('stroke-width', '1');
  svg.appendChild(endCircle);
}

/**
 * @function createOuterRing
 * @description Creates and updates the outer stationary ring (donut) around the radial menu
 * @param {SVGElement} svg - The SVG container for the outer ring
 * @returns {SVGElement} The outer ring path element
 */
function createOuterRing(svg) {
  if (!svg) {
    console.error('Failed to create outer ring: Missing SVG element');
    return null;
  }

  const outerRing = document.createElementNS(SVG_NS, 'path');
  function updateRing() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const outerD = `M${centerX + RING_CONFIG.OUTER_RADIUS},${centerY} A${RING_CONFIG.OUTER_RADIUS},${RING_CONFIG.OUTER_RADIUS} 0 1,0 ${centerX - RING_CONFIG.OUTER_RADIUS},${centerY} A${RING_CONFIG.OUTER_RADIUS},${RING_CONFIG.OUTER_RADIUS} 0 1,0 ${centerX + RING_CONFIG.OUTER_RADIUS},${centerY}`;
    const innerD = `M${centerX + RING_CONFIG.INNER_RADIUS},${centerY} A${RING_CONFIG.INNER_RADIUS},${RING_CONFIG.INNER_RADIUS} 0 1,1 ${centerX - RING_CONFIG.INNER_RADIUS},${centerY} A${RING_CONFIG.INNER_RADIUS},${RING_CONFIG.INNER_RADIUS} 0 1,1 ${centerX + RING_CONFIG.INNER_RADIUS},${centerY}`;
    outerRing.setAttribute('d', `${outerD} ${innerD}`);
  }

  outerRing.setAttribute('fill', RING_CONFIG.SQUARE_FILL);
  outerRing.setAttribute('fill-rule', 'evenodd');
  outerRing.setAttribute('stroke', RING_CONFIG.CIRCLE_STROKE);
  outerRing.setAttribute('stroke-width', RING_CONFIG.STROKE_WIDTH);
  svg.appendChild(outerRing);
  updateRing();

  return outerRing;
}

/**
 * @function createRotatingSquareRing
 * @description Creates a rotating ring of squares within the outer ring
 * @param {SVGElement} svg - The SVG container for the squares
 */
function createRotatingSquareRing(svg) {
  if (!svg) {
    console.error('Failed to create rotating square ring: Missing SVG element');
    return;
  }

  const squareGroup = document.createElementNS(SVG_NS, 'g');
  squareGroup.setAttribute('aria-hidden', 'true');
  squareGroup.classList.add('rotating-square-ring');

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < RING_CONFIG.SQUARE_COUNT; i++) {
    const angle = (i / RING_CONFIG.SQUARE_COUNT) * 360;
    const posX = centerX + RING_CONFIG.SQUARE_RING_RADIUS * Math.cos((angle * Math.PI) / 180);
    const posY = centerY + RING_CONFIG.SQUARE_RING_RADIUS * Math.sin((angle * Math.PI) / 180);

    const square = document.createElementNS(SVG_NS, 'rect');
    square.setAttribute('x', posX - RING_CONFIG.SQUARE_SIZE / 2);
    square.setAttribute('y', posY - RING_CONFIG.SQUARE_SIZE / 2);
    square.setAttribute('width', RING_CONFIG.SQUARE_SIZE);
    square.setAttribute('height', RING_CONFIG.SQUARE_SIZE);
    square.setAttribute('fill', RING_CONFIG.SQUARE_FILL);
    square.setAttribute('stroke', 'none');
    square.classList.add('rotating-square');

    square.style.transformOrigin = `${posX}px ${posY}px`;
    square.style.animation = `selfRotate ${RING_CONFIG.SQUARE_SELF_ROTATION_SPEED}s linear infinite`;

    const transformGroup = document.createElementNS(SVG_NS, 'g');
    transformGroup.classList.add('square-orbit');
    transformGroup.style.transformOrigin = `${centerX}px ${centerY}px`;
    transformGroup.style.animation = `orbit ${RING_CONFIG.SQUARE_ROTATION_SPEED}s linear infinite`;
    transformGroup.style.transform = `rotate(${angle}deg)`;
    transformGroup.appendChild(square);
    squareGroup.appendChild(transformGroup);
  }

  svg.appendChild(squareGroup);

  window.addEventListener('resize', () => {
    const newCenterX = window.innerWidth / 2;
    const newCenterY = window.innerHeight / 2;
    const squares = squareGroup.querySelectorAll('.rotating-square');
    squares.forEach((square, i) => {
      const angle = (i / RING_CONFIG.SQUARE_COUNT) * 360;
      const posX = newCenterX + RING_CONFIG.SQUARE_RING_RADIUS * Math.cos((angle * Math.PI) / 180);
      const posY = newCenterY + RING_CONFIG.SQUARE_RING_RADIUS * Math.sin((angle * Math.PI) / 180);
      square.setAttribute('x', posX - RING_CONFIG.SQUARE_SIZE / 2);
      square.setAttribute('y', posY - RING_CONFIG.SQUARE_SIZE / 2);
      square.style.transformOrigin = `${posX}px ${posY}px`;
      const transformGroup = square.parentNode;
      transformGroup.style.transformOrigin = `${newCenterX}px ${newCenterY}px`;
      transformGroup.style.transform = `rotate(${angle}deg)`;
    });
  });
}

/**
 * @function createSegmentedRotatingRing
 * @description Creates a segmented, counter-rotating donut ring outside the stationary ring
 * @param {SVGElement} svg - The SVG container for the new ring
 */
function createSegmentedRotatingRing(svg) {
  if (!svg) {
    console.error('Failed to create segmented rotating ring: Missing SVG element');
    return;
  }

  const segmentGroup = document.createElementNS(SVG_NS, 'g');
  segmentGroup.setAttribute('aria-hidden', 'true');
  segmentGroup.classList.add('segmented-ring');

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const segments = [];
  let currentAngle = 0;
  const minArc = 30;
  const maxArc = 90;
  const minGap = 5;
  const maxGap = 15;

  while (currentAngle < 360 && segments.length < RING_CONFIG.SEGMENT_COUNT) {
    const arcLength = minArc + Math.random() * (maxArc - minArc);
    const gapLength = minGap + Math.random() * (maxGap - minGap);
    if (currentAngle + arcLength > 360) break;
    segments.push({ start: currentAngle, end: currentAngle + arcLength });
    currentAngle += arcLength + gapLength;
  }

  segments.forEach(segment => {
    const { start, end } = segment;
    const largeArc = end - start > 180 ? 1 : 0;
    const outerStart = {
      x: centerX + RING_CONFIG.NEW_OUTER_RADIUS * Math.cos((start * Math.PI) / 180),
      y: centerY + RING_CONFIG.NEW_OUTER_RADIUS * Math.sin((start * Math.PI) / 180)
    };
    const outerEnd = {
      x: centerX + RING_CONFIG.NEW_OUTER_RADIUS * Math.cos((end * Math.PI) / 180),
      y: centerY + RING_CONFIG.NEW_OUTER_RADIUS * Math.sin((end * Math.PI) / 180)
    };
    const innerStart = {
      x: centerX + RING_CONFIG.NEW_INNER_RADIUS * Math.cos((end * Math.PI) / 180),
      y: centerY + RING_CONFIG.NEW_INNER_RADIUS * Math.sin((end * Math.PI) / 180)
    };
    const innerEnd = {
      x: centerX + RING_CONFIG.NEW_INNER_RADIUS * Math.cos((start * Math.PI) / 180),
      y: centerY + RING_CONFIG.NEW_INNER_RADIUS * Math.sin((start * Math.PI) / 180)
    };

    const pathData = `
      M ${outerStart.x} ${outerStart.y}
      A ${RING_CONFIG.NEW_OUTER_RADIUS} ${RING_CONFIG.NEW_OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
      L ${innerStart.x} ${innerStart.y}
      A ${RING_CONFIG.NEW_INNER_RADIUS} ${RING_CONFIG.NEW_INNER_RADIUS} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}
      Z
    `;

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', RING_CONFIG.SQUARE_FILL);
    path.setAttribute('stroke', RING_CONFIG.CIRCLE_STROKE);
    path.setAttribute('stroke-width', RING_CONFIG.SEGMENTED_STROKE_WIDTH);
    segmentGroup.appendChild(path);
  });

  segmentGroup.style.transformOrigin = `${centerX}px ${centerY}px`;
  segmentGroup.style.animation = `counterRotate ${RING_CONFIG.NEW_RING_ROTATION_SPEED}s linear infinite`;
  svg.appendChild(segmentGroup);

  window.addEventListener('resize', () => {
    const newCenterX = window.innerWidth / 2;
    const newCenterY = window.innerHeight / 2;
    segmentGroup.querySelectorAll('path').forEach((path, i) => {
      const { start, end } = segments[i];
      const largeArc = end - start > 180 ? 1 : 0;
      const outerStart = {
        x: newCenterX + RING_CONFIG.NEW_OUTER_RADIUS * Math.cos((start * Math.PI) / 180),
        y: newCenterY + RING_CONFIG.NEW_OUTER_RADIUS * Math.sin((start * Math.PI) / 180)
      };
      const outerEnd = {
        x: newCenterX + RING_CONFIG.NEW_OUTER_RADIUS * Math.cos((end * Math.PI) / 180),
        y: newCenterY + RING_CONFIG.NEW_OUTER_RADIUS * Math.sin((end * Math.PI) / 180)
      };
      const innerStart = {
        x: newCenterX + RING_CONFIG.NEW_INNER_RADIUS * Math.cos((end * Math.PI) / 180),
        y: newCenterY + RING_CONFIG.NEW_INNER_RADIUS * Math.sin((end * Math.PI) / 180)
      };
      const innerEnd = {
        x: newCenterX + RING_CONFIG.NEW_INNER_RADIUS * Math.cos((start * Math.PI) / 180),
        y: newCenterY + RING_CONFIG.NEW_INNER_RADIUS * Math.sin((start * Math.PI) / 180)
      };

      const pathData = `
        M ${outerStart.x} ${outerStart.y}
        A ${RING_CONFIG.NEW_OUTER_RADIUS} ${RING_CONFIG.NEW_OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
        L ${innerStart.x} ${innerStart.y}
        A ${RING_CONFIG.NEW_INNER_RADIUS} ${RING_CONFIG.NEW_INNER_RADIUS} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}
        Z
      `;
      path.setAttribute('d', pathData);
    });
    segmentGroup.style.transformOrigin = `${newCenterX}px ${newCenterY}px`;
  });
}

/**
 * @function initConnectionLinesAndRings
 * @description Initializes connection lines, outer ring, rotating square ring, and segmented ring
 */
function initConnectionLinesAndRings() {
  const svg = document.getElementById('connectionLines');
  if (!svg) {
    console.error('Connection lines SVG not found');
    return;
  }

  createTopConnectionLine(svg);
  createBottomConnectionLine(svg);
  const outerRing = createOuterRing(svg);
  createRotatingSquareRing(svg);
  createSegmentedRotatingRing(svg);

  window.addEventListener('resize', () => {
    svg.innerHTML = ''; // Clear existing SVG content
    createTopConnectionLine(svg);
    createBottomConnectionLine(svg);
    const newOuterRing = createOuterRing(svg);
    createRotatingSquareRing(svg);
    createSegmentedRotatingRing(svg);
  });
}

window.addEventListener('load', initConnectionLinesAndRings);
