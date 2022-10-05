/**
 * Module to monitor document's scroll position and set active section.
 * Use it inside a "scroll" event listener
 * @param {float=} factor Decimal value to multiply windows inner height with, which is subtracted from section's top offset value.
 * @returns {Array} Array that contains the active section element, its index and the section's positions array
 */

export default function activeSection(factor = 0.05) {
  // Get sections scroll position
  const sections = Array.from(document.querySelectorAll('section')).reverse(); // Get all sections as an array, in reverse order (to allow correct index identification)

  /**
   * Set section's positions array (distances from the start of the document).
   * A fraction of the viewport height is subtracted to adjust for the section's heights;
   */
  let sectionsPositions = sections.map(
    (section) => section.offsetTop - factor * window.innerHeight
  );

  // Active section accordingly to document's scroll position
  const activeSectionIndex = sectionsPositions.findIndex(
    (position) => scrollY >= position
  );
  const activeSection = sections[activeSectionIndex];
  activeSection.classList.add('active');

  // Return activated section, associated index and section's positions array
  return [
    activeSection ? activeSection : 'entrance',
    activeSection ? Math.abs(activeSectionIndex - sections.length + 1) : 0,
    sectionsPositions.reverse(),
  ];
}
