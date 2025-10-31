import { initNavbar } from "../navbar/navbar.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initNavbar();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    alert("ID de producto no válido");
    window.location.href = "/";
    return;
  }

  const form = document.getElementById("editForm") as HTMLFormElement;
  const inputs = {
    name: document.getElementById("name") as HTMLInputElement,
    description: document.getElementById("description") as HTMLTextAreaElement,
    price: document.getElementById("price") as HTMLInputElement,
    stock: document.getElementById("stock") as HTMLInputElement,
    category: document.getElementById("category") as HTMLInputElement,
    image_url: document.getElementById("image_url") as HTMLInputElement,
  };

  try {
    const res = await fetch(`/api/products/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("No se pudo cargar el producto");

    const product = await res.json();
    Object.entries(inputs).forEach(([key, el]) => {
      (el as HTMLInputElement).value = product[key] ?? "";
    });
  } catch {
    alert("Error al cargar el producto");
    window.location.href = "/";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: inputs.name.value.trim(),
      description: inputs.description.value.trim(),
      price: parseFloat(inputs.price.value),
      stock: parseInt(inputs.stock.value) || 0,
      category: inputs.category.value.trim(),
      image_url: inputs.image_url.value.trim(),
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const info = await res.json().catch(() => ({}));
        alert(info.error ?? "Error al actualizar");
        return;
      }

      alert("Producto actualizado correctamente");
      window.location.href = "/";
    } catch {
      alert("Error de conexión con el servidor");
    }
  });
});
