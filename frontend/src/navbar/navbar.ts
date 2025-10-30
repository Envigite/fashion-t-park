import { updateCartCount } from "./updateCart.js";

export async function initNavbar(): Promise<void> {
  const currentPath = window.location.pathname;
  const container = document.getElementById("navbarContainer");
  if (!container) return;

  try {
    const res = await fetch("/components/navbar.html");
    const html = await res.text();
    container.innerHTML = html;
  } catch {
    console.error("No se pudo cargar la barra de navegación.");
    return;
  }

  // 🔹 Elementos del menú móvil
  const btn = document.getElementById("menuToggle") as HTMLButtonElement | null;
  const menu = document.getElementById("mobileMenu") as HTMLElement | null;
  const overlay = document.getElementById("menuOverlay") as HTMLElement | null;

  if (btn && menu && overlay) {
    // Funciones reutilizables
    const openMenu = () => {
      menu.classList.remove("opacity-0", "pointer-events-none", "-translate-y-2");
      menu.classList.add("opacity-100", "translate-y-0");

      overlay.classList.remove("opacity-0", "pointer-events-none");
      overlay.classList.add("opacity-100");

      document.body.style.overflow = "hidden";
      btn.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      menu.classList.remove("opacity-100", "translate-y-0");
      menu.classList.add("opacity-0", "pointer-events-none", "-translate-y-2");

      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0", "pointer-events-none");

      document.body.style.overflow = "";
      btn.setAttribute("aria-expanded", "false");
    };

    // Alternar menú
    btn.addEventListener("click", () => {
      const isClosed = menu.classList.contains("opacity-0");
      isClosed ? openMenu() : closeMenu();
    });

    // Cerrar al hacer clic en el overlay
    overlay.addEventListener("click", closeMenu);

    // Cerrar al redimensionar a >= sm
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 640) closeMenu();
    });

    // Cerrar al hacer clic en un enlace del menú
    menu.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "A") closeMenu();
    });

    // Cerrar al hacer clic fuera del menú y botón
    document.addEventListener("click", (e) => {
      const target = e.target as Node;
      const isOpen = !menu.classList.contains("pointer-events-none");
      if (!isOpen) return;
      if (!menu.contains(target) && !btn.contains(target)) closeMenu();
    });
  }

  // 🔹 Lógica de autenticación y acciones
  const navbarActions = document.getElementById("navbarActions");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const isLogged = Boolean(username);

  const btnCarrito = document.getElementById("btnCarrito");
  const btnInicio = document.getElementById("btnInicio");
  const btnLogout = document.getElementById("btnLogout");
  const btnUsuario = document.getElementById("btnUsuario");
  const btnRegister = document.getElementById("btnRegister");
  const adminLink = document.getElementById("adminLink");

  updateCartCount();

  if (currentPath === "/carrito" && navbarActions) {
    navbarActions.innerHTML = `
      <a href="/" class="text-sm font-medium px-4 py-2 bg-white border border-slate-300 rounded-full hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 transition-all shadow-sm">
        Seguir comprando
      </a>`;
  }

  if (btnUsuario && username) btnUsuario.textContent = username;

  if (adminLink) {
    adminLink.style.display = role === "admin" ? "block" : "none";
    adminLink.addEventListener("click", () => (window.location.href = "/admin"));
  }

  btnCarrito?.addEventListener("click", () => (window.location.href = "/carrito"));
  btnInicio?.addEventListener("click", () => (window.location.href = "/"));

  btnUsuario?.addEventListener("click", () => {
    if (username) {
      // perfil
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
    btnLogout.addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      localStorage.clear();
      window.location.reload();
    });
  }
}
