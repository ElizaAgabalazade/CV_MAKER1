const radios = document.querySelectorAll('input[name="account"]');

radios.forEach(radio => {
    radio.addEventListener("change", () => {
        window.location.href = "index.html";
    });
});