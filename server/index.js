const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes
const authRoutes = require('./routes/authRoutes');  // Authentication routes
app.use('/api/auth', authRoutes);

// Example Schema + Routes (for todos)
const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', authenticateToken, async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', authenticateToken, async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.json(newTodo);
});

app.put('/todos/:id', authenticateToken, async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTodo);
});

app.delete('/todos/:id', authenticateToken, async (req, res) => {
  await Todo.findByIdAndRemove(req.params.id);
  res.json({ message: 'Todo deleted successfully' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

