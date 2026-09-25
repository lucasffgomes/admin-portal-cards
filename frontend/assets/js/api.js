export const api = {
  async getCards() {
    const res = await fetch("/api/cards");
    if (res.status === 401) {
      window.location.href = "/frontend/index.html";
      return null;
    }
    return await res.json();
  },

  async getGames() {
    const res = await fetch("/api/games");
    if (!res.ok) return null;
    return await res.json();
  },

  async getEditions(game) {
    const url = game ? `/api/editions?game=${game}` : "/api/editions";
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  },

  async saveCard(formData, isEdit) {
    let url = "/api/cards";
    if (isEdit) {
      formData.append("_method", "PUT");
    }
    const res = await fetch(url, { method: "POST", body: formData });
    return await res.json();
  },

  async deleteCard(id) {
    const res = await fetch(`/api/cards?id=${id}`, { method: "DELETE" });
    return await res.json();
  },

  async logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/frontend/index.html";
  },
};
