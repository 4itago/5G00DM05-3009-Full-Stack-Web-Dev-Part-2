from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse
from typing import Optional
from datetime import datetime

app = FastAPI()

# In-memory movie collection (same data as Express version)
movies = [
    {"id": 1, "title": "Inception", "director": "Christopher Nolan", "year": 2010},
    {"id": 2, "title": "The Matrix", "director": "The Wachowskis", "year": 1999},
    {"id": 3, "title": "Parasite", "director": "Bong Joon-ho", "year": 2019}
]

# Helper function to generate next ID
def get_next_id():
    if len(movies) == 0:
        return 1
    return max(movie["id"] for movie in movies) + 1

# Validation helper function (similar to Express version)
def validate_movie(data: dict, is_update: bool = False):
    errors = []

    # For POST, all fields are required; for PUT, at least one field should be present
    if not is_update and (not data.get("title") or not data.get("director") or not data.get("year")):
        errors.append("Missing required fields. Please provide title, director, and year.")

    if "title" in data:
        title = data["title"]
        if not title or not isinstance(title, str) or title.strip() == "":
            errors.append("Title must be a non-empty string.")

    if "director" in data:
        director = data["director"]
        if not director or not isinstance(director, str) or director.strip() == "":
            errors.append("Director must be a non-empty string.")

    if "year" in data:
        try:
            year = int(data["year"])
            current_year = datetime.now().year
            if year < 1888 or year > current_year + 1:
                errors.append(f"Year must be a valid number between 1888 and {current_year + 1}.")
        except (ValueError, TypeError):
            errors.append("Year must be a valid number.")

    return errors

# Default route - returns all movies as HTML list
@app.get("/", response_class=HTMLResponse)
def root():
    html = '<!DOCTYPE html><html><head><title>Movie Collection</title></head><body>'
    html += '<h1>Movie Collection</h1><ul>'
    for movie in movies:
        html += f'<li><strong>{movie["title"]}</strong> ({movie["year"]}) - Directed by {movie["director"]} [ID: {movie["id"]}]</li>'
    html += '</ul></body></html>'
    return html

# GET /movies - List all movies with optional query parameters
@app.get("/movies")
def get_movies(
    title: Optional[str] = Query(None, description="Filter by title (case-insensitive partial match)"),
    director: Optional[str] = Query(None, description="Filter by director (case-insensitive partial match)"),
    year: Optional[int] = Query(None, description="Filter by year (exact match)")
):
    filtered_movies = movies.copy()

    # Filter by title (case-insensitive partial match)
    if title:
        filtered_movies = [
            movie for movie in filtered_movies
            if title.lower() in movie["title"].lower()
        ]

    # Filter by director (case-insensitive partial match)
    if director:
        filtered_movies = [
            movie for movie in filtered_movies
            if director.lower() in movie["director"].lower()
        ]

    # Filter by year (exact match)
    if year is not None:
        filtered_movies = [
            movie for movie in filtered_movies
            if movie["year"] == year
        ]

    return filtered_movies

# GET /movies/{id} - Get a movie by its ID
@app.get("/movies/{movie_id}")
def get_movie(movie_id: int):
    movie = next((m for m in movies if m["id"] == movie_id), None)

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return movie

# POST /movies - Add a new movie
@app.post("/movies", status_code=201)
def create_movie(movie_data: dict):
    # Validate movie data
    validation_errors = validate_movie(movie_data, is_update=False)
    if validation_errors:
        raise HTTPException(status_code=400, detail=" ".join(validation_errors))

    # Generate new ID
    new_id = get_next_id()

    # Create new movie
    new_movie = {
        "id": new_id,
        "title": movie_data["title"].strip(),
        "director": movie_data["director"].strip(),
        "year": int(movie_data["year"])
    }

    movies.append(new_movie)
    return new_movie

# PUT /movies/{id} - Update an existing movie
@app.put("/movies/{movie_id}")
def update_movie(movie_id: int, movie_data: dict):
    # Find movie index
    movie_index = next((i for i, m in enumerate(movies) if m["id"] == movie_id), None)

    if movie_index is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    # Validate movie data (for updates, fields are optional)
    validation_errors = validate_movie(movie_data, is_update=True)
    if validation_errors:
        raise HTTPException(status_code=400, detail=" ".join(validation_errors))

    # Update only provided fields
    if "title" in movie_data:
        movies[movie_index]["title"] = movie_data["title"].strip()
    if "director" in movie_data:
        movies[movie_index]["director"] = movie_data["director"].strip()
    if "year" in movie_data:
        movies[movie_index]["year"] = int(movie_data["year"])

    return movies[movie_index]

# DELETE /movies/{id} - Delete a movie by its ID
@app.delete("/movies/{movie_id}", status_code=204)
def delete_movie(movie_id: int):
    # Find movie index
    movie_index = next((i for i, m in enumerate(movies) if m["id"] == movie_id), None)

    if movie_index is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    movies.pop(movie_index)
    return None

# Catch-all route for undefined routes
@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def catch_all(path: str):
    raise HTTPException(status_code=404, detail="Route not found")
