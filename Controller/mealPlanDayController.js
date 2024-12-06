const apiKey = '3a4bb7bba04f48c2a301ce1c3f1df88e';

document.getElementById('fetchMealPlan').addEventListener('click', async function() {
      const mealPlanContainer = document.getElementById('mealPlan');
      mealPlanContainer.innerHTML = '<p>Loading...</p>';

      try {
        const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?timeFrame=day&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.meals) {
          mealPlanContainer.innerHTML = `
            <div class="card">
              <div class="card-body">
                <h3 class="card-title">Breakfast</h3>
                <p>${data.meals[0].title}</p>
                <a href="https://spoonacular.com/recipes/${data.meals[0].title.replaceAll(' ', '-').toLowerCase()}-${data.meals[0].id}" target="_blank" class="btn btn-primary btn-sm">View Recipe</a>
              </div>
            </div>
            <div class="card mt-3">
              <div class="card-body">
                <h3 class="card-title">Lunch</h3>
                <p>${data.meals[1].title}</p>
                <a href="https://spoonacular.com/recipes/${data.meals[1].title.replaceAll(' ', '-').toLowerCase()}-${data.meals[1].id}" target="_blank" class="btn btn-primary btn-sm">View Recipe</a>
              </div>
            </div>
            <div class="card mt-3">
              <div class="card-body">
                <h3 class="card-title">Dinner</h3>
                <p>${data.meals[2].title}</p>
                <a href="https://spoonacular.com/recipes/${data.meals[2].title.replaceAll(' ', '-').toLowerCase()}-${data.meals[2].id}" target="_blank" class="btn btn-primary btn-sm">View Recipe</a>
              </div>
            </div>
          `;
        } else {
          mealPlanContainer.innerHTML = '<p>No meal plan found. Please try again later.</p>';
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
        mealPlanContainer.innerHTML = '<p>Error fetching meal plan. Please try again later.</p>';
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

