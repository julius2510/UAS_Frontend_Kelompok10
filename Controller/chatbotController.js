const apiKey = '3a4bb7bba04f48c2a301ce1c3f1df88e';
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const suggestionsDiv = document.getElementById('suggestions');

displayBotMessage("Hi! I'm your Cooking Assistant. How can I help you today?");

sendBtn.addEventListener('click', () => {
  const message = userInput.value;
  if (message) {
    displayUserMessage(message);
    handleUserMessage(message);
    userInput.value = ''; 
    suggestionsDiv.innerHTML = ''; 
  }
});


userInput.addEventListener('input', async () => {
  const query = userInput.value.trim();
  if (query.length >= 3) {
    const suggestions = await fetchRecipeSuggestions(query);
    displaySuggestions(suggestions);
  } else {
    suggestionsDiv.innerHTML = ''; 
  }
});


function displayUserMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('user-message');
  messageDiv.textContent = message;
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight; 
}

function displayBotMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('bot-message');
  messageDiv.textContent = message;
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight; 
}

async function handleUserMessage(message) {
  const query = message.toLowerCase();

  if (query.includes("recipe")) {
    const recipe = await fetchRecipe(query);
    displayBotMessage(`Here’s a recipe for you: ${recipe.title}\nIngredients: ${recipe.ingredients.join(", ")}\nDirections: ${recipe.instructions}`);
    if (recipe.image) {
      displayBotMessage(`Here's an image of the recipe:`);
      displayImage(recipe.image);
    }
  } else if (query.includes("nutrition")) {
    const ingredient = query.replace("nutrition", "").trim();
    const nutritionInfo = await fetchNutritionInfo(ingredient);
    displayBotMessage(`The nutritional information for ${ingredient}: \nCalories: ${nutritionInfo.calories} kcal\nProtein: ${nutritionInfo.protein}g\nFat: ${nutritionInfo.fat}g`);
  } else if (query.includes("random")) {
    const randomRecipe = await fetchRandomRecipe();
    displayBotMessage(`Here's a random recipe for you: ${randomRecipe.title}`);
    if (randomRecipe.image) {
      displayBotMessage(`Here's an image of the recipe:`);
      displayImage(randomRecipe.image);
    }
  } else {
    displayBotMessage("Sorry, I didn't understand that. Please try asking about recipes, ingredients, or nutrition.");
  }
}

async function fetchRecipe(query) {
  const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const recipeId = data.results[0].id;

    const recipeDetailsResponse = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
    const recipeDetails = await recipeDetailsResponse.json();

    return {
      title: recipeDetails.title,
      ingredients: recipeDetails.extendedIngredients.map(ingredient => ingredient.original), 
      instructions: recipeDetails.instructions || 'No instructions available', 
      image: recipeDetails.image 
    };
  } else {
    return { title: "No recipe found", ingredients: [], instructions: "No instructions available", image: "" };
  }
}

async function fetchNutritionInfo(ingredient) {
  const response = await fetch(`https://api.spoonacular.com/food/ingredients/${ingredient}/information?apiKey=${apiKey}`);
  const data = await response.json();
  return data.nutritional_info;
}

async function fetchRandomRecipe() {
  const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`);
  const data = await response.json();
  return {
    title: data.recipes[0].title,
    image: data.recipes[0].image 
  };
}

async function fetchRecipeSuggestions(query) {
  const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`);
  const data = await response.json();
  return data.results ? data.results.slice(0, 5) : []; 
}

function displaySuggestions(suggestions) {
  suggestionsDiv.innerHTML = '';
  if (suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      const suggestionDiv = document.createElement('div');
      suggestionDiv.classList.add('suggestion-item');
      suggestionDiv.textContent = suggestion.title;
      suggestionDiv.addEventListener('click', () => {
        userInput.value = suggestion.title; 
        suggestionsDiv.innerHTML = ''; 
      });
      suggestionsDiv.appendChild(suggestionDiv);
    });
  } else {
    suggestionsDiv.innerHTML = '<p>No suggestions found</p>';
  }
}


function displayImage(imageUrl) {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Recipe Image';
  img.classList.add('recipe-image');
  chatbox.appendChild(img);
  chatbox.scrollTop = chatbox.scrollHeight; 
}
  
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
    const formType = event.target.id; 
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
      localStorage.setItem("user", JSON.stringify(result.user));
      updateNavbarForLoggedInUser(result.user);
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

