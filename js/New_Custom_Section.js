const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    // Əvvəl bütün active-ləri sil
    tabs.forEach(t => t.classList.remove("active"));

    // Klik olunanı aktiv et
    tab.classList.add("active");
  });
});