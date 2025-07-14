const inputUsername = document.querySelector(".input-login-username");
const inputPassword = document.querySelector(".input-login-password");

function login() {
  if (!inputUsername.value || !inputPassword.value) {
    alert("Please enter your email and password!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(u =>
    u.email === inputUsername.value && u.password === inputPassword.value
  );

  if (foundUser) {
    alert("Login successful!");
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password.");
  }
}
