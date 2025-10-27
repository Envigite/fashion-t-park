import { Product } from "./types/product";

document.addEventListener("DOMContentLoaded", async () => {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const isLogged = Boolean(username);

  const btnCarrito = document.getElementById("btnCarrito") as HTMLButtonElement | null;
  const btnInicio = document.getElementById("btnInicio") as HTMLButtonElement | null;
  const btnLogout = document.getElementById("btnLogout") as HTMLButtonElement | null;
  const btnUsuario = document.getElementById("btnUsuario") as HTMLButtonElement | null;
  const btnRegister = document.getElementById("btnRegister") as HTMLButtonElement | null;
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
      // Aquí irá el perfil de usuario
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
      window.location.href = "/";
    });
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/products", { credentials: "include" });
      if (!res.ok) throw new Error("Error al cargar productos");

      const products: Product[] = await res.json();
      const container = document.getElementById("product-list") as HTMLDivElement | null;
      if (!container) return;

      container.innerHTML = products
        .map(
          (p) => `
          <div class="border border-gray-600 rounded-lg p-4 text-center bg-gray-800 text-white">
            <img src="${p.image_url || "/assets/img/logoFP.png"}" alt="${p.name}" class="mx-auto w-24 h-24 object-cover rounded-md mb-2"/>
            <h3 class="text-lg font-semibold">${p.name}</h3>
            <p class="text-sm text-gray-300">${p.description ?? "Sin descripción"}</p>
            <p class="mt-2 font-bold text-cyan-400">$${p.price}</p>
            <p class="text-sm text-gray-400">Stock: ${p.stock ?? "N/A"}</p>
            <p class="text-sm text-gray-400">Categoría: ${p.category ?? "General"}</p>
          </div>`
        )
        .join("");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  await loadProducts();
});
