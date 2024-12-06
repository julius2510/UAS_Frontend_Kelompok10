const apiKey = '3a4bb7bba04f48c2a301ce1c3f1df88e';

document.getElementById('generateMealBtn').addEventListener('click', async function() {
  const randomMealContainer = document.getElementById('randomMeal');
  randomMealContainer.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/random?number=1&apiKey=${apiKey}`);
    const data = await response.json();

    if (data.recipes && data.recipes.length > 0) {
      const meal = data.recipes[0];
      randomMealContainer.innerHTML = `
        <div class="card">
          <img src="${meal.image}" class="card-img-top" alt="${meal.title}">
          <div class="card-body">
            <h3 class="card-title">${meal.title}</h3>
            <p><strong>Ready in:</strong> ${meal.readyInMinutes} minutes</p>
            <p><strong>Servings:</strong> ${meal.servings}</p>
            <a href="${meal.sourceUrl}" target="_blank" class="btn btn-primary">View Full Recipe</a>
          </div>
        </div>
      `;
    } else {
      randomMealContainer.innerHTML = '<p>No recipe found. Please try again later.</p>';
    }
  } catch (error) {
    console.error('Error fetching random meal:', error);
    randomMealContainer.innerHTML = '<p>Error fetching recipe. Please try again later.</p>';
  }
});

document.addEventListener('DOMContentLoaded', function () {
// Cek apakah pengguna sudah login
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
  updateNavbarForLoggedInUser(user);
}

// Tambahkan event listener untuk form login dan signup
document.getElementById("loginForm").addEventListener("submit", handleFormSubmit);
document.getElementById("signupForm").addEventListener("submit", handleFormSubmit);
});

async function handleFormSubmit(event) {
event.preventDefault();

const formData = new FormData(event.target);
const formType = event.target.id; // loginForm atau signupForm
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
  // Simpan data pengguna ke localStorage
  localStorage.setItem("user", JSON.stringify(result.user));

  // Update navbar dengan informasi pengguna
  updateNavbarForLoggedInUser(result.user);

  // Arahkan ke halaman utama atau profil
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
    <i class="bi bi-person-circle fs-3 text-secondary me-2" style="pointer-events: none;"></i>
    <a href="/profile" style="text-decoration: none;">${user.name}</a>
  </div>
`;
signupLoginButton.outerHTML = userProfileHtml;
}

