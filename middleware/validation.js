const Joi = require('joi');

// Movie validation schemas using Joi
const movieSchema = Joi.object({
  title: Joi.string().trim().min(1).required()
    .messages({
      'string.empty': 'Title must be a non-empty string.',
      'any.required': 'Title is required.'
    }),
  director: Joi.string().trim().min(1).required()
    .messages({
      'string.empty': 'Director must be a non-empty string.',
      'any.required': 'Director is required.'
    }),
  year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 1).required()
    .messages({
      'number.base': 'Year must be a valid number.',
      'number.min': `Year must be at least 1888.`,
      'number.max': `Year must be at most ${new Date().getFullYear() + 1}.`,
      'any.required': 'Year is required.'
    })
});

const movieUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).optional()
    .messages({
      'string.empty': 'Title must be a non-empty string.'
    }),
  director: Joi.string().trim().min(1).optional()
    .messages({
      'string.empty': 'Director must be a non-empty string.'
    }),
  year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 1).optional()
    .messages({
      'number.base': 'Year must be a valid number.',
      'number.min': `Year must be at least 1888.`,
      'number.max': `Year must be at most ${new Date().getFullYear() + 1}.`
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.'
});

// User validation schemas
const userSignupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters.',
      'string.min': 'Username must be at least 3 characters long.',
      'string.max': 'Username must be at most 30 characters long.',
      'any.required': 'Username is required.'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.'
    }),
  name: Joi.string().trim().optional(),
  email: Joi.string().email().optional()
    .messages({
      'string.email': 'Email must be a valid email address.'
    })
});

const userLoginSchema = Joi.object({
  username: Joi.string().required()
    .messages({
      'any.required': 'Username is required.'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required.'
    })
});

// Validation middleware factory
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message).join(' ');
      return res.status(400).json({ error: errors });
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
}

module.exports = {
  validateMovie: validate(movieSchema),
  validateMovieUpdate: validate(movieUpdateSchema),
  validateUserSignup: validate(userSignupSchema),
  validateUserLogin: validate(userLoginSchema)
};

