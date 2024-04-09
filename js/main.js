import mobileMenu from './modules/mobileMenu.js';
import initVueGrid from './vue/index.js';
import sendMail from './modules/sendMail.js';
import navMenu from './modules/navMenu.js';
import bg from './modules/bg.js';
import writer from './modules/writer.js';

/** Public site functions **/
if (location.pathname == '/') {
  window.onload = () => {
    const html = document.querySelector('html');
    bg(innerWidth, innerHeight);

    const loadingScreen = document.querySelector('div.loading');
    loadingScreen.classList.add('concluded');

    // Reset body scrolling
    document.body.style.overflowY = '';

    // Start writing in panel
    writer();

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
