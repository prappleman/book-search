const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const connectDB = require('./config/connection');

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

const startServer = async () => {
  try {
    // Ensure the server is started
    await connectDB(); 

    // Apollo Server setup
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      cache: 'bounded',
      persistedQueries: false,
      context: authMiddleware,
    });

    // Apply Apollo Server middleware
    server.applyMiddleware({ app, cors: corsOptions });
    // Assuming db.connect() establishes the database connection
    await db.connect(); 
    console.log('Database connected.');

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