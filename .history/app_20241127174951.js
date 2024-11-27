const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'images')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/art1', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'articleheader1.jpg'));
});
app.get('/art2', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'articleheader2.jpg'));
});
app.get('/art3', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'articleheader3.jpg'));
});
app.get('/art4', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'articleheader4.jpg'));
});
app.get('/art5', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'articleheader5.jpg'));
});

app.get('/loginin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/article', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'articles.html'));
});

app.get('/resep', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'saved_recipes.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

app.get('/addRecipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'addRecipe.html'));
});

app.get('/searchrecipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'searchrecipe.html'));
});

app.get('/editrecipe', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'editrecipe.html'));
});

app.get('/searchProducts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'searchProducts.html'));
});

app.get('/searchIngredients', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'searchIngredients.html'));
});
app.get('/mealPlanDay', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mealPlanDay.html'));
});

app.get('/mealPlanWeek', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mealPlanWeek.html'));
});

// meal planning
app.get('/mealPlanDay', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mealPlanDay.html'));
});

app.get('/mealPlanWeek', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mealPlanWeek.html'));
});

app.get('/generateMeal', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'generateMeal.html'));
});


app.get('/generateMeal', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'generateMeal.html'));
});

app.get('/Chatbot', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Chatbot.html'));
});

// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/cooking_mama',)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
});



// Recipe Schema
const recipesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: String, required: true },
  steps: { type: String, required: true },
});

// Models
const User = mongoose.model('User', userSchema);
const Recipe = mongoose.model('Recipe', recipesSchema);

// Sign Up Route
app.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, phone, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User signed up successfully', user: { name, email } });
  } catch (error) {
    res.status(400).json({ message: 'Error signing up', error: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add Recipe Route
app.post('/add-recipe', async (req, res) => {
  try {
    const { name, ingredients, steps } = req.body;
    const newRecipe = new Recipe({ name, ingredients, steps });
    
    await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error adding recipe', error });
  }
});

// Search Recipe Route
app.get('/search-recipe', async (req, res) => {
  const query = req.query.query;

  try {
    const recipes = await Recipe.find({
      name: { $regex: query, $options: 'i' }, 
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes', error });
  }
});

// edit recioe
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes." });
  }
});

// update recipe
app.put("/update-recipe", async (req, res) => {
  try {
    const { id, name, ingredients, steps } = req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { name, ingredients, steps },
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to update recipe." });
  }
});

//delete recipe by ID
app.delete('/delete-recipe/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the recipe", error: error.message });
  }
});

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update Profile API
app.post('/api/update-profile', async (req, res) => {
  const { email, newName, newEmail, newPhone, newPassword } = req.body;

  try {
    const updateFields = {};

    // Update fields dynamically
    if (newName) updateFields.name = newName;
    if (newEmail) updateFields.email = newEmail;
    if (newPhone) updateFields.phone = newPhone;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Enkripsi password
      updateFields.password = hashedPassword;
    }

    // Cari pengguna berdasarkan email lama
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true } // Mengembalikan dokumen yang diperbarui
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Update Password Route
app.post('/api/update-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password are required' });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find the user and update their password
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete Account Route
app.post('/api/delete-account', async (req, res) => {
  const { email } = req.body;  // Ambil email dari body permintaan

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Mencari dan menghapus akun pengguna berdasarkan email
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting account' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
