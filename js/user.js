const PANELS = {
  personal_details: "details-card",
  documents: "documents-card",
  password: "password-card",
  settings: "settings-card",
  billing: "billing-card",
};

/* ─── Plan ─────────────────────────────────────────────── */
const initUserPlan = (activePlanName) => {
  document.querySelectorAll('.plan-card[data-plan]').forEach(card => {
    const btn = card.querySelector('.plan-btn');
    if (card.dataset.plan === activePlanName) {
      card.dataset.current = 'true';
      btn.textContent = 'Current Plan';
      btn.className = 'plan-btn plan-btn-current';
    } else {
      delete card.dataset.current;
      btn.textContent = 'Select';
      btn.className = 'plan-btn plan-btn-select';
    }
  });
};

const bSelectPlan = (selectedCard) => {
  if (selectedCard.dataset.current === 'true') return;
  document.querySelectorAll('.plan-card[data-plan]').forEach(card => {
    card.classList.remove('selected');
    const btn = card.querySelector('.plan-btn');
    if (card.dataset.current === 'true') {
      btn.textContent = 'Current Plan';
      btn.className = 'plan-btn plan-btn-current';
    } else {
      btn.textContent = 'Select';
      btn.className = 'plan-btn plan-btn-select';
    }
  });
  selectedCard.classList.add('selected');
  const btn = selectedCard.querySelector('.plan-btn');
  btn.textContent = 'Selected';
  btn.className = 'plan-btn plan-btn-chosen';
};

const confirmPlanUpgrade = async () => {
  const selected = document.querySelector('.plan-card.selected');
  if (!selected) return alert("Zəhmət olmasa bir plan seçin!");
  const newPlan = selected.dataset.plan;
  const token = localStorage.getItem("token");
  const res = await fetch("https://api.makecv.pro:5001/api/user/update-plan", {
    method: "POST",
    headers: { "Authorization": token, "Content-Type": "application/json" },
    body: JSON.stringify({ plan: newPlan })
  });
  if (res.ok) {
    initUserPlan(newPlan);
    alert("Plan uğurla yeniləndi!");
  }
};

/* ─── Panel ─────────────────────────────────────────────── */
const hideAllPanels = () => {
  Object.values(PANELS).forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = "none"; el.classList.remove("active"); }
  });
};

const showPanel = (panelId) => {
  hideAllPanels();
  const el = document.getElementById(panelId);
  if (!el) return;
  el.style.display = "";
  el.classList.add("active");
};

/* ─── Overlay helpers ───────────────────────────────────── */
const bHideBillingUI = () => {
  document.getElementById('billing-card')?.style.setProperty('display', 'none');
  document.querySelector('.profile-card')?.style.setProperty('display', 'none');
};

const bCloseAll = () => {
  document.querySelectorAll('.b-overlay').forEach(o => o.classList.remove('active'));
  document.getElementById('billing-card')?.style.removeProperty('display');
  document.querySelector('.profile-card')?.style.removeProperty('display');
};

/* ─── Change Card ───────────────────────────────────────── */
const bOpenChangeCard = () => {
  document.getElementById('bChangeCardOverlay').classList.add('active');
  bHideBillingUI();
};

const bSaveCard = async () => {
  const name   = document.getElementById('cardholderName').value.trim();
  const number = document.getElementById('cardNumber').value.trim();
  const expiry = document.getElementById('cardExpiry').value.trim();
  const cvc    = document.getElementById('cardCvc').value.trim();
  const token  = localStorage.getItem('token');
  try {
    const res = await fetch('https://api.makecv.pro:5001/api/user/update-card', {
      method: 'POST',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, number, expiry, cvc })
    });
    if (res.ok) bCloseAll();
    else console.error('Card update failed');
  } catch (err) { console.error(err); }
};

/* ─── Change Payment Method ─────────────────────────────── */
const initPaymentMethod = (activeMethod) => {
  bSelectMethod(activeMethod);
};

const bOpenChangeMethod = () => {
  document.getElementById('bChangeMethodOverlay').classList.add('active');
  bHideBillingUI();
};

const bSelectMethod = (value) => {
  document.querySelectorAll('.cm-radio').forEach(r => {
    r.checked = false;
    r.closest('.cm-opt')?.classList.remove('cm-opt-active');
  });
  const selected = document.querySelector(`.cm-radio[value="${value}"]`);
  if (selected) {
    selected.checked = true;
    selected.closest('.cm-opt')?.classList.add('cm-opt-active');
  }
};

const bConfirmMethod = async () => {
  const selected = document.querySelector('.cm-radio:checked');
  if (!selected) return;
  const method = selected.value;
  const token  = localStorage.getItem('token');
  try {
    const res = await fetch('https://api.makecv.pro:5001/api/user/update-payment-method', {
      method: 'POST',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ method })
    });
    if (res.ok) {
      console.log('Payment method updated:', method);
      bCloseAll();
    } else {
      console.error('Method update failed');
    }
  } catch (err) { console.error(err); }
};

/* ─── Docs helpers ──────────────────────────────────────── */
const formatDate = (isoString) =>
  new Date(isoString).toISOString().slice(0, 10);

const renderDocItem = (doc, isDraft = false) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="docs-card" data-id="${doc.id}" role="button" tabindex="0"
         aria-label="${doc.title || 'Adsız sənəd'}">
      <div class="doc-pdf-badge">PDF</div>
      <div class="doc-info">
        <div class="doc-title">${doc.title || "Adsız sənəd"}</div>
        <div class="doc-meta">CV / Last Edited ${formatDate(doc.updatedAt)}</div>
      </div>
      <div class="doc-actions">
        <button class="doc-action-btn" title="Preview"><i class="ti ti-eye" aria-hidden="true"></i></button>
        <button class="doc-action-btn" title="Download"><i class="ti ti-download" aria-hidden="true"></i></button>
        <button class="doc-action-btn doc-action-delete" title="Delete"><i class="ti ti-trash" aria-hidden="true"></i></button>
      </div>
    </div>`;

  const card = li.querySelector(".docs-card");
  const open = () => { window.location.href = `/editor.html?id=${doc.id}`; };

  card.addEventListener("click", open);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });

  card.querySelector('[title="Preview"]').addEventListener("click", (e) => {
    e.stopPropagation();
    window.open(`/preview.html?id=${doc.id}`, '_blank');
  });

  card.querySelector('[title="Download"]').addEventListener("click", (e) => {
    e.stopPropagation();
    window.open(`/api/docs/download/${doc.id}`, '_blank');
  });

  card.querySelector('[title="Delete"]').addEventListener("click", async (e) => {
    e.stopPropagation();
    if (!confirm(`"${doc.title}" silinsin?`)) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://api.makecv.pro:5001/api/user/delete-doc/${doc.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      if (res.ok) li.remove();
      else console.error('Delete doc failed');
    } catch (err) { console.error(err); }
  });

  return li;
};

const renderEmptyState = (message) => {
  const li = document.createElement("li");
  li.className = "docs-empty";
  li.innerHTML = `<i class="ti ti-files" aria-hidden="true"></i><span>${message}</span>`;
  return li;
};

const renderDocsSection = (list, items, isDraft = false) => {
  list.innerHTML = "";
  if (!items || items.length === 0) {
    list.appendChild(renderEmptyState(
      isDraft ? "Qaralama yoxdur" : "Hələ heç bir sənədiniz yoxdur"
    ));
    return;
  }
  items.forEach(doc => list.appendChild(renderDocItem(doc, isDraft)));
};

/* ─── User data ─────────────────────────────────────────── */
const loadUser = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("https://api.makecv.pro:5001/api/user/user-dashboard", {
      headers: { "Authorization": token }
    });
    if (response.status === 401) { window.location.href = "/Log_in.html"; return; }
    if (!response.ok) return;

    const data = await response.json();
    document.getElementById("user-name").textContent = data.username;
    document.getElementById("user-email").textContent = data.email;
    document.getElementById("username").value = data.username;
    document.getElementById("email").value = data.email;

    if (data.plan) initUserPlan(data.plan);
    if (data.paymentMethod) initPaymentMethod(data.paymentMethod);

    const yourDocsList = document.getElementById("your-docs-list");
    const draftsList   = document.getElementById("drafts-list");
    if (yourDocsList) renderDocsSection(yourDocsList, data.docs   ?? [], false);
    if (draftsList)   renderDocsSection(draftsList,   data.drafts ?? [], true);

  } catch (err) { console.error(err); }
};

/* ─── DOMContentLoaded ──────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  showPanel("details-card");
  loadUser();

  const menuBtn  = document.getElementById("menuBtn");
  const dropdown = document.getElementById("dropdown");
  if (menuBtn && dropdown) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", () => dropdown.classList.remove("open"));
    dropdown.addEventListener("click", (e) => e.stopPropagation());
  }

  Object.keys(PANELS).forEach(menuId => {
    const menuEl = document.getElementById(menuId);
    if (!menuEl) return;
    const li = menuEl.closest("li");
    if (li) {
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        showPanel(PANELS[menuId]);
        dropdown?.classList.remove("open");
      });
    }
  });

  document.querySelectorAll('.b-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) bCloseAll();
    });
  });

  document.getElementById('bChangePlanBtn')?.addEventListener('click', () =>
    document.getElementById('bChangePlanOverlay').classList.add('active'));

  document.getElementById('bCancelPlanBtn')?.addEventListener('click', () =>
    document.getElementById('bCancelPlanOverlay').classList.add('active'));

  document.getElementById('bChangeCardBtn')?.addEventListener('click', bOpenChangeCard);
  document.getElementById('bChangeMethodBtn')?.addEventListener('click', bOpenChangeMethod);
  document.getElementById('plansBackBtn')?.addEventListener('click', bCloseAll);

  document.querySelectorAll('.plan-card[data-plan]').forEach(card =>
    card.addEventListener('click', () => bSelectPlan(card)));

  document.querySelectorAll('.cm-radio').forEach(radio =>
    radio.addEventListener('change', () => bSelectMethod(radio.value)));

  const defaultMethod = document.querySelector('.cm-radio:checked');
  if (defaultMethod) bSelectMethod(defaultMethod.value);

  document.getElementById('confirmCancelBtn')?.addEventListener('click', async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://api.makecv.pro:5001/api/user/cancel-subscription", {
        method: "POST",
        headers: { "Authorization": token }
      });
      if (res.ok) {
        alert("Subscription cancelled.");
        bCloseAll();
        window.location.reload();
      }
    } catch (err) { console.error(err); }
  });

  document.getElementById('cardNumber')?.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 16);
    this.value = v.replace(/(.{4})/g, '$1 ').trim();
  });

  document.getElementById('cardExpiry')?.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    this.value = v;
  });

  document.getElementById('signout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/Log_in.html';
  });

  const deleteModal = document.getElementById('delete-modal');

  document.getElementById('delete-account-btn')?.addEventListener('click', () => {
    if (deleteModal) deleteModal.style.display = 'flex';
  });

  document.getElementById('modal-cancel')?.addEventListener('click', () => {
    if (deleteModal) deleteModal.style.display = 'none';
  });

  deleteModal?.addEventListener('click', (e) => {
    if (e.target === deleteModal) deleteModal.style.display = 'none';
  });

  document.getElementById('modal-confirm')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://api.makecv.pro:5001/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      if (res.ok) {
        localStorage.removeItem('token');
        window.location.href = '/Log_in.html';
      } else {
        console.error('Delete account failed');
      }
    } catch (err) { console.error(err); }
  });

});
// end