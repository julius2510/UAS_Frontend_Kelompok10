document.addEventListener('DOMContentLoaded', function () {
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
updateNavbarForLoggedInUser(user);
}


document.getElementById("loginForm").addEventListener("submit", handleFormSubmit);
document.getElementById("signupForm").addEventListener("submit", handleFormSubmit);
});

async function handleFormSubmit(event) {
event.preventDefault();

const formData = new FormData(event.target);
const formType = event.target.id; 
const data = Object.fromEntries(formData.entries());
const formAction = formType === "loginForm" 
? "http://localhost:3000/login" 
: "http://localhost:3000/signup";

try {
const response = await fetch(formAction, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

if (!response.ok) {
  const error = await response.json();
  alert(error.message || "Terjadi kesalahan");
  return;
}

const result = await response.json();
localStorage.setItem("user", JSON.stringify(result.user));
updateNavbarForLoggedInUser(result.user);
window.location.href = "/";
} catch (error) {
alert("Terjadi kesalahan: " + error.message);
}
}

function updateNavbarForLoggedInUser(user) {
const navbar = document.querySelector("nav");
const signupLoginButton = navbar.querySelector(".btn");
const userProfileHtml = `
<div class="d-flex align-items-center ms-5">
  <i class="bi bi-person-circle fs-3 text-secondary me-2" style="pointer-events: none; cursor: default;"></i>
  <a href="/profile" style="text-decoration: none;">${user.name}</a>
</div>
`;
signupLoginButton.outerHTML = userProfileHtml;
}
