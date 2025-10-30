export function initCart(): void {
  const cartContainer = document.getElementById("cartContainer") as HTMLElement | null;
  const totalElement = document.getElementById("total") as HTMLParagraphElement | null;
  const payBtn = document.getElementById("payBtn") as HTMLButtonElement | null;

  if (!cartContainer) return;

  // Cargar el carrito
  async function loadCart() {
    if (!cartContainer || !totalElement) return;
    console.log("Cargando carrito…");
    const res = await fetch("/api/cart", { credentials: "include" });

    if (!res.ok) {
      cartContainer.innerHTML = "<p>No hay sesión activa.</p>";
      totalElement.textContent = "";
      if (payBtn) payBtn.disabled = true;
      return;
    }

    const { items, total } = await res.json();

    if (!items.length) {
      cartContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
      totalElement.textContent = "";
      return;
    }

    cartContainer.innerHTML = items
      .map(
        (item: any) =>
      `<div class="flex justify-between items-center bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
        <div>
          <p class="font-medium text-slate-800">${item.name}</p>
          <p class="text-sm text-slate-500">$${item.price} × ${item.quantity}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="qtyBtn bg-slate-100 hover:bg-indigo-100 border border-slate-300 px-2 rounded transition" data-id="${item.product_id}" data-action="minus">−</button>
          <span class="font-semibold text-slate-700">${item.quantity}</span>
          <button class="qtyBtn bg-slate-100 hover:bg-indigo-100 border border-slate-300 px-2 rounded transition" data-id="${item.product_id}" data-action="plus">+</button>
          <button class="deleteBtn bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-3 py-1 rounded-full shadow transition" data-id="${item.product_id}">
            Eliminar
          </button>
        </div>
      </div>`
      )
      .join("");

    totalElement.textContent = `Total: $${total.toLocaleString("es-CL")}`;
  }

  // Manejar clics del div
  cartContainer.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const productId = target.getAttribute("data-id");
    if (!productId) return;

    // Eliminar producto
    if (target.classList.contains("deleteBtn")) {
      await fetch(`/api/cart/${productId}`, { method: "DELETE", credentials: "include" });
      await loadCart();
      return;
    }

    // Cambiar cantidad (+ o -)
    const action = target.getAttribute("data-action");
    if (action) {
      const parent = target.closest("div")!;
      const qty = parseInt(parent.querySelector("span")!.textContent || "1");
      const newQty = action === "plus" ? qty + 1 : qty - 1;
      if (newQty < 1) return;

      await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product_id: productId, quantity: newQty }),
      });

      await loadCart();
    }
  });

  loadCart();
}
