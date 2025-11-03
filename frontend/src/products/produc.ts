import type { Product } from "../types/product";

export async function loadProducts(): Promise<void> {
  try {
    const res = await fetch("/api/products", { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener productos");

    const products: Product[] = await res.json();
    const container = document.getElementById("product-list") as HTMLDivElement | null;
    const searchInput = document.getElementById("barra-busqueda") as HTMLInputElement | null;
    const role = localStorage.getItem("role")
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
          class="group cursor-pointer bg-white rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-xl border border-slate-200 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between"
          data-id="${p.id}"
        >
          <img
            src="${p.image_url || '/assets/img/IsaacHD.webp'}"
            alt="${p.name}"
            class="mx-auto w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl mb-4 ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all"
          />

          <h3 class="text-base sm:text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            ${p.name}
          </h3>

          <p class="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2 line-clamp-2">
            ${p.description ?? "Sin descripción"}
          </p>

          <div class="mt-3 sm:mt-4 space-y-1.5">
            <p class="text-xl sm:text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              $${Math.trunc(p.price).toLocaleString("es-CL")}
            </p>
            <p class="text-[11px] sm:text-xs text-slate-400">Stock: ${p.stock ?? "N/A"}</p>
            <p class="text-[11px] sm:text-xs text-slate-400">Categoría: ${p.category ?? "General"}</p>
          </div>

          <div class="mt-4 sm:mt-5 space-y-2">
            <button
              class="addToCartBtn w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              data-id="${p.id}"
            >
              Agregar al carrito
            </button>

            ${
              role === "admin"
                ? `
              <div class="flex gap-2 justify-center">
                <button
                  class="cursor-pointer editProductBtn px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-lg shadow-sm transition-all"
                  data-id="${p.id}"
                >
                  Editar
                </button>
                <button
                  class="cursor-pointer deleteProductBtn px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg shadow-sm transition-all"
                  data-id="${p.id}"
                >
                  Eliminar
                </button>
              </div>
              `
                : ""
            }
          </div>
        </div>
        `
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
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}
