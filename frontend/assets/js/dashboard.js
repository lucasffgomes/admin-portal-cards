document.addEventListener("DOMContentLoaded", () => {
  const cardsGrid = document.getElementById("cardsGrid");
  const cardModal = document.getElementById("cardModal");
  const newCardBtn = document.getElementById("newCardBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const cardForm = document.getElementById("cardForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const modalTitle = document.getElementById("modalTitle");

  let cards = [];

  // Busca e renderiza as cartas
  const fetchCards = async () => {
    try {
      const res = await fetch("/api/cards");
      if (res.status === 401) {
        window.location.href = "/frontend/index.html";
        return;
      }
      const data = await res.json();
      if (data.success) {
        cards = data.data;
        renderCards(cards);
      }
    } catch (error) {
      console.error("Erro ao carregar cartas:", error);
    }
  };

  const viewGridBtn = document.getElementById("viewGridBtn");
  const viewListBtn = document.getElementById("viewListBtn");

  // Trocar visualização
  const setView = (mode) => {
    if (mode === "grid") {
      cardsGrid.className = "cards-grid";
      viewGridBtn.style.background = "rgba(99, 102, 241, 0.4)";
      viewGridBtn.style.border = "1px solid var(--primary)";
      viewListBtn.style.background = "rgba(255, 255, 255, 0.1)";
      viewListBtn.style.border = "none";
    } else {
      cardsGrid.className = "cards-list";
      viewListBtn.style.background = "rgba(99, 102, 241, 0.4)";
      viewListBtn.style.border = "1px solid var(--primary)";
      viewGridBtn.style.background = "rgba(255, 255, 255, 0.1)";
      viewGridBtn.style.border = "none";
    }
  };

  viewGridBtn.addEventListener("click", () => setView("grid"));
  viewListBtn.addEventListener("click", () => setView("list"));

  const renderCards = (cardsToRender) => {
    cardsGrid.innerHTML = "";

    if (cardsToRender.length === 0) {
      cardsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); margin-top: 2rem;">Nenhuma carta cadastrada no banco ainda.</p>`;
      return;
    }

    cardsToRender.forEach((card) => {
      const cardEl = document.createElement("div");
      cardEl.className = "card-item";

      const imageUrl = card.image_url
        ? card.image_url
        : "https://via.placeholder.com/300x400?text=Sem+Imagem";

      // Trata as datas caso existam
      const createdDate = card.created_at
        ? new Date(card.created_at).toLocaleString("pt-BR")
        : "--";
      const updatedDate = card.updated_at
        ? new Date(card.updated_at).toLocaleString("pt-BR")
        : "--";

      cardEl.innerHTML = `
        <div class="card-image-container">
          <img src="${imageUrl}" alt="${card.name_en}" onerror="this.src='https://via.placeholder.com/300x400?text=Erro+na+Imagem'" />
        </div>
        <div class="card-content">
          <div class="card-details">
            <h3 class="card-title">${card.name_en}</h3>
            ${card.name_pt ? `<p style="font-size:0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">${card.name_pt}</p>` : ""}
            <div class="card-meta">
              <span class="tag ${card.game}">${card.game}</span>
              <span class="tag edition">${card.edition_id}</span>
              ${card.rarity ? `<span class="tag" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color);">${card.rarity}</span>` : ""}
            </div>
            <div class="card-timestamps">
              <strong>Criado:</strong> ${createdDate}<br>
              <strong>Atualizado:</strong> ${updatedDate}
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-secondary" onclick="editCard(${card.id})">Editar</button>
            <button class="btn-danger" onclick="deleteCard(${card.id})">Excluir</button>
          </div>
        </div>
      `;
      cardsGrid.appendChild(cardEl);
    });
  };

  // Funções do Modal
  const openModal = (isEdit = false, card = null) => {
    cardForm.reset();
    document.getElementById("cardId").value = "";
    modalTitle.innerText = isEdit ? "Editar Carta" : "Nova Carta";

    // Na criação a imagem é obrigatória, na edição não
    const imageInput = document.getElementById("image");
    if (isEdit) {
      imageInput.removeAttribute("required");
    } else {
      imageInput.setAttribute("required", "required");
    }

    if (card) {
      document.getElementById("cardId").value = card.id;
      document.getElementById("name_en").value = card.name_en;
      document.getElementById("name_pt").value = card.name_pt || "";
      document.getElementById("game").value = card.game;
      document.getElementById("edition_id").value = card.edition_id;
      document.getElementById("rarity").value = card.rarity || "";
    }

    cardModal.classList.add("active");
  };

  const closeModal = () => {
    cardModal.classList.remove("active");
  };

  newCardBtn.addEventListener("click", () => openModal(false));
  closeModalBtn.addEventListener("click", closeModal);

  // Fecha clicando fora
  cardModal.addEventListener("click", (e) => {
    if (e.target === cardModal) closeModal();
  });

  // Salvar Carta (Create / Update)
  cardForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById("saveCardBtn");
    const originalText = saveBtn.innerText;
    saveBtn.innerText = "Salvando...";
    saveBtn.disabled = true;

    const formData = new FormData(cardForm);
    const id = formData.get("id");

    // Se for edição e não enviou imagem nova, removemos para o backend não alterar e não dar erro
    if (!formData.get("image").name) {
      formData.delete("image");
    }

    let url = "/api/cards";
    let method = "POST";

    if (id) {
      // Como o PHP puro não lida bem com PUT contendo multipart/form-data,
      // usamos o hack arquitetural de mandar via POST e injetar o campo _method=PUT
      formData.append("_method", "PUT");
    }

    try {
      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        closeModal();
        fetchCards();
      } else {
        // Exibe os erros vindos da API
        let errorMsg = data.message;
        if (data.data) {
          errorMsg += "\n" + JSON.stringify(data.data, null, 2);
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de comunicação com o servidor.");
    } finally {
      saveBtn.innerText = originalText;
      saveBtn.disabled = false;
    }
  });

  // Funções Globais expostas pro onclick inline do HTML
  window.editCard = (id) => {
    const card = cards.find((c) => c.id == id);
    if (card) openModal(true, card);
  };

  window.deleteCard = async (id) => {
    if (!confirm("Tem certeza absoluta que deseja excluir esta carta?")) return;

    try {
      const res = await fetch(`/api/cards?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchCards();
      } else {
        alert(data.message || "Erro ao excluir.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de comunicação com o servidor.");
    }
  };

  // Logout
  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/frontend/index.html";
  });

  // Start
  fetchCards();
});
