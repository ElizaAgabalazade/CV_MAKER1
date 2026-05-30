const baseURL = "https://api.makecv.pro:5001/api/Auth/login";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

// Serverə POST ilə login göndərən funksiya
const sendLogin = async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("❌ Zəhmət olmasa email və parolu doldurun!");
    return;
  }

  try {
    const res = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await res.json();
    console.log("Server cavabı:", data);

    if (res.ok) {
      alert("✅ Login uğurlu! Xoş gəldin " + email);

      localStorage.setItem("googleUser", email);

      // Burada yönləndirmə edə bilərsən
      // window.location.href = "AI_cv.html";
    } else {
      alert("❌ Xəta: " + (data.message || "Email və ya parol səhvdir!"));
    }
  } catch (err) {
    console.error("Server xətası:", err);
    alert("❌ Server xətası!");
  }
};

// Form submit olunduqda işləyir
form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendLogin();
});
