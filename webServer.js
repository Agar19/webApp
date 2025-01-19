// webserver.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Serve static files from the root directory
app.use(express.static(__dirname));

// Handle JSON data
app.use(express.json());

// Specific route for recipes.json
app.get('/api/recipes', async (req, res) => {
    try {
        const recipesPath = path.join(__dirname, 'Json', 'recipes.json');
        const rawData = await fs.readFile(recipesPath, 'utf8');
        const recipes = JSON.parse(rawData);
        res.json(recipes);
    } catch (error) {
        console.error('Error reading recipes:', error);
        res.status(500).json({ error: 'Error loading recipes' });
    }
});

// You can add more specific API routes here
// app.get('/api/recipes/:id', async (req, res) => { ... });

// Handle all other routes by sending the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/mainPage.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Static files are being served from: ${__dirname}`);
    console.log('API endpoints:');
    console.log('  - GET /api/recipes');
});