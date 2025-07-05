/**
 * @module RadialMenu
 * @description Initializes the radial menu with interactive sectors, grid, holographic effects, and welcome text carousel for Shimti Multimedia.
 * Ensures responsiveness and accessibility in live environments.
 */

/** @constant {string} window.MENU_SVG_NS - SVG namespace for menu elements */
window.MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/** @constant {Object} window.MENU_CONFIG - Configuration for radial menu and welcome carousel */
window.MENU_CONFIG = {
  CENTER_X: 200, // X-coordinate of menu center
  CENTER_Y: 200, // Y-coordinate of menu center
  OUTER_RADIUS: 180, // Outer radius of menu sectors
  INNER_RADIUS: 70, // Inner radius of menu sectors
  GRID_SPACING: 20, // Grid line spacing
  PARTICLE_COUNT_MIN: 4, // Minimum grid particles
  PARTICLE_COUNT_MAX: 12, // Maximum grid particles
  SECTOR_FILL: 'rgba(180, 220, 255, 0.08)', // Sector fill color
  STROKE_COLOR: '#fff', // Stroke color for menu elements
  INNER_CIRCLE_RADIUS: 58, // Inner circle radius
  INNER_FILLED_RADIUS: 48, // Inner filled circle radius
  CORE_RADIUS: 20, // Holographic core radius
  RING_RADII: [25, 30, 35], // Radii for holographic core rings
  NAVIGATION_LINKS: ['Contact', 'AI', 'Work', 'Media', 'Shop', 'About'], // Menu sector labels
  WELCOME_INTERVAL: 3000, // Carousel transition interval (ms)
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
 * @function window.polarToCartesian
 * @description Converts polar coordinates to Cartesian coordinates
 * @param {number} cx - X-coordinate of the center
 * @param {number} cy - Y-coordinate of the center
 * @param {number} r - Radius from the center
 * @param {number} angleDeg - Angle in degrees
 * @returns {Object} Cartesian coordinates {x, y}
 */
window.polarToCartesian = function (cx, cy, r, angleDeg) {
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};

/**
 * @function window.createNavigationSector
 * @description Creates an SVG sector for the radial menu
 * @param {Object} position - Sector position data (p1, p2, p3, p4, iconPos, start, end)
 * @param {string} label - Sector label (e.g., 'Contact')
 * @param {string} fillColor - Sector fill color
 * @param {DocumentFragment} fragment - Fragment to append the sector
 */
window.createNavigationSector = function (position, label, fillColor, fragment) {
  const { p1, p2, p3, p4, iconPos, start, end } = position;
  const largeArc = end - start > 180 ? 1 : 0;
  const pathData = `
    M ${p1.x} ${p1.y}
    A ${window.MENU_CONFIG.OUTER_RADIUS} ${window.MENU_CONFIG.OUTER_RADIUS} 0 ${largeArc} 0 ${p2.x} ${p2.y}
    L ${p3.x} ${p3.y}
    A ${window.MENU_CONFIG.INNER_RADIUS} ${window.MENU_CONFIG.INNER_RADIUS} 0 ${largeArc} 1 ${p4.x} ${p4.y}
    Z
  `;

  const path = document.createElementNS(window.MENU_SVG_NS, 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', fillColor);
  path.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
  path.setAttribute('stroke-width', '1');

  const group = document.createElementNS(window.MENU_SVG_NS, 'g');
  group.setAttribute('role', 'link');
  group.setAttribute('aria-label', `Navigate to ${label} section`);
  group.setAttribute('tabindex', '0');
  group.dataset.label = label;

  const icon = document.createElementNS(window.MENU_SVG_NS, 'image');
  icon.setAttribute('href', `assets/images/${label}.svg`);
  icon.setAttribute('x', iconPos.x - 25);
  icon.setAttribute('y', iconPos.y - 25);
  icon.setAttribute('width', '50');
  icon.setAttribute('height', '50');
  icon.setAttribute('aria-label', `${label} Icon`);
  icon.setAttribute('loading', 'lazy');

  group.appendChild(path);
  group.appendChild(icon);
  fragment.appendChild(group);
};

/**
 * @class window.GridParticle
 * @description Represents a fading particle in the radial menu's grid
 */
window.GridParticle = class {
  /**
   * @param {number} x - X-coordinate of the particle
   * @param {number} y - Y-coordinate of the particle
   * @param {SVGGElement} gridOverlay - SVG group for appending the particle
   */
  constructor(x, y, gridOverlay) {
    this.x = x;
    this.y = y;
    this.element = document.createElementNS(window.MENU_SVG_NS, 'circle');
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
};

/**
 * @function window.initWelcomeCarousel
 * @description Initializes the welcome text carousel with language cycling
 */
window.initWelcomeCarousel = async function () {
  await new Promise(resolve => setTimeout(resolve, 100));
  const welcomeText = document.getElementById('welcomeText');
  const menuWheel = document.getElementById('menuWheel');
  if (!welcomeText || !menuWheel) return;

  welcomeText.textContent = 'Loading...';

  let languages = window.MENU_CONFIG.FALLBACK_LANGUAGES;
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
    // Silent fallback to avoid console clutter
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
      welcomeText.textContent = languages[currentIndex].text || 'Welcome';
      welcomeText.classList.remove('fade-out');
      welcomeText.classList.add('fade-in');
      if (languages[currentIndex].lang === 'English') {
        hasShownEnglish = true;
      }
      currentIndex = (currentIndex + 1) % languages.length;
      timeoutId = setTimeout(cycleText, window.MENU_CONFIG.WELCOME_INTERVAL);
    }, 500);
  };

  welcomeText.textContent = languages[0].text || 'Welcome';
  welcomeText.classList.add('fade-in');
  timeoutId = setTimeout(cycleText, window.MENU_CONFIG.WELCOME_INTERVAL);

  menuWheel.querySelectorAll('g[role="link"]').forEach(sector => {
    sector.addEventListener('mouseenter', () => {
      isHovering = true;
      clearTimeout(timeoutId);
      welcomeText.classList.remove('fade-in');
      welcomeText.classList.add('fade-out');
      setTimeout(() => {
        const labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
        welcomeText.textContent = labelMatch ? labelMatch[1] : '';
        welcomeText.classList.remove('fade-out');
        welcomeText.classList.add('fade-in');
      }, 500);
    });

    sector.addEventListener('mouseleave', () => {
      isHovering = false;
      welcomeText.classList.remove('fade-in');
      welcomeText.classList.add('fade-out');
      setTimeout(() => {
        welcomeText.textContent = languages[currentIndex].text || 'Welcome';
        welcomeText.classList.remove('fade-out');
        welcomeText.classList.add('fade-in');
        timeoutId = setTimeout(cycleText, window.MENU_CONFIG.WELCOME_INTERVAL);
      }, 500);
    });
  });
};

/**
 * @function window.initRadialMenu
 * @description Initializes the radial menu with sectors, grid, and holographic effects
 */
window.initRadialMenu = function () {
  const svgElement = document.getElementById('radialMenu');
  const menuWheel = document.getElementById('menuWheel');
  if (!svgElement || !menuWheel) return;

  const sectorAngle = 360 / window.MENU_CONFIG.NAVIGATION_LINKS.length;
  const sectorPositions = window.MENU_CONFIG.NAVIGATION_LINKS.map((_, i) => {
    const start = 270 + i * sectorAngle;
    const end = start + sectorAngle;
    const labelAngle = (start + end) / 2;
    return {
      p1: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, window.MENU_CONFIG.OUTER_RADIUS, end),
      p2: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, window.MENU_CONFIG.OUTER_RADIUS, start),
      p3: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, window.MENU_CONFIG.INNER_RADIUS, start),
      p4: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, window.MENU_CONFIG.INNER_RADIUS, end),
      iconPos: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, (window.MENU_CONFIG.INNER_RADIUS + window.MENU_CONFIG.OUTER_RADIUS) / 2, labelAngle),
      start,
      end,
    };
  });

  const fragment = document.createDocumentFragment();
  sectorPositions.forEach((pos, i) => {
    window.createNavigationSector(pos, window.MENU_CONFIG.NAVIGATION_LINKS[i], window.MENU_CONFIG.SECTOR_FILL, fragment);
  });
  menuWheel.appendChild(fragment);

  menuWheel.addEventListener('click', (event) => {
    const sector = event.target.closest('g');
    if (sector) {
      sector.classList.add('mouse-active');
      const labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
      if (labelMatch) {
        window.location.href = `#${labelMatch[1].toLowerCase()}`;
      }
    }
  });

  menuWheel.addEventListener('keydown', (event) => {
    const sector = event.target.closest('g');
    if (sector && event.key === 'Enter') {
      sector.classList.remove('mouse-active');
      const labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
      if (labelMatch) {
        window.location.href = `#${labelMatch[1].toLowerCase()}`;
      }
    }
  });

  menuWheel.addEventListener('blur', (event) => {
    const sector = event.target.closest('g');
    if (sector) {
      sector.classList.remove('mouse-active');
    }
  }, true);

  const defsBackground = document.createElementNS(window.MENU_SVG_NS, 'defs');
  const gradient = document.createElementNS(window.MENU_SVG_NS, 'radialGradient');
  gradient.setAttribute('id', 'backgroundGradient');
  gradient.setAttribute('cx', '50%');
  gradient.setAttribute('cy', '50%');
  gradient.setAttribute('r', '50%');
  gradient.setAttribute('fx', '50%');
  gradient.setAttribute('fy', '50%');

  const stop1 = document.createElementNS(window.MENU_SVG_NS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', 'rgb(180, 220, 255)');
  stop1.setAttribute('stop-opacity', '0.0');

  const stop2 = document.createElementNS(window.MENU_SVG_NS, 'stop');
  stop2.setAttribute('offset', '80%');
  stop2.setAttribute('stop-color', 'rgb(180, 220, 255)');
  stop2.setAttribute('stop-opacity', '0.08');

  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defsBackground.appendChild(gradient);

  const holoCoreGradient = document.createElementNS(window.MENU_SVG_NS, 'linearGradient');
  holoCoreGradient.setAttribute('id', 'holoCoreGradient');
  holoCoreGradient.setAttribute('x1', '0%');
  holoCoreGradient.setAttribute('y1', '0%');
  holoCoreGradient.setAttribute('x2', '0%');
  holoCoreGradient.setAttribute('y2', '100%');

  const holoStop1 = document.createElementNS(window.MENU_SVG_NS, 'stop');
  holoStop1.setAttribute('offset', '
