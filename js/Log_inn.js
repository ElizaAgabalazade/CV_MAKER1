const loginForm = document.getElementById("loginFormm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const resultEl = document.getElementById("result");

    try {
        const res = await fetch("https://api.makecv.pro:5001/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log("Response:", data);

        if (!res.ok) {
            resultEl.innerText = data?.message || "Login failed";
            return;
        }

        resultEl.innerText = "Logged in!";

        const token = data.token;
        if (!token) {
            resultEl.innerText = "Token tapılmadı";
            return;
        }

        localStorage.setItem("token", token);

        const payload = getPayloadFromToken(token);
        console.log("Payload:", payload);

        const userName =
            payload.name ||
            payload.fullName ||
            payload.username ||
            payload.email;

        resultEl.innerText = userName;
        window.location.href = "/";

    } catch (err) {
        console.error(err);
        resultEl.innerText = "Network error";
    }
});

//  Arrow function
const getPayloadFromToken = (token) => {
    const payloadPart = token.split(".")[1];

    const base64 = payloadPart
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    return JSON.parse(atob(base64));
};
