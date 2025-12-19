# Movie Collection CRUD API

A simple Express.js API for managing a movie collection. This project demonstrates basic CRUD operations and API testing.

## Project Setup

1. **Initialize the project:**
   ```bash
   npm init -y
   ```

2. **Install Express:**
   ```bash
   npm install express
   ```

## Running the Server

Start the server with:
```bash
npm start
```

Or directly:
```bash
node server.js
```

The server will run on `http://localhost:3000`

## API Endpoints

### Default Route
- **GET /** - Returns all movies as an HTML list (web page)

### Movie Endpoints
- **GET /movies** - Get all movies (JSON)
- **POST /movies** - Add a new movie
  - Body: `{ "title": "Movie Title", "director": "Director Name", "year": 2024 }`
- **GET /movies/:id** - Get a movie by its ID

## Testing

### Using REST Client (VSCode Extension)

1. Install the REST Client extension in VSCode
2. Open `api-test.http`
3. Click "Send Request" above each request to test the endpoints

### Using Postman

1. Import the endpoints into Postman
2. Create a collection called "Movie Collection API"
3. Test each endpoint with sample data

## Project Structure

```
.
├── server.js           # Main Express server file
├── api-test.http       # REST Client test file
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## Default Movie Data

The server starts with three default movies:
- Inception (2010) - Christopher Nolan
- The Matrix (1999) - The Wachowskis
- Parasite (2019) - Bong Joon-ho

