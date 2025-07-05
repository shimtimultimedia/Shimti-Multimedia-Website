/**
 * @module TitlePanel
 * @description Initializes the title panel with logo and text for Shimti Multimedia.
 * Ensures proper loading and error handling for live environments.
 */

/**
 * @function window.initTitlePanel
 * @description Sets up the title panel, checking for logo load errors
 */
window.initTitlePanel = function () {
  const titlePanel = document.getElementById('titlePanel');
  if (!titlePanel) return;

  const logo = titlePanel.querySelector('img');
  if (logo) {
    logo.addEventListener('error', () => {
      logo.alt = 'Shimti Multimedia Logo (Failed to Load)';
    });
  }
};

window.addEventListener('load', window.initTitlePanel);
