const apiKey = 'c77b4a6b7dad4a59b5e22314aafb30f2';
const searchForm = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');
const recipeDetailsDiv = document.getElementById('recipeDetails');

// Fungsi untuk mendapatkan resep default (12 resep pertama)
async function getDefaultRecipes() {
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=12`; // Ambil 12 resep pertama
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    resultsDiv.innerHTML = `<p class="text-danger text-center">Terjadi kesalahan saat mengambil data.</p>`;
  }
}

// Fungsi untuk mendapatkan data resep berdasarkan pencarian
async function getRecipes(query, ingredients = '', maxCalories = '') {
  let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`;
  if (query) apiUrl += `&query=${query}`;
  if (ingredients) apiUrl += `&includeIngredients=${ingredients}`;
  if (maxCalories) apiUrl += `&maxCalories=${maxCalories}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    resultsDiv.innerHTML = `<p class="text-danger text-center">Terjadi kesalahan saat mengambil data.</p>`;
  }
}

// Fungsi untuk menampilkan data resep
function displayRecipes(recipes) {
  resultsDiv.innerHTML = '';
  recipeDetailsDiv.innerHTML = ''; // Bersihkan detail sebelumnya
  if (!recipes || recipes.length === 0) {
    resultsDiv.innerHTML = '<p class="text-center">Tidak ada resep ditemukan.</p>';
    return;
  }

  recipes.forEach(recipe => {
    console.log(`Displaying recipe: ID=${recipe.id}, Title=${recipe.title}`); // Debug log
    const recipeCard = `
      <div class="col-md-4">
        <div class="card shadow-lg border-0 h-100" style="overflow: hidden; transition: transform 0.3s;">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary fw-bold">${recipe.title}</h5>
            <p class="text-secondary small">Cocok untuk menu harian anda!</p>
            <div class="mt-auto">
              <button class="btn btn-success w-100 mb-2 rounded-pill" onclick="showRecipeDetails(${recipe.id})">
                <i class="bi bi-eye"></i> Lihat Detail
              </button>
              <button class="btn btn-success w-100 rounded-pill" onclick="saveRecipe(${recipe.id}, '${recipe.title}', '${recipe.image}')">
  <i class="bi bi-bookmark"></i> Save Recipe
</button>
            </div>
          </div>
        </div>
      </div>
    `;
    resultsDiv.innerHTML += recipeCard;
  });

  // Tambahkan efek hover ke semua kartu
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseover', () => {
      card.style.transform = 'scale(1.05)';
    });
    card.addEventListener('mouseout', () => {
      card.style.transform = 'scale(1)';
    });
  });
}

// Fungsi untuk mendapatkan detail resep
async function getRecipeDetails(recipeId) {
  const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    recipeDetailsDiv.innerHTML = `<p class="text-danger text-center">Terjadi kesalahan saat mengambil detail resep.</p>`;
  }
}

async function showRecipeDetails(recipeId) {
  recipeDetailsDiv.innerHTML = '<p class="text-center">Memuat detail...</p>'; // Indikator loading
  const recipe = await getRecipeDetails(recipeId);
  if (!recipe) {
    recipeDetailsDiv.innerHTML = `<p class="text-danger text-center">Gagal memuat detail resep.</p>`;
    return;
  }

  recipeDetailsDiv.innerHTML = `
    <div class="card shadow-lg">
      <div class="card-header bg-primary text-white">
        <h2>${recipe.title}</h2>
      </div>
      <div class="card-body">
        <img src="${recipe.image}" class="img-fluid mb-3 rounded" alt="${recipe.title}">
        <h5 class="fw-bold">Bahan-Bahan:</h5>
        <ul>
          ${
            recipe.extendedIngredients && recipe.extendedIngredients.length > 0
              ? recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')
              : '<li>Tidak ada bahan tersedia.</li>'
          }
        </ul>
        <h5 class="fw-bold">Langkah-Langkah:</h5>
        <ol>
          ${
            recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
              ? recipe.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join('')
              : '<li>Tidak ada langkah tersedia.</li>'
          }
        </ol>
        <button class="btn btn-secondary mt-3" onclick="recipeDetailsDiv.innerHTML=''">Tutup</button>
      </div>
    </div>
  `;
}
// Event listener untuk form pencarian resep
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('query').value;
  const ingredients = document.getElementById('ingredients').value;
  const maxCalories = document.getElementById('maxCalories').value;

  const recipes = await getRecipes(query, ingredients, maxCalories);
  displayRecipes(recipes);
});

// Fungsi untuk menyimpan resep
function saveRecipe(id, title, image) {
  const user = JSON.parse(localStorage.getItem('user'));

  // Cek apakah pengguna sudah login
  if (!user) {
    alert("Silakan login terlebih dahulu untuk menyimpan resep.");
    window.location.href = "/loginin"; // Arahkan pengguna ke halaman login
    return;
  }

  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
  savedRecipes.push({ id, title, image }); // Tambahkan id ke data yang disimpan
  localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  alert(`Resep "${title}" telah disimpan!`);
}

// Menampilkan 12 resep default saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', async function () {
  const defaultRecipes = await getDefaultRecipes();
  displayRecipes(defaultRecipes);
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