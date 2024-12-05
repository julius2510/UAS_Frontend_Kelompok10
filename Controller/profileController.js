document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('You are not logged in!');
      window.location.href = '/';
      return;
    }

    // Populate user data
    document.getElementById('profileName').innerText = user.name;
    document.getElementById('profileEmail').innerText = user.email;
    document.getElementById('profilePhone').innerText = user.phone;

    document.getElementById("updateProfileForm").addEventListener("submit", async (e) => { e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  const newName = document.getElementById("newName").value || user.name;
  const newEmail = document.getElementById("newEmail").value || user.email;
  const newPhone = document.getElementById("newPhone").value || user.phone;
  const newPassword = document.getElementById("newPassword").value;

  try {
    const response = await fetch("/api/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, newName, newEmail, newPhone, newPassword }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(result.user));
      location.reload();
    } else {
      alert("Error updating profile: " + result.message);
    }
  } catch (error) {
    alert("An error occurred while updating profile");
    console.error(error);
  }
});

    // Handle password update
    const updatePasswordForm = document.getElementById('updatePasswordForm');
    updatePasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById('newPassword').value;

      try {
        const response = await fetch('/api/update-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, newPassword }),
        });

        const result = await response.json();

        if (result.success) {
          alert('Password updated successfully!');
        } else {
          alert('Error updating password');
        }
      } catch (error) {
        alert('An error occurred while updating password');
      }
    });

    // Handle delete account
    document.getElementById('deleteAccountButton').addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
          const response = await fetch('/api/delete-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          });

          const result = await response.json();

          if (result.success) {
            alert('Account deleted successfully');
            localStorage.removeItem('user');
            window.location.href = '/';
          } else {
            alert('Error deleting account');
          }
        } catch (error) {
          alert('An error occurred while deleting account');
        }
      }
    });

    // Handle log out
    document.getElementById('logoutButton').addEventListener('click', () => {
      localStorage.removeItem('user');
      alert('Logged out successfully!');
      window.location.href = '/';
    });
  });

  // Handle delete account
  document.getElementById('deleteAccountButton').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));  // Ambil data pengguna dari localStorage
        const response = await fetch('/api/delete-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),  // Kirim email pengguna untuk dihapus
        });

        const result = await response.json();

        if (result.success) {
          alert('Account deleted successfully');
          localStorage.removeItem('user');  // Hapus data pengguna dari localStorage
          window.location.href = '/';  // Arahkan kembali ke halaman utama
        } else {
          alert('Error deleting account: ' + result.message);
        }
      } catch (error) {
        alert('An error occurred while deleting account');
        console.error(error);
      }
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