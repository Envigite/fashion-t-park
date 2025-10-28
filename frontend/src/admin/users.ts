import { handleExpiredToken } from "../utils/auth.js";
import { User } from "../types/user";

export function initUsers(): void {
  const container = document.getElementById("user-list");
  if (!container) return;
  const list = container as HTMLDivElement;

  async function loadUsers() {
    const res = await fetch("/api/users", { credentials: "include" });
    if (handleExpiredToken(res)) return;
    if (!res.ok) return;

    const users: User[] = await res.json();

    list.innerHTML = users
      .map(
        (u) => `
      <div class="p-2 border-b border-gray-400 flex justify-between items-center">
        <span>${u.username} | ${u.email} | ${u.role}</span>
        <div class="flex gap-2">
          ${
            u.role !== "admin"
              ? `<button class="promote-btn px-2 py-1 bg-blue-600 text-white rounded" data-id="${u.id}">Promover</button>`
              : `<button class="demote-btn px-2 py-1 bg-yellow-600 text-white rounded" data-id="${u.id}">Degradar</button>`
          }
          <button class="delete-btn px-2 py-1 bg-red-600 text-white rounded" data-id="${u.id}">Eliminar</button>
        </div>
      </div>`
      )
      .join("");
    // PROMOVER
    list.querySelectorAll<HTMLButtonElement>(".promote-btn").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const r = await fetch(`/api/users/promote/${id}`, { method: "PUT", credentials: "include" });
        if (handleExpiredToken(r)) return;
        loadUsers();
      })
    );
    // DEGRADAR
    list.querySelectorAll<HTMLButtonElement>(".demote-btn").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const r = await fetch(`/api/users/demote/${id}`, { method: "PUT", credentials: "include" });
        if (handleExpiredToken(r)) return;
        loadUsers();
      })
    );
    // ELIMINAR
    list.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const r = await fetch(`/api/users/${id}`, { method: "DELETE", credentials: "include" });
        if (handleExpiredToken(r)) return;
        loadUsers();
      })
    );
  }

  loadUsers();
}
