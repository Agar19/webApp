const express = require('express'); // Import the express module
const path = require('path'); // To work with file paths

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000; // Set the port to environment variable or default to 3000

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Example route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mainPage.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
