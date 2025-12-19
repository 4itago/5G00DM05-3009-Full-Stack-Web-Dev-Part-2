const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { validateMovie, validateMovieUpdate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// GET /movies - Get all movies (public, no auth required)
router.get('/', movieController.getAllMovies);

// GET /movies/:id - Get movie by ID (public, no auth required)
router.get('/:id', movieController.getMovieById);

// POST /movies - Create new movie (requires authentication)
router.post('/', authenticateToken, validateMovie, movieController.createMovie);

// PUT /movies/:id - Update movie (requires authentication)
router.put('/:id', authenticateToken, validateMovieUpdate, movieController.updateMovie);

// DELETE /movies/:id - Delete movie (requires authentication)
router.delete('/:id', authenticateToken, movieController.deleteMovie);

module.exports = router;

