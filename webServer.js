// webserver.js
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the root directory
app.use(express.static(__dirname));

// Handle all routes by sending the main index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/mainPage.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});