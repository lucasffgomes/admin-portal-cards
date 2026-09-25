import { api } from "./api.js";
import { renderCards, setView } from "./cardRenderer.js";
import { modal } from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  let cards = [];
  let editionsData = {};

  let currentFilterGame = "all";
  let currentFilterEdition = "all";

  const applyFilters = () => {
    let filtered = cards;
    if (currentFilterGame !== "all") {
      filtered = filtered.filter((c) => c.game === currentFilterGame);
    }
    if (currentFilterEdition !== "all") {
      filtered = filtered.filter((c) => c.edition_id == currentFilterEdition);
    }
    renderCards(filtered, handleEdit, handleDelete);
  };

  const loadGames = async () => {
    const data = await api.getGames();
    if (data && data.success) {
      const tabsContainer = document.getElementById("gameFilterTabs");
      const formSelect = document.getElementById("game");

      tabsContainer.innerHTML =
        '<button class="btn btn-secondary active" data-game="all">Todos os Jogos</button>';
      formSelect.innerHTML = '<option value="">Selecione o Jogo...</option>';

      data.data.forEach((g) => {
        // Aba de filtro
        const btn = document.createElement("button");
        btn.className = "btn btn-secondary";
        btn.dataset.game = g.id;
        btn.textContent = g.name;
        tabsContainer.appendChild(btn);

        // Option do Modal
        const option = document.createElement("option");
        option.value = g.id;
        option.textContent = g.name;
        formSelect.appendChild(option);
      });

      // Recria eventos das abas
      setupGameTabs();
    }
  };

  const loadCards = async () => {
    const data = await api.getCards();
    if (data && data.success) {
      cards = data.data;
      applyFilters();
    }
  };

  // Escuta a mudança de Jogo para popular as Edições dinamicamente
  document.getElementById("game").addEventListener("change", async (e) => {
    const gameKey = e.target.value;
    const editionSelect = document.getElementById("edition_id");

    editionSelect.innerHTML = '<option value="">Selecione a Edição...</option>';
    editionSelect.disabled = true;

    if (gameKey) {
      editionSelect.innerHTML =
        '<option value="">Carregando edições...</option>';

      await new Promise((resolve) => setTimeout(resolve, 500));

      const data = await api.getEditions(gameKey);

      editionSelect.innerHTML =
        '<option value="">Selecione a Edição...</option>';
      if (data && data.success) {
        editionSelect.disabled = false;
        data.data.forEach((ed) => {
          const option = document.createElement("option");
          option.value = ed.id;
          option.textContent = ed.name;
          editionSelect.appendChild(option);
        });

        // Se estiver em modo de edição, tenta restaurar o valor original guardado temporariamente no dataset
        if (editionSelect.dataset.preselect) {
          editionSelect.value = editionSelect.dataset.preselect;
          delete editionSelect.dataset.preselect;
        }
      }
    }
  });

  const handleEdit = (id) => {
    const card = cards.find((c) => c.id == id);
    if (card) modal.open(true, card);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza absoluta que deseja excluir esta carta?")) return;
    try {
      const data = await api.deleteCard(id);
      if (data.success) {
        loadCards();
      } else {
        alert(data.message || "Erro ao excluir.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de comunicação com a API.");
    }
  };

  document
    .getElementById("newCardBtn")
    .addEventListener("click", () => modal.open(false));
  document
    .getElementById("viewGridBtn")
    .addEventListener("click", () => setView("grid"));
  document
    .getElementById("viewListBtn")
    .addEventListener("click", () => setView("list"));
  document.getElementById("logoutBtn").addEventListener("click", api.logout);

  // Lógica de Filtros
  const editionFilterContainer = document.getElementById(
    "editionFilterContainer",
  );
  const editionFilter = document.getElementById("editionFilter");

  const setupGameTabs = () => {
    const gameTabs = document.querySelectorAll("#gameFilterTabs button");
    gameTabs.forEach((tab) => {
      tab.addEventListener("click", async (e) => {
        // Atualiza UI das abas
        gameTabs.forEach((t) => t.classList.remove("active"));
        e.target.classList.add("active");

        currentFilterGame = e.target.dataset.game;
        currentFilterEdition = "all";

        if (currentFilterGame === "all") {
          editionFilterContainer.style.display = "none";
        } else {
          editionFilterContainer.style.display = "flex";
          editionFilter.innerHTML =
            '<option value="all">Carregando edições...</option>';
          editionFilter.disabled = true;

          const data = await api.getEditions(currentFilterGame);

          editionFilter.innerHTML =
            '<option value="all">Todas as Edições</option>';
          if (data && data.success) {
            editionFilter.disabled = false;
            data.data.forEach((ed) => {
              const option = document.createElement("option");
              option.value = ed.id;
              option.textContent = ed.name;
              editionFilter.appendChild(option);
            });
          }
        }

        applyFilters();
      });
    });
  };

  editionFilter.addEventListener("change", (e) => {
    currentFilterEdition = e.target.value;
    applyFilters();
  });

  modal.setupCloseEvents("closeModalBtn");

  document.getElementById("cardForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const saveBtn = document.getElementById("saveCardBtn");
    const originalText = saveBtn.innerText;

    saveBtn.innerText = "Salvando...";
    saveBtn.disabled = true;

    const formData = new FormData(form);
    const id = formData.get("id");

    // Evita envio de imagem vazia na edição
    if (!formData.get("image").name) {
      formData.delete("image");
    }

    try {
      const data = await api.saveCard(formData, !!id);
      if (data.success) {
        modal.close();
        loadCards();
      } else {
        let errorMsg = data.message;
        if (data.data) errorMsg += "\n" + JSON.stringify(data.data, null, 2);
        alert(errorMsg);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar a carta.");
    } finally {
      saveBtn.innerText = originalText;
      saveBtn.disabled = false;
    }
  });

  // App Initialization
  loadGames();
  loadCards();
});
