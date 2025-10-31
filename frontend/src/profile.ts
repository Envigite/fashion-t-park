import { updateCartCount } from "./navbar/updateCart.js";

document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  const emailInput = document.getElementById("email") as HTMLInputElement;
  const usernameInput = document.getElementById("username") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const confirmPassword = document.getElementById("confirmPassword") as HTMLInputElement;
  const confirmGroup = document.getElementById("confirmPasswordGroup") as HTMLElement;
  const usernameLabel = document.getElementById("usernameLabel") as HTMLLabelElement;
  const passwordLabel = document.getElementById("passwordLabel") as HTMLLabelElement;
  const editUsernameBtn = document.getElementById("editUsernameBtn") as HTMLButtonElement;
  const editPasswordBtn = document.getElementById("editPasswordBtn") as HTMLButtonElement;
  const backHomeBtn = document.getElementById("backHomeBtn") as HTMLButtonElement;
  const form = document.getElementById("profileForm") as HTMLFormElement;
  const result = document.getElementById("result") as HTMLParagraphElement;

  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) throw new Error("No autenticado");
    const user = await res.json();

    emailInput.value = user.email;
    usernameInput.value = user.username;
    passwordInput.value = "********";
  } catch {
    window.location.href = "/login";
    return;
  }

  editUsernameBtn.addEventListener("click", () => {
    const isEditing = !usernameInput.readOnly;
    if (isEditing) {
      usernameInput.value = localStorage.getItem("username") || "";
      usernameInput.readOnly = true;
      usernameInput.classList.add("bg-slate-100", "cursor-not-allowed");
      usernameLabel.textContent = "Nombre de usuario";
    } else {
      usernameInput.readOnly = false;
      usernameInput.classList.remove("bg-slate-100", "cursor-not-allowed");
      usernameLabel.textContent = "Nuevo nombre de usuario";
    }
  });

  // --- Editar contraseña ---
  editPasswordBtn.addEventListener("click", () => {
    const isEditing = !passwordInput.readOnly;
    if (isEditing) {
      passwordInput.readOnly = true;
      passwordInput.type = "password";
      passwordInput.value = "********";
      passwordInput.classList.add("bg-slate-100", "cursor-not-allowed");
      passwordLabel.textContent = "Contraseña";
      confirmGroup.classList.add("hidden");
      confirmPassword.value = "";
    } else {
      passwordInput.readOnly = false;
      passwordInput.type = "password";
      passwordInput.value = "";
      passwordInput.classList.remove("bg-slate-100", "cursor-not-allowed");
      passwordLabel.textContent = "Nueva contraseña";
      confirmGroup.classList.remove("hidden");
    }
  });

  backHomeBtn.addEventListener("click", () => {
    window.location.href = "/";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    result.textContent = "";

    const body: Record<string, string> = {};

    const newUsername = usernameInput.readOnly ? null : usernameInput.value.trim();
    const newPassword = passwordInput.readOnly ? null : passwordInput.value.trim();
    const confirm = confirmPassword.value.trim();

    if (newPassword && newPassword !== confirm) {
      result.textContent = "Las contraseñas no coinciden";
      result.className = "text-red-400 text-center";
      return;
    }

    if (!newUsername && !newPassword) {
      result.textContent = "No hay cambios para guardar";
      result.className = "text-slate-500 text-center";
      return;
    }

    if (newUsername) body.username = newUsername;
    if (newPassword) body.password = newPassword;

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg =
          data?.details?.[0]?.message ?? data?.error ?? data?.message ?? "Error al actualizar perfil";
        result.textContent = msg;
        result.className = "text-red-400 text-center";
        return;
      }

      if (newUsername) localStorage.setItem("username", newUsername);
      result.textContent = "Perfil actualizado correctamente";
      result.className = "text-green-500 text-center";

      setTimeout(() => (window.location.href = "/"), 1500);
    } catch {
      result.textContent = "Error de conexión con el servidor";
      result.className = "text-red-400 text-center";
    }
  });
});
