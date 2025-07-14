const inputUsername = document.querySelector(".input-signup-username");
const inputPassword = document.querySelector(".input-signup-password");

function signup() {
  if (!inputUsername.value || !inputPassword.value) {
    alert("Please enter both email and password!");
    return;
  }

  const user = {
    email: inputUsername.value,
    password: inputPassword.value,
  };

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find(u => u.email === user.email);
  if (exists) {
    alert("This email is already registered!");
  } else {
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful!");
    window.location.href = "login.html";
  }
}
