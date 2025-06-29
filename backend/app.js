const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import routes
const routes = require('./routes/routes'); // Adjust path to your main routes file

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://naibiabdulhamid:yY8oaihiIM2Uov82@cluster0.xg4m2dh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Use routes
app.use('/', routes);

// Global error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : error.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

// Route to list all available routes
app.get('/routes', (req, res) => {
  const availableRoutes = [
    { method: 'GET', path: '/health', description: 'Check server health' },
    { method: 'GET', path: '/routes', description: 'List all available routes' },
    // Add other routes here as needed
  ];
  res.status(200).json({
    success: true,
    routes: availableRoutes,
  });
});