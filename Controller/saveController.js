const apiKey = 'c77b4a6b7dad4a59b5e22314aafb30f2';
const recipeDetailsDiv = document.getElementById('recipeDetails');
const savedRecipesList = document.getElementById('savedRecipesList');

// Fungsi untuk menampilkan resep yang disimpan
function loadSavedRecipes() {
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
  savedRecipesList.innerHTML = '';

  if (savedRecipes.length === 0) {
    savedRecipesList.innerHTML = `<p class="text-center text-secondary">Belum ada resep yang disimpan.</p>`;
    return;
  }

  savedRecipes.forEach((recipe, index) => {
    const recipeCard = `
      <div class="col-md-4">
        <div class="card shadow-lg border-0 h-100" style="overflow: hidden;">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary fw-bold">${recipe.title}</h5>
            <div class="mt-auto">
              <button class="btn btn-primary w-100 mb-2 rounded-pill" onclick="viewRecipeDetails(${recipe.id})">
                <i class="bi bi-eye"></i> View Recipe
              </button>
              <button class="btn btn-danger w-100 rounded-pill" onclick="deleteRecipe(${index})">
                <i class="bi bi-trash"></i> Delete Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    savedRecipesList.innerHTML += recipeCard;
  });
}

// Fungsi untuk menghapus resep dari LocalStorage
function deleteRecipe(index) {
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
  savedRecipes.splice(index, 1); // Hapus resep berdasarkan indeks
  localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes)); // Perbarui Local Storage
  loadSavedRecipes(); // Perbarui tampilan
}

// Fungsi untuk menyimpan resep
function saveRecipe(title, image, id) {
  if (!id) {
    console.error("ID resep tidak valid!");
    return; // Tidak menyimpan resep jika ID tidak valid
  }
  
  const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
  savedRecipes.push({ title, image, id }); // Simpan ID
  localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  alert(`Resep "${title}" telah disimpan!`);
}

// Fungsi untuk mendapatkan detail resep dari API
async function getRecipeDetails(recipeId) {
  if (!recipeId) {
    console.error("ID resep tidak valid!");
    recipeDetailsDiv.innerHTML = `<p class="text-danger text-center">ID resep tidak valid.</p>`;
    return;
  }

  const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
  try {
    console.log(`Fetching details for recipe with ID: ${recipeId}`); // Debugging log
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    recipeDetailsDiv.innerHTML = `<p class="text-danger text-center">Terjadi kesalahan saat mengambil detail resep: ${error.message}</p>`;
  }
}

// Fungsi untuk menampilkan detail resep
async function viewRecipeDetails(recipeId) {
  if (!recipeId) {
    recipeDetailsDiv.innerHTML = `<p class="text-danger text-center">ID resep tidak valid.</p>`;
    return;
  }

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
          ${recipe.extendedIngredients?.map(ing => `<li>${ing.original}</li>`).join('') || '<li>Tidak ada bahan tersedia.</li>'}
        </ul>
        <h5 class="fw-bold">Langkah-Langkah:</h5>
        <ol>
          ${recipe.analyzedInstructions?.[0]?.steps.map(step => `<li>${step.step}</li>`).join('') || '<li>Tidak ada langkah tersedia.</li>'}
        </ol>
        <button class="btn btn-secondary mt-3" onclick="recipeDetailsDiv.innerHTML=''">Tutup</button>
      </div>
    </div>
  `;
}

// Panggil fungsi loadSavedRecipes saat halaman dimuat
window.onload = loadSavedRecipes;

// Panggil fungsi untuk memuat resep yang disimpan saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadSavedRecipes);
      // Muat resep saat halaman selesai dimuat
      document.addEventListener('DOMContentLoaded', loadSavedRecipes);

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