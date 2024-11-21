const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Set up Express app
const app = express();

// Body parser middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/cooking_mama', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

// Create a Mongoose schema for user
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
});

// Create Mongoose model for User
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if user already exists
  User.findOne({ email }, (err, user) => {
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ name, email, phone, password });
    newUser.save()
      .then(user => res.status(201).json({ message: 'User created', user }))
      .catch(err => res.status(500).json({ message: 'Error creating user', error: err }));
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email, password })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      res.status(200).json({ message: 'Login successful', user });
    })
    .catch(err => res.status(500).json({ message: 'Error logging in', error: err }));
});

// Start server

app.listen(port, () => {
  console.log(`Server running on port localhost:${port}`);
});
