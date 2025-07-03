/**
 * Shimti Multimedia: Manages connection lines between panels and radial menu.
 * Handles dynamic SVG rendering and responsive resizing for a sci-fi aesthetic.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

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
      startPoint: {
        x: topRect.left + topRect.width / 2,
        y: topRect.bottom,
      },
      endPoint: {
        x: radialRect.left + radialRect.width / 2,
        y: radialRect.top,
      },
    };

    // Removed debug log
    // console.log('Top connection line points:', topPoints);

    const bottomPoints = {
      startPoint: {
        x: bottomRect.left + bottomRect.width / 2,
        y: bottomRect.top,
      },
      endPoint: {
        x: radialRect.left + radialRect.width / 2,
        y: radialRect.bottom,
      },
    };

    // Removed debug log
    // console.log('Bottom connection line points:', bottomPoints);

    const pathTop = document.createElementNS(SVG_NS, 'path');
    pathTop.setAttribute('d', `M${topPoints.startPoint.x},${topPoints.startPoint.y} L${topPoints.endPoint.x},${topPoints.endPoint.y}`);
    pathTop.setAttribute('stroke', '#fff');
    pathTop.setAttribute('stroke-width', '1');
    pathTop.setAttribute('stroke-dasharray', '5,5');
    connectionLines.appendChild(pathTop);

    const pathBottom = document.createElementNS(SVG_NS, 'path');
    pathBottom.setAttribute('d', `M${bottomPoints.startPoint.x},${bottomPoints.startPoint.y} L${bottomPoints.endPoint.x},${bottomPoints.endPoint.y}`);
    pathBottom.setAttribute('stroke', '#fff');
    pathBottom.setAttribute('stroke-width', '1');
    pathBottom.setAttribute('stroke-dasharray', '5,5');
    connectionLines.appendChild(pathBottom);
  };

  updateLines();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateLines, 100);
  });
}

window.addEventListener('load', drawConnectionLines);
