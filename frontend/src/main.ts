import { initNavbar } from "./navbar/navbar.js";
import { loadProducts } from "./home/produc.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  loadProducts();
});
