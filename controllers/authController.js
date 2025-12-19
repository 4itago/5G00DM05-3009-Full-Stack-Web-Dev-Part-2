const bcrypt = require('bcrypt');
const { getUsersCollection } = require('../config/database');
const { generateToken } = require('../middleware/auth');

// Sign up (register) a new user
async function signup(req, res, next) {
  try {
    const usersCollection = getUsersCollection();
    const { username, password, name, email } = req.body;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate new user ID
    const maxUser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
    const newId = maxUser.length > 0 ? maxUser[0].id + 1 : 1;

    // Create new user
    const newUser = {
      id: newId,
      username: username,
      password: hashedPassword,
      name: name || '',
      email: email || ''
    };

    await usersCollection.insertOne(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Return user info (without password) and token
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email
      },
      token: token
    });
  } catch (error) {
    next(error);
  }
}

// Login existing user
async function login(req, res, next) {
  try {
    const usersCollection = getUsersCollection();
    const { username, password } = req.body;

    // Find user by username
    const user = await usersCollection.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate token
    const token = generateToken(user);

    // Return user info (without password) and token
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email
      },
      token: token
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login
};

