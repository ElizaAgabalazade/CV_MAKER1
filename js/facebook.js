const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;


    if(email === "" || password === ""){
        alert("Please fill in all fields!");
        return;
    }

  
    if(!email.match(emailPattern)){
        alert("Please enter a valid email address!");
        return;
    }

   
    if(password.length < 6){
        alert("Password must be at least 6 characters!");
        return;
    }

    
    alert("Login Successful!");
    window.location.href = "main.html";
});