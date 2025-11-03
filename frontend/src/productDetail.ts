import type { Product } from "./types/product.js";
import { updateCartCount } from "./navbar/updateCart.js";
import { initNavbar } from "./navbar/navbar.js";

async function loadProductDetail() {
  await initNavbar();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("productDetail") as HTMLElement | null;

  if (!id || !container) {
    if (container)
      container.innerHTML = "<p class='text-center mt-10 text-slate-500'>Producto no encontrado.</p>";
    return;
  }

  try {
    const res = await fetch(`/api/products/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener el producto");
    const product: Product = await res.json();

    const image = product.image_url || "/assets/img/IsaacHD.webp";
    const stock = product.stock ?? "N/A";
    const category = product.category ?? "General";
    const description = product.description ?? "Sin descripción disponible.";

    container.innerHTML = `
    <section class="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-10 flex flex-col md:flex-row gap-8 transition-all">
      <!-- Imagen -->
      <img
        src="${image}"
        alt="${product.name}"
        class="w-full md:w-80 h-80 object-cover rounded-2xl mx-auto ring-2 ring-slate-100 shadow-md hover:ring-indigo-200 transition-all"
      />

      <!-- Detalle -->
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ${product.name}
          </h1>
          <p class="text-slate-600 text-sm sm:text-base mb-4">${description}</p>
          <p class="text-2xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            $${Math.trunc(product.price).toLocaleString("es-CL")}
          </p>
          <div class="text-sm text-slate-500 space-y-1">
            <p><span class="font-semibold">Categoría:</span> ${category}</p>
            <p><span class="font-semibold">Stock:</span> ${stock}</p>
          </div>
        </div>

        <button
          class="addToCartBtn mt-6 w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
          data-id="${product.id}"
        >
          Agregar al carrito
        </button>
      </div>
    </section>

    <!-- Reseñas -->
    <section id="reviews" class="mt-12 bg-white/70 backdrop-blur-lg border border-slate-200 rounded-2xl p-6 shadow-md">
      <h2 class="text-xl font-semibold text-indigo-700 mb-4">Reseñas</h2>
      <p class="text-slate-600 text-sm mb-4">Aquí se mostrarán las reseñas de los clientes (en desarrollo).</p>
      <p class="text-slate-500 text-sm">⭐ Próximamente podrás dejar tu opinión sobre este producto.</p>
    </section>

    <!-- Productos relacionados -->
    <section id="relatedProducts" class="mt-12">
      <h2 class="text-xl font-semibold text-indigo-700 mb-6">Productos relacionados</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="relatedGrid">
        <p class="text-slate-400 text-sm col-span-full text-center">Cargando sugerencias...</p>
      </div>
    </section>
    `;

    // Evento "Agregar al carrito"
    const addBtn = container.querySelector(".addToCartBtn") as HTMLButtonElement | null;
    addBtn?.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ product_id: product.id, quantity: 1 }),
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) return (window.location.href = "/login");
          const data = await res.json().catch(() => ({}));
          alert(data.error ?? "No se pudo agregar al carrito");
          return;
        }

        updateCartCount();
        addBtn.textContent = "Agregado ✓";
        setTimeout(() => (addBtn.textContent = "Agregar al carrito"), 1000);
      } catch {
        alert("Error de conexión con el servidor");
      }
    });

  } catch {
    container.innerHTML = "<p class='text-center mt-10 text-red-400'>Error al cargar el producto.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProductDetail);
