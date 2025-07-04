/**
 * Shimti Multimedia: Manages connection lines between panels and radial menu.
 * Handles dynamic SVG rendering and responsive resizing for a sci-fi aesthetic.
 */
const SVG_NS_MAIN = 'http://www.w3.org/2000/svg';

function drawConnectionLines() {
  const shimtiPanel = document.getElementById('shimtiPanel');
  const shimtiPanelBottom = document.getElementById('shimtiPanelBottom');
  const radialMenu = document.getElementById('radialMenu');
  const connectionLines = document.getElementById('connectionLines');

  if (!shimtiPanel || !shimtiPanelBottom || !radialMenu || !connectionLines) {
    console.error('Required elements not found:', { shimtiPanel, shimtiPanelBottom, radialMenu, connectionLines });
    return;
  }

  const updateLines = () => {
    connectionLines.innerHTML = ''; // Clear existing lines

    const topRect = shimtiPanel.getBoundingClientRect();
    const bottomRect = shimtiPanelBottom.getBoundingClientRect();
    const radialRect = radialMenu.getBoundingClientRect();

    const topPoints = {
      startPoint: { x: topRect.left + topRect.width / 2, y: topRect.bottom },
      endPoint: { x: radialRect.left + radialRect.width / 2, y: radialRect.top },
    };

    const bottomPoints = {
      startPoint: { x: bottomRect.left + bottomRect.width / 2, y: bottomRect.top },
      endPoint: { x: radialRect.left + radialRect.width / 2, y: radialRect.bottom },
    };

    // Top connection line
    const pathTop = document.createElementNS(SVG_NS_MAIN, 'path');
    pathTop.setAttribute('d', `M${topPoints.startPoint.x},${topPoints.startPoint.y} L${topPoints.endPoint.x},${topPoints.endPoint.y}`);
    pathTop.setAttribute('stroke', '#8cf');
    pathTop.setAttribute('stroke-width', '2');
    pathTop.setAttribute('fill', 'none');
    connectionLines.appendChild(pathTop);

    // Top connection points
    const topStartCircle = document.createElementNS(SVG_NS_MAIN, 'circle');
    topStartCircle.setAttribute('cx', topPoints.startPoint.x);
    topStartCircle.setAttribute('cy', topPoints.startPoint.y);
    topStartCircle.setAttribute('r', '4');
    topStartCircle.setAttribute('fill', '#8cf');
    connectionLines.appendChild(topStartCircle);

    const topEndCircle = document.createElementNS(SVG_NS_MAIN, 'circle');
    topEndCircle.setAttribute('cx', topPoints.endPoint.x);
    topEndCircle.setAttribute('cy', topPoints.endPoint.y);
    topEndCircle.setAttribute('r', '4');
    topEndCircle.setAttribute('fill', '#8cf');
    connectionLines.appendChild(topEndCircle);

    // Bottom connection line
    const pathBottom = document.createElementNS(SVG_NS_MAIN, 'path');
    pathBottom.setAttribute('d', `M${bottomPoints.startPoint.x},${bottomPoints.startPoint.y} L${bottomPoints.endPoint.x},${bottomPoints.endPoint.y}`);
    pathBottom.setAttribute('stroke', '#8cf');
    pathBottom.setAttribute('stroke-width', '2');
    pathBottom.setAttribute('fill', 'none');
    connectionLines.appendChild(pathBottom);

    // Bottom connection points
    const bottomStartCircle = document.createElementNS(SVG_NS_MAIN, 'circle');
    bottomStartCircle.setAttribute('cx', bottomPoints.startPoint.x);
    bottomStartCircle.setAttribute('cy', bottomPoints.startPoint.y);
    bottomStartCircle.setAttribute('r', '4');
    bottomStartCircle.setAttribute('fill', '#8cf');
    connectionLines.appendChild(bottomStartCircle);

    const bottomEndCircle = document.createElementNS(SVG_NS_MAIN, 'circle');
    bottomEndCircle.setAttribute('cx', bottomPoints.endPoint.x);
    bottomEndCircle.setAttribute('cy', bottomPoints.endPoint.y);
    bottomEndCircle.setAttribute('r', '4');
    bottomEndCircle.setAttribute('fill', '#8cf');
    connectionLines.appendChild(bottomEndCircle);
  };

  updateLines();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateLines, 100);
  });
}

window.addEventListener('load', drawConnectionLines);
