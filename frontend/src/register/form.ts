export function initRegisterForm(): void {
  const form = document.getElementById("registerForm") as HTMLFormElement | null;
  const result = document.getElementById("result") as HTMLParagraphElement | null;
  const usernameInput = document.getElementById("username") as HTMLInputElement | null;
  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;
  if (!form || !result || !usernameInput || !emailInput || !passwordInput) return;

  const blockSpace = (input: HTMLInputElement) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === " ") e.preventDefault();
    });
  };
  [usernameInput, emailInput, passwordInput].forEach(blockSpace);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = (usernameInput).value
    const email = (emailInput).value
    const password = passwordInput.value;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
        data?.details?.[0]?.message ??
        data?.error ??
        data?.message ??
        "Datos inválidos";

        result.textContent = msg;
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