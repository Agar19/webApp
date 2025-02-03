const path = require('path');
const fs = require('fs').promises;

exports.setupRecipeRoutes = (app, upload) => {
    // Save Recipe Route
    app.post('/save-recipe', upload.single('recipeImage'), async (req, res) => {
        try {
            if (!req.file) {
                throw new Error('No image file uploaded');
            }

            // Get the uploaded image path (relative to frontend)
            const imagePath = `/images/${req.file.filename}`;
            
            // Parse recipe data
            const recipeData = JSON.parse(req.body.recipeData);
            
            // Read existing recipes
            const recipesPath = path.join(__dirname, '..', 'Json', 'recipes.json');
            let recipes;
            
            try {
                const recipesContent = await fs.readFile(recipesPath, 'utf8');
                recipes = JSON.parse(recipesContent);
            } catch (error) {
                // If file doesn't exist or is empty, initialize with empty array
                recipes = { recipes: [] };
            }
            
            // Generate new ID
            const maxId = recipes.recipes.length > 0 
                ? Math.max(...recipes.recipes.map(recipe => recipe.id))
                : 0;
            
            // Create new recipe object with image path
            const newRecipe = {
                ...recipeData,
                id: maxId + 1,
                image: imagePath
            };
            
            // Add new recipe to array
            recipes.recipes.push(newRecipe);
            
            // Create Json directory if it doesn't exist
            const jsonDir = path.join(__dirname, '..', 'Json');
            try {
                await fs.mkdir(jsonDir, { recursive: true });
            } catch (error) {
                if (error.code !== 'EEXIST') throw error;
            }
            
            // Save updated recipes
            await fs.writeFile(recipesPath, JSON.stringify(recipes, null, 4));
            
            res.json({ 
                success: true, 
                recipe: newRecipe 
            });
        } catch (error) {
            console.error('Error saving recipe:', error);
            res.status(500).json({ 
                error: 'Failed to save recipe', 
                details: error.message 
            });
        }
    });

    // Search Route
    app.get('/search', async (req, res) => {
        try {
            const query = req.query.q.toLowerCase().trim();
            const recipesPath = path.join(__dirname, '..', 'Json', 'recipes.json');
            
            // Read recipes file
            const recipesContent = await fs.readFile(recipesPath, 'utf8');
            const recipesData = JSON.parse(recipesContent);
            
            // Search logic
            const searchResults = recipesData.recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(query) || 
                recipe.description.toLowerCase().includes(query) ||
                recipe.ingredients.some(ingredient => 
                    ingredient.toLowerCase().includes(query)
                )
            );
            
            res.json(searchResults);
        } catch (error) {
            console.error('Search error:', error);
            res.status(500).json({ error: 'Search failed', details: error.message });
        }
    });
};