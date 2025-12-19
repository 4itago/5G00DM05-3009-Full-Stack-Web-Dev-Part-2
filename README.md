# Movie Collection CRUD API

A complete Express.js API for managing a movie collection. This project demonstrates full CRUD operations, query parameter filtering, request logging, and API testing.

## Project Setup

1. **Initialize the project:**
   ```bash
   npm init -y
   ```

2. **Install dependencies:**
   ```bash
   npm install express morgan mongodb dotenv joi jsonwebtoken bcrypt
   ```

## Running the Server

Start the server with:
```bash
npm start
```

Or directly:
```bash
node app.js
```

The server will run on `http://localhost:3000`

## API Endpoints

### Default Route
- **GET /** - Returns all movies as an HTML list (web page)

### Movie Endpoints

**CRUD Operations:**
- **GET /movies** - Get all movies (JSON, public)
  - Query parameters: `?title=...&director=...&year=...` (filtering)
- **GET /movies/:id** - Get a movie by its ID (public)
- **POST /movies** - Add a new movie (requires authentication)
  - Body: `{ "title": "Movie Title", "director": "Director Name", "year": 2024 }`
  - Returns: 201 Created
- **PUT /movies/:id** - Update an existing movie (requires authentication)
  - Body: `{ "title": "...", "director": "...", "year": ... }` (partial updates allowed)
  - Returns: 200 OK or 404 Not Found
- **DELETE /movies/:id** - Delete a movie by its ID (requires authentication)
  - Returns: 204 No Content or 404 Not Found

**Authentication Endpoints:**
- **POST /auth/signup** - Register a new user
  - Body: `{ "username": "...", "password": "...", "name": "...", "email": "..." }`
  - Returns: User info and JWT token
- **POST /auth/login** - Login user
  - Body: `{ "username": "...", "password": "..." }`
  - Returns: User info and JWT token

**Features:**
- Modular architecture (routes, controllers, middleware, models, config)
- Full CRUD operations with MongoDB
- JWT-based authentication
- Password hashing with bcrypt
- Joi validation middleware
- Query parameter filtering (title, director, year)
- Data validation (required fields, year range: 1888-present)
- Proper HTTP status codes (200, 201, 204, 400, 401, 404)
- Request logging with Morgan
- Error handling middleware
- Protected routes (POST, PUT, DELETE require authentication)

## Testing

### Using REST Client (VSCode Extension)

1. Install the REST Client extension in VSCode
2. Open `api-test-auth.http` for authenticated endpoints
3. First sign up or login to get a JWT token
4. Copy the token and use it in Authorization header for protected routes
5. Click "Send Request" above each request to test the endpoints

### Using Postman

1. Import the endpoints into Postman
2. Create a collection called "Movie Collection API"
3. Sign up or login to get a JWT token
4. Add token to Authorization header (Bearer token) for POST, PUT, DELETE requests
5. Test each endpoint with sample data

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
├── app.js                       # Application entry point
├── config/
│   └── database.js             # MongoDB connection configuration
├── controllers/
│   ├── movieController.js      # Movie CRUD operations
│   └── authController.js       # Authentication operations
├── middleware/
│   ├── validation.js           # Joi validation middleware
│   ├── auth.js                 # JWT authentication middleware
│   └── errorHandler.js         # Error handling middleware
├── models/
│   ├── Movie.js                # Movie model
│   └── User.js                 # User model
├── routes/
│   ├── movies.js               # Movie routes
│   └── auth.js                 # Authentication routes
├── api-test-auth.http          # REST Client test file with authentication
├── package.json                # Project dependencies and scripts
└── fastapi-demo/               # FastAPI comparison demo
```

## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your-mongodb-connection-string
MONGODB_DBNAME=moviecollection
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
```

## Default Movie Data

The server seeds three default movies on first run:
- Inception (2010) - Christopher Nolan
- The Matrix (1999) - The Wachowskis
- Parasite (2019) - Bong Joon-ho

## Authentication

Protected routes (POST, PUT, DELETE /movies) require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

To get a token:
1. Sign up: `POST /auth/signup`
2. Or login: `POST /auth/login`
3. Copy the token from the response
4. Use it in the Authorization header for protected routes

Tokens expire after 1 hour. Login again to get a new token.

