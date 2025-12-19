const { getMoviesCollection } = require('../config/database');

// Get all movies with optional filtering
async function getAllMovies(req, res, next) {
  try {
    const moviesCollection = getMoviesCollection();
    let query = {};

    // Build query for filtering
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }

    if (req.query.director) {
      query.director = { $regex: req.query.director, $options: 'i' };
    }

    if (req.query.year) {
      const year = parseInt(req.query.year);
      if (!isNaN(year)) {
        query.year = year;
      }
    }

    const movies = await moviesCollection.find(query).toArray();
    res.json(movies);
  } catch (error) {
    next(error);
  }
}

// Get a single movie by ID
async function getMovieById(req, res, next) {
  try {
    const moviesCollection = getMoviesCollection();
    const id = parseInt(req.params.id);
    const movie = await moviesCollection.findOne({ id: id });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
}

// Create a new movie
async function createMovie(req, res, next) {
  try {
    const moviesCollection = getMoviesCollection();
    const { title, director, year } = req.body;

    // Generate new ID
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
    next(error);
  }
}

// Update an existing movie
async function updateMovie(req, res, next) {
  try {
    const moviesCollection = getMoviesCollection();
    const id = parseInt(req.params.id);

    // Check if movie exists
    const movie = await moviesCollection.findOne({ id: id });
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
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
    next(error);
  }
}

// Delete a movie
async function deleteMovie(req, res, next) {
  try {
    const moviesCollection = getMoviesCollection();
    const id = parseInt(req.params.id);
    const result = await moviesCollection.deleteOne({ id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Get movies as HTML (for root route)
async function getMoviesHTML(req, res, next) {
  try {
    const moviesCollection = getMoviesCollection();
    const movies = await moviesCollection.find({}).toArray();

    let html = '<!DOCTYPE html><html><head><title>Movie Collection</title></head><body>';
    html += '<h1>Movie Collection</h1><ul>';
    movies.forEach(movie => {
      html += `<li><strong>${movie.title}</strong> (${movie.year}) - Directed by ${movie.director} [ID: ${movie.id}]</li>`;
    });
    html += '</ul></body></html>';
    res.send(html);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesHTML
};

