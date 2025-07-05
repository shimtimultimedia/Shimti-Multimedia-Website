/**
 * @module RadialMenu
 * @description Initializes the radial menu with interactive sectors, grid, holographic effects, and welcome text carousel.
 * Manages SVG rendering and user interactions for a sci-fi aesthetic.
 */

/** @constant {string} MENU_SVG_NS - SVG namespace for menu elements */
const MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/** @constant {Object} MENU_CONFIG - Configuration for radial menu and welcome carousel */
const MENU_CONFIG = {
  CENTER_X: 200, // X-coordinate of menu center
  CENTER_Y: 200, // Y-coordinate of menu center
  OUTER_RADIUS: 180, // Outer radius of menu sectors
  INNER_RADIUS: 70, // Inner radius of menu sectors
  GRID_SPACING: 20, // Grid line spacing
  GRID_PARTICLE_COUNT_MIN: 4, // Minimum grid particles
  GRID_PARTICLE_COUNT_MAX: 12, // Maximum grid particles
  SECTOR_FILL: 'rgba(180, 220, 255, 0.08)', // Sector fill color
  STROKE_COLOR: '#fff', // Stroke color for menu elements
  BACKGROUND_RADIUS: 192, // Stationary ring radius
  INNER_CIRCLE_RADIUS: 58, // Inner circle radius
  INNER_FILLED_RADIUS: 48, // Inner filled circle radius
  CORE_RADIUS: 20, // Holographic core radius
  OUTER_RING_RADIUS: 200, // Outer rotating ring radius
  INNER_RING_RADIUS: 60, // Inner rotating ring radius
  SEGMENTED_RING_RADIUS: 210, // Outer segmented ring radius
  RING_STROKE_WIDTH: 2, // Thickness for all rings except segmented
  SEGMENTED_RING_STROKE_WIDTH: 1, // Thinner segmented ring
  RING_RADII: [25, 30, 35], // Radii for holographic core rings
  NAVIGATION_LINKS: ['Contact', 'AI', 'Work', 'Media', 'Shop', 'About'], // Menu sector labels
  WELCOME_INTERVAL: 3000, // Carousel transition interval (ms)
  SQUARE_COUNT: 24, // Number of rotating squares
  SEGMENT_COUNT: 8, // Number of segments in counter-rotating ring
  FALLBACK_LANGUAGES: [
    { lang: 'English', text: 'Welcome' },
    { lang: 'Spanish', text: 'Bienvenido' },
    { lang: 'French', text: 'Bienvenue' },
    { lang: 'German', text: 'Willkommen' },
    { lang: 'Russian', text: 'Добро пожаловать' },
    { lang: 'Mandarin', text: '欢迎' },
    { lang: 'Japanese', text: 'ようこそ' },
    { lang: 'Hindi', text: 'स्वागत है' },
    { lang: 'Swahili', text: 'Karibu' },
    { lang: 'Arabic', text: 'أهلاً' },
    { lang: 'Portuguese', text: 'Bem-vindo' },
    { lang: 'Yoruba', text: 'Kaabọ' },
  ], // Fallback languages for welcome text
};

/**
 * @function polarToCartesian
 * @description Converts polar coordinates to Cartesian coordinates
 * @param {number} centerX - X-coordinate of the center
 * @param {number} centerY - Y-coordinate of the center
 * @param {number} radius - Radius from the center
 * @param {number} angleDeg - Angle in degrees
 * @returns {Object} Cartesian coordinates {x, y}
 */
function polarToCartesian(centerX, centerY, radius, angleDeg) {
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
}

/**
 * @function createNavigationSector
 * @description Creates an SVG sector for the radial menu
 * @param {Object} position - Sector position data (p1, p2, p3, p4, iconPos, start, end)
 * @param {string} label - Sector label (e.g., 'Contact')
 * @param {string} fillColor - Sector fill color
 * @param {DocumentFragment} fragment - Fragment to append the sector
 */
function createNavigationSector(position, label, fillColor, fragment) {
  const { p1, p2, p3, p4, iconPos, start, end } = position;
  const largeArc = end - start > 180 ? 1 : 0;
  const pathData = `
    M ${p1.x} ${p1.y}
    A ${MENU_CONFIG.OUTER_RADIUS} ${MENU_CONFIG.OUTER_RADIUS} 0 ${largeArc} 0 ${p2.x} ${p2.y}
    L ${p3.x} ${p3.y}
    A ${MENU_CONFIG.INNER_RADIUS} ${MENU_CONFIG.INNER_RADIUS} 0 ${largeArc} 1 ${p4.x} ${p4.y}
    Z
  `;

  const path = document.createElementNS(MENU_SVG_NS, 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', fillColor);
  path.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
  path.setAttribute('stroke-width', '1');

  const group = document.createElementNS(MENU_SVG_NS, 'g');
  group.setAttribute('role', 'link');
  group.setAttribute('aria-label', `Navigate to ${label} section`);
  group.setAttribute('tabindex', '0');
  group.dataset.label = label;

  const icon = document.createElementNS(MENU_SVG_NS, 'image');
  const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
  icon.setAttribute('href', `assets/images/${capitalizedLabel}.svg`);
  icon.setAttribute('x', iconPos.x - 25);
  icon.setAttribute('y', iconPos.y - 25);
  icon.setAttribute('width', '50');
  icon.setAttribute('height', '50');
  icon.setAttribute('aria-label', `${label} Icon`);
  icon.setAttribute('loading', 'lazy');

  group.appendChild(path);
  group.appendChild(icon);
  fragment.appendChild(group);
}

/**
 * @class GridParticle
 * @description Represents a fading particle in the radial menu's grid
 */
class GridParticle {
  /**
   * @param {number} x - X-coordinate of the particle
   * @param {number} y - Y-coordinate of the particle
   * @param {SVGGElement} gridOverlay - SVG group for appending the particle
   */
  constructor(x, y, gridOverlay) {
    this.x = x;
    this.y = y;
    this.element = document.createElementNS(MENU_SVG_NS, 'circle');
    this.element.setAttribute('cx', this.x);
    this.element.setAttribute('cy', this.y);
    this.element.setAttribute('r', '3');
    this.element.setAttribute('fill', 'rgba(234, 255, 255, 0.8)');
    this.element.setAttribute('opacity', '0');
    this.element.setAttribute('class', 'grid-particle');
    gridOverlay.appendChild(this.element);
    this.animate();
  }

  /** @method animate - Applies fading animation to the particle */
  animate() {
    const lifetime = 1000 + Math.random() * 2000;
    const delay = Math.random() * 1000;
    this.element.style.setProperty('--random-delay', delay / 1000);
  }
}

/**
 * @function initializeWelcomeCarousel
 * @description Initializes the welcome text carousel with language cycling
 * @async
 */
async function initializeWelcomeCarousel() {
  await new Promise(resolve => setTimeout(resolve, 100));
  const welcomeText = document.getElementById('welcomeText');
  const menuContainer = document.getElementById('wheelMenu');
  if (!welcomeText || !menuContainer) {
    console.error('Welcome text or menu container not found:', { welcomeText, menuContainer });
    return;
  }

  welcomeText.textContent = 'Loading...';

  let languages = MENU_CONFIG.FALLBACK_LANGUAGES;
  try {
    const response = await fetch('assets/data/languages.xml');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const languageNodes = xmlDoc.getElementsByTagName('language');
    if (languageNodes.length === 0) throw new Error('No languages found in XML');
    languages = Array.from(languageNodes).map(node => ({
      lang: node.getAttribute('lang'),
      text: node.getAttribute('text') || 'Welcome'
    }));
  } catch (error) {
    console.warn('Failed to load languages.xml, using fallback:', error);
  }

  let currentIndex = 0;
  let isHovering = false;
  let timeoutId = null;
  let hasShownEnglish = false;

  /** @function cycleText - Cycles through welcome text languages */
  const cycleText = () => {
    if (isHovering) return;

    if (languages[currentIndex].lang === 'English' && hasShownEnglish) {
      currentIndex = (currentIndex + 1) % languages.length;
    }

    welcomeText.classList.remove('fade-in');
    welcomeText.classList.add('fade-out');
    setTimeout(() => {
      const newText = languages[currentIndex].text || 'Welcome';
      welcomeText.textContent = newText;
      welcomeText.classList.remove('fade-out');
      welcomeText.classList.add('fade-in');
      if (languages[currentIndex].lang === 'English') {
        hasShownEnglish = true;
      }
      currentIndex = (currentIndex + 1) % languages.length;
      timeoutId = setTimeout(cycleText, MENU_CONFIG.WELCOME_INTERVAL);
    }, 500);
  };

  welcomeText.textContent = languages[0].text || 'Welcome';
  welcomeText.classList.add('fade-in');
  timeoutId = setTimeout(cycleText, MENU_CONFIG.WELCOME_INTERVAL);

  menuContainer.querySelectorAll('g[role="link"]').forEach(sector => {
    sector.addEventListener('mouseenter', () => {
      isHovering = true;
      clearTimeout(timeoutId);
      welcomeText.classList.remove('fade-in');
      welcomeText.classList.add('fade-out');
      setTimeout(() => {
        const labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
        const labelText = labelMatch ? labelMatch[1] : '';
        welcomeText.textContent = labelText;
        welcomeText.classList.remove('fade-out');
        welcomeText.classList.add('fade-in');
      }, 500);
    });

    sector.addEventListener('mouseleave', () => {
      isHovering = false;
      welcomeText.classList.remove('fade-in');
      welcomeText.classList.add('fade-out');
      setTimeout(() => {
        const resumeText = languages[currentIndex].text || 'Welcome';
        welcomeText.textContent = resumeText;
        welcomeText.classList.remove('fade-out');
        welcomeText.classList.add('fade-in');
        timeoutId = setTimeout(cycleText, MENU_CONFIG.WELCOME_INTERVAL);
      }, 500);
    });
  });
}

/**
 * @function initializeRadialMenu
 * @description Initializes the radial menu with sectors, rings, squares, and grid
 */
function initializeRadialMenu() {
  const svgElement = document.getElementById('radialMenu');
  const menuContainer = document.getElementById('wheelMenu');
  if (!svgElement || !menuContainer) {
    console.error('Radial menu elements not found:', { svgElement, menuContainer });
    return;
  }

  const sectorAngle = 360 / MENU_CONFIG.NAVIGATION_LINKS.length;
  const sectorPositions = MENU_CONFIG.NAVIGATION_LINKS.map((_, i) => {
    const start = 270 + i * sectorAngle;
    const end = start + sectorAngle;
    const labelAngle = (start + end) / 2;
    return {
      p1: polarToCartesian(MENU_CONFIG.CENTER_X, MENU_CONFIG.CENTER_Y, MENU_CONFIG.OUTER_RADIUS, end),
      p2: polarToCartesian(MENU_CONFIG.CENTER_X, MENU_CONFIG.CENTER_Y, MENU_CONFIG.OUTER_RADIUS, start),
      p3: polarToCartesian(MENU_CONFIG.CENTER_X, MENU_CONFIG.CENTER_Y, MENU_CONFIG.INNER_RADIUS, start),
      p4: polarToCartesian(MENU_CONFIG.CENTER_X, MENU_CONFIG.CENTER_Y, MENU_CONFIG.INNER_RADIUS, end),
      iconPos: polarToCartesian(MENU_CONFIG.CENTER_X, MENU_CONFIG.CENTER_Y, (MENU_CONFIG.INNER_RADIUS + MENU_CONFIG.OUTER_RADIUS) / 2, labelAngle),
      start,
      end,
    };
  });

  const fragment = document.createDocumentFragment();
  sectorPositions.forEach((pos, i) => {
    createNavigationSector(pos, MENU_CONFIG.NAVIGATION_LINKS[i], MENU_CONFIG.SECTOR_FILL, fragment);
  });
  menuContainer.appendChild(fragment);

  menuContainer.addEventListener('click', (event) => {
    const sector = event.target.closest('g');
    if (sector) {
      sector.classList.add('mouse-active');
      const labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
      if (labelMatch) {
        window.location.href = `#${labelMatch[1].toLowerCase()}`;
      }
    }
  });

  menuContainer.addEventListener('keydown', (event) => {
    const sector = event.target.closest('g');
    if (sector && event.key === 'Enter') {
      sector.classList.remove('mouse-active');
      const labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
      if (labelMatch) {
        window.location.href = `#${labelMatch[1].toLowerCase()}`;
      }
    }
  });

  menuContainer.addEventListener('blur', (event) => {
    const sector = event.target.closest('g');
    if (sector) {
      sector.classList.remove('mouse-active');
    }
  }, true);

  const defsBackground = document.createElementNS(MENU_SVG_NS, 'defs');
  const gradient = document.createElementNS(MENU_SVG_NS, 'radialGradient');
  gradient.setAttribute('id', 'backgroundGradient');
  gradient.setAttribute('cx', '50%');
  gradient.setAttribute('cy', '50%');
  gradient.setAttribute('r', '50%');
  gradient.setAttribute('fx', '50%');
  gradient.setAttribute('fy', '50%');

  const stop1 = document.createElementNS(MENU_SVG_NS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', 'rgb(180, 220, 255)');
  stop1.setAttribute('stop-opacity', '0.0');

  const stop2 = document.createElementNS(MENU_SVG_NS, 'stop');
  stop2.setAttribute('offset', '80%');
  stop2.setAttribute('stop-color', 'rgb(180, 220, 255)');
  stop2.setAttribute('stop-opacity', '0.08');

  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defsBackground.appendChild(gradient);

  const holoCoreGradient = document.createElementNS(MENU_SVG_NS, 'linearGradient');
  holoCoreGradient.setAttribute('id', 'holoCoreGradient');
  holoCoreGradient.setAttribute('x1', '0%');
  holoCoreGradient.setAttribute('y1', '0%');
  holoCoreGradient.setAttribute('x2', '0%');
  holoCoreGradient.setAttribute('y2', '100%');

  const holoStop1 = document.createElementNS(MENU_SVG_NS, 'stop');
  holoStop1.setAttribute('offset', '0%');
  holoStop1.setAttribute('stop-color', 'rgb(180, 220, 255)');
  holoStop1.setAttribute('stop-opacity', '0.1');

  const holoStop2 = document.createElementNS(MENU_SVG_NS, 'stop');
  holoStop2.setAttribute('offset', '100%');
  holoStop2.setAttribute('stop-color', 'rgb(180, 220, 255)');
  holoStop2.setAttribute('stop-opacity', '0.2');

  holoCoreGradient.appendChild(holoStop1);
  holoCoreGradient.appendChild(holoStop2);
  defsBackground.appendChild(holoCoreGradient);
  svgElement.appendChild(defsBackground);

  // Stationary ring/donut shape
  const backgroundCircle = document.createElementNS(MENU_SVG_NS, 'circle');
  backgroundCircle.setAttribute('cx', MENU_CONFIG.CENTER_X);
  backgroundCircle.setAttribute('cy', MENU_CONFIG.CENTER_Y);
  backgroundCircle.setAttribute('r', MENU_CONFIG.BACKGROUND_RADIUS);
  backgroundCircle.setAttribute('fill', 'url(#backgroundGradient)');
  backgroundCircle.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
  backgroundCircle.setAttribute('stroke-width', MENU_CONFIG.RING_STROKE_WIDTH);
  backgroundCircle.setAttribute('class', 'stationary-ring');
  menuContainer.parentNode.insertBefore(backgroundCircle, menuContainer);

  const defs = document.createElementNS(MENU_SVG_NS, 'defs');
  const clipPath = document.createElementNS(MENU_SVG_NS, 'clipPath');
  clipPath.setAttribute('id', 'innerCircleClip');
  const clipCircle = document.createElementNS(MENU_SVG_NS, 'circle');
  clipCircle.setAttribute('cx', MENU_CONFIG.CENTER_X);
  clipCircle.setAttribute('cy', MENU_CONFIG.CENTER_Y);
  clipCircle.setAttribute('r', MENU_CONFIG.INNER_CIRCLE_RADIUS);
  clipPath.appendChild(clipCircle);
  defs.appendChild(clipPath);
  svgElement.appendChild(defs);

  const gridOverlay = document.createElementNS(MENU_SVG_NS, 'g');
  gridOverlay.setAttribute('clip-path', 'url(#innerCircleClip)');
  for (let x = -MENU_CONFIG.INNER_RADIUS; x <= MENU_CONFIG.INNER_RADIUS; x += MENU_CONFIG.GRID_SPACING) {
    const line = document.createElementNS(MENU_SVG_NS, 'line');
    line.setAttribute('x1', MENU_CONFIG.CENTER_X + x);
    line.setAttribute('y1', MENU_CONFIG.CENTER_Y - MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('x2', MENU_CONFIG.CENTER_X + x);
    line.setAttribute('y2', MENU_CONFIG.CENTER_Y + MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
    line.setAttribute('stroke-width', MENU_CONFIG.RING_STROKE_WIDTH);
    gridOverlay.appendChild(line);
  }
  for (let y = -MENU_CONFIG.INNER_RADIUS; y <= MENU_CONFIG.INNER_RADIUS; y += MENU_CONFIG.GRID_SPACING) {
    const line = document.createElementNS(MENU_SVG_NS, 'line');
    line.setAttribute('x1', MENU_CONFIG.CENTER_X - MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('y1', MENU_CONFIG.CENTER_Y + y);
    line.setAttribute('x2', MENU_CONFIG.CENTER_X + MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('y2', MENU_CONFIG.CENTER_Y + y);
    line.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
    line.setAttribute('stroke-width', MENU_CONFIG.RING_STROKE_WIDTH);
    gridOverlay.appendChild(line);
  }
  menuContainer.appendChild(gridOverlay);

  const gridCenters = [];
  for (let x = -MENU_CONFIG.INNER_RADIUS; x <= MENU_CONFIG.INNER_RADIUS; x += MENU_CONFIG.GRID_SPACING) {
    for (let y = -MENU_CONFIG.INNER_RADIUS; y <= MENU_CONFIG.INNER_RADIUS; y += MENU_CONFIG.GRID_SPACING) {
      const distance = Math.sqrt(x * x + y * y);
      if (distance <= MENU_CONFIG.INNER_CIRCLE_RADIUS) {
        gridCenters.push({ x: MENU_CONFIG.CENTER_X + x, y: MENU_CONFIG.CENTER_Y + y });
      }
    }
  }

  const particleCount = MENU_CONFIG.GRID_PARTICLE_COUNT_MIN + Math.floor(Math.random() * (MENU_CONFIG.GRID_PARTICLE_COUNT_MAX - MENU_CONFIG.GRID_PARTICLE_COUNT_MIN));
  const selectedCenters = gridCenters.sort(() => Math.random() - 0.5).slice(0, particleCount);
  selectedCenters.forEach(center => new GridParticle(center.x, center.y, gridOverlay));

  const centerCircle = document.createElementNS(MENU_SVG_NS, 'circle');
  centerCircle.setAttribute('cx', MENU_CONFIG.CENTER_X);
  centerCircle.setAttribute('cy', MENU_CONFIG.CENTER_Y);
  centerCircle.setAttribute('r', MENU_CONFIG.INNER_CIRCLE_RADIUS);
  centerCircle.setAttribute('fill', 'none');
  centerCircle.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
  centerCircle.setAttribute('stroke-width', MENU_CONFIG.RING_STROKE_WIDTH);
  menuContainer.appendChild(centerCircle);

  const innerFilledCircle = document.createElementNS(MENU_SVG_NS, 'circle');
  innerFilledCircle.setAttribute('cx', MENU_CONFIG.CENTER_X);
  innerFilledCircle.setAttribute('cy', MENU_CONFIG.CENTER_Y);
  innerFilledCircle.setAttribute('r', MENU_CONFIG.INNER_FILLED_RADIUS);
  innerFilledCircle.setAttribute('fill', 'rgba(180, 220, 255, 0.06)');
  innerFilledCircle.setAttribute('stroke', 'none');
  innerFilledCircle.setAttribute('class', 'inner-filled-circle');
  menuContainer.appendChild(innerFilledCircle);

  const holoCoreGroup = document.createElementNS(MENU_SVG_NS, 'g');
  holoCoreGroup.setAttribute('aria-hidden', 'true');
  const holoCore = document.createElementNS(MENU_SVG_NS, 'circle');
  holoCore.setAttribute('cx', MENU_CONFIG.CENTER_X);
  holoCore.setAttribute('cy', MENU_CONFIG.CENTER_Y);
  holoCore.setAttribute('r', MENU_CONFIG.CORE_RADIUS);
  holoCore.setAttribute('fill', 'rgba(234, 255, 255, 0.9)');
  holoCore.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
  holoCore.setAttribute('stroke-width', MENU_CONFIG.RING_STROKE_WIDTH);
  holoCore.setAttribute('class', 'holo-core');
  holoCoreGroup.appendChild(holoCore);

  MENU_CONFIG.RING_RADII.forEach((r, i) => {
    const ring = document.createElementNS(MENU_SVG_NS, 'circle');
    ring.setAttribute('cx', MENU_CONFIG.CENTER_X);
    ring.setAttribute('cy', MENU_CONFIG.CENTER_Y);
    ring.setAttribute('r', r);
    ring.setAttribute('fill', 'url(#holoCoreGradient)');
    ring.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
    ring.setAttribute('stroke-width', MENU_CONFIG.RING_STROKE_WIDTH);
    ring.setAttribute('class', `holo-ring ring-${i}`);
    holoCoreGroup.appendChild(ring);
  });
  menuContainer.appendChild(holoCoreGroup);

  // Rotating outer ring
  const outerRing = document.createElementNS(MENU_SVG_NS, 'circle');
  outerRing.setAttribute('cx', MENU_CONFIG.CENTER_X);
  outerRing.setAttribute('cy', MENU_CONFIG.CENTER_Y);
  outerRing.setAttribute('r', MENU_CONFIG.OUTER_RING_RADIUS);
  outerRing.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
  outerRing.setAttribute('stroke-width', MENU_CONFIG.RING_STROKE_WIDTH);
  outerRing.setAttribute('fill', 'none');
  outerRing.setAttribute('class', 'rotating-ring');
  menuContainer.appendChild(outerRing);

  // Rotating inner ring
  const innerRing = document.createElementNS(MENU_SVG_NS, 'circle');
  innerRing.setAttribute('cx', MENU_CONFIG.CENTER_X);
  innerRing.setAttribute('cy', MENU_CONFIG.CENTER_Y);
  innerRing.setAttribute('r', MENU_CONFIG.INNER_RING_RADIUS);
  innerRing.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
  innerRing.setAttribute('stroke-width', MENU_CONFIG.RING_STROKE_WIDTH);
  innerRing.setAttribute('fill', 'none');
  innerRing.setAttribute('class', 'rotating-ring reverse');
  menuContainer.appendChild(innerRing);

  // 24 rotating squares (clockwise, no outline, UI fill)
  const squareGroup = document.createElementNS(MENU_SVG_NS, 'g');
  squareGroup.setAttribute('class', 'square-orbit');
  for (let i = 0; i < MENU_CONFIG.SQUARE_COUNT; i++) {
    const angle = (i / MENU_CONFIG.SQUARE_COUNT) * 360;
    const pos = polarToCartesian(MENU_CONFIG.CENTER_X, MENU_CONFIG.CENTER_Y, MENU_CONFIG.OUTER_RADIUS + 5, angle);
    const square = document.createElementNS(MENU_SVG_NS, 'rect');
    square.setAttribute('x', pos.x - 5);
    square.setAttribute('y', pos.y - 5);
    square.setAttribute('width', '10');
    square.setAttribute('height', '10');
    square.setAttribute('fill', MENU_CONFIG.SECTOR_FILL);
    square.setAttribute('stroke', 'none');
    square.setAttribute('class', 'rotating-square');
    squareGroup.appendChild(square);
  }
  menuContainer.appendChild(squareGroup);

  // Segmented ring (counter-clockwise, thinner, random cutouts)
  const segmentGroup = document.createElementNS(MENU_SVG_NS, 'g');
  segmentGroup.setAttribute('class', 'segmented-ring');
  for (let i = 0; i < MENU_CONFIG.SEGMENT_COUNT; i++) {
    if (Math.random() > 0.4) { // Randomly skip ~40% of segments
      const start = (i / MENU_CONFIG.SEGMENT_COUNT) * 360;
      const end = start + (360 / MENU_CONFIG.SEGMENT_COUNT) * 0.8;
      const p1 = polarToCartesian(MENU_CONFIG.CENTER_X, MENU_CONFIG.CENTER_Y, MENU_CONFIG.SEGMENTED_RING_RADIUS, start);
      const p2 = polarToCartesian(MENU_CONFIG.CENTER_X, MENU_CONFIG.CENTER_Y, MENU_CONFIG.SEGMENTED_RING_RADIUS, end);
      const arc = document.createElementNS(MENU_SVG_NS, 'path');
      arc.setAttribute('d', `M ${p1.x} ${p1.y} A ${MENU_CONFIG.SEGMENTED_RING_RADIUS} ${MENU_CONFIG.SEGMENTED_RING_RADIUS} 0 0 0 ${p2.x} ${p2.y}`);
      arc.setAttribute('stroke', MENU_CONFIG.STROKE_COLOR);
      arc.setAttribute('stroke-width', MENU_CONFIG.SEGMENTED_RING_STROKE_WIDTH);
      arc.setAttribute('fill', 'none');
      segmentGroup.appendChild(arc);
    }
  }
  menuContainer.appendChild(segmentGroup);

  // Initialize welcome text carousel
  initializeWelcomeCarousel();
}

window.addEventListener('load', initializeRadialMenu);
