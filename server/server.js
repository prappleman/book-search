const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Serve index.html for all other routes to support React Router
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const startApolloServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });
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

// Call the async function to start the server
startApolloServer();