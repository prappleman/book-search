const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const cors = require('cors'); // Import cors
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Use CORS middleware with appropriate options
app.use(cors({
  origin: '*', // Allow all origins, change as necessary
  methods: ['GET', 'POST', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow credentials
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const startApolloServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app, cors: false }); // Disable ApolloServer's CORS

    console.log('Apollo Server started.');

    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`GraphQL path: ${server.graphqlPath}`);
      });
    });

    db.on('error', (err) => {
      console.error('Database connection error:', err);
    });
  } catch (error) {
    console.error('Failed to start Apollo Server:', error);
  }
};

startApolloServer();
