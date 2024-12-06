const apiKey = '3a4bb7bba04f48c2a301ce1c3f1df88e';

document.getElementById("fetchMealPlan").addEventListener("click", async () => {
  try {
    const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?timeFrame=week&apiKey=${apiKey}`);
    if (!response.ok) {
      throw new Error("Failed to fetch meal plan. Please try again later.");
    }
    
    const data = await response.json();
    displayMealPlan(data.week);
  } catch (error) {
    console.error("Error fetching meal plan:", error.message);
    alert("Failed to load meal plan: " + error.message);
  }
});

function displayMealPlan(week) {
  const mealPlanContainer = document.getElementById("mealPlanResults");
  mealPlanContainer.innerHTML = ""; // Clear previous results
  
  Object.keys(week).forEach(day => {
    const meals = week[day].meals;
    const nutrients = week[day].nutrients;

    const dayCard = `
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title text-center fw-bold">${day.charAt(0).toUpperCase() + day.slice(1)}</h5>
            <ul class="list-group list-group-flush">
              ${meals.map(meal => `
                <li class="list-group-item">
                  <a href="${meal.sourceUrl}" target="_blank" class="text-decoration-none text-primary">${meal.title}</a>
                </li>`).join('')}
            </ul>
            <div class="mt-3">
              <p><strong>Calories:</strong> ${nutrients.calories} kcal</p>
              <p><strong>Protein:</strong> ${nutrients.protein} g</p>
              <p><strong>Fat:</strong> ${nutrients.fat} g</p>
              <p><strong>Carbs:</strong> ${nutrients.carbohydrates} g</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    mealPlanContainer.insertAdjacentHTML("beforeend", dayCard);
  });
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
        <i class="bi bi-person-circle fs-3 text-secondary me-2" style="pointer-events: none;"></i>
        <a href="/profile" style="text-decoration: none;">${user.name}</a>
      </div>
    `;
    signupLoginButton.outerHTML = userProfileHtml;
  }

