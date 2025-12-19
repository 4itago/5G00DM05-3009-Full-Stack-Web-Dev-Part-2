// User model - defines the structure for user documents
// Used for authentication

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password; // This will be hashed
    this.name = data.name || '';
    this.email = data.email || '';
  }

  // Convert to plain object (excluding password)
  toObject() {
    const obj = {
      id: this.id,
      username: this.username,
      name: this.name,
      email: this.email
    };
    return obj;
  }

  // Convert to object including password (for internal use only)
  toObjectWithPassword() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      name: this.name,
      email: this.email
    };
  }
}

module.exports = User;

