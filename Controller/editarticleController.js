        // Fetch articles from backend
        async function fetchArticles() {
            const response = await fetch('http://localhost:3000/api/articles');
            const articles = await response.json();

            const articleSelect = document.getElementById('articleSelect');
            articles.forEach(article => {
                const option = document.createElement('option');
                option.value = article._id;  // Use _id as the article ID
                option.textContent = article.title;
                articleSelect.appendChild(option);
            });
        }

        fetchArticles();

        // Event listener for article selection
        document.getElementById('articleSelect').addEventListener('change', (e) => {
            const selectedArticleId = e.target.value;

            if (selectedArticleId) {
                // Fetch the selected article
                fetch(`http://localhost:3000/api/articles/${selectedArticleId}`)
                    .then(response => response.json())
                    .then(article => {
                        document.getElementById('title').value = article.title;
                        document.getElementById('content').value = article.content;

                        // Set the checkboxes based on article tags
                        document.getElementById('tagHealthy').checked = article.tags.includes('Healthy');
                        document.getElementById('tagQuickly').checked = article.tags.includes('Quickly');
                        document.getElementById('tagEasy').checked = article.tags.includes('Easy');
                        document.getElementById('tagDessert').checked = article.tags.includes('Dessert');

                        // Show delete button
                        document.getElementById('deleteBtn').style.display = 'inline-block';
                    });
            }
        });

        // Event listener for delete button
        document.getElementById('deleteBtn').addEventListener('click', () => {
            const selectedArticleId = document.getElementById('articleSelect').value;
            if (selectedArticleId) {
                fetch(`http://localhost:3000/api/articles/${selectedArticleId}`, { method: 'DELETE' })
                    .then(() => {
                        alert('Article deleted');
                        document.getElementById('articleSelect').value = '';
                        document.getElementById('title').value = '';
                        document.getElementById('content').value = '';
                        document.getElementById('deleteBtn').style.display = 'none';
                        fetchArticles();  // Refresh the dropdown
                    });
            }
        });

        // Event listener for update article form submission
        document.getElementById('editArticleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedArticleId = document.getElementById('articleSelect').value;
            const updatedTitle = document.getElementById('title').value;
            const updatedContent = document.getElementById('content').value;
            const updatedTags = [
                document.getElementById('tagHealthy').checked ? 'Healthy' : '',
                document.getElementById('tagQuickly').checked ? 'Quickly' : '',
                document.getElementById('tagEasy').checked ? 'Easy' : '',
                document.getElementById('tagDessert').checked ? 'Dessert' : ''
            ].filter(Boolean);

            fetch(`http://localhost:3000/api/articles/${selectedArticleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: updatedTitle, content: updatedContent, tags: updatedTags }),
            }).then(response => response.json())
              .then(() => {
                  alert('Article updated');
                  fetchArticles();  // Refresh the dropdown
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