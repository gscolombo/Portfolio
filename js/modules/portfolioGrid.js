/**
 * Module to handle portfolio grid interaction (only mobile)
 */

import Pagination from "./pagination.js";

export default async function portfolioGrid(selector) {
  // Get portfolio wrapper
  const wrapper = document.querySelector("div.portfolio-wrapper");

  // Get portfolio grid items
  const gridItems = Array.from(wrapper.querySelectorAll(".grid .work"));

  // Set groups of items based on number of pages
  let tmp = [];
  let pages = [];
  gridItems.reduce((prev, current, index) => {
    // Define conditions to check third or last item
    const thirdItem = (index + 1) % 3 == 0;
    const lastItem = index + 1 == gridItems.length;

    tmp.push(current); // Insert grid items in temporary array of elements

    if (thirdItem || lastItem) {
      pages.push(tmp); // Insert array of elements in group of 3 in pages array
      tmp = []; // Clear array of elements;
    }
  }, []);

  if (pages.length > 1) {
    const pagination = new Pagination(pages);
    pagination.setPaginationElements();
    const { paginationWrapper, buttons, pageCounter } = pagination.elements;
    buttons.forEach((btn) => {
      const img = document.createElement("img");
      img.src = "img/arrow.svg";
      img.alt = "Ícone de seta";
      btn.appendChild(img);
    });

    paginationWrapper.appendChild(buttons[0]);
    paginationWrapper.appendChild(pageCounter);
    paginationWrapper.appendChild(buttons[1]);

    wrapper.insertBefore(paginationWrapper, wrapper.querySelector(".grid"));

    pagination.setPaginationButtonsEventListeners(); // Set touch events to pagination handlers
  } else {
    gridItems.forEach((item) => item.classList.add("show"));
  }
}
