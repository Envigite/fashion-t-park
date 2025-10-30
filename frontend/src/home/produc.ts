import type { Product } from "../types/product";
import { updateCartCount } from "../navbar/updateCart.js";

export async function loadProducts(): Promise<void> {
  try {
    const res = await fetch("/api/products", { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener productos");

    const products: Product[] = await res.json();
    const container = document.getElementById("product-list") as HTMLDivElement | null;
    const searchInput = document.getElementById("barra-busqueda") as HTMLInputElement | null;
    if (!container) return;

    const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    function render(list: Product[]) {
      if (!container) return;

      if (!list.length) {
        container.innerHTML = `<p class="text-center text-gray-300 mt-10">No se encontraron productos.</p>`;
        return;
      }

    container.innerHTML = list
      .map(
        (p) => 
        `<div class="group cursor-pointer bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl border border-slate-200 hover:border-indigo-300 transition-all duration-300" data-id="${p.id}">
          <img
            src="${p.image_url || '/assets/img/IsaacHD.webp'}"
            alt="${p.name}"
            class="mx-auto w-32 h-32 object-cover rounded-xl mb-4 ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all"linear
          />
          <h3 class="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            ${p.name}
          </h3>
          <p class="text-sm text-slate-500 mt-2 line-clamp-2">
            ${p.description ?? 'Sin descripción'}
          </p>
          <div class="mt-4 space-y-1.5">
            <p class="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">$${p.price}</p>
            <p class="text-xs text-slate-400">Stock: ${p.stock ?? 'N/A'}</p>
            <p class="text-xs text-slate-400">Categoría: ${p.category ?? 'General'}</p>
          </div>
          <button
            class="addToCartBtn mt-5 w-full px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            data-id="${p.id}"
          >
            Agregar al carrito
          </button>
        </div>`
      )
      .join("");
    }
    render(products);

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const term = normalize((e.target as HTMLInputElement).value.trim());
        if (term === "") {
          render(products);
          return;
        }

        const filtered = products.filter((p) => {
          const name = normalize(p.name);
          const desc = normalize(p.description ?? "");
          const category = normalize(p.category ?? "");
          return (
            name.includes(term) ||
            desc.includes(term) ||
            category.includes(term)
          );
        });

        render(filtered);
      });
    }

      container.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      if (!target.matches(".addToCartBtn")) return;

      const productId = target.getAttribute("data-id");
      if (!productId) return;

      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ product_id: productId, quantity: 1 }),
        });

        if (res.status === 401 || res.status === 403) {
          window.location.href = "/login";
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error ?? "No se pudo agregar al carrito");
          return;
        }

        target.textContent = "Agregado ✓";
        target.classList.replace("bg-cyan-600", "bg-green-600");
        setTimeout(() => {
          target.textContent = "Agregar al carrito";
          target.classList.replace("bg-green-600", "bg-cyan-600");
        }, 1000);

        updateCartCount();

      } catch {
        alert("Error de conexión con el servidor");
      }
    });

    container.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest("[data-id]") as HTMLElement | null;
    if (card && !target.classList.contains("addToCartBtn")) {
      const productId = card.getAttribute("data-id");
      window.location.href = `/product?id=${productId}`;
      }
    });

  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}
