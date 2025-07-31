document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Simple mock auth logic
  if (email === "admin@example.com" && password === "admin123") {
    localStorage.setItem("token", "mock-admin-token");
    window.location.href = "index.html";
  } else {
    document.getElementById('loginError').style.display = 'block';
    document.getElementById('loginError').innerText = "Invalid credentials.";
  }
});
