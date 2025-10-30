import { initNavbar } from "./navbar/navbar.js";
import { initCart } from "./cart/index.js";

document.addEventListener("DOMContentLoaded", () => {
  initCart();
  initNavbar();
});
