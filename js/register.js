document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("modalOverlay");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("closeModal");


  const modalEmailText = document.querySelector(".modal-subtitle strong");

  const otpInputs = Array.from(document.querySelectorAll(".otp-input"));

  const confirmBtn = document.querySelector(".btn-confirm");

  let emailV = "";


  function closeModal() {
    overlay.classList.remove("is-open");
  }

  openBtn.addEventListener("click", async function openModal() {

    const usernameValue = document.getElementById("username").value.trim();
    const emailValue = document.getElementById("email").value.trim();
    const passwordValue = document.getElementById("password").value.trim();

    if (!emailValue || !usernameValue || !passwordValue) {
      alert("Bütün xanaları doldur!");
      return;
    }

    overlay.classList.add("is-open");

    try {

      const res = await fetch("https://api.makecv.pro:5001/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usernameValue,
          email: emailValue,
          password: passwordValue
        })
      });

      let data = null;

      try {
        data = await res.json();
      } catch { }

      if (!res.ok) {
        throw new Error(data?.message || "Qeydiyyat uğursuz oldu");
      }
      emailV = emailValue;
      modalEmailText.textContent = emailValue;

      otpInputs.forEach(i => i.value = "");

      otpInputs[0].focus();

    } catch (err) {

      alert("Error: " + err.message);

      overlay.classList.remove("is-open");
    }

  });

  // VERIFY OTP
  confirmBtn.addEventListener("click", async function () {

    const otp = otpInputs.map(i => i.value).join("");

    if (otp.length !== 6) {
      alert("OTP kodunu tam yaz");
      return;
    }

    try {

      const res = await fetch(
        `https://api.makecv.pro:5001/api/Auth/verify?email=${encodeURIComponent(emailV)}&code=${otp}`,
        {
          method: "POST"
        }
      );

      let data = null;

      try {
        data = await res.json();
      } catch { }

      if (!res.ok) {
        throw new Error(data?.message || "OTP səhvdir");
      }

      alert("Təsdiqləndi! go to login page");
      window.location.href = "/Log_in.html";
      closeModal();

    } catch (err) {

      alert("Error: " + err.message);

      otpInputs.forEach(i => i.value = "");

      otpInputs[0].focus();
    }

  });


  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });


  // OTP INPUT LOGIC

  otpInputs.forEach((input, index) => {

    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);

      if (input.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();

      const pasted = (e.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/\D/g, "");

      pasted.split("").forEach((char, i) => {
        if (otpInputs[index + i]) {
          otpInputs[index + i].value = char;
        }
      });

      const nextIndex = Math.min(index + pasted.length, otpInputs.length - 1);
      otpInputs[nextIndex].focus();
    });

  });



});