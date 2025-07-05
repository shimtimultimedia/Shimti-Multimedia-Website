/**
 * @module ConnectionRings
 * @description Renders top and bottom connection lines with connection points for Shimti Multimedia's radial menu.
 */

/** @constant {string} window.MENU_SVG_NS - SVG namespace for connection elements */
window.MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * @function window.initConnectionLines
 * @description Initializes top and bottom connection lines with connection points
 */
window.initConnectionLines = function() {
  var svgElement = document.getElementById('radialMenu');
  if (!svgElement) {
    console.error('Radial menu SVG not found');
    return;
  }

  var connectionGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
  connectionGroup.setAttribute('aria-hidden', 'true');

  // Convert viewport coordinates to SVG viewBox (0 0 400 400)
  function toSvgCoords(x, y, elementRect) {
    const svgRect = svgElement.getBoundingClientRect();
    const scaleX = 400 / svgRect.width;
    const scaleY = 400 / svgRect.height;
    // Adjust for SVG's position in viewport
    const offsetX = x - svgRect.left;
    const offsetY = y - svgRect.top;
    return {
      x: Math.max(0, Math.min(400, offsetX * scaleX)),
      y: Math.max(0, Math.min(400, offsetY * scaleY))
    };
  }

  // Top Connection Line (from shimtiPanel to radialMenu)
  var titleRect = document.getElementById('shimtiPanel')?.getBoundingClientRect();
  var wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
  if (titleRect && wheelRect) {
    const startPoint = toSvgCoords(
      titleRect.left + titleRect.width,
      titleRect.top + titleRect.height / 2,
      titleRect
    );
    const endPoint = toSvgCoords(
      wheelRect.left + wheelRect.width / 2,
      wheelRect.top + wheelRect.height / 18, // ~22.22px in 400x400 viewBox
      wheelRect
    );
    const bendX = startPoint.x + (endPoint.x - startPoint.x);
    const bendY = startPoint.y;

    const path = document.createElementNS(window.MENU_SVG_NS, 'path');
    path.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${bendX} ${bendY} L ${endPoint.x} ${endPoint.y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('class', 'connection-line');
    connectionGroup.appendChild(path);

    const startCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
    startCircle.setAttribute('cx', startPoint.x);
    startCircle.setAttribute('cy', startPoint.y);
    startCircle.setAttribute('r', '5');
    startCircle.setAttribute('fill', 'none');
    startCircle.setAttribute('stroke', '#ffffff');
    startCircle.setAttribute('stroke-width', '1');
    startCircle.setAttribute('class', 'connection-point');
    connectionGroup.appendChild(startCircle);

    const endCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
    endCircle.setAttribute('cx', endPoint.x);
    endCircle.setAttribute('cy', endPoint.y);
    endCircle.setAttribute('r', '5');
    endCircle.setAttribute('fill', 'none');
    endCircle.setAttribute('stroke', '#ffffff');
    endCircle.setAttribute('stroke-width', '1');
    endCircle.setAttribute('class', 'connection-point');
    connectionGroup.appendChild(endCircle);
  } else {
    console.error('Failed to create top connection line: Missing DOM elements', { titleRect, wheelRect });
  }

  // Bottom Connection Line (from radialMenu to shimtiPanelBottom)
  var bottomPanelRect = document.getElementById('shimtiPanelBottom')?.getBoundingClientRect();
  if (wheelRect && bottomPanelRect) {
    const startPoint = toSvgCoords(
      wheelRect.left + wheelRect.width / 2,
      wheelRect.top + wheelRect.height / 1.05, // ~380.95px in 400x400 viewBox
      wheelRect
    );
    const endPoint = toSvgCoords(
      bottomPanelRect.left + bottomPanelRect.width / 2,
      bottomPanelRect.top,
      bottomPanelRect
    );

    const path = document.createElementNS(window.MENU_SVG_NS, 'path');
    path.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('class', 'connection-line');
    connectionGroup.appendChild(path);

    const startCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
    startCircle.setAttribute('cx', startPoint.x);
    startCircle.setAttribute('cy', startPoint.y);
    startCircle.setAttribute('r', '5');
    startCircle.setAttribute('fill', 'none');
    startCircle.setAttribute('stroke', '#ffffff');
    startCircle.setAttribute('stroke-width', '1');
    startCircle.setAttribute('class', 'connection-point');
    connectionGroup.appendChild(startCircle);

    const endCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
    endCircle.setAttribute('cx', endPoint.x);
    endCircle.setAttribute('cy', endPoint.y);
    endCircle.setAttribute('r', '5');
    endCircle.setAttribute('fill', 'none');
    endCircle.setAttribute('stroke', '#ffffff');
    endCircle.setAttribute('stroke-width', '1');
    endCircle.setAttribute('class', 'connection-point');
    connectionGroup.appendChild(endCircle);
  } else {
    console.error('Failed to create bottom connection line: Missing DOM elements', { wheelRect, bottomPanelRect });
  }

  svgElement.appendChild(connectionGroup);

  // Handle resize to update coordinates
  window.addEventListener('resize', function() {
    connectionGroup.innerHTML = ''; // Clear existing lines
    titleRect = document.getElementById('shimtiPanel')?.getBoundingClientRect();
    wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
    if (titleRect && wheelRect) {
      const startPoint = toSvgCoords(
        titleRect.left + titleRect.width,
        titleRect.top + titleRect.height / 2,
        titleRect
      );
      const endPoint = toSvgCoords(
        wheelRect.left + wheelRect.width / 2,
        wheelRect.top + wheelRect.height / 18,
        wheelRect
      );
      const bendX = startPoint.x + (endPoint.x - startPoint.x);
      const bendY = startPoint.y;

      const path = document.createElementNS(window.MENU_SVG_NS, 'path');
      path.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${bendX} ${bendY} L ${endPoint.x} ${endPoint.y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('class', 'connection-line');
      connectionGroup.appendChild(path);

      const startCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
      startCircle.setAttribute('cx', startPoint.x);
      startCircle.setAttribute('cy', startPoint.y);
      startCircle.setAttribute('r', '5');
      startCircle.setAttribute('fill', 'none');
      startCircle.setAttribute('stroke', '#ffffff');
      startCircle.setAttribute('stroke-width', '1');
      startCircle.setAttribute('class', 'connection-point');
      connectionGroup.appendChild(startCircle);

      const endCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
      endCircle.setAttribute('cx', endPoint.x);
      endCircle.setAttribute('cy', endPoint.y);
      endCircle.setAttribute('r', '5');
      endCircle.setAttribute('fill', 'none');
      endCircle.setAttribute('stroke', '#ffffff');
      endCircle.setAttribute('stroke-width', '1');
      endCircle.setAttribute('class', 'connection-point');
      connectionGroup.appendChild(endCircle);
    }

    bottomPanelRect = document.getElementById('shimtiPanelBottom')?.getBoundingClientRect();
    if (wheelRect && bottomPanelRect) {
      const startPoint = toSvgCoords(
        wheelRect.left + wheelRect.width / 2,
        wheelRect.top + wheelRect.height / 1.05,
        wheelRect
      );
      const endPoint = toSvgCoords(
        bottomPanelRect.left + bottomPanelRect.width / 2,
        bottomPanelRect.top,
        bottomPanelRect
      );

      const path = document.createElementNS(window.MENU_SVG_NS, 'path');
      path.setAttribute('d', `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('class', 'connection-line');
      connectionGroup.appendChild(path);

      const startCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
      startCircle.setAttribute('cx', startPoint.x);
      startCircle.setAttribute('cy', startPoint.y);
      startCircle.setAttribute('r', '5');
      startCircle.setAttribute('fill', 'none');
      startCircle.setAttribute('stroke', '#ffffff');
      startCircle.setAttribute('stroke-width', '1');
      startCircle.setAttribute('class', 'connection-point');
      connectionGroup.appendChild(startCircle);

      const endCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
      endCircle.setAttribute('cx', endPoint.x);
      endCircle.setAttribute('cy', endPoint.y);
      endCircle.setAttribute('r', '5');
      endCircle.setAttribute('fill', 'none');
      endCircle.setAttribute('stroke', '#ffffff');
      endCircle.setAttribute('stroke-width', '1');
      endCircle.setAttribute('class', 'connection-point');
      connectionGroup.appendChild(endCircle);
    }

    svgElement.appendChild(connectionGroup);
  });

  console.log('Connection lines initialized');
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: Starting connection lines initialization');
  window.initConnectionLines();
});
