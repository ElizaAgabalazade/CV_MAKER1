async function loadUser() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    const response = await fetch(
        "https://api.makecv.pro:5001/api/user/user-dashboard",
        {
            headers: {
                Authorization: token
            }
        }
    );

    if (!response.ok) {
        console.log("Error:", response.status);
        return;
    }

    const data = await response.json();



    // Для аватара с первой буквой
    const headerRight = document.getElementById("headerRight");

    if (headerRight) {
        headerRight.innerHTML = `
            <a href="user.html" class="user-avatar">
                ${data.username.charAt(0).toUpperCase()}
            </a>
        `;
    }
}

loadUser();