export function initNavbar(): void {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const isLogged = Boolean(username);

  const btnCarrito = document.getElementById("btnCarrito");
  const btnInicio = document.getElementById("btnInicio");
  const btnLogout = document.getElementById("btnLogout");
  const btnUsuario = document.getElementById("btnUsuario");
  const btnRegister = document.getElementById("btnRegister");
  const adminLink = document.getElementById("adminLink");

  if (btnUsuario && username) {
    btnUsuario.textContent = username;
  }

  if (adminLink) {
    adminLink.style.display = role === "admin" ? "block" : "none";
    adminLink.addEventListener("click", () => (window.location.href = "/admin"));
  }

  btnCarrito?.addEventListener("click", () => (window.location.href = "/carrito"));
  btnInicio?.addEventListener("click", () => (window.location.href = "/"));

  btnUsuario?.addEventListener("click", () => {
    if (username) {
      // más adelante → perfil real
    } else {
      window.location.href = "/login";
    }
  });

  if (btnRegister) {
    btnRegister.style.display = isLogged ? "none" : "block";
    btnRegister.addEventListener("click", () => (window.location.href = "/register"));
  }

  if (btnLogout) {
    btnLogout.style.display = isLogged ? "block" : "none";
  }

  btnLogout?.addEventListener("click", async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.clear();
    window.location.reload();
  });
}
