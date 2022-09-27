import bg from "poly-bg";
import mobileMenu from "./modules/mobileMenu.js";
import portfolioGrid from "./modules/portfolioGrid.js";
import initVueApp from "../adminApp/index.js";
import initVueGrid from "./vue/index.js";
import sendMail from "./modules/sendMail.js";

/** Public site functions **/
if (location.pathname == "/") {
  window.onload = () => {
    const html = document.querySelector("html");

    // Inactive loading screen
    document.querySelector("div.loading").classList.add("concluded");

    // Reset body scrolling
    document.body.style.overflowY = "";

    // Set cool background
    bg("bg", 4, 4, html.clientWidth, html.clientHeight);

    // Initialize vue grid
    initVueGrid();

    // Start mobile functions
    if (window.innerWidth < 720) {
      mobileMenu();
      portfolioGrid();
    }

    // Button callback for scroll to portfolio's section
    const btn = document.querySelector("section#entrance button");
    const events = ["touchstart", "click"];
    events.forEach((event) =>
      btn.addEventListener(event, (e) => {
        e.preventDefault();
        const distance = document.querySelector("section#portfolio").offsetTop;
        scrollTo({ top: distance, left: 0, behavior: "smooth" });
      })
    );
  };

  sendMail(document.querySelector("#contact form"));
}

/** Administration page functions **/
if (location.pathname == "/admin") {
  // Remove drag-and-drop event listener from window object
  ["drop", "dragover"].forEach((event) => {
    window.addEventListener(event, (e) => e.preventDefault());
  });

  window.onload = () => {
    initVueApp(); // Start Vue app
  };
}
