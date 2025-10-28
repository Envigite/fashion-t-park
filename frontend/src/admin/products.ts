import { handleExpiredToken } from "../utils/auth.js";

export function initProducts(): void {
  const form = document.getElementById("productForm") as HTMLFormElement | null;
  const resultDiv = document.getElementById("result") as HTMLDivElement | null;
  if (!form || !resultDiv) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement).value.trim();
    const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
    const price = Number((document.getElementById("price") as HTMLInputElement).value);
    const stock = Number((document.getElementById("stock") as HTMLInputElement).value);
    const category = (document.getElementById("category") as HTMLInputElement).value.trim();
    const image_url = (document.getElementById("image_url") as HTMLInputElement).value.trim();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, description, price, stock, category, image_url }),
    });

    if (handleExpiredToken(res)) return;

    if (!res.ok) {
      resultDiv.textContent = `❌ Error: ${await res.text()}`;
      resultDiv.className = "mt-4 text-center text-sm text-red-600";
      return;
    }

    const product = await res.json();
    resultDiv.textContent = `✅ Producto creado: ${product.name} ($${product.price})`;
    resultDiv.className = "mt-4 text-center text-sm text-green-600";
    form.reset();
  });
}
