import { initRegisterForm } from "./register/form.js";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("role")) {
    window.location.href = "/";
    return;
  }
  initRegisterForm();
});
