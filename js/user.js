/* ─── Panel IDs ─────────────────────────────────────────── */
const PANELS = {
  personal_details: "details-card",
  documents:        "documents-card",
  password:         "password-card",
  settings:         "settings-card",
  billing:          "billing-card",
};
 
/* ─── Bütün panelləri gizlət ────────────────────────────── */
const hideAllPanels = () => {
  Object.values(PANELS).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
      el.classList.remove("active");
    }
  });
};
 
/* ─── Seçilmiş paneli göstər ────────────────────────────── */
const showPanel = (panelId) => {
  hideAllPanels();
  const el = document.getElementById(panelId);
  if (!el) return;
  el.style.display = "";
  el.classList.add("active");
};
 
/* ─── Dropdown toggle ───────────────────────────────────── */
const menuBtn  = document.getElementById("menuBtn");
const dropdown = document.getElementById("dropdown");
 
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("open");
});
 
document.addEventListener("click", () => {
  dropdown.classList.remove("open");
});
 
dropdown.addEventListener("click", (e) => {
  e.stopPropagation();
});
 
/* ─── Menyu elementlərinə klik ──────────────────────────── */
Object.keys(PANELS).forEach(menuId => {
  const menuEl = document.getElementById(menuId);
  if (!menuEl) return;
 
  const li = menuEl.closest("li");
  if (!li) return;
 
  li.style.cursor = "pointer";
 
  li.addEventListener("click", () => {
    showPanel(PANELS[menuId]);
    dropdown.classList.remove("open");
    if (menuId === "documents") loadDocuments();
  });
});
 
/* ─── İstifadəçi məlumatlarını yüklə ───────────────────── */
const loadUser = async () => {
  const token = localStorage.getItem("token");
 
  const response = await fetch("https://api.makecv.pro:5001/api/user/user-dashboard", {
    headers: { "Authorization": token }
  });
 
  if (!response.ok) {
    console.log("HTTP ERROR:", response.status);
    if (response.status === 401) window.location.href = "/Log_in.html";
    return;
  }
 
  const data = await response.json();
  console.log(data);
 
  const nameEl  = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");
 
  if (nameEl)  nameEl.textContent  = data.username;
  if (emailEl) emailEl.textContent = data.email;
 
  document.getElementById("username").value = data.username;
  document.getElementById("email").value    = data.email;
};
const loadDocuments = async () => {
  const token = localStorage.getItem("token");
 
  const response = await fetch("https://api.makecv.pro:5001/api/user/documents", {
    headers: { "Authorization": token }
  });
 
  if (!response.ok) {
    console.log("HTTP ERROR:", response.status);
    if (response.status === 401) window.location.href = "/Log_in.html";
    return;
  }
 
  const data = await response.json();
  console.log(data);
 
  renderDocs(data.docs,   "your-docs-list");
  renderDocs(data.drafts, "drafts-list");
};
const renderDocs = (items, listId) => {
  const list = document.getElementById(listId);
  if (!list) return;
 
  if (!items || items.length === 0) {
    list.innerHTML = `<li class="doc-empty">Heç bir sənəd tapılmadı.</li>`;
    return;
  }
 
  list.innerHTML = items.map(doc => `
    <li class="doc-item">
      <span class="pdf-badge">PDF</span>
      <div class="doc-info">
        <p class="doc-name">${doc.name}</p>
        <p class="doc-date">CV Last Edited ${doc.lastEdited}</p>
      </div>
      <div class="doc-actions">
        <button class="doc-btn" title="Preview">&#128065;</button>
        <button class="doc-btn" title="Download">&#8659;</button>
        <button class="doc-btn delete" title="Delete">&#128465;</button>
      </div>
    </li>
  `).join("");
};
 
loadUser();