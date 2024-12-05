document.getElementById("searchForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const query = document.getElementById("searchQuery").value;

  try {
    const response = await fetch(`/search-recipe?query=${encodeURIComponent(query)}`, {
      method: "GET",
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || "Error occurred while searching recipes.");
      return;
    }

    const results = await response.json();
    const resultsContainer = document.getElementById("searchResults");

    if (results.length === 0) {
      resultsContainer.innerHTML = "<p class='text-danger text-center'>No recipes found.</p>";
      return;
    }

    let html = `<h3 class="mb-3">Search Results:</h3>`;
    html += `<ul class="list-group">`;

    results.forEach(recipe => {
    const ingredientsList = recipe.ingredients
        .split('\n') // Pisahkan berdasarkan newline
        .map(item => `<li>${item.trim()}</li>`) // Trim spasi dan bungkus dalam <li>
        .join(''); // Gabungkan kembali menjadi string HTML

    html += `
        <li class="list-group-item">
        <h5>${recipe.name}</h5>
        <p><strong>Ingredients:</strong></p>
        <ul>${ingredientsList}</ul>
        <p><strong>Steps:</strong> ${recipe.steps}</p>
        </li>
    `;
    });

    html += `</ul>`;
    resultsContainer.innerHTML = html;
  } catch (error) {
    alert("Error occurred: " + error.message);
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
    <i class="bi bi-person-circle fs-3 text-secondary me-2"></i>
    <a href="/profile" style="text-decoration: none;">${user.name}</a>
  </div>
`;
signupLoginButton.outerHTML = userProfileHtml;
}