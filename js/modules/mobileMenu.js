/**
 * Module to handle mobile version sandwich menu
 */
import activeSection from './activeSection.js';

export default function mobileMenu() {
  const menu = document.querySelector('.mobileMenu'); // Get mobile menu
  const sandwich = document.querySelector('button.sandwich'); // Get sandwich button
  const a = Array.from(menu.querySelectorAll('a')); // Get anchor elements array

  // Adjust horizontal anchor elements position accordingly to viewport width
  function adjustAnchorsPosition() {
    a.forEach((el) => {
      // Set center at 40% of the menu's width
      const center = menu.clientWidth * 0.4;

      // Get element x position
      const x = el.offsetLeft;
      const right = Number(getComputedStyle(el).right.replace('px', ''));

      /**
       * Translate element by the difference of the
       * x position to the center added to the "right" computed value
       */
      el.style.transform = `translateX(${center - right + center - x}px)`;
      el.setAttribute(
        'style',
        'transform: ' + el.style.transform + ' !important'
      );
    });
  }

  function toggleState() {
    sandwich.classList.toggle('active'); // Toggle active class for sandwich button
    sandwich.parentElement.classList.toggle('active'); // Toggle active class for sandwich button parent element

    // Set width and height from mobile menu accordingly with menu state
    if (!menu.classList.contains('active')) {
      // Remove width and height after 0.25 seconds if menu closed
      setTimeout(() => (menu.style.minWidth = '0'), 250);
      setTimeout(() => (menu.style.minHeight = '0'), 250);
    } else {
      // Set width and height to cover viewport if menu is open
      menu.style.minWidth = '100vw';
      menu.style.minHeight = '100vh';
      if (innerWidth < 320) adjustAnchorsPosition(); // Adjust anchor elements horizontal position for extra small screens
    }
  }

  // Set touch event to button
  sandwich.addEventListener('touchstart', toggleState);

  // Set touch event to background outside mobile menu (only if sandwich is activated)
  menu.addEventListener('touchstart', (event) => {
    // Check event target
    const validTarget =
      event.target == event.currentTarget ||
      event.target.classList.contains('svg-circle-menu-container');

    if (validTarget && sandwich.classList.contains('active')) toggleState();
  });

  /**
   * Function to indicate section in mobile menu
   * accordingly to window scroll position
   */
  // Get default value for active section name and index
  let [section, index, positions] = activeSection();

  // Define window scroll event callback
  window.onscroll = () => {
    // Reset active section name and index
    [section, index, positions] = activeSection();

    // Check anchors elements correspondence with active section
    const activeAnchor = a.find((a) => a.id == section.id);

    // Set active state to anchor element accordingly to respective active section
    a.forEach((a) => a.classList.remove('active'));
    if (activeAnchor) activeAnchor.classList.add('active');
  };

  /**
   * Function to set page navigation through mobile menu anchors
   */
  // Set touch event callback for each anchor element
  a.forEach((a, i, array) =>
    a.addEventListener('touchstart', (event) => {
      /**
       * Get anchor element index.
       * Add one to adjust the correspondence between the anchors
       * and the section's positions array
       */
      const index = array.findIndex((el) => el == a) + 1; //

      // Get section's position correspondent to anchor element index
      let position = positions.find((position, i) => {
        if (i == index) return position;
      });

      // Adjust position
      position += 0.05 * innerHeight;

      // Scroll page to section with id correspondent to anchor element id
      scrollTo({
        top: position,
        left: 0,
        behavior: 'smooth',
      });

      // Close mobile menu
      toggleState();
    })
  );
}
