require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { connectDatabase } = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const movieController = require('./controllers/movieController');

// Import routes
const moviesRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
// Root route - HTML list of movies
app.get('/', movieController.getMoviesHTML);

// API routes
app.use('/movies', moviesRoutes);
app.use('/auth', authRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;

