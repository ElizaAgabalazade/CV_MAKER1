const overlay = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');

const otpInputs = document.querySelectorAll('.otp-input');

let emailValue = "";


























openBtn.addEventListener("click", async () => {

  emailValue = document.getElementById("email").value;

  if (!emailValue) {
    alert("Email yaz!");
    return;
  }

  await fetch("https://api.makecv.pro:5001/api/Auth/register/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: emailValue })
  });

  overlay.classList.add("is-open");
});

// bagla
closeBtn.addEventListener("click", () => {
  overlay.classList.remove("is-open");
});

// OTP verify
otpInputs.forEach((input, i) => {

  input.addEventListener("input", async () => {
    input.value = input.value.replace(/\D/g, "");

    if (input.value && i < otpInputs.length - 1) {
      otpInputs[i + 1].focus();
    }

    const otp = Array.from(otpInputs).map(x => x.value).join("");

    if (otp.length === 6) {

      const res = await fetch("https://api.makecv.pro:5001/api/Auth/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue,
          otp
        })
      });

      const data = await res.json();

      alert(data.message);

      if (data.success) {
        overlay.classList.remove("is-open");
      }
    }
  });

});