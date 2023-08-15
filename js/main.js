import bg from 'poly-bg';
import mobileMenu from './modules/mobileMenu.js';
import initVueGrid from './vue/index.js';
import sendMail from './modules/sendMail.js';
import navMenu from './modules/navMenu.js';
import { getGPUTier } from 'detect-gpu';

/** Public site functions **/
if (location.pathname == '/') {
  // document
  //   .querySelectorAll('img')
  //   .forEach((img) =>
  //     img.hasAttribute('loading') ? null : img.setAttribute('loading', 'lazy')
  //   );

  window.onload = () => {
    const html = document.querySelector('html');

    const loadingScreen = document.querySelector('div.loading');
    loadingScreen.querySelector('p').textContent =
      'Realizando benchmark da GPU...';
    getGPUTier({ failIfMajorPerformanceCaveat: true }).then((result) => {
      // Set cool background
      if (result.tier == 3) {
        bg('bg', 4, 4, html.clientWidth, html.clientHeight, true);
      } else {
        bg('bg', 4, 4, html.clientWidth, html.clientHeight, false);
      }
      // Inactive loading screen
      loadingScreen.classList.add('concluded');
    });

    // Reset body scrolling
    document.body.style.overflowY = '';

    // Initialize vue grid
    initVueGrid();

    // Start mobile functions or desktop version according to screen size
    if (window.innerWidth < 720) {
      mobileMenu();
    } else {
      navMenu(); // Navigation bar transition
    }

    // Button callback for scroll to portfolio's section
    const btn = document.querySelector('section#entrance button');
    const events = ['touchstart', 'click'];
    events.forEach((event) =>
      btn.addEventListener(
        event,
        (e) => {
          let distance = document.querySelector('section#portfolio').offsetTop;
          if (innerWidth > 720) distance -= innerHeight * 0.08;
          scrollTo({ top: distance, left: 0, behavior: 'smooth' });
        },
        { passive: true }
      )
    );
  };

  // Send e-mail from contact form
  sendMail(document.querySelector('#contact form'));
}
