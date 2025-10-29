import type { Product } from "../types/product";

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
        `<div
        class="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center text-gray-100 shadow-lg hover:scale-[1.03] hover:border-cyan-400 transition-all duration-300"
      >
        <img
          src="${p.image_url || '/assets/img/IsaacHD.webp'}"
          alt="${p.name}"
          class="mx-auto w-28 h-28 object-cover rounded-xl mb-3 shadow-md group-hover:shadow-cyan-500/20 transition"
        />
        <h3 class="text-lg font-semibold text-white group-hover:text-cyan-300 transition">
          ${p.name}
        </h3>
        <p class="text-sm text-gray-300 mt-1">
          ${p.description ?? 'Sin descripción'}
        </p>
        <div class="mt-3 space-y-1">
          <p class="text-cyan-400 font-bold text-base">$${p.price}</p>
          <p class="text-xs text-gray-400">Stock: ${p.stock ?? 'N/A'}</p>
          <p class="text-xs text-gray-400">Categoría: ${p.category ?? 'General'}</p>
        </div>
        <button
          class="addToCartBtn mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-sm font-medium rounded-lg shadow-md transition-all"
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

      } catch {
        alert("Error de conexión con el servidor");
      }
    });
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}
