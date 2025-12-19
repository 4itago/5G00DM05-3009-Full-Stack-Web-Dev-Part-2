require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME || 'moviecollection';

const client = new MongoClient(uri);

let db = null;
let moviesCollection = null;
let usersCollection = null;

// Initial movie data (for seeding database)
const initialMovies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }
];

async function connectDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db(dbName);
    moviesCollection = db.collection("movies");
    usersCollection = db.collection("users");

    // Seed initial movies if database is empty
    const movieCount = await moviesCollection.countDocuments();
    if (movieCount === 0) {
      const result = await moviesCollection.insertMany(initialMovies);
      console.log(`Initial ${result.insertedCount} movies created`);
    } else {
      console.log(`Database already contains ${movieCount} movies`);
    }
  } catch (err) {
    console.error("MongoDB connection or init failed:", err);
    throw err;
  }
}

function getMoviesCollection() {
  return moviesCollection;
}

function getUsersCollection() {
  return usersCollection;
}

function getDatabase() {
  return db;
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await client.close();
  process.exit(0);
});

module.exports = {
  connectDatabase,
  getMoviesCollection,
  getUsersCollection,
  getDatabase
};

