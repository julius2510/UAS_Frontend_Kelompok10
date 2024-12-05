
document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3000/add-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Error occurred while adding recipe.");
        return;
      }

      // Show success message
      document.getElementById("successMessage").classList.remove("d-none");

      // Clear form
      event.target.reset();
    } catch (error) {
      alert("Error occurred: " + error.message);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('#carouselExampleFadeUp');
    const carouselInstance = new bootstrap.Carousel(carousel, {
      interval: 3000, // Waktu antar slide (3 detik)
      ride: 'carousel', // Memulai otomatis
    });
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