const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path'); // Required to work with file paths

const app = express();
const port = 3000;

// Middleware untuk menyajikan file statis seperti CSS, JS, dll.
app.use(express.static(path.join(__dirname, '../public'))); // Folder 'public' untuk file statis

// Rute untuk halaman login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'login.html')); // Halaman login
});

// Rute untuk halaman signup
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'signup.html')); // Halaman signup
});

// Rute untuk halaman home
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'home.html')); // Halaman home
});

// Rute untuk halaman about
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'about.html')); // Halaman about
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/cooking_mama')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String
});

// Model
const User = mongoose.model('User', userSchema);

// Sign Up Route
app.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ name, email, phone, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).send('User signed up');
  } catch (error) {
    res.status(400).send('Error signing up: ' + error.message);
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send('Invalid password');
  }

  res.status(200).send('Logged in successfully');
});

// Menjalankan server pada port 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
