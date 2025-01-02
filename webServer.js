// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static('public'));

// GET endpoint to read recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const recipesData = await fs.readFile(path.join(__dirname, 'recipes.json'), 'utf8');
        res.json(JSON.parse(recipesData));
    } catch (error) {
        res.status(500).json({ error: 'Error reading recipes file' });
    }
});

// POST endpoint to add new recipe
app.post('/api/recipes', async (req, res) => {
    try {
        // Read existing recipes
        const recipesData = await fs.readFile(path.join(__dirname, 'recipes.json'), 'utf8');
        const data = JSON.parse(recipesData);
        
        // Add new recipe
        const newRecipe = req.body;
        newRecipe.id = data.recipes.length > 0 ? Math.max(...data.recipes.map(r => r.id)) + 1 : 1;
        data.recipes.push(newRecipe);
        
        // Write back to file
        await fs.writeFile(
            path.join(__dirname, 'recipes.json'),
            JSON.stringify(data, null, 4),
            'utf8'
        );
        
        res.json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: 'Error saving recipe' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});