const cardsGrid = document.getElementById("cardsGrid");
const viewGridBtn = document.getElementById("viewGridBtn");
const viewListBtn = document.getElementById("viewListBtn");

export const setView = (mode) => {
  if (mode === "grid") {
    cardsGrid.className = "cards-grid";
    viewGridBtn.classList.add("active");
    viewListBtn.classList.remove("active");
  } else {
    cardsGrid.className = "cards-list";
    viewListBtn.classList.add("active");
    viewGridBtn.classList.remove("active");
  }
};

export const renderCards = (cardsToRender, onEdit, onDelete) => {
  cardsGrid.innerHTML = "";

  if (cardsToRender.length === 0) {
    cardsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); margin-top: 2rem;">Nenhuma carta cadastrada no banco ainda.</p>`;
    return;
  }

  cardsToRender.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card-item";

    const imageHtml = card.image_url
      ? `<img src="${card.image_url}" alt="${card.name_en}" onerror="this.style.display='none'" />`
      : `<span style="color: var(--text-muted); font-size: 0.9rem;">Sem Imagem</span>`;

    const createdDate = card.created_at
      ? new Date(card.created_at).toLocaleString("pt-BR")
      : "--";
    const updatedDate = card.updated_at
      ? new Date(card.updated_at).toLocaleString("pt-BR")
      : "--";

    cardEl.innerHTML = `
      <div class="card-image-container">
        ${imageHtml}
      </div>
      <div class="card-content">
        <div class="card-details">
          <h3 class="card-title">${card.name_en}</h3>
          ${card.name_pt ? `<p class="card-subtitle">${card.name_pt}</p>` : ""}
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
          <button class="btn btn-secondary edit-btn">Editar</button>
          <button class="btn btn-danger delete-btn">Excluir</button>
        </div>
      </div>
    `;

    cardEl
      .querySelector(".edit-btn")
      .addEventListener("click", () => onEdit(card.id));
    cardEl
      .querySelector(".delete-btn")
      .addEventListener("click", () => onDelete(card.id));

    cardsGrid.appendChild(cardEl);
  });
};
