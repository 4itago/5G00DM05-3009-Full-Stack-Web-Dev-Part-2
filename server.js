const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// HTTP request logging middleware (dev format)
app.use(morgan('dev'));

// Default movie collection data
const movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

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

// Default route - returns all movies as HTML list
app.get('/', (req, res) => {
  let html = '<!DOCTYPE html><html><head><title>Movie Collection</title></head><body>';
  html += '<h1>Movie Collection</h1><ul>';
  movies.forEach(movie => {
    html += `<li><strong>${movie.title}</strong> (${movie.year}) - Directed by ${movie.director} [ID: ${movie.id}]</li>`;
  });
  html += '</ul></body></html>';
  res.send(html);
});

// GET /movies - List all movies (JSON) with optional query parameters
app.get('/movies', (req, res) => {
  let filteredMovies = [...movies];

  // Filter by title (case-insensitive partial match)
  if (req.query.title) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.title.toLowerCase().includes(req.query.title.toLowerCase())
    );
  }

  // Filter by director (case-insensitive partial match)
  if (req.query.director) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.director.toLowerCase().includes(req.query.director.toLowerCase())
    );
  }

  // Filter by year (exact match)
  if (req.query.year) {
    const year = parseInt(req.query.year);
    if (!isNaN(year)) {
      filteredMovies = filteredMovies.filter(movie => movie.year === year);
    }
  }

  res.json(filteredMovies);
});

// POST /movies - Add a new movie
app.post('/movies', (req, res) => {
  // Check if req.body exists (middleware might not have parsed it)
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

  // Generate new ID
  const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;

  const newMovie = {
    id: newId,
    title: title.trim(),
    director: director.trim(),
    year: parseInt(year)
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// GET /movies/:id - Get a movie by its id
app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.json(movie);
});

// PUT /movies/:id - Update an existing movie
app.put('/movies/:id', (req, res) => {
  // Check if req.body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Request body is empty or invalid. Make sure Content-Type is set to application/json and body contains valid JSON.'
    });
  }

  const id = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  // Validate movie data (for updates, fields are optional)
  const validationErrors = validateMovie(req.body, true);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: validationErrors.join(' ')
    });
  }

  // Update only provided fields
  const { title, director, year } = req.body;
  if (title !== undefined) movies[movieIndex].title = title.trim();
  if (director !== undefined) movies[movieIndex].director = director.trim();
  if (year !== undefined) movies[movieIndex].year = parseInt(year);

  res.json(movies[movieIndex]);
});

// DELETE /movies/:id - Delete a movie by its id
app.delete('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  movies.splice(movieIndex, 1);
  res.status(204).send();
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

