export function initLoginForm(): void {
  const form = document.getElementById("loginForm") as HTMLFormElement | null;
  const result = document.getElementById("result") as HTMLParagraphElement | null;
  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  if (!form || !result || !passwordInput || !emailInput) return;

  const blockSpace = (input: HTMLInputElement) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === " ") e.preventDefault();
    });
  }

  [emailInput, passwordInput].forEach(blockSpace);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value
    const password = passwordInput.value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        result.textContent = data.error || data.message || "Credenciales inválidas";
        result.className = "text-red-400 text-center";
        return;
      }

      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      window.location.href = "/";
    } catch {
      result.textContent = "Error de conexión.";
      result.className = "text-red-400 text-center";
    }
  });
}
