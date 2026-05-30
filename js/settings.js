const threeDot = document.getElementById("threeDotDiv");
const menu = document.getElementById("dropdownMenu");

threeDot.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});














function signOut() {
  alert("You have been signed out.");
}

function deleteAccount() {
  const confirmDelete = confirm("Are you sure you want to delete your account?");
  
  if (confirmDelete) {
    alert("Account deleted permanently.");
  }
}

// Toggle example (optional logic)
document.getElementById("toggleNotif").addEventListener("change", function() {
  if (this.checked) {
    console.log("Notifications Enabled");
  } else {
    console.log("Notifications Disabled");
  }
});









const select = document.getElementById("languageSelect");
const userId = "user123";

// translations
const translations = {
  en: {
    language_title: "Language",
    language_desc: "Choose your preferred language for the app."
  },
  fr: {
    language_title: "Langue",
    language_desc: "Choisissez votre langue préférée."
  },
  de: {
    language_title: "Sprache",
    language_desc: "Wählen Sie Ihre Sprache."
  }
};

function applyLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key];
  });
}

// change language
select.addEventListener("change", async (e) => {
  const lang = e.target.value;

  applyLanguage(lang);

  localStorage.setItem("lang", lang);

  await fetch("http://localhost:3000/set-language", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, lang })
  });
});

// load user language
async function init() {
  const res = await fetch(`http://localhost:3000/get-language/${userId}`);
  const data = await res.json();

  const lang = data.language || "en";

  select.value = lang;
  applyLanguage(lang);
}

init();