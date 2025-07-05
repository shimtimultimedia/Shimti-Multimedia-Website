/**
 * @module ThickCircle
 * @description Renders a stationary thick circle encompassing the dotted circle and inner elements for Shimti Multimedia’s sci-fi holographic UI.
 */

/** @constant {string} window.MENU_SVG_NS - SVG namespace for thick circle */
window.MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * @function window.initThickCircle
 * @description Initializes stationary thick circle in full-screen SVG, encircling the dotted circle but not the welcome panel
 */
window.initThickCircle = function() {
  var svgElement = document.getElementById('thickCircleSvg');
  if (!svgElement) {
    console.error('Thick circle SVG not found');
    return;
  }

  // Set dynamic viewBox to match viewport
  svgElement.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);

  var circleGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
  circleGroup.setAttribute('aria-hidden', 'true');

  var wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
  if (wheelRect) {
    const centerX = wheelRect.left + wheelRect.width / 2;
    const centerY = wheelRect.top + wheelRect.height / 2;
    const outerRadius = 345; // 335px (dotted circle) + 10px spacing
    const innerRadius = 235; // 345px - 110px (matches radial menu button ring thickness)

    const outerD = `M${centerX + outerRadius},${centerY} A${outerRadius},${outerRadius} 0 1,0 ${centerX - outerRadius},${centerY} A${outerRadius},${outerRadius} 0 1,0 ${centerX + outerRadius},${centerY}`;
    const innerD = `M${centerX + innerRadius},${centerY} A${innerRadius},${innerRadius} 0 1,1 ${centerX - innerRadius},${centerY} A${innerRadius},${innerRadius} 0 1,1 ${centerX + innerRadius},${centerY}`;
    const circle = document.createElementNS(window.MENU_SVG_NS, 'path');
    circle.setAttribute('d', `${outerD} ${innerD}`);
    circle.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
    circle.setAttribute('fill-rule', 'evenodd');
    circle.setAttribute('stroke', 'none');
    circle.setAttribute('class', 'thick-circle');
    circleGroup.appendChild(circle);

    svgElement.appendChild(circleGroup);

    // Handle resize to update position
    window.addEventListener('resize', function() {
      svgElement.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
      circleGroup.innerHTML = ''; // Clear existing content
      wheelRect = document.getElementById('radialMenu')?.getBoundingClientRect();
      if (wheelRect) {
        const newCenterX = wheelRect.left + wheelRect.width / 2;
        const newCenterY = wheelRect.top + wheelRect.height / 2;
        const newOuterD = `M${newCenterX + outerRadius},${newCenterY} A${outerRadius},${outerRadius} 0 1,0 ${newCenterX - outerRadius},${newCenterY} A${outerRadius},${outerRadius} 0 1,0 ${newCenterX + outerRadius},${newCenterY}`;
        const newInnerD = `M${newCenterX + innerRadius},${newCenterY} A${innerRadius},${innerRadius} 0 1,1 ${newCenterX - innerRadius},${newCenterY} A${innerRadius},${innerRadius} 0 1,1 ${newCenterX + innerRadius},${newCenterY}`;
        const newCircle = document.createElementNS(window.MENU_SVG_NS, 'path');
        newCircle.setAttribute('d', `${newOuterD} ${newInnerD}`);
        newCircle.setAttribute('fill', 'rgba(180, 220, 255, 0.08)');
        newCircle.setAttribute('fill-rule', 'evenodd');
        newCircle.setAttribute('stroke', 'none');
        newCircle.setAttribute('class', 'thick-circle');
        circleGroup.appendChild(newCircle);
        svgElement.appendChild(circleGroup);
      }
    });
  } else {
    console.error('Failed to create thick circle: Missing radialMenu element');
  }

  console.log('Thick circle initialized');
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: Starting thick circle initialization');
  window.initThickCircle();
});
