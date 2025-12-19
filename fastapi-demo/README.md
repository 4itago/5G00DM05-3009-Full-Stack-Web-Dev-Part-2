# FastAPI Movie CRUD API

A complete FastAPI implementation of the Movie Collection CRUD API, matching the Express.js version.

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- Query parameter filtering (title, director, year)
- Data validation with proper error messages
- Proper HTTP status codes (200, 201, 204, 400, 404)
- Automatic API documentation (Swagger UI and ReDoc)
- In-memory data storage (Python dictionaries)

## Setup

1. **Activate the virtual environment:**

   Windows (Git Bash):
   ```bash
   source venv/Scripts/activate
   ```

   macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn
   ```

3. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

   - `main` = the Python file name (main.py)
   - `app` = the FastAPI instance variable name
   - `--reload` = enables auto-reload on code changes

4. **Access the API:**
   - API Root: http://127.0.0.1:8000
   - Swagger UI: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

## API Endpoints

### Default Route
- **GET /** - Returns all movies as an HTML list

### Movie Endpoints

- **GET /movies** - Get all movies (with optional query parameters)
  - Query params: `?title=...&director=...&year=...`
- **GET /movies/{id}** - Get a movie by its ID
- **POST /movies** - Create a new movie (returns 201 Created)
- **PUT /movies/{id}** - Update an existing movie
- **DELETE /movies/{id}** - Delete a movie (returns 204 No Content)

## Testing with Swagger UI

1. Start the server: `uvicorn main:app --reload`
2. Open http://127.0.0.1:8000/docs in your browser
3. Click "Try it out" on any endpoint
4. Fill in parameters and click "Execute"
5. See the response below

## Default Movie Data

The server starts with three default movies:
- Inception (2010) - Christopher Nolan
- The Matrix (1999) - The Wachowskis
- Parasite (2019) - Bong Joon-ho

## Comparison with Express.js

This FastAPI implementation matches the Express.js version feature-for-feature:
- Same endpoints and functionality
- Same validation logic
- Same HTTP status codes
- Same query parameter filtering

Key differences:
- Automatic API documentation (Swagger UI)
- Type hints for validation
- Decorator-based routing
- Python instead of JavaScript

