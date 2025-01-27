const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Enable CORS and JSON parsing
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Endpoint to save recipe
app.post('/save-recipe', async (req, res) => {
    try {
        // Update path to match your folder structure
        const recipesPath = path.join(__dirname, 'Json', 'recipes.json');
        
        // Log for debugging
        console.log('Saving recipe to:', recipesPath);
        console.log('Recipe data:', JSON.stringify(req.body, null, 2));

        await fs.writeFile(recipesPath, JSON.stringify(req.body, null, 4));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({ error: 'Failed to save recipe', details: error.message });
    }
});

// Add a test endpoint to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server directory: ${__dirname}`);
});