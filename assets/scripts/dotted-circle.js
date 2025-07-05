/**
 * @module DottedCircle
 * @description Renders a stationary dotted circle encompassing the outer segmented ring (330px outer radius) with ~5px spacing for Shimti Multimedia’s sci-fi holographic UI.
 */

/** @constant {string} window.MENU_SVG_NS - SVG namespace for dotted circle */
window.MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * @function window.initDottedCircle
 * @description Initializes stationary dotted circle in full-screen SVG, encircling the outer segmented ring but not the welcome panel
 */
window.initDottedCircle = function() {
  var svgElement = document.getElementById('dottedCircleSvg');
  if (!svgElement) {
    console.error('Dotted circle SVG not found');
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
    const radius = 335; // 330px (outer segmented ring) + 5px spacing

    const circle = document.createElementNS(window.MENU_SVG_NS, 'circle');
    circle.setAttribute('cx', centerX);
    circle.setAttribute('cy', centerY);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('stroke-dasharray', '4, 4');
    circle.setAttribute('class', 'dotted-circle');
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
        const newCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
        newCircle.setAttribute('cx', newCenterX);
        newCircle.setAttribute('cy', newCenterY);
        newCircle.setAttribute('r', radius);
        newCircle.setAttribute('fill', 'none');
        newCircle.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        newCircle.setAttribute('stroke-width', '2');
        newCircle.setAttribute('stroke-dasharray', '4, 4');
        newCircle.setAttribute('class', 'dotted-circle');
        circleGroup.appendChild(newCircle);
        svgElement.appendChild(circleGroup);
      }
    });
  } else {
    console.error('Failed to create dotted circle: Missing radialMenu element');
  }

  console.log('Dotted circle initialized');
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: Starting dotted circle initialization');
  window.initDottedCircle();
});
