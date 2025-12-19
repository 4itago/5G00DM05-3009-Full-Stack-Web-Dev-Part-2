const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Default movie collection data
const movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

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

// GET /movies - List all movies (JSON)
app.get('/movies', (req, res) => {
  res.json(movies);
});

// POST /movies - Add a new movie
app.post('/movies', (req, res) => {
  // Check if req.body exists (middleware might not have parsed it)
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Request body is empty or invalid. Make sure Content-Type is set to application/json and body contains valid JSON.'
    });
  }

  const { title, director, year } = req.body;

  // Validation
  if (!title || !director || !year) {
    return res.status(400).json({
      error: 'Missing required fields. Please provide title, director, and year.'
    });
  }

  // Generate new ID
  const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;

  const newMovie = {
    id: newId,
    title,
    director,
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

