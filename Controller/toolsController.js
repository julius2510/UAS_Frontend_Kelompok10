const apiKey = '3a4bb7bba04f48c2a301ce1c3f1df88e'; 
const searchEquipmentForm = document.getElementById('searchEquipmentForm');
const equipmentResultDiv = document.getElementById('equipmentResult');

async function getEquipmentByRecipeId(recipeId) {
    const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/equipmentWidget.json?apiKey=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Peralatan tidak ditemukan untuk resep ini');
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error fetching equipment:', error);
        return null;
    }
}

function displayEquipment(equipmentData) {
    if (!equipmentData || !equipmentData.equipment || equipmentData.equipment.length === 0) {
        equipmentResultDiv.innerHTML = '<p class="text-danger">Detail equipment tidak ditemukan atau tidak tersedia.</p>';
        return;
    }

    const equipmentList = equipmentData.equipment.map(equipment => `
        <div class="card shadow-sm border-0 mx-auto mb-3" style="width: 70%;">
            <div class="row g-0">
                <div class="col-md-4">
                  <img src="${equipment.image ? `https://spoonacular.com/cdn/equipment_100x100/${equipment.image}` : 'https://via.placeholder.com/150'}"
                  class="img-fluid rounded-start" alt="${equipment.name}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title text-primary fw-bold">${equipment.name}</h5>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    equipmentResultDiv.innerHTML = `
        <h4 class="text-success mb-4">Daftar Peralatan</h4>
        ${equipmentList}
    `;
}

searchEquipmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const recipeId = document.getElementById('recipeId').value;

    if (!recipeId) {
        equipmentResultDiv.innerHTML = '<p class="text-danger">Harap masukkan ID Tools!</p>';
        return;
    }

    equipmentResultDiv.innerHTML = '<p class="text-info">Sedang mencari...</p>';
    const equipmentData = await getEquipmentByRecipeId(recipeId);
    displayEquipment(equipmentData); 
});
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

// Menampilkan 9 bahan makanan pertama ketika halaman dimuat
window.addEventListener('load', async () => {
  const Products = await searchProducts('B');
  displayProducts(Products);
});
