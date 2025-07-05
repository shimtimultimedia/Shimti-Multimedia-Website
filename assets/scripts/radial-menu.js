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
  WELCOME_INTERVAL: 8000,
  PARTICLE_INTERVAL_MIN: 1000,
  PARTICLE_INTERVAL_MAX: 3000,
  BACKGROUND_RADIUS: 185,
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

/**
 * @function window.polarToCartesian
 * @description Converts polar coordinates to Cartesian coordinates
 */
window.polarToCartesian = function(cx, cy, r, angleDeg) {
  var angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
};

/**
 * @function window.createNavigationSector
 * @description Creates an SVG sector for the radial menu
 */
window.createNavigationSector = function(position, label, fillColor, fragment) {
  var p1 = position.p1, p2 = position.p2, p3 = position.p3, p4 = position.p4, iconPos = position.iconPos, start = position.start, end = position.end;
  var largeArc = end - start > 180 ? 1 : 0;
  var pathData = [
    'M', p1.x, p1.y,
    'A', window.MENU_CONFIG.OUTER_RADIUS, window.MENU_CONFIG.OUTER_RADIUS, 0, largeArc, 0, p2.x, p2.y,
    'L', p3.x, p3.y,
    'A', window.MENU_CONFIG.INNER_RADIUS, window.MENU_CONFIG.INNER_RADIUS, 0, largeArc, 1, p4.x, p4.y,
    'Z'
  ].join(' ');

  var path = document.createElementNS(window.MENU_SVG_NS, 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('fill', fillColor);
  path.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
  path.setAttribute('stroke-width', '1');

  var group = document.createElementNS(window.MENU_SVG_NS, 'g');
  group.setAttribute('role', 'link');
  group.setAttribute('aria-label', 'Navigate to ' + label + ' section');
  group.setAttribute('tabindex', '0');
  group.dataset.label = label;

  var icon = document.createElementNS(window.MENU_SVG_NS, 'image');
  icon.setAttribute('href', 'assets/images/' + label + '.svg');
  icon.setAttribute('x', iconPos.x - 25);
  icon.setAttribute('y', iconPos.y - 25);
  icon.setAttribute('width', '50');
  icon.setAttribute('height', '50');
  icon.setAttribute('aria-label', label + ' Icon');
  icon.setAttribute('loading', 'lazy');

  group.appendChild(path);
  group.appendChild(icon);
  fragment.appendChild(group);
};

/**
 * @function window.GridParticle
 * @description Represents a particle at grid intersections that pops in/out randomly
 */
window.GridParticle = function(x, y, gridOverlay) {
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
};

/**
 * @method animate
 * @description Toggles visibility randomly in an infinite loop
 */
window.GridParticle.prototype.animate = function() {
  var self = this;
  var toggleVisibility = function() {
    var isVisible = self.element.style.opacity === '1';
    self.element.style.opacity = isVisible ? '0' : '1';
    var delay = window.MENU_CONFIG.PARTICLE_INTERVAL_MIN + Math.random() * (window.MENU_CONFIG.PARTICLE_INTERVAL_MAX - window.MENU_CONFIG.PARTICLE_INTERVAL_MIN);
    setTimeout(toggleVisibility, delay);
  };
  var initialDelay = Math.random() * window.MENU_CONFIG.PARTICLE_INTERVAL_MAX;
  setTimeout(toggleVisibility, initialDelay);
};

/**
 * @function window.initWelcomeCarousel
 * @description Initializes the welcome text carousel with smooth, sequential language cycling, prioritizing languages.xml
 */
window.initWelcomeCarousel = function() {
  var welcomeText = document.getElementById('welcomeText');
  var menuWheel = document.getElementById('wheelMenu');
  if (!welcomeText || !menuWheel) {
    console.error('Welcome text or wheel menu not found:', { welcomeText: !!welcomeText, menuWheel: !!menuWheel });
    return;
  }

  welcomeText.textContent = 'Loading...';

  var languages = window.MENU_CONFIG.FALLBACK_LANGUAGES;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'assets/data/languages.xml', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var xmlDoc = xhr.responseXML;
        var languageNodes = xmlDoc.getElementsByTagName('language');
        if (languageNodes.length > 0) {
          languages = Array.prototype.map.call(languageNodes, function(node) {
            return {
              lang: node.getAttribute('lang'),
              text: node.getAttribute('text') || 'Welcome'
            };
          });
          console.log('Using languages.xml:', languages);
        } else {
          console.log('languages.xml is empty, using FALLBACK_LANGUAGES:', languages);
        }
      } else {
        console.log('Failed to load languages.xml, using FALLBACK_LANGUAGES:', languages);
      }
      // Start carousel after XML load attempt
      startCarousel();
    }
  };
  xhr.send();

  function startCarousel() {
    var currentIndex = 0;
    var isHovering = false;
    var timeoutId = null;

    var cycleText = function() {
      if (timeoutId) clearTimeout(timeoutId);
      if (isHovering) {
        timeoutId = setTimeout(cycleText, window.MENU_CONFIG.WELCOME_INTERVAL);
        return;
      }

      welcomeText.classList.remove('fade-in');
      welcomeText.classList.add('fade-out');
      setTimeout(function() {
        currentIndex = (currentIndex + 1) % languages.length;
        welcomeText.textContent = languages[currentIndex].text || 'Welcome';
        welcomeText.classList.remove('fade-out');
        welcomeText.classList.add('fade-in');
        timeoutId = setTimeout(cycleText, window.MENU_CONFIG.WELCOME_INTERVAL);
      }, 500);
    };

    welcomeText.textContent = languages[0].text || 'Welcome';
    welcomeText.classList.add('fade-in');
    timeoutId = setTimeout(cycleText, window.MENU_CONFIG.WELCOME_INTERVAL);

    var sectors = menuWheel.querySelectorAll('g[role="link"]');
    for (var i = 0; i < sectors.length; i++) {
      sectors[i].addEventListener('mouseenter', function() {
        if (timeoutId) clearTimeout(timeoutId);
        isHovering = true;
        welcomeText.classList.remove('fade-in');
        welcomeText.classList.add('fade-out');
        var sector = this;
        setTimeout(function() {
          var labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
          welcomeText.textContent = labelMatch ? labelMatch[1] : '';
          welcomeText.classList.remove('fade-out');
          welcomeText.classList.add('fade-in');
        }, 500);
      });

      sectors[i].addEventListener('mouseleave', function() {
        if (timeoutId) clearTimeout(timeoutId);
        isHovering = false;
        welcomeText.classList.remove('fade-in');
        welcomeText.classList.add('fade-out');
        setTimeout(function() {
          welcomeText.textContent = languages[currentIndex].text || 'Welcome';
          welcomeText.classList.remove('fade-out');
          welcomeText.classList.add('fade-in');
          timeoutId = setTimeout(cycleText, window.MENU_CONFIG.WELCOME_INTERVAL);
        }, 500);
      });
    }
  }
};

/**
 * @function window.initRadialMenu
 * @description Initializes the radial menu with sectors, masked grid, and holographic effects
 */
window.initRadialMenu = function() {
  var svgElement = document.getElementById('radialMenu');
  var menuWheel = document.getElementById('wheelMenu');
  console.log('Initializing radial menu:', { svgElement: !!svgElement, menuWheel: !!menuWheel });
  if (!svgElement || !menuWheel) {
    console.error('Radial menu elements not found:', { svgElement: !!svgElement, menuWheel: !!menuWheel });
    return;
  }

  var sectorAngle = 360 / window.MENU_CONFIG.NAVIGATION_LINKS.length;
  var sectorPositions = window.MENU_CONFIG.NAVIGATION_LINKS.map(function(_, i) {
    var start = 270 + i * sectorAngle;
    var end = start + sectorAngle;
    var labelAngle = (start + end) / 2;
    return {
      p1: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, window.MENU_CONFIG.OUTER_RADIUS, end),
      p2: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, window.MENU_CONFIG.OUTER_RADIUS, start),
      p3: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, window.MENU_CONFIG.INNER_RADIUS, start),
      p4: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, window.MENU_CONFIG.INNER_RADIUS, end),
      iconPos: window.polarToCartesian(window.MENU_CONFIG.CENTER_X, window.MENU_CONFIG.CENTER_Y, (window.MENU_CONFIG.INNER_RADIUS + window.MENU_CONFIG.OUTER_RADIUS) / 2, labelAngle),
      start: start,
      end: end
    };
  });

  var fragment = document.createDocumentFragment();
  sectorPositions.forEach(function(pos, i) {
    window.createNavigationSector(pos, window.MENU_CONFIG.NAVIGATION_LINKS[i], window.MENU_CONFIG.SECTOR_FILL, fragment);
  });
  menuWheel.appendChild(fragment);
  console.log('Sectors appended:', sectorPositions.length);

  menuWheel.addEventListener('click', function(event) {
    var sector = event.target.closest('g');
    if (sector) {
      sector.classList.add('mouse-active');
      var labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
      if (labelMatch) {
        window.location.href = '#' + labelMatch[1].toLowerCase();
      }
    }
  });

  menuWheel.addEventListener('keydown', function(event) {
    var sector = event.target.closest('g');
    if (sector && event.key === 'Enter') {
      sector.classList.remove('mouse-active');
      var labelMatch = sector.getAttribute('aria-label').match(/Navigate to (\w+) section/);
      if (labelMatch) {
        window.location.href = '#' + labelMatch[1].toLowerCase();
      }
    }
  });

  menuWheel.addEventListener('blur', function(event) {
    var sector = event.target.closest('g');
    if (sector) {
      sector.classList.remove('mouse-active');
    }
  }, true);

  var defsBackground = document.createElementNS(window.MENU_SVG_NS, 'defs');
  var gradient = document.createElementNS(window.MENU_SVG_NS, 'radialGradient');
  gradient.setAttribute('id', 'backgroundGradient');
  gradient.setAttribute('cx', '50%');
  gradient.setAttribute('cy', '50%');
  gradient.setAttribute('r', '50%');
  gradient.setAttribute('fx', '50%');
  gradient.setAttribute('fy', '50%');

  var stop1 = document.createElementNS(window.MENU_SVG_NS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', 'rgb(180, 220, 255)');
  stop1.setAttribute('stop-opacity', '0.0');

  var stop2 = document.createElementNS(window.MENU_SVG_NS, 'stop');
  stop2.setAttribute('offset', '80%');
  stop2.setAttribute('stop-color', 'rgb(180, 220, 255)');
  stop2.setAttribute('stop-opacity', '0.08');

  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defsBackground.appendChild(gradient);

  var holoCoreGradient = document.createElementNS(window.MENU_SVG_NS, 'linearGradient');
  holoCoreGradient.setAttribute('id', 'holoCoreGradient');
  holoCoreGradient.setAttribute('x1', '0%');
  holoCoreGradient.setAttribute('y1', '0%');
  holoCoreGradient.setAttribute('x2', '0%');
  holoCoreGradient.setAttribute('y2', '100%');

  var holoStop1 = document.createElementNS(window.MENU_SVG_NS, 'stop');
  holoStop1.setAttribute('offset', '0%');
  holoStop1.setAttribute('stop-color', 'rgb(180, 220, 255)');
  holoStop1.setAttribute('stop-opacity', '0.1');

  var holoStop2 = document.createElementNS(window.MENU_SVG_NS, 'stop');
  holoStop2.setAttribute('offset', '100%');
  holoStop2.setAttribute('stop-color', 'rgb(180, 220, 255)');
  holoStop2.setAttribute('stop-opacity', '0.2');

  holoCoreGradient.appendChild(holoStop1);
  holoCoreGradient.appendChild(holoStop2);
  defsBackground.appendChild(holoCoreGradient);
  svgElement.appendChild(defsBackground);

  var backgroundCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
  backgroundCircle.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  backgroundCircle.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  backgroundCircle.setAttribute('r', window.MENU_CONFIG.BACKGROUND_RADIUS);
  backgroundCircle.setAttribute('fill', 'url(#backgroundGradient)');
  backgroundCircle.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
  backgroundCircle.setAttribute('stroke-width', '1');
  menuWheel.parentNode.insertBefore(backgroundCircle, menuWheel);

  var defs = document.createElementNS(window.MENU_SVG_NS, 'defs');
  var clipPath = document.createElementNS(window.MENU_SVG_NS, 'clipPath');
  clipPath.setAttribute('id', 'innerCircleClip');
  var clipCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
  clipCircle.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  clipCircle.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  clipCircle.setAttribute('r', window.MENU_CONFIG.INNER_CIRCLE_RADIUS);
  clipPath.appendChild(clipCircle);
  defs.appendChild(clipPath);
  svgElement.appendChild(defs);

  var gridOverlay = document.createElementNS(window.MENU_SVG_NS, 'g');
  gridOverlay.setAttribute('clip-path', 'url(#innerCircleClip)');
  for (var x = -window.MENU_CONFIG.INNER_RADIUS; x <= window.MENU_CONFIG.INNER_RADIUS; x += window.MENU_CONFIG.GRID_SPACING) {
    var line = document.createElementNS(window.MENU_SVG_NS, 'line');
    line.setAttribute('x1', window.MENU_CONFIG.CENTER_X + x);
    line.setAttribute('y1', window.MENU_CONFIG.CENTER_Y - window.MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('x2', window.MENU_CONFIG.CENTER_X + x);
    line.setAttribute('y2', window.MENU_CONFIG.CENTER_Y + window.MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
    line.setAttribute('stroke-width', '1');
    gridOverlay.appendChild(line);
  }
  for (var y = -window.MENU_CONFIG.INNER_RADIUS; y <= window.MENU_CONFIG.INNER_RADIUS; y += window.MENU_CONFIG.GRID_SPACING) {
    var line = document.createElementNS(window.MENU_SVG_NS, 'line');
    line.setAttribute('x1', window.MENU_CONFIG.CENTER_X - window.MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('y1', window.MENU_CONFIG.CENTER_Y + y);
    line.setAttribute('x2', window.MENU_CONFIG.CENTER_X + window.MENU_CONFIG.INNER_RADIUS);
    line.setAttribute('y2', window.MENU_CONFIG.CENTER_Y + y);
    line.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
    line.setAttribute('stroke-width', '1');
    gridOverlay.appendChild(line);
  }

  var gridCenters = [];
  for (var x = -window.MENU_CONFIG.INNER_RADIUS; x <= window.MENU_CONFIG.INNER_RADIUS; x += window.MENU_CONFIG.GRID_SPACING) {
    for (var y = -window.MENU_CONFIG.INNER_RADIUS; y <= window.MENU_CONFIG.INNER_RADIUS; y += window.MENU_CONFIG.GRID_SPACING) {
      var distance = Math.sqrt(x * x + y * y);
      if (distance <= window.MENU_CONFIG.INNER_CIRCLE_RADIUS) {
        gridCenters.push({ x: window.MENU_CONFIG.CENTER_X + x, y: window.MENU_CONFIG.CENTER_Y + y });
      }
    }
  }
  var particleCount = window.MENU_CONFIG.PARTICLE_COUNT_MIN + Math.floor(Math.random() * (window.MENU_CONFIG.PARTICLE_COUNT_MAX - window.MENU_CONFIG.PARTICLE_COUNT_MIN));
  var selectedCenters = gridCenters.sort(function() { return Math.random() - 0.5; }).slice(0, particleCount);
  selectedCenters.forEach(function(center) { new window.GridParticle(center.x, center.y, gridOverlay); });

  menuWheel.appendChild(gridOverlay);
  console.log('Grid and particles appended');

  var centerCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
  centerCircle.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  centerCircle.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  centerCircle.setAttribute('r', window.MENU_CONFIG.INNER_CIRCLE_RADIUS);
  centerCircle.setAttribute('fill', 'none');
  centerCircle.setAttribute('stroke', window.MENU_CONFIG.STROKE_COLOR);
  centerCircle.setAttribute('stroke-width', '1');
  menuWheel.appendChild(centerCircle);

  var innerFilledCircle = document.createElementNS(window.MENU_SVG_NS, 'circle');
  innerFilledCircle.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  innerFilledCircle.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  innerFilledCircle.setAttribute('r', window.MENU_CONFIG.INNER_FILLED_RADIUS);
  innerFilledCircle.setAttribute('fill', 'rgba(180, 220, 255, 0.06)');
  innerFilledCircle.setAttribute('stroke', 'none');
  innerFilledCircle.setAttribute('class', 'inner-filled-circle');
  menuWheel.appendChild(innerFilledCircle);

  var holoCoreGroup = document.createElementNS(window.MENU_SVG_NS, 'g');
  holoCoreGroup.setAttribute('aria-hidden', 'true');
  var holoCore = document.createElementNS(window.MENU_SVG_NS, 'circle');
  holoCore.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
  holoCore.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
  holoCore.setAttribute('r', window.MENU_CONFIG.CORE_RADIUS);
  holoCore.setAttribute('fill', 'rgba(234, 255, 255, 0.9)');
  holoCore.setAttribute('stroke', 'none');
  holoCore.setAttribute('class', 'holo-core');
  holoCoreGroup.appendChild(holoCore);

  window.MENU_CONFIG.RING_RADII.forEach(function(r, i) {
    var ring = document.createElementNS(window.MENU_SVG_NS, 'circle');
    ring.setAttribute('cx', window.MENU_CONFIG.CENTER_X);
    ring.setAttribute('cy', window.MENU_CONFIG.CENTER_Y);
    ring.setAttribute('r', r);
    ring.setAttribute('fill', 'url(#holoCoreGradient)');
    ring.setAttribute('stroke', 'none');
    ring.setAttribute('class', 'holo-ring ring-' + i);
    holoCoreGroup.appendChild(ring);
  });
  menuWheel.appendChild(holoCoreGroup);
  console.log('Core elements appended');

  window.initWelcomeCarousel();
  console.log('Radial menu initialization complete');
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded: Starting radial menu initialization');
  window.initRadialMenu();
});
