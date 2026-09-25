const cardModal = document.getElementById("cardModal");
const cardForm = document.getElementById("cardForm");
const modalTitle = document.getElementById("modalTitle");
const imageInput = document.getElementById("image");

export const modal = {
  open(isEdit = false, card = null) {
    cardForm.reset();
    document.getElementById("cardId").value = "";
    modalTitle.innerText = isEdit ? "Editar Carta" : "Nova Carta";

    const previewContainer = document.getElementById("imagePreviewContainer");

    if (isEdit) {
      imageInput.removeAttribute("required");
    } else {
      imageInput.setAttribute("required", "required");
    }

    if (card) {
      document.getElementById("cardId").value = card.id;
      document.getElementById("name_en").value = card.name_en;
      document.getElementById("name_pt").value = card.name_pt || "";

      const gameSelect = document.getElementById("game");
      gameSelect.value = card.game;
      // Guarda a edição atual para ser setada após o carregamento assíncrono
      document.getElementById("edition_id").dataset.preselect = card.edition_id;
      // Dispara o change para o app.js popular as edições dinamicamente
      gameSelect.dispatchEvent(new Event("change"));

      document.getElementById("rarity").value = card.rarity || "";

      if (card.image_url) {
        previewContainer.innerHTML = `<img src="${card.image_url}" alt="Preview" /><div class="image-overlay">📷 Alterar Imagem</div>`;
      } else {
        previewContainer.innerHTML = `<span style="color: var(--text-muted);">Clique para Upload</span><div class="image-overlay">📷 Alterar Imagem</div>`;
      }
    } else {
      // Se for nova carta, limpa as edições
      document.getElementById("game").dispatchEvent(new Event("change"));
      previewContainer.innerHTML = `<span style="color: var(--text-muted);">Clique para Upload</span><div class="image-overlay">📷 Alterar Imagem</div>`;
    }

    cardModal.classList.add("active");
  },

  close() {
    cardModal.classList.remove("active");
  },

  setupCloseEvents(closeBtnId) {
    document
      .getElementById(closeBtnId)
      .addEventListener("click", () => this.close());
    cardModal.addEventListener("click", (e) => {
      if (e.target === cardModal) this.close();
    });

    const previewContainer = document.getElementById("imagePreviewContainer");

    // Aciona o input oculto ao clicar no container da imagem
    previewContainer.addEventListener("click", () => {
      imageInput.click();
    });

    // Preview local quando o usuário escolhe um arquivo
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          previewContainer.innerHTML = `<img src="${evt.target.result}" alt="Preview Local" /><div class="image-overlay">📷 Alterar Imagem</div>`;
        };
        reader.readAsDataURL(file);
      }
    });
  },
};
