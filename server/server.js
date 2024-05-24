const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const connectDB = require('./config/connection');

const app = express();
const PORT = 3001 || 3002;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../client/build')));

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB(); 
    console.log('Database connected.');

    // Apollo Server setup
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cache: 'bounded',
      persistedQueries: false,
      context: ({ req }) => authMiddleware({ req }),
    });

    // Ensure the server is started
    await server.start();

    // Apply Apollo Server middleware
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`GraphQL path: ${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Serve React app for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

startServer();