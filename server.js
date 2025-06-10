require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in the environment");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in the environment");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ User Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

//Suggestion Model
const suggestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Suggestion = mongoose.model("Suggestion", suggestionSchema);

//RecipesSaved Model
const RecipesSavedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      adjustedQuantity: { type: String, required: true },
      unit: { type: String, default: "unit" }
    }
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
});

const RecipesSaved = mongoose.model("RecipesSaved", RecipesSavedSchema);

// ✅ Middleware for Protected Routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(401).json({ error: "Access denied. Invalid or expired token." });
  }
};

// ✅ Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Registration failed. Please try again later." });
  }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, message: "Login successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
});

//Suggestion Route
app.post('/suggestion', async (req, res) => {
  const { suggestion } = req.body;

  if (!suggestion || suggestion.trim() === "") {
    return res.status(400).json({ error: "Suggestion box cannot be empty" });
  }

  try {
    const newSuggestion = new Suggestion({ text: suggestion });
    await newSuggestion.save();
    res.json(newSuggestion);
  } catch (err) {
    console.error("Error saving suggestion:", err.message);
    res.status(500).json({ error: "Failed to save suggestion" });
  }
});


app.post('/savedrecipes', authenticateToken, async (req, res) => {
  const { name, ingredients, tags } = req.body;
  const userId = req.user.userId;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "You must name the recipe" });
  }
  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Please add ingredients" });
  }
  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: "Tags must be an array." });
  }


  try {
    const newRecipe = new RecipesSaved({ name, ingredients, tags, userId });
    await newRecipe.save();
    res.json(newRecipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Saving a recipe has failed. Please try again later." });
  }
});



//Loads Saved Suggestions
app.get('/suggestions', async (req, res) => {
  try {
    const loadSuggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json(loadSuggestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to load saved suggestions." });
  }
});

//Loads Saved Recipes
app.get('/savedrecipes', authenticateToken, async (req, res) => {
  try {
    const loadrecipes = await RecipesSaved.find({ userId: req.user.userId });
    res.json(loadrecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to load saved recipes." });
  }
});

//Loads a pressed single Recipes by id
app.get('/savedrecipes/:id', authenticateToken, async (req, res) => {
  try {
    const loadrecipe = await RecipesSaved.findById(req.params.id);
    if (!loadrecipe || loadrecipe.userId.toString() !== req.user.userId) return res.status(404).json({ error: "Failed to load saved recipe" });
    res.json(loadrecipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to load recipe." });
  }
});
// ✅ Protected Route Example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "You have accessed a protected route!", userId: req.user.userId });
});

// DELETE /savedrecipes/:id
app.delete('/savedrecipes/:id', authenticateToken, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.userId;

  try {
    const deleted = await RecipesSaved.deleteOne({ _id: recipeId, userId });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Recipe not found or not authorized." });
    }

    res.json({ message: "Recipe deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error while deleting recipe." });
  }
});

// ✅ Delete User Account
app.delete('/deleteaccount', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete all the user's saved recipes
    await RecipesSaved.deleteMany({ userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account and all data deleted successfully." });
  } catch (err) {
    console.error("Error deleting account:", err.message);
    res.status(500).json({ error: "Failed to delete account." });
  }
});


// ✅ Serve React Frontend
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
