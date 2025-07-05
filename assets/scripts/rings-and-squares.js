/**
 * @module RingsAndSquares
 * @description Renders a stationary ring and 24 counter-clockwise rotating squares for Shimti Multimedia.
 */

/** @constant {string} window.MENU_SVG_NS - SVG namespace for ring and squares */
window.MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * @function window.initRingsAndSquares
 * @description Initializes stationary ring and rotating squares in full-screen SVG
 */
window.initRingsAndSquares = function() {
  var svgElement = document.getElementById('ringSvg');
  if (!svgElement) {
    console.error('Ring SVG not found');
    return;
  }

  // Set dynamic viewBox to match viewport
  svgElement.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);

  var ringGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
  ringGroup.setAttribute('aria-hidden', 'true');

  // Stationary Ring (Donut)
  var wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
  if (wheelRect) {
    const centerX = wheelRect.left + wheelRect.width / 2;
    const centerY = wheelRect.top + wheelRect.height / 2;
    const outerRadius = 245;
    const innerRadius = 210;
    const outerD = `M${centerX + outerRadius},${centerY} A${outerRadius},${outerRadius} 0 1,0 ${centerX - outerRadius},${centerY} A${outerRadius},${outerRadius} 0 1,0 ${centerX + outerRadius},${centerY}`;
    const innerD = `M${centerX + innerRadius},${centerY} A${innerRadius},${innerRadius} 0 1,1 ${centerX - innerRadius},${centerY} A${innerRadius},${innerRadius} 0 1,1 ${centerX + innerRadius},${centerY}`;
    const ring = document.createElementNS(window.MENU_SVG_NS, 'path');
    ring.setAttribute('d', `${outerD} ${innerD}`);
    ring.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
    ring.setAttribute('fill-rule', 'evenodd');
    ring.setAttribute('stroke', '#ffffff');
    ring.setAttribute('stroke-width', '2');
    ring.setAttribute('class', 'stationary-ring');
    ringGroup.appendChild(ring);

    // Rotating Squares
    const squareGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
    squareGroup.setAttribute('aria-hidden', 'true');
    squareGroup.setAttribute('class', 'rotating-squares');
    squareGroup.style.transformOrigin = `${centerX}px ${centerY}px`;
    const squareRadius = (outerRadius + innerRadius) / 2; // 227.5px
    const squareCount = 24;
    const squareSize = 8;
    for (let i = 0; i < squareCount; i++) {
      const angle = (i / squareCount) * 360;
      const posX = centerX + squareRadius * Math.cos((angle * Math.PI) / 180);
      const posY = centerY + squareRadius * Math.sin((angle * Math.PI) / 180);
      const square = document.createElementNS(window.MENU_SVG_NS, 'rect');
      square.setAttribute('x', posX - squareSize / 2);
      square.setAttribute('y', posY - squareSize / 2);
      square.setAttribute('width', squareSize);
      square.setAttribute('height', squareSize);
      square.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
      square.setAttribute('stroke', 'none');
      square.setAttribute('class', 'rotating-square');
      square.style.transformOrigin = `${posX}px ${posY}px`;
      squareGroup.appendChild(square);
    }
    ringGroup.appendChild(squareGroup);

    svgElement.appendChild(ringGroup);

    // Handle resize to update positions
    window.addEventListener('resize', function() {
      svgElement.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
      ringGroup.innerHTML = ''; // Clear existing content
      wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
      if (wheelRect) {
        const newCenterX = wheelRect.left + wheelRect.width / 2;
        const newCenterY = wheelRect.top + wheelRect.height / 2;
        const newOuterD = `M${newCenterX + outerRadius},${newCenterY} A${outerRadius},${outerRadius} 0 1,0 ${newCenterX - outerRadius},${newCenterY} A${outerRadius},${outerRadius} 0 1,0 ${newCenterX + outerRadius},${newCenterY}`;
        const newInnerD = `M${newCenterX + innerRadius},${newCenterY} A${innerRadius},${innerRadius} 0 1,1 ${newCenterX - innerRadius},${newCenterY} A${innerRadius},${innerRadius} 0 1,1 ${newCenterX + innerRadius},${newCenterY}`;
        const newRing = document.createElementNS(window.MENU_SVG_NS, 'path');
        newRing.setAttribute('d', `${newOuterD} ${newInnerD}`);
        newRing.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
        newRing.setAttribute('fill-rule', 'evenodd');
        newRing.setAttribute('stroke', '#ffffff');
        newRing.setAttribute('stroke-width', '2');
        newRing.setAttribute('class', 'stationary-ring');
        ringGroup.appendChild(newRing);

        const newSquareGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
        newSquareGroup.setAttribute('aria-hidden', 'true');
        newSquareGroup.setAttribute('class', 'rotating-squares');
        newSquareGroup.style.transformOrigin = `${newCenterX}px ${newCenterY}px`;
        for (let i = 0; i < squareCount; i++) {
          const angle = (i / squareCount) * 360;
          const posX = newCenterX + squareRadius * Math.cos((angle * Math.PI) / 180);
          const posY = newCenterY + squareRadius * Math.sin((angle * Math.PI) / 180);
          const square = document.createElementNS(window.MENU_SVG_NS, 'rect');
          square.setAttribute('x', posX - squareSize / 2);
          square.setAttribute('y', posY - squareSize / 2);
          square.setAttribute('width', squareSize);
          square.setAttribute('height', squareSize);
          square.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
          square.setAttribute('stroke', 'none');
          square.setAttribute('class', 'rotating-square');
          square.style.transformOrigin = `${posX}px ${posY}px`;
          newSquareGroup.appendChild(square);
        }
        ringGroup.appendChild(newSquareGroup);
        svgElement.appendChild(ringGroup);
      }
    });
  } else {
    console.error('Failed to create ring and squares: Missing radialMenu element');
  }

  console.log('Stationary ring and rotating squares initialized');
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: Starting rings and squares initialization');
  window.initRingsAndSquares();
});
