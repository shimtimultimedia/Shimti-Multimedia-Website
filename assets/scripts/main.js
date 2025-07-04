/**
 * @module ConnectionLines
 * @description Renders SVG connection lines between branding panels and radial menu.
 * Supports dynamic, curved lines with responsive resizing for a sci-fi aesthetic.
 */

/** @constant {string} CONNECTION_SVG_NS - SVG namespace for connection elements */
const CONNECTION_SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * @function renderConnectionLines
 * @description Initializes and updates SVG connection lines
 */
function renderConnectionLines() {
  const brandingPanel = document.getElementById('shimtiPanel');
  const welcomePanel = document.getElementById('shimtiPanelBottom');
  const radialMenu = document.getElementById('radialMenu');
  const connectionLayer = document.getElementById('connectionLines');

  if (!brandingPanel || !welcomePanel || !radialMenu || !connectionLayer) {
    console.error('Required elements not found:', { brandingPanel, welcomePanel, radialMenu, connectionLayer });
    return;
  }

  /** @function updateLines - Updates SVG line positions and styles */
  const updateLines = () => {
    connectionLayer.innerHTML = ''; // Clear existing lines

    const topRect = brandingPanel.getBoundingClientRect();
    const bottomRect = welcomePanel.getBoundingClientRect();
    const radialRect = radialMenu.getBoundingClientRect();

    const topPoints = {
      startPoint: { x: topRect.right, y: topRect.top + topRect.height / 2 }, // Right side of brandingPanel
      controlPoint1: { x: topRect.right + 100, y: topRect.top + topRect.height / 2 }, // Horizontal extension
      controlPoint2: { x: radialRect.left + radialRect.width / 2, y: radialRect.top - 100 }, // Downward bend
      endPoint: { x: radialRect.left + radialRect.width / 2, y: radialRect.top }, // Top of radialMenu
    };

    const bottomPoints = {
      startPoint: { x: bottomRect.left + bottomRect.width / 2, y: bottomRect.top },
      endPoint: { x: radialRect.left + radialRect.width / 2, y: radialRect.bottom },
    };

    // Top curved connection line (horizontal then downward)
    const pathTop = document.createElementNS(CONNECTION_SVG_NS, 'path');
    pathTop.setAttribute('d', `M${topPoints.startPoint.x},${topPoints.startPoint.y} C${topPoints.controlPoint1.x},${topPoints.controlPoint1.y} ${topPoints.controlPoint2.x},${topPoints.controlPoint2.y} ${topPoints.endPoint.x},${topPoints.endPoint.y}`);
    pathTop.setAttribute('stroke', 'rgba(255, 255, 255, 0.5)');
    pathTop.setAttribute('stroke-width', '2');
    pathTop.setAttribute('fill', 'none');
    connectionLayer.appendChild(pathTop);

    // Top connection points
    const topStartCircle = document.createElementNS(CONNECTION_SVG_NS, 'circle');
    topStartCircle.setAttribute('cx', topPoints.startPoint.x);
    topStartCircle.setAttribute('cy', topPoints.startPoint.y);
    topStartCircle.setAttribute('r', '4');
    topStartCircle.setAttribute('fill', 'rgba(255, 255, 255, 0.7)');
    connectionLayer.appendChild(topStartCircle);

    const topEndCircle = document.createElementNS(CONNECTION_SVG_NS, 'circle');
    topEndCircle.setAttribute('cx', topPoints.endPoint.x);
    topEndCircle.setAttribute('cy', topPoints.endPoint.y);
    topEndCircle.setAttribute('r', '4');
    topEndCircle.setAttribute('fill', 'rgba(255, 255, 255, 0.7)');
    connectionLayer.appendChild(topEndCircle);

    // Bottom straight connection line
    const pathBottom = document.createElementNS(CONNECTION_SVG_NS, 'path');
    pathBottom.setAttribute('d', `M${bottomPoints.startPoint.x},${bottomPoints.startPoint.y} L${bottomPoints.endPoint.x},${bottomPoints.endPoint.y}`);
    pathBottom.setAttribute('stroke', 'rgba(255, 255, 255, 0.5)');
    pathBottom.setAttribute('stroke-width', '2');
    pathBottom.setAttribute('fill', 'none');
    connectionLayer.appendChild(pathBottom);

    // Bottom connection points
    const bottomStartCircle = document.createElementNS(CONNECTION_SVG_NS, 'circle');
    bottomStartCircle.setAttribute('cx', bottomPoints.startPoint.x);
    bottomStartCircle.setAttribute('cy', bottomPoints.startPoint.y);
    bottomStartCircle.setAttribute('r', '4');
    bottomStartCircle.setAttribute('fill', 'rgba(255, 255, 255, 0.7)');
    connectionLayer.appendChild(bottomStartCircle);

    const bottomEndCircle = document.createElementNS(CONNECTION_SVG_NS, 'circle');
    bottomEndCircle.setAttribute('cx', bottomPoints.endPoint.x);
    bottomEndCircle.setAttribute('cy', bottomPoints.endPoint.y);
    bottomEndCircle.setAttribute('r', '4');
    bottomEndCircle.setAttribute('fill', 'rgba(255, 255, 255, 0.7)');
    connectionLayer.appendChild(bottomEndCircle);
  };

  updateLines();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateLines, 100);
  });
}

window.addEventListener('load', renderConnectionLines);
