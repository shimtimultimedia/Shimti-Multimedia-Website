/**
 * Shimti Multimedia: Initializes connection lines, outer ring, a rotating ring of squares, and a segmented counter-rotating ring for the radial menu.
 * Handles SVG rendering for a sci-fi aesthetic.
 */
window.addEventListener('load', () => {
  // Constants for SVG styling
  const LINE_STROKE = 'rgba(255, 255, 255, 0.3)';
  const CIRCLE_STROKE = '#ffffff';
  const STROKE_WIDTH = '2';
  const CIRCLE_RADIUS = 5;
  const OUTER_RADIUS = 240;
  const INNER_RADIUS = 205;
  const SQUARE_RING_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2; // Center of first donut
  const SQUARE_SIZE = 8; // Size of each square
  const SQUARE_COUNT = 24; // Number of squares in the ring
  const SQUARE_ROTATION_SPEED = 60; // Seconds (CSS)
  const SQUARE_SELF_ROTATION_SPEED = 2; // Seconds (CSS)
  const SQUARE_FILL = 'rgba(180, 220, 255, 0.08)'; // Matches wheel menu sectors
  const NEW_OUTER_RADIUS = 257.5; // Outer radius for new donut
  const NEW_INNER_RADIUS = 240; // Inner radius for new donut
  const NEW_RING_ROTATION_SPEED = 80; // Seconds (CSS)
  const SEGMENT_COUNT = 4; // Number of segments with random cuts
  const SVG_NS = 'http://www.w3.org/2000/svg';

  /**
   * Creates or updates a connection line from the branding panel to the radial menu.
   * @param {SVGElement} svg - The SVG container for connection lines.
   * @param {SVGPathElement|null} existingPath - Existing path to update, if any.
   * @param {SVGCircleElement|null} existingStartCircle - Existing start circle, if any.
   * @param {SVGCircleElement|null} existingEndCircle - Existing end circle, if any.
   * @returns {Object} Path and circle elements.
   */
  function createTopConnectionLine(svg, existingPath = null, existingStartCircle = null, existingEndCircle = null) {
    const titleRect = document.getElementById('shimtiPanel')?.getBoundingClientRect();
    const wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();

    if (!titleRect || !wheelRect || !svg) {
      console.error('Failed to create top connection line: Missing DOM elements', { titleRect, wheelRect, svg });
      return { path: null, startCircle: null, endCircle: null };
    }

    const startPoint = {
      x: titleRect.left + titleRect.width,
      y: titleRect.top + titleRect.height / 2
    };
    const endPoint = {
      x: wheelRect.left + wheelRect.width / 2,
      y: wheelRect.top + wheelRect.height / 18
    };
    const bendX = startPoint.x + (endPoint.x - startPoint.x);
    const bendY = startPoint.y;

    console.log('Top connection line points:', { startPoint, endPoint });

    const path = existingPath || document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${bendX} ${bendY} L ${endPoint.x} ${endPoint.y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', LINE_STROKE);
    path.setAttribute('stroke-width', STROKE_WIDTH);

    const startCircle = existingStartCircle || document.createElementNS(SVG_NS, 'circle');
    startCircle.setAttribute('cx', startPoint.x);
    startCircle.setAttribute('cy', startPoint.y);
    startCircle.setAttribute('r', CIRCLE_RADIUS);
    startCircle.setAttribute('fill', 'none');
    startCircle.setAttribute('stroke', CIRCLE_STROKE);
    startCircle.setAttribute('stroke-width', '1');

    const endCircle = existingEndCircle || document.createElementNS(SVG_NS, 'circle');
    endCircle.setAttribute('cx', endPoint.x);
    endCircle.setAttribute('cy', endPoint.y);
    endCircle.setAttribute('r', CIRCLE_RADIUS);
    endCircle.setAttribute('fill', 'none');
    endCircle.setAttribute('stroke', CIRCLE_STROKE);
    endCircle.setAttribute('stroke-width', '1');

    if (!existingPath) svg.appendChild(path);
    if (!existingStartCircle) svg.appendChild(startCircle);
    if (!existingEndCircle) svg.appendChild(endCircle);

    return { path, startCircle, endCircle };
  }

  /**
   * Creates or updates a connection line from the radial menu to the bottom panel.
   * @param {SVGElement} svg - The SVG container for connection lines.
   * @param {SVGPathElement|null} existingPath - Existing path to update, if any.
   * @param {SVGCircleElement|null} existingStartCircle - Existing start circle, if any.
   * @param {SVGCircleElement|null} existingEndCircle - Existing end circle, if any.
   * @returns {Object} Path and circle elements.
   */
  function createBottomConnectionLine(svg, existingPath = null, existingStartCircle = null, existingEndCircle = null) {
    const wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
    const bottomPanelRect = document.getElementById('shimtiPanelBottom')?.getBoundingClientRect();

    if (!wheelRect || !bottomPanelRect || !svg) {
      console.error('Failed to create bottom connection line: Missing DOM elements', { wheelRect, bottomPanelRect, svg });
      return { path: null, startCircle: null, endCircle: null };
    }

    const startPoint = {
      x: wheelRect.left + wheelRect.width / 2,
      y: wheelRect.top + wheelRect.height / 1.05
    };
    const endPoint = {
      x: bottomPanelRect.left + bottomPanelRect.width / 2,
      y: bottomPanelRect.top
    };

    console.log('Bottom connection line points:', { startPoint, endPoint });

    const path = existingPath || document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', LINE_STROKE);
    path.setAttribute('stroke-width', STROKE_WIDTH);

    const startCircle = existingStartCircle || document.createElementNS(SVG_NS, 'circle');
    startCircle.setAttribute('cx', startPoint.x);
    startCircle.setAttribute('cy', startPoint.y);
    startCircle.setAttribute('r', CIRCLE_RADIUS);
    startCircle.setAttribute('fill', 'none');
    startCircle.setAttribute('stroke', CIRCLE_STROKE);
    startCircle.setAttribute('stroke-width', '1');

    const endCircle = existingEndCircle || document.createElementNS(SVG_NS, 'circle');
    endCircle.setAttribute('cx', endPoint.x);
    endCircle.setAttribute('cy', endPoint.y);
    endCircle.setAttribute('r', CIRCLE_RADIUS);
    endCircle.setAttribute('fill', 'none');
    endCircle.setAttribute('stroke', CIRCLE_STROKE);
    endCircle.setAttribute('stroke-width', '1');

    if (!existingPath) svg.appendChild(path);
    if (!existingStartCircle) svg.appendChild(startCircle);
    if (!existingEndCircle) svg.appendChild(endCircle);

    return { path, startCircle, endCircle };
  }

  /**
   * Creates or updates the outer ring around the radial menu.
   * @param {SVGElement} svg - The SVG container for the outer ring.
   * @param {SVGPathElement|null} existingRing - Existing ring to update, if any.
   * @returns {SVGPathElement|null} The outer ring path element.
   */
  function createOuterRing(svg, existingRing = null) {
    if (!svg) {
      console.error('Failed to create outer ring: Missing SVG element');
      return null;
    }

    const outerRing = existingRing || document.createElementNS(SVG_NS, 'path');
    function updateRing() {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const outerD = `M${centerX + OUTER_RADIUS},${centerY} A${OUTER_RADIUS},${OUTER_RADIUS} 0 1,0 ${centerX - OUTER_RADIUS},${centerY} A${OUTER_RADIUS},${OUTER_RADIUS} 0 1,0 ${centerX + OUTER_RADIUS},${centerY}`;
      const innerD = `M${centerX + INNER_RADIUS},${centerY} A${INNER_RADIUS},${INNER_RADIUS} 0 1,1 ${centerX - INNER_RADIUS},${centerY} A${INNER_RADIUS},${INNER_RADIUS} 0 1,1 ${centerX + INNER_RADIUS},${centerY}`;
      outerRing.setAttribute('d', `${outerD} ${innerD}`);
    }

    outerRing.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
    outerRing.setAttribute('fill-rule', 'evenodd');
    outerRing.setAttribute('stroke', CIRCLE_STROKE);
    outerRing.setAttribute('stroke-width', STROKE_WIDTH);
    if (!existingRing) svg.appendChild(outerRing);
    updateRing();

    return outerRing;
  }

  /**
   * Creates or updates a rotating ring of squares within the outer ring (donut).
   * @param {SVGElement} svg - The SVG container for the squares.
   * @param {SVGGElement|null} existingGroup - Existing square group to update, if any.
   * @returns {SVGGElement|null} The square group element.
   */
  function createRotatingSquareRing(svg, existingGroup = null) {
    if (!svg) {
      console.error('Failed to create rotating square ring: Missing SVG element');
      return null;
    }

    const squareGroup = existingGroup || document.createElementNS(SVG_NS, 'g');
    squareGroup.setAttribute('aria-hidden', 'true');
    squareGroup.classList.add('rotating-square-ring');

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    if (!existingGroup) {
      for (let i = 0; i < SQUARE_COUNT; i++) {
        const angle = (i / SQUARE_COUNT) * 360;
        const posX = centerX + SQUARE_RING_RADIUS * Math.cos((angle * Math.PI) / 180);
        const posY = centerY + SQUARE_RING_RADIUS * Math.sin((angle * Math.PI) / 180);

        const square = document.createElementNS(SVG_NS, 'rect');
        square.setAttribute('x', posX - SQUARE_SIZE / 2);
        square.setAttribute('y', posY - SQUARE_SIZE / 2);
        square.setAttribute('width', SQUARE_SIZE);
        square.setAttribute('height', SQUARE_SIZE);
        square.setAttribute('fill', SQUARE_FILL);
        square.setAttribute('stroke', 'none');
        square.classList.add('rotating-square');

        square.style.transformOrigin = `${posX}px ${posY}px`;
        square.style.animation = `selfRotate ${SQUARE_SELF_ROTATION_SPEED}s linear infinite`;

        const transformGroup = document.createElementNS(SVG_NS, 'g');
        transformGroup.classList.add('square-orbit');
        transformGroup.style.transformOrigin = `${centerX}px ${centerY}px`;
        transformGroup.style.animation = `orbit ${SQUARE_ROTATION_SPEED}s linear infinite`;
        transformGroup.style.transform = `rotate(${angle}deg)`;
        transformGroup.appendChild(square);
        squareGroup.appendChild(transformGroup);
      }
      svg.appendChild(squareGroup);
    } else {
      const squares = squareGroup.querySelectorAll('.rotating-square');
      squares.forEach((square, i) => {
        const angle = (i / SQUARE_COUNT) * 360;
        const posX = centerX + SQUARE_RING_RADIUS * Math.cos((angle * Math.PI) / 180);
        const posY = centerY + SQUARE_RING_RADIUS * Math.sin((angle * Math.PI) / 180);
        square.setAttribute('x', posX - SQUARE_SIZE / 2);
        square.setAttribute('y', posY - SQUARE_SIZE / 2);
        square.style.transformOrigin = `${posX}px ${posY}px`;
        const transformGroup = square.parentNode;
        transformGroup.style.transformOrigin = `${centerX}px ${centerY}px`;
        transformGroup.style.transform = `rotate(${angle}deg)`;
      });
    }

    return squareGroup;
  }

  /**
   * Creates or updates a segmented, counter-rotating donut ring outside the first donut.
   * @param {SVGElement} svg - The SVG container for the new ring.
   * @param {SVGGElement|null} existingGroup - Existing segment group to update, if any.
   * @returns {SVGGElement|null} The segment group element.
   */
  function createSegmentedRotatingRing(svg, existingGroup = null) {
    if (!svg) {
      console.error('Failed to create segmented rotating ring: Missing SVG element');
      return null;
    }

    const segmentGroup = existingGroup || document.createElementNS(SVG_NS, 'g');
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

    while (currentAngle < 360 && segments.length < SEGMENT_COUNT) {
      const arcLength = minArc + Math.random() * (maxArc - minArc);
      const gapLength = minGap + Math.random() * (maxGap - minGap);
      if (currentAngle + arcLength > 360) break;
      segments.push({ start: currentAngle, end: currentAngle + arcLength });
      currentAngle += arcLength + gapLength;
    }

    if (!existingGroup) {
      segments.forEach(segment => {
        const { start, end } = segment;
        const largeArc = end - start > 180 ? 1 : 0;
        const outerStart = {
          x: centerX + NEW_OUTER_RADIUS * Math.cos((start * Math.PI) / 180),
          y: centerY + NEW_OUTER_RADIUS * Math.sin((start * Math.PI) / 180)
        };
        const outerEnd = {
          x: centerX + NEW_OUTER_RADIUS * Math.cos((end * Math.PI) / 180),
          y: centerY + NEW_OUTER_RADIUS * Math.sin((end * Math.PI) / 180)
        };
        const innerStart = {
          x: centerX + NEW_INNER_RADIUS * Math.cos((end * Math.PI) / 180),
          y: centerY + NEW_INNER_RADIUS * Math.sin((end * Math.PI) / 180)
        };
        const innerEnd = {
          x: centerX + NEW_INNER_RADIUS * Math.cos((start * Math.PI) / 180),
          y: centerY + NEW_INNER_RADIUS * Math.sin((start * Math.PI) / 180)
        };

        const pathData = `
          M ${outerStart.x} ${outerStart.y}
          A ${NEW_OUTER_RADIUS} ${NEW_OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
          L ${innerStart.x} ${innerStart.y}
          A ${NEW_INNER_RADIUS} ${NEW_INNER_RADIUS} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}
          Z
        `;

        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', SQUARE_FILL);
        path.setAttribute('stroke', 'none');
        segmentGroup.appendChild(path);
      });
      svg.appendChild(segmentGroup);
    } else {
      const paths = segmentGroup.querySelectorAll('path');
      paths.forEach((path, i) => {
        const { start, end } = segments[i];
        const largeArc = end - start > 180 ? 1 : 0;
        const outerStart = {
          x: centerX + NEW_OUTER_RADIUS * Math.cos((start * Math.PI) / 180),
          y: centerY + NEW_OUTER_RADIUS * Math.sin((start * Math.PI) / 180)
        };
        const outerEnd = {
          x: centerX + NEW_OUTER_RADIUS * Math.cos((end * Math.PI) / 180),
          y: centerY + NEW_OUTER_RADIUS * Math.sin((end * Math.PI) / 180)
        };
        const innerStart = {
          x: centerX + NEW_INNER_RADIUS * Math.cos((end * Math.PI) / 180),
          y: centerY + NEW_INNER_RADIUS * Math.sin((end * Math.PI) / 180)
        };
        const innerEnd = {
          x: centerX + NEW_INNER_RADIUS * Math.cos((start * Math.PI) / 180),
          y: centerY + NEW_INNER_RADIUS * Math.sin((start * Math.PI) / 180)
        };

        const pathData = `
          M ${outerStart.x} ${outerStart.y}
          A ${NEW_OUTER_RADIUS} ${NEW_OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
          L ${innerStart.x} ${innerStart.y}
          A ${NEW_INNER_RADIUS} ${NEW_INNER_RADIUS} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}
          Z
        `;
        path.setAttribute('d', pathData);
      });
    }

    segmentGroup.style.transformOrigin = `${centerX}px ${centerY}px`;
    segmentGroup.style.animation = `counterRotate ${NEW_RING_ROTATION_SPEED}s linear infinite`;

    return segmentGroup;
  }

  // Initialize connection lines, outer ring, rotating square ring, and segmented ring
  const svg = document.getElementById('connectionLines');
  if (svg) {
    let topLineElements = createTopConnectionLine(svg);
    let bottomLineElements = createBottomConnectionLine(svg);
    let outerRing = createOuterRing(svg);
    let squareGroup = createRotatingSquareRing(svg);
    let segmentGroup = createSegmentedRotatingRing(svg);

    window.addEventListener('resize', () => {
      // Update existing elements instead of clearing SVG
      topLineElements = createTopConnectionLine(svg, topLineElements.path, topLineElements.startCircle, topLineElements.endCircle);
      bottomLineElements = createBottomConnectionLine(svg, bottomLineElements.path, bottomLineElements.startCircle, bottomLineElements.endCircle);
      outerRing = createOuterRing(svg, outerRing);
      squareGroup = createRotatingSquareRing(svg, squareGroup);
      segmentGroup = createSegmentedRotatingRing(svg, segmentGroup);
    });
  } else {
    console.error('Connection lines SVG not found');
  }
});
