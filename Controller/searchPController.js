const apiKey = 'c77b4a6b7dad4a59b5e22314aafb30f2';
const searchProductsForm = document.getElementById('searchProductsForm');
const productResultsDiv = document.getElementById('productResults');

// Fungsi untuk mendapatkan data produk
async function searchProducts(query = '', number = 9) {
  const apiUrl = `https://api.spoonacular.com/food/products/search?apiKey=${apiKey}&query=${query}&number=${number}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.products; // Kembalikan array produk
  } catch (error) {
    console.error('Error fetching products:', error);
    productResultsDiv.innerHTML = `<p class="text-danger text-center">Terjadi kesalahan saat mengambil data produk.</p>`;
  }
}

// Fungsi untuk menampilkan produk
function displayProducts(products) {
  productResultsDiv.innerHTML = '';
  if (!products || products.length === 0) {
    productResultsDiv.innerHTML = '<p class="text-center">Tidak ada produk ditemukan.</p>';
    return;
  }

  products.forEach(product => {
    const productCard = `
      <div class="col-md-4">
        <div class="card shadow-lg border-0 h-100" style="overflow: hidden; transition: transform 0.3s;">
          <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary fw-bold">${product.title}</h5>
            <p class="text-secondary small">ID: ${product.id || 'Tidak diketahui'}</p>
            <div class="mt-auto">
              <button class="btn btn-success w-100 rounded-pill" onclick="alert('Produk ID: ${product.id}')">
                <i class="bi bi-eye"></i> Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    productResultsDiv.innerHTML += productCard;
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

// Event listener untuk form pencarian produk
searchProductsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('productQuery').value;

  const products = await searchProducts(query, 12); // Cari dengan query
  displayProducts(products);
});

// Tampilkan produk default saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
  const defaultProducts = await searchProducts('', 9); // Ambil 9 produk default
  displayProducts(defaultProducts);
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

// Menampilkan 9 bahan makanan pertama ketika halaman dimuat
window.addEventListener('load', async () => {
  const Products = await searchProducts('B');
  displayProducts(Products);
});