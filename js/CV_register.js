const BASE_URL = "https://api.makecv.pro:5001/api/Auth/register";

const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInBtn = document.getElementById("signInBtn");

const sendData = async () => {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!username || !email || !password) {
    alert("❌ Zəhmət olmasa bütün sahələri doldurun!");
    return;
  }

  try {
    // Sadəcə POST göndərilməlidir. GET yoxdur!
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded"
        "Content-Type": "application/json"


      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    console.log("Server cavabı:", data);

    if (res.ok) {
      alert("✅ Uğurla qeydiyyatdan keçdiniz!");
    } else {
      alert("❌ Xəta: " + (data.message || "Qeydiyyat alınmadı"));
    }

  } catch (error) {
    console.error("Xəta:", error);
    alert("❌ Server ilə bağlantı xətası!");
  }
};

signInBtn.addEventListener("click", sendData);
