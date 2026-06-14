/* ─── Panel IDs ─────────────────────────────────────────── */
const PANELS = {
  personal_details: "details-card",
  documents:        "documents-card",
  password:         "password-card",
  settings:         "settings-card",
  billing:          "billing-card",
};

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

/* ─── Sənədləri yüklə ───────────────────────────────────── */
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

/* ─── Password toggle ───────────────────────────────────── */
function togglePw(id, btn) {
  const inp = document.getElementById(id);
  if (inp.type === "password") {
    inp.type = "text";
    btn.querySelector("i").className = "ti ti-eye-off";
  } else {
    inp.type = "password";
    btn.querySelector("i").className = "ti ti-eye";
  }
}

/* ─── Settings ──────────────────────────────────────────── */

// Language
const langSelect = document.getElementById("language-select");
if (langSelect) {
  langSelect.value = localStorage.getItem("language") || "en-uk";
  langSelect.addEventListener("change", (e) => {
    localStorage.setItem("language", e.target.value);
  });
}

// Email Notifications
const emailToggle = document.getElementById("email-notifications");
if (emailToggle) {
  emailToggle.addEventListener("change", async (e) => {
    const token = localStorage.getItem("token");
    await fetch("https://api.makecv.pro:5001/api/user/notifications", {
      method: "PUT",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ emailNotifications: e.target.checked })
    });
  });
}

// Sign Out
const signoutBtn = document.getElementById("signout-btn");
if (signoutBtn) {
  signoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/Log_in.html";
  });
}

// Delete Account
const deleteModal   = document.getElementById("delete-modal");
const modalCancel   = document.getElementById("modal-cancel");
const modalConfirm  = document.getElementById("modal-confirm");

if (deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    deleteModal.classList.add("open");
  });
}

modalCancel.addEventListener("click", () => {
  deleteModal.classList.remove("open");
});

modalConfirm.addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("https://api.makecv.pro:5001/api/user/delete", {
    method: "DELETE",
    headers: { "Authorization": token }
  });

  if (response.ok) {
    localStorage.removeItem("token");
    window.location.href = "/Log_in.html";
  } else {
    alert("Something went wrong. Please try again.");
    deleteModal.classList.remove("open");
  }
});

// Overlay-ə klik edəndə bağla
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) deleteModal.classList.remove("open");
});

/* ─── Default panel ─────────────────────────────────────── */
showPanel("details-card");
loadUser();