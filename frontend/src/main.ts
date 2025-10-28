import { initNavbar } from "./ui/navbar.js";
import { loadProducts } from "./home/produc.js";

document.addEventListener("DOMContentLoaded", async () => {
  initNavbar();
  loadProducts();
});
