import type { Product } from "../types/product";

export async function loadProducts(): Promise<void> {
  try {
    const res = await fetch("/api/products", { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener productos");

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
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}
