
let allArticles = []; // Store all fetched articles

// Fetch articles from the server
fetch('/api/articles')
  .then(response => response.json())
  .then(articles => {
    allArticles = articles; // Save all articles
    displayArticles(allArticles); // Display all articles initially
  })
  .catch(error => {
    console.error('Error fetching articles:', error);
  });

// Function to display articles as cards
function displayArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = ''; // Clear existing articles

  if (articles.length > 0) {
    articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.classList.add('article');

      const titleElement = document.createElement('h3');
      titleElement.textContent = article.title;

      const contentElement = document.createElement('p');
      contentElement.textContent = article.content;

      // Add tags to the article card
      const tagsElement = document.createElement('p');
      tagsElement.textContent = 'Tags: ' + (article.tags.join(', ') || 'No tags');

      // Append the elements to the article card
      articleElement.appendChild(titleElement);
      articleElement.appendChild(contentElement);
      articleElement.appendChild(tagsElement);

      // Append the article card to the container
      container.appendChild(articleElement);
    });
  } else {
    container.innerHTML = 'No articles found.';
  }
}

// Function to filter articles by tag
function filterByTag(event) {
  const selectedTag = event.target.getAttribute('data-category');
  let filteredArticles = allArticles;

  if (selectedTag && selectedTag !== 'All') {
    filteredArticles = allArticles.filter(article => article.tags.includes(selectedTag));
  }

  displayArticles(filteredArticles); // Display the filtered articles
}

// Attach event listeners to each tag
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', filterByTag);
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