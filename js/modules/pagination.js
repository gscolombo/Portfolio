/**
 * Number pagination object class
 */

export default class Pagination {
  #events = ['touchstart', 'click'];
  elements = {};
  currentPageIndex = 0;

  constructor(pages) {
    this.pages = pages;
    this.pages[this.currentPageIndex].forEach((item) =>
      item.classList.add('show')
    );
  }

  setPaginationElements = () => {
    const paginationElements = {
      paginationWrapper: document.createElement('div'),
      buttons: [
        document.createElement('button'),
        document.createElement('button'),
      ].map((btn, i) => {
        i ? btn.classList.add('right') : btn.classList.add('left');
        return btn;
      }),
      pageCounter: document.createElement('p'),
    };

    paginationElements.paginationWrapper.classList.add('pagination-wrapper');
    paginationElements.pageCounter.textContent = '1';
    paginationElements.buttons[0].disabled = 'true';

    this.elements = paginationElements;
  };

  setPaginationButtonsEventListeners = () => {
    const { buttons, pageCounter } = this.elements;

    this.#events.forEach((event) => {
      buttons.forEach((btn) => {
        btn.addEventListener(event, (e) => {
          buttons.forEach((btn) => btn.removeAttribute('disabled')); // Reset buttons
          this.#buttonEventListener(e, btn, pageCounter);
        });
      });
    });
  };

  #buttonEventListener = (event, button, pageCounter) => {
    event.preventDefault();
    const currentPage = parseInt(pageCounter.textContent); // Get current page number

    // Change page accordingly to direction of button pressed
    switch (button.classList[0]) {
      /**
       * In both cases, define current page index from pages array accordingly to the pageCounter
       * (decrease value by one to correspond with index)
       */
      case 'left':
        const isFirstPage = currentPage == 1; // Check if current page is first page
        const isSecondPage = currentPage == 2; // Check if current page is second page

        // Remove show status for all items if not first page
        if (!isFirstPage) {
          this.pages[this.currentPageIndex].forEach((item) =>
            item.classList.remove('show')
          );
        }

        // If current page is the second page, decrease pageCounter value, set current page index and disable button
        if (isSecondPage) {
          pageCounter.textContent = currentPage - 1;
          this.currentPageIndex--;
          button.disabled = 'true';
        }
        // If negative, only decrease pageCounter value and set current page index
        else {
          if (isFirstPage) return; // If current page is first page, do nothing
          pageCounter.textContent = currentPage - 1;
          this.currentPageIndex--;
        }
        break;
      case 'right':
        const isPenultPage = currentPage == this.pages.length - 1; // Check if current page is penult page
        const isLastPage = currentPage == this.pages.length; // Check if current page is last page;

        // Remove show status for all items if not last page
        if (!isLastPage) {
          this.pages[this.currentPageIndex].forEach((item) =>
            item.classList.remove('show')
          );
        }

        // Do the same as to the left direction button, but increasing pageCounter value
        if (isPenultPage) {
          pageCounter.textContent = currentPage + 1;
          this.currentPageIndex++;
          button.disabled = 'true';
        } else {
          if (isLastPage) return; // If current page is the last page, do nothing
          pageCounter.textContent = currentPage + 1;
          this.currentPageIndex++;
        }
    }

    // Set show status for items of the current index page
    this.pages[this.currentPageIndex].forEach((item) =>
      item.classList.add('show')
    );
  };
}
