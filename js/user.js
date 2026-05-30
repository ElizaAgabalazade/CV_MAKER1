let isEdit = false;

const inputs = document.querySelectorAll("input");
const btn = document.querySelector(".btn");

// Load saved data on start
window.onload = () => {
    const saved = JSON.parse(localStorage.getItem("profile"));

    if (saved) {
        document.getElementById("name").value = saved.name;
        document.getElementById("phone").value = saved.phone;
        document.getElementById("email").value = saved.email;
    } else {
        document.getElementById("name").value = "Lavinia Vicolvioni";
        document.getElementById("phone").value = "+0123456789";
        document.getElementById("email").value = "laviniavicolvioni555@gmail.com";
    }
};

function toggleEdit() {
    isEdit = !isEdit;

    inputs.forEach(input => {
        input.disabled = !isEdit;
    });

    if (!isEdit) {
        // SAVE MODE
        const data = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value
        };

        localStorage.setItem("profile", JSON.stringify(data));
        console.log("Saved:", data);
    }

    btn.innerText = isEdit ? "Save Profile" : "Edit Profile";
}



























































const threeDot = document.getElementById("threeDotDiv");
const menu = document.getElementById("dropdownMenu");

threeDot.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});


//LOGIN
document.addEventListener("DOMContentLoaded", function () {

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    // login olmayıb → geri qaytar
    window.location.href = "index.html";
  }

});