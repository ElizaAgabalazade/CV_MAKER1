const threeDot = document.getElementById("threeDotDiv");
const menu = document.getElementById("dropdownMenu");

threeDot.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});
























const fileInput = document.getElementById("fileInput");
const previewBox = document.getElementById("previewBox");

// BURADA HAMISI SAXLANIR
let allFiles = [];

fileInput.addEventListener("change", (event) => {

    const newFiles = Array.from(event.target.files);

    // yeni faylları əlavə edirik
    allFiles = allFiles.concat(newFiles);

    renderFiles();

});

function renderFiles() {

    previewBox.innerHTML = "";

    allFiles.forEach(file => {

        const card = document.createElement("div");
        card.className = "file-card";

        if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            card.appendChild(img);
        }

        const name = document.createElement("div");
        name.className = "file-name";
        name.textContent = file.name;

        card.appendChild(name);

        previewBox.appendChild(card);
    });
}