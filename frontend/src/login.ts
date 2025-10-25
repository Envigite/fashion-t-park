document.addEventListener("DOMContentLoaded", () => {
  // Si ya hay sesión → volver al inicio
  const role = localStorage.getItem("role");
  if (role) {
    window.location.href = "/";
    return;
  }

  const form = document.getElementById("loginForm") as HTMLFormElement;
  const result = document.getElementById("result") as HTMLParagraphElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" // ← Envía la cookie con la sesión
      });

      const data = await res.json();

      if (!res.ok) {
        result.textContent = data.error || data.message || "Error al iniciar sesión";
        result.className = "text-red-400 text-center";
        return;
      }

      // Guardar solo información necesaria en el frontend
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      window.location.href = "/";
    } catch {
      result.textContent = "Error de conexión.";
      result.className = "text-red-400 text-center";
    }
  });
});
