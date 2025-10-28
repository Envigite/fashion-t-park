import { guardAdminPage } from "./utils/auth.js";
import { initProducts } from "./admin/products.js";
import { initUsers } from "./admin/users.js";

document.addEventListener("DOMContentLoaded", () => {
  guardAdminPage();
  initProducts();
  initUsers();
});
