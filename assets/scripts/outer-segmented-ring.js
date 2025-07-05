/**
 * @module OuterSegmentedRing
 * @description Renders a larger segmented clockwise-rotating ring with consistent thickness and randomized arc lengths for Shimti Multimedia.
 */

/** @constant {string} window.MENU_SVG_NS - SVG namespace for outer segmented ring */
window.MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * @function window.initOuterSegmentedRing
 * @description Initializes larger segmented clockwise-rotating ring in full-screen SVG
 */
window.initOuterSegmentedRing = function() {
  var svgElement = document.getElementById('outerSegmentedRingSvg');
  if (!svgElement) {
    console.error('Outer segmented ring SVG not found');
    return;
  }

  // Set dynamic viewBox to match viewport
  svgElement.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);

  var segmentGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
  segmentGroup.setAttribute('aria-hidden', 'true');
  segmentGroup.setAttribute('class', 'outer-segmented-ring');

  var wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
  if (wheelRect) {
    const centerX = wheelRect.left + wheelRect.width / 2;
    const centerY = wheelRect.top + wheelRect.height / 2;
    const outerRadius = 330;
    const innerRadius = 260; // Consistent 70px thickness
    const segmentCount = 16;
    const minArc = 2; // Allow very thin segments
    const maxArc = 90;
    const minGap = 5;
    const maxGap = 15;

    const segments = [];
    let currentAngle = 0;
    while (currentAngle < 360 && segments.length < segmentCount) {
      const arcLength = Math.random() < 0.5 ? minArc + Math.random() * (5 - minArc) : minArc + Math.random() * (maxArc - minArc); // 50% chance for thin arcs (2–5°)
      const gapLength = minGap + Math.random() * (maxGap - minGap);
      if (currentAngle + arcLength > 360) break;
      segments.push({ start: currentAngle, end: currentAngle + arcLength });
      currentAngle += arcLength + gapLength;
    }

    segments.forEach(segment => {
      const { start, end } = segment;
      const largeArc = end - start > 180 ? 1 : 0;
      const outerStart = {
        x: centerX + outerRadius * Math.cos((start * Math.PI) / 180),
        y: centerY + outerRadius * Math.sin((start * Math.PI) / 180)
      };
      const outerEnd = {
        x: centerX + outerRadius * Math.cos((end * Math.PI) / 180),
        y: centerY + outerRadius * Math.sin((end * Math.PI) / 180)
      };
      const innerStart = {
        x: centerX + innerRadius * Math.cos((end * Math.PI) / 180),
        y: centerY + innerRadius * Math.sin((end * Math.PI) / 180)
      };
      const innerEnd = {
        x: centerX + innerRadius * Math.cos((start * Math.PI) / 180),
        y: centerY + innerRadius * Math.sin((start * Math.PI) / 180)
      };

      const pathData = `
        M ${outerStart.x} ${outerStart.y}
        A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
        L ${innerStart.x} ${innerStart.y}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}
        Z
      `;

      const path = document.createElementNS(window.MENU_SVG_NS, 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
      path.setAttribute('stroke', 'none');
      segmentGroup.appendChild(path);
    });

    segmentGroup.style.transformOrigin = `${centerX}px ${centerY}px`;
    svgElement.appendChild(segmentGroup);

    // Handle resize to update positions
    window.addEventListener('resize', function() {
      svgElement.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
      segmentGroup.innerHTML = ''; // Clear existing content
      wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
      if (wheelRect) {
        const newCenterX = wheelRect.left + wheelRect.width / 2;
        const newCenterY = wheelRect.top + wheelRect.height / 2;
        segments.forEach(segment => {
          const { start, end } = segment;
          const largeArc = end - start > 180 ? 1 : 0;
          const outerStart = {
            x: newCenterX + outerRadius * Math.cos((start * Math.PI) / 180),
            y: newCenterY + outerRadius * Math.sin((start * Math.PI) / 180)
          };
          const outerEnd = {
            x: newCenterX + outerRadius * Math.cos((end * Math.PI) / 180),
            y: newCenterY + outerRadius * Math.sin((end * Math.PI) / 180)
          };
          const innerStart = {
            x: newCenterX + innerRadius * Math.cos((end * Math.PI) / 180),
            y: newCenterY + innerRadius * Math.sin((end * Math.PI) / 180)
          };
          const innerEnd = {
            x: newCenterX + innerRadius * Math.cos((start * Math.PI) / 180),
            y: newCenterY + innerRadius * Math.sin((start * Math.PI) / 180)
          };

          const pathData = `
            M ${outerStart.x} ${outerStart.y}
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
            L ${innerStart.x} ${innerStart.y}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}
            Z
          `;
          const path = document.createElementNS(window.MENU_SVG_NS, 'path');
          path.setAttribute('d', pathData);
          path.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
          path.setAttribute('stroke', 'none');
          segmentGroup.appendChild(path);
        });
        segmentGroup.style.transformOrigin = `${newCenterX}px ${newCenterY}px`;
        svgElement.appendChild(segmentGroup);
      }
    });
  } else {
    console.error('Failed to create outer segmented ring: Missing radialMenu element');
  }

  console.log('Outer segmented ring initialized');
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: Starting outer segmented ring initialization');
  window.initOuterSegmentedRing();
});
