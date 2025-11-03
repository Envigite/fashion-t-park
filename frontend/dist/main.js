import { initNavbar } from "./navbar/navbar.js";
import { loadProducts } from "./products/produc.js";
import { setupProductEvents } from "./products/productEvents.js";
document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();
    await loadProducts();
    setupProductEvents();
});
//# sourceMappingURL=main.js.map