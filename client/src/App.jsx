import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, } from "@apollo/client";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

const client = new ApolloClient({
  uri: 'https://book-search-83k4.onrender.com',
  cache: new InMemoryCache(),
});

function App() {
  useEffect(() => {
    // Simulating feature object definition
    const feature = {
      isFeatureEnabled: true
    };

    // Check if feature is defined before accessing its properties
    if (typeof feature !== 'undefined' && feature.isFeatureEnabled) {
      console.log('Feature is enabled');
    } else {
      console.log('Feature is not defined or isFeatureEnabled is not available');
    }

    // Define the initPalette function
    function initPalette() {
      // Your implementation here
      console.log('Palette initialized');
    }

    // Call the initPalette function after it is defined
    initPalette();
  }, []);

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;