document.addEventListener("DOMContentLoaded", async function () {
    const recipeSelect = document.getElementById("recipeSelect");
    const recipeDetails = document.getElementById("recipeDetails");
    const recipeNameInput = document.getElementById("recipeName");
    const ingredientsTextarea = document.getElementById("ingredients");
    const stepsTextarea = document.getElementById("steps");
    const deleteRecipeBtn = document.getElementById("deleteRecipeBtn");

    try {
        // Fetch existing recipes from MongoDB
        const response = await fetch("http://localhost:3000/recipes");
        const recipes = await response.json();

        // Populate recipe dropdown
        recipes.forEach(recipe => {
        const option = document.createElement("option");
        option.value = recipe._id;
        option.textContent = recipe.name;
        recipeSelect.appendChild(option);
        });

        // Load selected recipe details
        recipeSelect.addEventListener("change", () => {
        const selectedRecipe = recipes.find(recipe => recipe._id === recipeSelect.value);
        if (selectedRecipe) {
            recipeNameInput.value = selectedRecipe.name;
            ingredientsTextarea.value = selectedRecipe.ingredients;
            stepsTextarea.value = selectedRecipe.steps;
            recipeDetails.classList.remove("d-none");
        } else {
            recipeDetails.classList.add("d-none");
        }
        });

        // Submit updated recipe to the server
        document.getElementById("editRecipeForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedRecipe = {
            id: recipeSelect.value,
            name: recipeNameInput.value,
            ingredients: ingredientsTextarea.value,
            steps: stepsTextarea.value,
        };

        try {
            const updateResponse = await fetch("http://localhost:3000/update-recipe", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRecipe),
            });

            if (updateResponse.ok) {
            alert("Recipe updated successfully!");
            window.location.reload();
            } else {
            const error = await updateResponse.json();
            alert(error.message || "Failed to update the recipe.");
            }
        } catch (error) {
            alert("Error occurred: " + error.message);
        }
        });

        // Delete recipe
        deleteRecipeBtn.addEventListener("click", async function () {
        const recipeId = recipeSelect.value;

        if (recipeId && confirm("Are you sure you want to delete this recipe?")) {
            try {
            const deleteResponse = await fetch(`http://localhost:3000/delete-recipe/${recipeId}`, {
                method: "DELETE",
            });

            if (deleteResponse.ok) {
                alert("Recipe deleted successfully!");
                window.location.reload();
            } else {
                const error = await deleteResponse.json();
                alert(error.message || "Failed to delete the recipe.");
            }
            } catch (error) {
            alert("Error occurred: " + error.message);
            }
        }
        });

    } catch (error) {
        alert("Error loading recipes: " + error.message);
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
        <i class="bi bi-person-circle fs-3 text-secondary me-2"></i>
        <a href="/profile" style="text-decoration: none;">${user.name}</a>
      </div>
    `;
    signupLoginButton.outerHTML = userProfileHtml;
  }