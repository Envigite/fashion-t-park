export async function updateCartCount() {
  const badge = document.getElementById("cartCount") as HTMLSpanElement | null;
  if (!badge) return;

  try {
    const res = await fetch("/api/cart", { credentials: "include" });
    if (!res.ok) throw new Error("Sin Sesión");

    const data = await res.json();
    const count = data.items?.length ?? 0;

    if (count > 0) {
      badge.textContent = String(count);
      badge.classList.remove("hidden");
    } else {
      badge.textContent = "";
      badge.classList.add("hidden");
    }
  } catch {
    badge.textContent = "";
    badge.classList.add("hidden");
  }
}
