const apiKey = 'c30bb4e46d6d4ec082eb3f1c8cf1c071'; // API Key Anda
const searchForm = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');
const recipeDetailsDiv = document.getElementById('recipeDetails');

// Fungsi untuk mendapatkan data resep
async function getRecipes(query) {
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    resultsDiv.innerHTML = `<p class="text-danger text-center">Terjadi kesalahan saat mengambil data.</p>`;
  }
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

// Fungsi untuk menampilkan data resep
function displayRecipes(recipes) {
  resultsDiv.innerHTML = '';
  recipeDetailsDiv.innerHTML = ''; // Bersihkan detail sebelumnya
  if (!recipes || recipes.length === 0) {
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
            <button class="btn btn-info" onclick="showRecipeDetails(${recipe.id})">Lihat Detail</button>
          </div>
        </div>
      </div>
    `;
    resultsDiv.innerHTML += recipeCard;
  });
}

// Fungsi untuk menampilkan detail resep
async function showRecipeDetails(recipeId) {
  const recipe = await getRecipeDetails(recipeId);
  recipeDetailsDiv.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2>${recipe.title}</h2>
      </div>
      <div class="card-body">
        <img src="${recipe.image}" class="img-fluid mb-3" alt="${recipe.title}">
        <h5>Bahan-Bahan:</h5>
        <ul>
          ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
        </ul>
        <h5>Langkah-Langkah:</h5>
        <ol>
          ${recipe.analyzedInstructions.length > 0
            ? recipe.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join('')
            : '<li>Tidak ada langkah tersedia.</li>'}
        </ol>
      </div>
    </div>
  `;
}

// Event listener untuk form pencarian
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('query').value;
  const recipes = await getRecipes(query);
  displayRecipes(recipes);
});
