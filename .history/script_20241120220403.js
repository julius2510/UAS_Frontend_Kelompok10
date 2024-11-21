<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resep Masakan</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    .spinner {
      width: 3rem;
      height: 3rem;
      border: 0.3em solid rgba(0, 0, 0, 0.1);
      border-top: 0.3em solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>

<div class="container mt-4">
  <h1>Temukan Resep Masakan</h1>
  
  <!-- Form Pencarian -->
  <form id="searchForm">
    <div class="input-group mb-3">
      <input type="text" class="form-control" id="query" placeholder="Cari Resep...">
      <button class="btn btn-primary" type="submit">Cari</button>
    </div>
  </form>

  <!-- Div untuk hasil pencarian resep -->
  <div id="results" class="row">
    <!-- Hasil resep akan ditampilkan di sini -->
  </div>

  <!-- Div untuk detail resep -->
  <div id="recipeDetails" class="mt-4">
    <!-- Detail resep akan ditampilkan di sini -->
  </div>
</div>

<script>
// API Key Anda
const apiKey = 'c30bb4e46d6d4ec082eb3f1c8cf1c071';
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
      <div class="col-md-4 mb-3">
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
  recipeDetailsDiv.innerHTML = '<div class="text-center spinner"></div>'; // Menampilkan loading spinner
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
  if (!query) {
    alert('Masukkan kata kunci pencarian.');
    return;
  }

  resultsDiv.innerHTML = '<div class="text-center spinner"></div>'; // Menampilkan loading spinner

  const recipes = await getRecipes(query);
  displayRecipes(recipes);
);
</script>

</body>
</html>
