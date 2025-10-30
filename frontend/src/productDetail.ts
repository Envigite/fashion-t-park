import type { Product } from "./types/product.js";

async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("productDetail") as HTMLElement;
  if (!id || !container) {
    container.innerHTML = "<p class='text-center mt-10'>Producto no encontrado.</p>";
    return;
  }

  try {
    const res = await fetch(`/api/products/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener el producto");
    const product: Product = await res.json();

    container.innerHTML =
    `<div class="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
      <img src="/assets/img/IsaacHD.webp"
           alt="Producto"
           class="w-72 h-72 object-cover rounded-2xl mx-auto md:mx-0 ring-2 ring-slate-100 shadow-md" />

      <div class="flex-1 flex flex-col justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Nombre del producto</h1>
          <p class="text-slate-600 mb-3">Descripción del producto o texto placeholder que se reemplazará dinámicamente al cargar los datos.</p>
          <p class="text-2xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">Precio: $0.00</p>
          <p class="text-sm text-slate-500 mb-2">Categoría: General</p>
          <p class="text-sm text-slate-500 mb-4">Stock: N/A</p>
        </div>

        <button class="addToCartBtn w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all" data-id="0">
          Agregar al carrito
        </button>
      </div>
    </div>
    <section id="reviews" class="mt-12 bg-white/70 backdrop-blur-lg border border-slate-200 rounded-2xl p-6 shadow-md">
      <h2 class="text-xl font-semibold text-indigo-700 mb-4">Reseñas</h2>
      <p class="text-slate-600 text-sm mb-4">Aquí se mostrarán las reseñas de los clientes (en desarrollo).</p>
      <div class="space-y-3">
        <p class="text-slate-500 text-sm">⭐ Próximamente podrás dejar tu opinión sobre este producto.</p>
      </div>
    </section>

    <!-- Productos relacionados -->
    <section id="relatedProducts" class="mt-12">
      <h2 class="text-xl font-semibold text-indigo-700 mb-6">Productos relacionados</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white/80 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-center">
          <img src="/assets/img/logoFP.png" alt="Relacionado" class="w-28 h-28 mx-auto object-cover rounded-lg mb-3">
          <p class="font-semibold text-slate-700">Producto ejemplo</p>
          <p class="text-sm text-slate-500">$15.990</p>
        </div>
      </div>
    </section>`;
  } catch {
    container.innerHTML = "<p class='text-center mt-10 text-red-400'>Error al cargar el producto.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProductDetail);
