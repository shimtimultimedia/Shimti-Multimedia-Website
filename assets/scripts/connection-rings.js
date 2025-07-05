/**
 * @module ConnectionRings
 * @description Renders top and bottom connection lines with connection points for Shimti Multimedia.
 */

/** @constant {string} window.MENU_SVG_NS - SVG namespace for connection elements */
window.MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * @function window.initConnectionLines
 * @description Initializes top and bottom connection lines with connection points in full-screen SVG
 */
window.initConnectionLines = function() {
  var svgElement = document.getElementById('connectionSvg');
  if (!svgElement) {
    console.error('Connection SVG not found');
    return;
  }

  // Set dynamic viewBox to match viewport
  svgElement.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);

  var connectionGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
  connectionGroup.setAttribute('aria-hidden', 'true');

  // Top Connection Line (from shimtiPanel right edge to radialMenu)
  var titleRect = document.getElementById('shimtiPanel')?.getBoundingClientRect();
  var wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
  if (titleRect && wheelRect) {
    const startPoint = {
      x: titleRect.right, // Right edge of shimtiPanel
      y: titleRect.top + titleRect.height / 1 // Vertical center
    };
    const endPoint = {
      x: wheelRect.left + wheelRect.width / 2,
      y: wheelRect.top + wheelRect.height / 18 // ~5.56% from top
    };
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
    const startPoint = {
      x: wheelRect.left + wheelRect.width / 2,
      y: wheelRect.top + wheelRect.height / 1.05 // ~95.24% from top
    };
    const endPoint = {
      x: bottomPanelRect.left + bottomPanelRect.width / 2,
      y: bottomPanelRect.top
    };

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
    startCircle.setAttribute('stroke-width', '1');
    endCircle.setAttribute('class', 'connection-point');
    connectionGroup.appendChild(endCircle);
  } else {
    console.error('Failed to create bottom connection line: Missing DOM elements', { wheelRect, bottomPanelRect });
  }

  svgElement.appendChild(connectionGroup);

  // Handle resize to update viewBox and redraw lines
  window.addEventListener('resize', function() {
    svgElement.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    connectionGroup.innerHTML = ''; // Clear existing lines
    titleRect = document.getElementById('shimtiPanel')?.getBoundingClientRect();
    wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
    if (titleRect && wheelRect) {
      const startPoint = {
        x: titleRect.right,
        y: titleRect.top + titleRect.height / 2
      };
      const endPoint = {
        x: wheelRect.left + wheelRect.width / 2,
        y: wheelRect.top + wheelRect.height / 18
      };
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
      const startPoint = {
        x: wheelRect.left + wheelRect.width / 2,
        y: wheelRect.top + wheelRect.height / 1.05
      };
      const endPoint = {
        x: bottomPanelRect.left + bottomPanelRect.width / 2,
        y: bottomPanelRect.top
      };

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
