/**
 * Carousel slide module
 * The secret here is that the last and first items are duplicated and put, respectively, in the first
 * and last position of the item's array. When the user reaches the "fake" last or first item, without its
 * notice, the slide goes back to the "real" last or first item and the carousel effect is accomplished (taa-daa...)
 */

export default function carousel() {
  // Get slide items
  const slide = document.querySelector('#portfolio .slide');
  const items = Array.from(slide.querySelectorAll('.work'));
  let n = items.length; // Get number of items to convenience

  // Duplicate first and last item and the respective adjacente items
  const firstItemClone = items[0].cloneNode(true);
  const adjacentFirstItemClone = items[1].cloneNode(true);
  const lastItemClone = items[n - 1].cloneNode(true);
  const adjacentLastItemClone = items[n - 2].cloneNode(true);

  // Identify clones
  firstItemClone.classList.add('clone');
  adjacentFirstItemClone.classList.add('clone');
  lastItemClone.classList.add('clone');
  adjacentLastItemClone.classList.add('clone');

  // Insert duplicates in the proper places

  // Insert first item clone after real last item
  items[n - 1]
    .insertAdjacentElement('afterend', firstItemClone)
    .insertAdjacentElement('afterend', adjacentFirstItemClone);
  items.push(firstItemClone); // Insert the last item clone in the array of items

  // The same with the last item clone
  items[0]
    .insertAdjacentElement('beforebegin', lastItemClone)
    .insertAdjacentElement('beforebegin', adjacentLastItemClone);
  items.unshift(lastItemClone);

  // Update items array length variable
  n = items.length;

  // Define offset distances
  const distances = items.map((item) => item.offsetLeft - innerWidth * 0.25);
  let currentDistance = distances[1];

  /** Initial slide state settings */
  const transition = 'all 0.25s ease-out'; // Smooth transition to be applied when displayed item is changed
  slide.style.transform = `translate3d(${-currentDistance}px, 0, 0)`; // Set initial grid position
  items[1].classList.add('on'); // Set "on" class to initially displayed item

  /** Mouse events settings
   * The slide must have 3 event listeners: one for the initial click, one for the mouse movement (while clicking)
   * and one for the click releasing.
   * The first will get the initial mouse coordinates and pass to the the second, which will calculate the distance
   * traveled based on the initial coordinates provided and pass to the last, which will finally execute stuff
   * if the distance is over a certain threshold. Only the X coordinate is necessary in this case.
   */

  // Slide dragging operation started by pressing the mouse
  slide.addEventListener('mousedown', (startEvent) => {
    startEvent.preventDefault();

    // Create an AbortSignal instance to remove "mousemove" event listener afterwards
    const signalController = new AbortController();
    const signal = signalController.signal;

    let distance = 0; // Initialize distance variable

    const offset = startEvent.offsetX; // Get pointer offset from element's left padding

    // Calculate element's distance from windows inner borders
    const initialDistanceLeft = startEvent.pageX - offset;
    const initialDistanceRight =
      innerWidth - startEvent.pageX - (startEvent.target.clientWidth - offset);

    // Get reference position index
    const currentPositionIndex = items.findIndex((item) =>
      item.classList.contains('on')
    );

    // Get current slide translation distance
    const initialXCoordinates = startEvent.pageX;

    // Dragging is executed by moving the mouse
    slide.addEventListener(
      'mousemove',
      (moveEvent) => {
        moveEvent.preventDefault();

        // Calculate distance traveled
        distance = initialXCoordinates - moveEvent.pageX;

        /** Change style properties according to distance moved */
        // Recalculate element's distance from windows inner borders
        const distanceLeft = moveEvent.pageX - offset;
        const distanceRight =
          innerWidth -
          moveEvent.pageX -
          (moveEvent.target.clientWidth - offset);

        const sizeFactor = Math.fround(
          distanceLeft < distanceRight
            ? distanceLeft / initialDistanceLeft
            : distanceRight / initialDistanceRight
        );

        items[currentPositionIndex].style.transition = 'none';
        items[currentPositionIndex].style.transform = `scale(${
          0.8 + 0.2 * sizeFactor
        })`;

        // Move slide by adding distance traveled to current translation distance
        slide.style.transform = `translate3d(${
          -currentDistance - distance
        }px, 0, 0)`;
      },
      { signal: signal }
    );

    // Dragging has stopped by releasing the mouse
    slide.addEventListener(
      'mouseup',
      (endEvent) => {
        endEvent.preventDefault();

        // Signal to remove "mousemove" event listener
        signalController.abort();

        // Do stuff
        if (Math.abs(distance) > 100) {
          if (distance < 0) {
            // Check if current index is the first item
            if (!(currentPositionIndex - 1)) {
              currentDistance = distances[currentPositionIndex - 1];
              moveSlide(slide, transition, -currentDistance); // Translate the slide

              // Update classes
              items[currentPositionIndex].classList.remove('on');
              items[currentPositionIndex - 1].classList.add('on');
              items[n - 2].classList.add('on');

              // Translate to the real last item without user notice
              items.forEach((item) => (item.style.pointerEvents = 'none')); // Disable interactions with the slide
              setTimeout(() => {
                currentDistance = distances[n - 2]; //  Set current distance to the real last item
                slide.style.transform = `translate3d(${-currentDistance}px, 0, 0)`; // Translate the slide
                items.forEach((item) => (item.style.pointerEvents = '')); // Enable interactions with the slide
                items[0].classList.remove('on');
              }, 250);
            } else {
              currentDistance = distances[currentPositionIndex - 1]; // Set reference distance to the previous item
              moveSlide(slide, transition, -currentDistance); // Translate the slide

              // Update classes
              items[currentPositionIndex].classList.remove('on');
              items[currentPositionIndex - 1].classList.add('on');
            }
          } else {
            // The same from above but to the right
            if (currentPositionIndex == n - 2) {
              currentDistance = distances[n - 1];
              moveSlide(slide, transition, -currentDistance); // Translate the slide

              // Update classes
              items[currentPositionIndex].classList.remove('on');
              items[currentPositionIndex + 1].classList.add('on');
              items[1].classList.add('on');

              // Translate to the real last item without user notice
              setTimeout(() => {
                currentDistance = distances[1]; //  Set current distance to the real first item
                slide.style.transform = `translate3d(${-currentDistance}px, 0, 0)`; // Translate the slide
                items[n - 1].classList.remove('on');
              }, 250);
            } else {
              currentDistance = distances[currentPositionIndex + 1];
              moveSlide(slide, transition, -currentDistance); // Translate the slide

              // Update classes
              items[currentPositionIndex].classList.remove('on');
              items[currentPositionIndex + 1].classList.add('on');
            }
          }
        } else {
          slide.style.transition = transition; // Set smooth transition
          slide.style.transform = `translate3d(${-currentDistance}px, 0, 0)`;

          setTimeout(() => {
            slide.style.transition = 'none';
          }, 250);
        }

        // Reset item styles
        items.forEach(
          (item) => ((item.style.transform = ''), (item.style.transition = ''))
        );
      },
      { once: true }
    );
  });
}

// Function to move the slide
function moveSlide(slide, transition, distance) {
  slide.style.transition = transition; // Set smooth transition
  slide.style.transform = `translate3d(${distance}px, 0,0)`;

  // Reset transition to none
  setTimeout(() => {
    slide.style.transition = 'none';
  }, 250);
}
