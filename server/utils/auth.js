const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretkey';
const expiration = '2h';

module.exports = {
  // Function for authenticated routes
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      console.log('No token found');
      return { user: null };
    }

    // Verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Token verified:', data);
    } catch {
      console.log('Invalid token');
      return { user: null };
    }

    // Return the context with the user data
    return { user: req.user };
  },

  // Function to sign a token
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};