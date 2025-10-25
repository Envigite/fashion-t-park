document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm") as HTMLFormElement;
  const resultDiv = document.getElementById("result")!;

  // Si no es admin → sacar
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    window.location.href = "/";
    return;
  }

  // Si el backend responde 401 / 403 → sesión expirada o sin permisos
  function handleExpiredToken(res: Response) {
    if (res.status === 401 || res.status === 403) {
      localStorage.clear();
      window.location.href = "/";
      return true;
    }
    return false;
  }

  // ---------- CREAR PRODUCTO ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLTextAreaElement).value;
    const price = parseFloat((document.getElementById("price") as HTMLInputElement).value);
    const stock = parseInt((document.getElementById("stock") as HTMLInputElement).value);
    const category = (document.getElementById("category") as HTMLTextAreaElement).value;
    const image_url = (document.getElementById("image_url") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ← cookie de sesión va aquí
        body: JSON.stringify({ name, description, price, stock, category, image_url }),
      });

      if (handleExpiredToken(res)) return;

      if (!res.ok) {
        const errorText = await res.text();
        resultDiv.textContent = `❌ Error: ${errorText}`;
        resultDiv.className = "mt-4 text-center text-sm text-red-600";
        return;
      }

      const data = await res.json();
      resultDiv.textContent = `✅ Producto creado: ${data.name} ($${data.price})`;
      resultDiv.className = "mt-4 text-center text-sm text-green-600";
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      resultDiv.textContent = "❌ Error de conexión con el servidor.";
      resultDiv.className = "mt-4 text-center text-sm text-red-600";
    }
  });

  // ---------- LISTAR USUARIOS + ACCIONES ----------
  async function loadUsers() {
    const res = await fetch("/api/users", {
      credentials: "include", // ← cookie incluida
    });

    if (handleExpiredToken(res)) return;
    if (!res.ok) return;

    const users = await res.json();
    const container = document.getElementById("user-list");
    if (!container) return;

    container.innerHTML = users
      .map(
        (u: any) => `
        <div class="p-2 border-b border-gray-400 flex justify-between items-center">
          <span>${u.username} | ${u.email} | ${u.role}</span>
          <div class="flex gap-2">

            ${
              u.role !== "admin"
                ? `<button class="promote-btn px-2 py-1 bg-blue-600 text-white rounded" data-id="${u.id}">
                     Promover
                   </button>`
                : `<button class="demote-btn px-2 py-1 bg-yellow-600 text-white rounded" data-id="${u.id}">
                     Degradar
                   </button>`
            }

            <button class="delete-btn px-2 py-1 bg-red-600 text-white rounded" data-id="${u.id}">
              Eliminar
            </button>

          </div>
        </div>`
      )
      .join("");

    // PROMOVER
    container.querySelectorAll(".promote-btn").forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        const id = (e.target as HTMLButtonElement).dataset.id;
        const promoteRes = await fetch(`/api/users/promote/${id}`, {
          method: "PUT",
          credentials: "include",
        });
        if (handleExpiredToken(promoteRes)) return;
        loadUsers();
      })
    );

    // DEGRADAR
    container.querySelectorAll(".demote-btn").forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        const id = (e.target as HTMLButtonElement).dataset.id;
        const demoteRes = await fetch(`/api/users/demote/${id}`, {
          method: "PUT",
          credentials: "include",
        });
        if (handleExpiredToken(demoteRes)) return;
        loadUsers();
      })
    );

    // ELIMINAR
    container.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        const id = (e.target as HTMLButtonElement).dataset.id;
        const deleteRes = await fetch(`/api/users/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (handleExpiredToken(deleteRes)) return;
        loadUsers();
      })
    );
  }

  loadUsers();
});
