# Movie Collection CRUD API

A complete Express.js API for managing a movie collection. This project demonstrates full CRUD operations, query parameter filtering, request logging, and API testing.

## Project Setup

1. **Initialize the project:**
   ```bash
   npm init -y
   ```

2. **Install dependencies:**
   ```bash
   npm install express morgan
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

**CRUD Operations:**
- **GET /movies** - Get all movies (JSON)
  - Query parameters: `?title=...&director=...&year=...` (filtering)
- **GET /movies/:id** - Get a movie by its ID
- **POST /movies** - Add a new movie
  - Body: `{ "title": "Movie Title", "director": "Director Name", "year": 2024 }`
  - Returns: 201 Created
- **PUT /movies/:id** - Update an existing movie
  - Body: `{ "title": "...", "director": "...", "year": ... }` (partial updates allowed)
  - Returns: 200 OK or 404 Not Found
- **DELETE /movies/:id** - Delete a movie by its ID
  - Returns: 204 No Content or 404 Not Found

**Features:**
- Full CRUD operations
- Query parameter filtering (title, director, year)
- Data validation (required fields, year range: 1888-present)
- Proper HTTP status codes (200, 201, 204, 400, 404)
- Request logging with Morgan
- Catch-all route for undefined endpoints

## Testing

### Using REST Client (VSCode Extension)

1. Install the REST Client extension in VSCode
2. Open `api-test.http`
3. Click "Send Request" above each request to test the endpoints
4. File includes tests for all CRUD operations and query parameters

### Using JSON Client

1. Install the JSON Client extension in VSCode
2. Open `api-tests.json`
3. Run automated tests for all endpoints

### Using Postman

1. Import the endpoints into Postman
2. Create a collection called "Movie Collection API"
3. Test each endpoint with sample data

## Logging

The server uses **Morgan** for HTTP request logging. All requests are logged to the console in development format, showing:
- HTTP method
- URL path
- Status code
- Response time

Example log output:
```
GET /movies 200 15.234 ms
POST /movies 201 8.123 ms
DELETE /movies/1 204 3.456 ms
```

## Project Structure

```
.
├── server.js                    # Main Express server file
├── api-test.http                # REST Client test file
├── api-tests.json               # JSON Client automated tests
├── package.json                 # Project dependencies and scripts
└── fastapi-demo/                # FastAPI comparison demo
```

## Default Movie Data

The server starts with three default movies:
- Inception (2010) - Christopher Nolan
- The Matrix (1999) - The Wachowskis
- Parasite (2019) - Bong Joon-ho

