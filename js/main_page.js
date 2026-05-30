const images = document.querySelectorAll(".slides img");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let index = 0;

const updateSlider = () => {
    images.forEach((img, i) => {
        let diff = i - index;

        // Sonsuz döngə
        if (diff > images.length / 2) diff -= images.length;
        if (diff < -images.length / 2) diff += images.length;

        // Hesablamalar
        const translateX = diff * 80; // Mobildə şəkillər arası məsafə
        const scale = (i === index) ? 1.15 : 0.85; // Aktiv şəkil bir az böyük, digərləri kiçik
        const zIndex = 100 - Math.abs(diff) * 10;
        const opacity = (Math.abs(diff) > 2) ? 0 : (1 - Math.abs(diff) * 0.3);

        // ƏN VACİB HİSSƏ:
        // Şəkli əvvəlcə mərkəzə (-50%, -50%) gətiririk, sonra translateX əlavə edirik
        img.style.transform = `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`;
        img.style.zIndex = zIndex;
        img.style.opacity = opacity;

        // Klass idarəetməsi
        if (i === index) {
            img.classList.add("active");
        } else {
            img.classList.remove("active");
        }
    });
};
nextBtn.onclick = () => {
    index = (index + 1) % images.length;
    updateSlider();
};

prevBtn.onclick = () => {
    index = (index - 1 + images.length) % images.length;
    updateSlider();
};

// Səhifə yüklənəndə ilkin vəziyyət
updateSlider();



document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "user.html";
});


//LOGIN
document.addEventListener("DOMContentLoaded", function () {

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const profileIcon = document.getElementById("profileIcon");
  const loginBtn = document.querySelector(".log_in");
  const signBtn = document.querySelector(".sign_part");

  if (isLoggedIn === "true") {

    // login olub
    profileIcon.style.display = "block";
    loginBtn.style.display = "none";
    signBtn.style.display = "none";

  } else {

    // login olmayıb
    profileIcon.style.display = "none";
    loginBtn.style.display = "block";
    signBtn.style.display = "block";
  }

});