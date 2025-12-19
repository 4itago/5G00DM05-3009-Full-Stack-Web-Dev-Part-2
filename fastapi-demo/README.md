# FastAPI Demo

A simple FastAPI application for comparison with Express.js.

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

4. **Access the API:**
   - API: http://127.0.0.1:8000
   - Swagger UI: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

## Notes

- The `--reload` flag enables auto-reload on code changes
- FastAPI automatically generates interactive API documentation
- Compare this setup with the Express.js implementation

