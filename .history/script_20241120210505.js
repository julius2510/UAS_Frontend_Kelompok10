const apiKey = 'YOUR_SPOONACULAR_API_KEY'; // Ganti dengan API Key Anda
const searchForm = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');

// Fungsi untuk mendapatkan data dari API
async function getRecipes(query) {
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results; // Array resep
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
}

// Fungsi untuk menampilkan data ke dalam HTML
function displayRecipes(recipes) {
  resultsDiv.innerHTML = ''; // Bersihkan hasil sebelumnya
  if (recipes.length === 0) {
    resultsDiv.innerHTML = '<p class="text-center">Tidak ada resep ditemukan.</p>';
    return;
  }

  recipes.forEach(recipe => {
    const recipeCard = `
      <div class="col-md-4">
        <div class="card">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
          <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
            <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank" class="btn btn-primary">Lihat Detail</a>
          </div>
        </div>
      </div>
    `;
    resultsDiv.innerHTML += recipeCard;
  });
}

// Event listener untuk form pencarian
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('query').value;
  const recipes = await getRecipes(query);
  displayRecipes(recipes);
});
