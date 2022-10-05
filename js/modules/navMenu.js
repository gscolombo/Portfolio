/**
 * Module to handle navigation bar
 */
import activeSection from './activeSection';
import debounce from './debounce';

export default () => {
  // Get nav element and links
  const nav = document.querySelector('nav');
  let navHeight = nav.clientHeight; // Define navigation height;
  const links = nav.querySelectorAll('.links a');

  // Get default value for active section name and index
  let [section, index, positions] = activeSection(0.075);

  // Scroll to section when click on link
  links.forEach((link, i) => {
    link.addEventListener('click', () => {
      scrollTo({
        top: positions[i + 1],
        left: 0,
        behavior: 'smooth',
      });
    });
  });

  // Set scroll event listener
  window.onscroll = debounce(100, () => {
    // Set navigation bar style transition
    if (scrollY > innerHeight / 4) {
      nav.classList.add('active');
      navHeight = nav.clientHeight;
    } else {
      nav.classList.remove('active');
      navHeight = nav.clientHeight;
    }

    // Monitor sections and activate according to scroll position
    [section, index] = activeSection(0.08);

    links.forEach((link, i) =>
      i == index - 1
        ? link.classList.add('active')
        : link.classList.remove('active')
    );
  });
};
