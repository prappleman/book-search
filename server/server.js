const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = 3001;

// CORS options
const corsOptions = {
  origin: ['https://studio.apollographql.com', '*'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  path: '/graphql',
});

// Apply Apollo Server middleware
server.applyMiddleware({ app, cors: corsOptions });

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Start Apollo Server and API server
const startApolloServer = async () => {
  try {
    console.log('Starting Apollo Server...');
    await server.start();
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