require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Read environment variables from .env
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME || 'moviecollection';

// MongoDB client
const client = new MongoClient(uri);

// Collection reference (will be set after connection)
let moviesCollection;

// Initial movie data (for seeding database)
const initialMovies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

// Middleware to parse JSON bodies
app.use(express.json());

// HTTP request logging middleware (dev format)
app.use(morgan('dev'));

// Validation helper function
function validateMovie(data, isUpdate = false) {
  const errors = [];

  // For POST, all fields are required; for PUT, at least one field should be present
  if (!isUpdate && (!data.title || !data.director || !data.year)) {
    errors.push('Missing required fields. Please provide title, director, and year.');
  }

  if (data.title !== undefined && (!data.title || typeof data.title !== 'string' || data.title.trim() === '')) {
    errors.push('Title must be a non-empty string.');
  }

  if (data.director !== undefined && (!data.director || typeof data.director !== 'string' || data.director.trim() === '')) {
    errors.push('Director must be a non-empty string.');
  }

  if (data.year !== undefined) {
    const year = parseInt(data.year);
    if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 1) {
      errors.push(`Year must be a valid number between 1888 and ${new Date().getFullYear() + 1}.`);
    }
  }

  return errors;
}

// Initialize database connection and seed initial data
async function initDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    moviesCollection = db.collection("movies");

    // Check if there are movies in the database. If not, add the initial movies
    const count = await moviesCollection.countDocuments();
    if (count === 0) {
      // No movies there -> let's create the initial movies
      const result = await moviesCollection.insertMany(initialMovies);
      console.log(`Initial ${result.insertedCount} movies created`);
    } else {
      console.log(`Database already contains ${count} movies`);
    }
  } catch (err) {
    console.error("MongoDB connection or init failed:", err);
    throw err;
  }
}

// Default route - returns all movies as HTML list
app.get('/', async (req, res) => {
  try {
    const movies = await moviesCollection.find({}).toArray();
    let html = '<!DOCTYPE html><html><head><title>Movie Collection</title></head><body>';
    html += '<h1>Movie Collection</h1><ul>';
    movies.forEach(movie => {
      html += `<li><strong>${movie.title}</strong> (${movie.year}) - Directed by ${movie.director} [ID: ${movie.id}]</li>`;
    });
    html += '</ul></body></html>';
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// GET /movies - List all movies (JSON) with optional query parameters
app.get('/movies', async (req, res) => {
  try {
    let query = {};

    // Build query for filtering
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' }; // case-insensitive
    }

    if (req.query.director) {
      query.director = { $regex: req.query.director, $options: 'i' }; // case-insensitive
    }

    if (req.query.year) {
      const year = parseInt(req.query.year);
      if (!isNaN(year)) {
        query.year = year;
      }
    }

    const filteredMovies = await moviesCollection.find(query).toArray();
    res.json(filteredMovies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// GET /movies/:id - Get a movie by its id
app.get('/movies/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const movie = await moviesCollection.findOne({ id: id });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// POST /movies - Add a new movie
app.post('/movies', async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Request body is empty or invalid. Make sure Content-Type is set to application/json and body contains valid JSON.'
      });
    }

    // Validate movie data
    const validationErrors = validateMovie(req.body, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: validationErrors.join(' ')
      });
    }

    const { title, director, year } = req.body;

    // Generate new ID - find max ID and add 1
    const maxMovie = await moviesCollection.find().sort({ id: -1 }).limit(1).toArray();
    const newId = maxMovie.length > 0 ? maxMovie[0].id + 1 : 1;

    const newMovie = {
      id: newId,
      title: title.trim(),
      director: director.trim(),
      year: parseInt(year)
    };

    await moviesCollection.insertOne(newMovie);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

// PUT /movies/:id - Update an existing movie
app.put('/movies/:id', async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Request body is empty or invalid. Make sure Content-Type is set to application/json and body contains valid JSON.'
      });
    }

    const id = parseInt(req.params.id);
    const movie = await moviesCollection.findOne({ id: id });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Validate movie data (for updates, fields are optional)
    const validationErrors = validateMovie(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: validationErrors.join(' ')
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title.trim();
    if (req.body.director !== undefined) updateData.director = req.body.director.trim();
    if (req.body.year !== undefined) updateData.year = parseInt(req.body.year);

    await moviesCollection.updateOne(
      { id: id },
      { $set: updateData }
    );

    // Fetch and return updated movie
    const updatedMovie = await moviesCollection.findOne({ id: id });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// DELETE /movies/:id - Delete a movie by its id
app.delete('/movies/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await moviesCollection.deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await client.close();
  process.exit(0);
});

// Start the server
startServer();

