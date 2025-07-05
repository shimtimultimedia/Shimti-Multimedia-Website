/**
 * @module RadialMenu
 * @description Initializes the radial menu with interactive sectors, masked grid with particles, holographic effects, and welcome text carousel for Shimti Multimedia.
 * Ensures responsiveness and accessibility in live environments.
 */

/** @constant {string} window.MENU_SVG_NS - SVG namespace for menu elements */
window.MENU_SVG_NS = 'http://www.w3.org/2000/svg';

/** @constant {Object} window.MENU_CONFIG - Configuration for radial menu and welcome carousel */
window.MENU_CONFIG = {
  CENTER_X: 200,
  CENTER_Y: 200,
  OUTER_RADIUS: 180,
  INNER_RADIUS: 70,
  GRID_SPACING: 20,
  PARTICLE_COUNT_MIN: 4,
  PARTICLE_COUNT_MAX: 12,
  SECTOR_FILL: 'rgba(180, 220, 255, 0.08)',
  STROKE_COLOR: '#fff',
  INNER_CIRCLE_RADIUS: 58,
  INNER_FILLED_RADIUS: 48,
  CORE_RADIUS: 20,
  RING_RADII: [25, 30, 35],
  NAVIGATION_LINKS: ['Contact', 'AI', 'Work', 'Media', 'Shop', 'About'],
  WELCOME_INTERVAL: 3000,
  PARTICLE_INTERVAL_MIN: 1000,
  PARTICLE_INTERVAL_MAX: 3000,
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
    { lang: 'Yoruba', text: 'Kaabọ' }
  ]
};

/** @function window.polarToCartesian */
window.polarToCartesian = function (cx, cy, r, angleDeg) {
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
};

/** @function window.createNavigationSector */
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

/** @class window.GridParticle */
window.GridParticle = class {
  constructor(x, y, gridOverlay) {
    this.x = x;
    this.y = y;
    this.gridOverlay = gridOverlay;
    this.element = document.createElementNS(window.MENU_SVG_NS, 'circle');
    this.element.setAttribute('cx', this.x);
    this.element.setAttribute('cy', this.y);
    this.element.setAttribute('r', '3');
    this.element.setAttribute('fill', 'rgba(234, 255, 255, 0.8)');
    this.element.style.opacity = '0';
    this.gridOverlay.appendChild(this.element);
    this.animate();
  }

  animate() {
    const toggleVisibility = () => {
      const isVisible = this.element.style.opacity === '1';
      this.element.style.opacity = isVisible ? '0' : '1';
      const delay = window.MENU_CONFIG.PARTICLE_INTERVAL_MIN + Math.random() * (window.MENU_CONFIG.PARTICLE_INTERVAL_MAX - window.MENU_CONFIG.PARTICLE_INTERVAL_MIN);
      setTimeout(toggleVisibility, delay);
    };
    const initialDelay = Math.random() * window.MENU_CONFIG.PARTICLE_INTERVAL_MAX;
    setTimeout(toggleVisibility, initialDelay);
  }
};

/** @function window.initWelcomeCarousel */
window.initWelcomeCarousel = async function () {
  await new Promise(resolve => setTimeout(resolve, 100));
  const welcomeText = document.getElementById('welcomeText');
  const menuWheel = document.getElementById('wheelMenu');
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
    // Silent fallback
  }

  let currentIndex = 0;
  let isHovering = false;
  let timeoutId = null;
  let hasShownEnglish = false;

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

/** @function window.initRadialMenu */
window.initRadialMenu = function () {
  const svgElement = document.getElementById('radialMenu');
  const menuWheel = document.getElementById('wheelMenu');
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
      end
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
  holoStop1.setAttribute('offset', '0%');
  holoStop1.setAttribute('stop-color', 'rgb(180, 220, 255)');
  holoStop1.setAttribute('stop-opacity', '0.1');

  const holoStop2 = document.createElementNS(window.MENU_SVG_NS, 'stop');
  holoStop2.setAttribute('offset', '100%');
  holoStop2.setAttribute('stop-color', 'rgb(180, 220, 255)');
  holoStop2.setAttribute('stop-opacity', '0.2');

  holoCoreGradient.appendChild(holoStop1);
  holoCoreGradient.appendChild(holoStop2);
  defsBackground.appendChild(holoCoreGradient);
  svgElement.appendChild(defsBackground);

  const backgroundCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
  backgroundCircle.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  backgroundCircle.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  backgroundCircle.setAttribute('r', 192);
  backgroundCircle.setAttribute('fill', 'url(#backgroundGradient)');
  backgroundCircle.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
  backgroundCircle.setAttribute('stroke-width', '2');
  menuWheel.parentNode.insertBefore(backgroundCircle, menuWheel);

  const defs = document.createElementNS(window.MENU_SVG_NS, 'defs');
  const clipPath = document.createElementNS(window.MENU_SVG_NS, 'clipPath');
  clipPath.setAttribute('id', 'innerCircleClip');
  const clipCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
  clipCircle.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  clipCircle.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  clipCircle.setAttribute('r', window.MENU_CONFIG.INNER_CIRCLE_RADIUS);
  clipPath.appendChild(clipCircle);
  defs.appendChild(clipPath);
  svgElement.appendChild(defs);

  const gridOverlay = document.createElementNS(window.MENU_SVG_NS, 'g');
  gridOverlay.setAttribute('clip-path', 'url(#innerCircleClip)');
  for (let x = -window.MENU_CONFIG.INNER_RADIUS; x <= window.MENU_CONFIG.INNER_RADIUS; x += window.MENU_CONFIG.GRID_SPACING) {
    const line = document.createElementNS(window.MENU_SVG_NS, 'line');
    line.setAttribute('x1', window.MENU_CONFIG.CENTER_X + x);
    line.setAttribute('y1', window.MENU_CONFIG.CENTER_Y - window.MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('x2', window.MENU_CONFIG.CENTER_X + x);
    line.setAttribute('y2', window.MENU_CONFIG.CENTER_Y + window.MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
    line.setAttribute('stroke-width', '1');
    gridOverlay.appendChild(line);
  }
  for (let y = -window.MENU_CONFIG.INNER_RADIUS; y <= window.MENU_CONFIG.INNER_RADIUS; y += window.MENU_CONFIG.GRID_SPACING) {
    const line = document.createElementNS(window.MENU_SVG_NS, 'line');
    line.setAttribute('x1', window.MENU_CONFIG.CENTER_X - window.MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('y1', window.MENU_CONFIG.CENTER_Y + y);
    line.setAttribute('x2', window.MENU_CONFIG.CENTER_X + window.MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('y2', window.MENU_CONFIG.CENTER_Y + y);
    line.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
    line.setAttribute('stroke-width', '1');
    gridOverlay.appendChild(line);
  }

  const gridCenters = [];
  for (let x = -window.MENU_CONFIG.INNER_RADIUS; x <= window.MENU_CONFIG.INNER_RADIUS; x += window.MENU_CONFIG.GRID_SPACING) {
    for (let y = -window.MENU_CONFIG.INNER_RADIUS; y <= window.MENU_CONFIG.INNER_RADIUS; y += window.MENU_CONFIG.GRID_SPACING) {
      const distance = Math.sqrt(x * x + y * y);
      if (distance <= window.MENU_CONFIG.INNER_CIRCLE_RADIUS) {
        gridCenters.push({ x: window.MENU_CONFIG.CENTER_X + x, y: window.MENU_CONFIG.CENTER_Y + y });
      }
    }
  }
  const particleCount = window.MENU_CONFIG.PARTICLE_COUNT_MIN + Math.floor(Math.random() * (window.MENU_CONFIG.PARTICLE_COUNT_MAX - window.MENU_CONFIG.PARTICLE_COUNT_MIN));
  const selectedCenters = gridCenters.sort(() => Math.random() - 0.5).slice(0, particleCount);
  selectedCenters.forEach(center => new window.GridParticle(center.x, center.y, gridOverlay));

  menuWheel.appendChild(gridOverlay);

  const centerCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
  centerCircle.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  centerCircle.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  centerCircle.setAttribute('r', window.MENU_CONFIG.INNER_CIRCLE_RADIUS);
  centerCircle.setAttribute('fill', 'none');
  centerCircle.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
  centerCircle.setAttribute('stroke-width', '1');
  menuWheel.appendChild(centerCircle);

  const innerFilledCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
  innerFilledCircle.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  innerFilledCircle.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  innerFilledCircle.setAttribute('r', window.MENU_CONFIG.INNER_FILLED_RADIUS);
  innerFilledCircle.setAttribute('fill', 'rgba(180, 220, 255, 0.06)');
  innerFilledCircle.setAttribute('stroke', 'none');
  innerFilledCircle.setAttribute('class', 'inner-filled-circle');
  menuWheel.appendChild(innerFilledCircle);

  const holoCoreGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
  holoCoreGroup.setAttribute('aria-hidden', 'true');
  const holoCore = document.createElementNS(window.MENU_SVG_NS, 'circle');
  holoCore.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  holoCore.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  holoCore.setAttribute('r', window.MENU_CONFIG.CORE_RADIUS);
  holoCore.setAttribute('fill', 'rgba(234, 255, 255, 0.9)');
  holoCore.setAttribute('stroke', 'none');
  holoCore.setAttribute('class', 'holo-core');
  holoCoreGroup.appendChild(holoCore);

  window.MENU_CONFIG.RING_RADII.forEach((r, i) => {
    const ring = document.createElementNS(window.MENU_SVG_NS, 'circle');
    ring.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
    ring.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
    ring.setAttribute('r', r);
    ring.setAttribute('fill', 'url(#holoCoreGradient)');
    ring.setAttribute('stroke', 'none');
    ring.setAttribute('class', `holo-ring ring-${i}`);
    holoCoreGroup.appendChild(ring);
  });
  menuWheel.appendChild(holoCoreGroup);

  window.initWelcomeCarousel();
};

window.addEventListener('load', window.initRadialMenu);
