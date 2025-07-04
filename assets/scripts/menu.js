/**
 * Shimti Multimedia: Initializes the radial menu with interactive sectors, grid, holographic effects, and welcome text carousel.
 * Creates SVG elements and handles navigation and hover events for a sci-fi aesthetic.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const CONFIG = {
  CENTER_X: 200,
  CENTER_Y: 200,
  OUTER_RADIUS: 180,
  INNER_RADIUS: 70,
  GRID_SPACING: 20,
  NEURON_COUNT_MIN: 4,
  NEURON_COUNT_MAX: 12,
  SECTOR_FILL: 'rgba(180, 220, 255, 0.08)',
  STROKE_COLOR: '#fff',
  BACKGROUND_RADIUS: 192,
  INNER_CIRCLE_RADIUS: 58,
  INNER_FILLED_RADIUS: 48,
  CORE_RADIUS: 20,
  RING_RADII: [25, 30, 35],
  LABELS: [], // Empty to avoid 404s until pages are added
  WELCOME_INTERVAL: 3000, // 3s per language
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
  ],
};

/**
 * Converts polar coordinates to Cartesian coordinates.
 */
function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

/**
 * Creates a radial menu sector with a path and icon.
 */
function createSector(pos, label, color, fragment) {
  const { p1, p2, p3, p4, iconPos, start, end } = pos;
  const largeArc = end - start > 180 ? 1 : 0;
  const pathData = `
    M ${p1.x} ${p1.y}
    A ${CONFIG.OUTER_RADIUS} ${CONFIG.OUTER_RADIUS} 0 ${largeArc} 0 ${p2.x} ${p2.y}
    L ${p3.x} ${p3.y}
    A ${CONFIG.INNER_RADIUS} ${CONFIG.INNER_RADIUS} 0 ${largeArc} 1 ${p4.x} ${p4.y}
    Z
  `;

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', color);
  path.setAttribute('stroke', CONFIG.STROKE_COLOR);
  path.setAttribute('stroke-width', '1');

  const group = document.createElementNS(SVG_NS, 'g');
  group.setAttribute('role', 'link');
  group.setAttribute('aria-label', `Navigate to ${label} section`);
  group.setAttribute('tabindex', '0');
  group.dataset.label = label;

  const icon = document.createElementNS(SVG_NS, 'image');
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
 * Represents a grid neuron with random pop-in/pop-out animation.
 */
class GridNeuron {
  constructor(x, y, gridOverlay) {
    this.x = x;
    this.y = y;
    this.element = document.createElementNS(SVG_NS, 'circle');
    this.element.setAttribute('cx', this.x);
    this.element.setAttribute('cy', this.y);
    this.element.setAttribute('r', '3');
    this.element.setAttribute('fill', 'rgba(234, 255, 255, 0.8)');
    this.element.setAttribute('opacity', '0');
    gridOverlay.appendChild(this.element);
    this.animate();
  }

  animate() {
    const lifetime = 1000 + Math.random() * 2000;
    const delay = Math.random() * 1000;
    const fadeIn = () => {
      this.element.setAttribute('opacity', '1');
      setTimeout(() => {
        this.element.setAttribute('opacity', '0');
        setTimeout(fadeIn, delay);
      }, lifetime);
    };
    setTimeout(fadeIn, delay);
  }
}

/**
 * Loads languages from XML and manages the welcome text carousel and button hover interactions.
 */
async function initWelcomeCarousel() {
  await new Promise(resolve => setTimeout(resolve, 100));
  const welcomeText = document.getElementById('welcomeText');
  const wheelMenu = document.getElementById('wheelMenu');
  if (!welcomeText || !wheelMenu) {
    console.error('Welcome text or wheel menu not found:', { welcomeText, wheelMenu });
    return;
  }

  welcomeText.textContent = 'Loading...';

  let languages = CONFIG.FALLBACK_LANGUAGES;
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
      timeoutId = setTimeout(cycleText, CONFIG.WELCOME_INTERVAL);
    }, 500);
  };

  welcomeText.textContent = languages[0].text || 'Welcome';
  welcomeText.classList.add('fade-in');
  timeoutId = setTimeout(cycleText, CONFIG.WELCOME_INTERVAL);

  wheelMenu.querySelectorAll('g[role="link"]').forEach(sector => {
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
        timeoutId = setTimeout(cycleText, CONFIG.WELCOME_INTERVAL);
      }, 500);
    });
  });
}

/**
 * Initializes the radial menu with sectors, grid, and holographic effects.
 */
function initRadialMenu() {
  const svgElement = document.getElementById('radialMenu');
  const wheelMenu = document.getElementById('wheelMenu');
  if (!svgElement || !wheelMenu) {
    console.error('Radial menu elements not found:', { svgElement, wheelMenu });
    return;
  }

  const sectorAngle = 360 / CONFIG.LABELS.length;
  const sectorPositions = CONFIG.LABELS.map((_, i) => {
    const start = 270 + i * sectorAngle;
    const end = start + sectorAngle;
    const labelAngle = (start + end) / 2;
    return {
      p1: polarToCartesian(CONFIG.CENTER_X, CONFIG.CENTER_Y, CONFIG.OUTER_RADIUS, end),
      p2: polarToCartesian(CONFIG.CENTER_X, CONFIG.CENTER_Y, CONFIG.OUTER_RADIUS, start),
      p3: polarToCartesian(CONFIG.CENTER_X, CONFIG.CENTER_Y, CONFIG.INNER_RADIUS, start),
      p4: polarToCartesian(CONFIG.CENTER_X, CONFIG.CENTER_Y, CONFIG.INNER_RADIUS, end),
      iconPos: polarToCartesian(CONFIG.CENTER_X, CONFIG.CENTER_Y, (CONFIG.INNER_RADIUS + CONFIG.OUTER_RADIUS) / 2, labelAngle),
      start,
      end,
    };
  });

  const fragment = document.createDocumentFragment();
  sectorPositions.forEach((pos, i) => {
    createSector(pos, CONFIG.LABELS[i], CONFIG.SECTOR_FILL, fragment);
  });
  wheelMenu.appendChild(fragment);

  wheelMenu.addEventListener('click', (event) => {
    const sector = event.target.closest('g');
    if (sector) {
      sector.classList.add('mouse-active');
      const labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
      if (labelMatch) {
        window.location.href = `#${labelMatch[1].toLowerCase()}`;
      }
    }
  });

  wheelMenu.addEventListener('keydown', (event) => {
    const sector = event.target.closest('g');
    if (sector && event.key === 'Enter') {
      sector.classList.remove('mouse-active');
      const labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
      if (labelMatch) {
        window.location.href = `#${labelMatch[1].toLowerCase()}`;
      }
    }
  });

  wheelMenu.addEventListener('blur', (event) => {
    const sector = event.target.closest('g');
    if (sector) {
      sector.classList.remove('mouse-active');
    }
  }, true);

  const defsBackground = document.createElementNS(SVG_NS, 'defs');
  const gradient = document.createElementNS(SVG_NS, 'radialGradient');
  gradient.setAttribute('id', 'backgroundGradient');
  gradient.setAttribute('cx', '50%');
  gradient.setAttribute('cy', '50%');
  gradient.setAttribute('r', '50%');
  gradient.setAttribute('fx', '50%');
  gradient.setAttribute('fy', '50%');

  const stop1 = document.createElementNS(SVG_NS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', 'rgb(180, 220, 255)');
  stop1.setAttribute('stop-opacity', '0.0');

  const stop2 = document.createElementNS(SVG_NS, 'stop');
  stop2.setAttribute('offset', '80%');
  stop2.setAttribute('stop-color', 'rgb(180, 220, 255)');
  stop2.setAttribute('stop-opacity', '0.08');

  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defsBackground.appendChild(gradient);

  const holoCoreGradient = document.createElementNS(SVG_NS, 'linearGradient');
  holoCoreGradient.setAttribute('id', 'holoCoreGradient');
  holoCoreGradient.setAttribute('x1', '0%');
  holoCoreGradient.setAttribute('y1', '0%');
  holoCoreGradient.setAttribute('x2', '0%');
  holoCoreGradient.setAttribute('y2', '100%');

  const holoStop1 = document.createElementNS(SVG_NS, 'stop');
  holoStop1.setAttribute('offset', '0%');
  holoStop1.setAttribute('stop-color', 'rgb(180, 220, 255)');
  holoStop1.setAttribute('stop-opacity', '0.1');

  const holoStop2 = document.createElementNS(SVG_NS, 'stop');
  holoStop2.setAttribute('offset', '100%');
  holoStop2.setAttribute('stop-color', 'rgb(180, 220, 255)');
  holoStop2.setAttribute('stop-opacity', '0.2');

  holoCoreGradient.appendChild(holoStop1);
  holoCoreGradient.appendChild(holoStop2);
  defsBackground.appendChild(holoCoreGradient);
  svgElement.appendChild(defsBackground);

  const backgroundCircle = document.createElementNS(SVG_NS, 'circle');
  backgroundCircle.setAttribute('cx', CONFIG.CENTER_X);
  backgroundCircle.setAttribute('cy', CONFIG.CENTER_Y);
  backgroundCircle.setAttribute('r', CONFIG.BACKGROUND_RADIUS);
  backgroundCircle.setAttribute('fill', 'url(#backgroundGradient)');
  backgroundCircle.setAttribute('stroke', CONFIG.STROKE_COLOR);
  backgroundCircle.setAttribute('stroke-width', '1');
  wheelMenu.parentNode.insertBefore(backgroundCircle, wheelMenu);

  const defs = document.createElementNS(SVG_NS, 'defs');
  const clipPath = document.createElementNS(SVG_NS, 'clipPath');
  clipPath.setAttribute('id', 'innerCircleClip');
  const clipCircle = document.createElementNS(SVG_NS, 'circle');
  clipCircle.setAttribute('cx', CONFIG.CENTER_X);
  clipCircle.setAttribute('cy', CONFIG.CENTER_Y);
  clipCircle.setAttribute('r', CONFIG.INNER_CIRCLE_RADIUS);
  clipPath.appendChild(clipCircle);
  defs.appendChild(clipPath);
  svgElement.appendChild(defs);

  const gridOverlay = document.createElementNS(SVG_NS, 'g');
  gridOverlay.setAttribute('clip-path', 'url(#innerCircleClip)');
  for (let x = -CONFIG.INNER_RADIUS; x <= CONFIG.INNER_RADIUS; x += CONFIG.GRID_SPACING) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', CONFIG.CENTER_X + x);
    line.setAttribute('y1', CONFIG.CENTER_Y - CONFIG.INNER_RADIUS);
    line.setAttribute('x2', CONFIG.CENTER_X + x);
    line.setAttribute('y2', CONFIG.CENTER_Y + CONFIG.INNER_RADIUS);
    line.setAttribute('stroke', CONFIG.STROKE_COLOR);
    line.setAttribute('stroke-width', '1');
    gridOverlay.appendChild(line);
  }
  for (let y = -CONFIG.INNER_RADIUS; y <= CONFIG.INNER_RADIUS; y += CONFIG.GRID_SPACING) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', CONFIG.CENTER_X - CONFIG.INNER_RADIUS);
    line.setAttribute('y1', CONFIG.CENTER_Y + y);
    line.setAttribute('x2', CONFIG.CENTER_X + CONFIG.INNER_RADIUS);
    line.setAttribute('y2', CONFIG.CENTER_Y + y);
    line.setAttribute('stroke', CONFIG.STROKE_COLOR);
    line.setAttribute('stroke-width', '1');
    gridOverlay.appendChild(line);
  }
  wheelMenu.appendChild(gridOverlay);

  const gridCenters = [];
  for (let x = -CONFIG.INNER_RADIUS; x <= CONFIG.INNER_RADIUS; x += CONFIG.GRID_SPACING) {
    for (let y = -CONFIG.INNER_RADIUS; y <= CONFIG.INNER_RADIUS; y += CONFIG.GRID_SPACING) {
      const distance = Math.sqrt(x * x + y * y);
      if (distance <= CONFIG.INNER_CIRCLE_RADIUS) {
        gridCenters.push({ x: CONFIG.CENTER_X + x, y: CONFIG.CENTER_Y + y });
      }
    }
  }

  const neuronCount = CONFIG.NEURON_COUNT_MIN + Math.floor(Math.random() * (CONFIG.NEURON_COUNT_MAX - CONFIG.NEURON_COUNT_MIN));
  const selectedCenters = gridCenters.sort(() => Math.random() - 0.5).slice(0, neuronCount);
  selectedCenters.forEach(center => new GridNeuron(center.x, center.y, gridOverlay));

  const centerCircle = document.createElementNS(SVG_NS, 'circle');
  centerCircle.setAttribute('cx', CONFIG.CENTER_X);
  centerCircle.setAttribute('cy', CONFIG.CENTER_Y);
  centerCircle.setAttribute('r', CONFIG.INNER_CIRCLE_RADIUS);
  centerCircle.setAttribute('fill', 'none');
  centerCircle.setAttribute('stroke', CONFIG.STROKE_COLOR);
  centerCircle.setAttribute('stroke-width', '1');
  wheelMenu.appendChild(centerCircle);

  const innerFilledCircle = document.createElementNS(SVG_NS, 'circle');
  innerFilledCircle.setAttribute('cx', CONFIG.CENTER_X);
  innerFilledCircle.setAttribute('cy', CONFIG.CENTER_Y);
  innerFilledCircle.setAttribute('r', CONFIG.INNER_FILLED_RADIUS);
  innerFilledCircle.setAttribute('fill', 'rgba(180, 220, 255, 0.06)');
  innerFilledCircle.setAttribute('stroke', 'none');
  innerFilledCircle.setAttribute('class', 'inner-filled-circle');
  wheelMenu.appendChild(innerFilledCircle);

  const holoCoreGroup = document.createElementNS(SVG_NS, 'g');
  holoCoreGroup.setAttribute('aria-hidden', 'true');
  const holoCore = document.createElementNS(SVG_NS, 'circle');
  holoCore.setAttribute('cx', CONFIG.CENTER_X);
  holoCore.setAttribute('cy', CONFIG.CENTER_Y);
  holoCore.setAttribute('r', CONFIG.CORE_RADIUS);
  holoCore.setAttribute('fill', 'rgba(234, 255, 255, 0.9)');
  holoCore.setAttribute('class', 'holo-core');
  holoCoreGroup.appendChild(holoCore);

  CONFIG.RING_RADII.forEach((r, i) => {
    const ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('cx', CONFIG.CENTER_X);
    ring.setAttribute('cy', CONFIG.CENTER_Y);
    ring.setAttribute('r', r);
    ring.setAttribute('fill', 'url(#holoCoreGradient)');
    ring.setAttribute('class', `holo-ring ring-${i}`);
    holoCoreGroup.appendChild(ring);
  });
  wheelMenu.appendChild(holoCoreGroup);

  // Initialize welcome text carousel
  initWelcomeCarousel();
}

// Initialize on DOM load
window.addEventListener('load', initRadialMenu);
