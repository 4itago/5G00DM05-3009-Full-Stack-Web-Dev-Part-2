const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUserSignup, validateUserLogin } = require('../middleware/validation');

// POST /auth/signup - Register new user
router.post('/signup', validateUserSignup, authController.signup);

// POST /auth/login - Login user
router.post('/login', validateUserLogin, authController.login);

module.exports = router;

