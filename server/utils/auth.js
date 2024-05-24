const { Token } = require('graphql');
const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretkey';
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    console.log('Token received:', token); // Log the received token

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
      console.log('Token after split:', token); // Log the token after split
    }
    
    if (!token) {
      console.log('No token found');
      return { user: null };
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Token verified:', data);
    } catch {
      console.log('Invalid token');
      return { user: null };
    }

    return { user: req.user };
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
