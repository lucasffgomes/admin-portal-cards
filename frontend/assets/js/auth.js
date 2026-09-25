document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      // Evita o comportamento padrão do HTML (recarregar a página e jogar na URL)
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      // UI Feedback
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = "Autenticando...";
      submitBtn.disabled = true;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Login com sucesso, vai pro dashboard
          window.location.href = "/frontend/dashboard.html";
        } else {
          // Erro de credenciais (401)
          alert(data.message || "Credenciais inválidas.");
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
        }
      } catch (error) {
        console.error("Erro de requisição:", error);
        alert("Erro de comunicação com o servidor.");
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
