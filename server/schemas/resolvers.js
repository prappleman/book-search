const { AuthenticationError } = require("apollo-server");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      try {
        if (context.user) {
          console.log("Fetching user:", context.user._id); // Log user ID
          const user = await User.findOne({ _id: context.user._id });
          if (!user) {
            throw new Error('User not found');
          }
          return user;
        } else {
          console.log("User not logged in"); // Log if user is not logged in
          throw new AuthenticationError('You need to be logged in!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('An error occurred while fetching user data');
      }
    },
  },
  Mutation: {
    // Register a new user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      console.log("New user created:", user._id); // Log new user ID
      return { token, user };
    },
    // Log in an existing user
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        console.log("No user found with this email:", email); // Log email if user not found
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        console.log("Incorrect password for user:", email); // Log email if password is incorrect
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      console.log("User logged in:", user._id); // Log user ID on successful login

      return { token, user };
    },
    // Save a book to the logged-in user's saved books
    saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
      if (context.user) {
        console.log("Saving book for user:", context.user._id); // Log user ID
        console.log("Book details:", { bookId, authors, description, title, image, link }); // Log book details
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: { bookId, authors, description, title, image, link },
            },
          },
          { new: true, runValidators: true }
        );
      } else {
        console.log("User not logged in when attempting to save book"); // Log if user is not logged in
        throw new AuthenticationError("savebook: You need to be logged in!");
      }
    },
    // Remove a book from the logged-in user's saved books
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        console.log("Removing book for user:", context.user._id); // Log user ID
        console.log("Book ID to remove:", bookId); // Log book ID to remove
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true, runValidators: true }
        );
      } else {
        console.log("User not logged in when attempting to remove book"); // Log if user is not logged in
        throw new AuthenticationError("removebook: You need to be logged in!");
      }
    }
  }
};

module.exports = resolvers;
