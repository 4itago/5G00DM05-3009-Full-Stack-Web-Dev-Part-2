// Movie model - defines the structure and validation for movie documents
// This is a conceptual model since we're using MongoDB (schema-less)
// In a real application, you might use Mongoose for schema validation

class Movie {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.director = data.director;
    this.year = data.year;
  }

  // Convert to plain object
  toObject() {
    return {
      id: this.id,
      title: this.title,
      director: this.director,
      year: this.year
    };
  }
}

module.exports = Movie;

