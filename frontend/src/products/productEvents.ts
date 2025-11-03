import { loadProducts } from "./produc.js";
import { updateCartCount } from "../navbar/updateCart.js";

export async function setupProductEvents() {
    
const container = document.getElementById("product-list") as HTMLDivElement | null;
if (!container) return;

container.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const card = target.closest("[data-id]") as HTMLElement | null;
  if (!card) return;

  const addBtn    = target.closest(".addToCartBtn") as HTMLElement | null;
  const editBtn   = target.closest(".editProductBtn") as HTMLElement | null;
  const deleteBtn = target.closest(".deleteProductBtn") as HTMLElement | null;

  // Agregar al carrito
  if (addBtn) {
    e.stopPropagation();
    const productId = addBtn.dataset.id || card.getAttribute("data-id");
    if (!productId) return;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
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
    return;
  }

  // Eliminar producto (admin)
  if (deleteBtn) {
    e.stopPropagation();
    const productId = deleteBtn.dataset.id || card.getAttribute("data-id");
    if (!productId) return;
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Error al eliminar el producto");
        return;
      }

      alert("Producto eliminado correctamente");
      await loadProducts();
    } catch {
      alert("Error de conexión con el servidor");
    }
    return;
  }

  // Editar producto (admin)
  if (editBtn) {
    e.stopPropagation();
    const productId = editBtn.dataset.id || card.getAttribute("data-id");
    if (!productId) return;
    window.location.href = `/admin/edit?id=${productId}`;
    return;
  }

  // Navegar al detalle si fue click en la card fuera de los botones
  const productId = card.getAttribute("data-id");
  if (productId) window.location.href = `/product?id=${productId}`;
});
}