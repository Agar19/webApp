const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const cors = require('cors');

const app = express();

app.use(cors());

//static files
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/JS', express.static('js'));

// Ensure images file exists
const imagesDir = path.join(__dirname, 'images');
fs.mkdir(imagesDir, { recursive: true }).catch(error => {
    if (error.code !== 'EEXIST') {
        console.error('Error creating images directory:', error);
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'images'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'recipe-' + uniqueSuffix + path.extname(file.originalname))
    }
});


const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

app.post('/save-recipe', upload.single('recipeImage'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No image file uploaded');
        }

        // Get the uploaded image path
        const imagePath = `/images/${req.file.filename}`;
        
        // Parse recipe data
        const recipeData = JSON.parse(req.body.recipeData);
        
        const recipesPath = path.join(__dirname, 'Json', 'recipes.json');
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
        const jsonDir = path.join(__dirname, 'Json');
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

// page routes
app.get('/pages/:pageName', async (req, res) => {
    try {
        const pageName = req.params.pageName;
        const filePath = path.join(__dirname, 'pages', `${pageName}.html`);
        
        const content = await fs.readFile(filePath, 'utf8');
        res.send(content);
    } catch (error) {
        res.status(404).send('Page not found');
    }
});

// JS route for server-side JavaScript
app.get('/JS/:scriptName', async (req, res) => {
    try {
        const scriptName = req.params.scriptName;
        const filePath = path.join(__dirname, 'JS', `${scriptName}.js`);
        
        const content = await fs.readFile(filePath, 'utf8');
        res.set('Content-Type', 'application/javascript');
        res.send(content);
    } catch (error) {
        res.status(404).send('Script not found');
    }
});

// Json route
app.get('/Json/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;

        if (!fileName.endsWith('.json')) {
            fileName += '.json';
        }

        const filePath = path.join(__dirname, 'Json', fileName); 
        
        const content = await fs.readFile(filePath, 'utf8');
        res.json(JSON.parse(content));
    } catch (error) {
        res.status(404).json({ error: 'Data file not found' });
    }
});

//search login nemev
app.get('/search', async (req, res) => {
    try {
        const query = req.query.q.toLowerCase().trim();
        const recipesPath = path.join(__dirname, 'Json', 'recipes.json');
        
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


app.get('/', (req, res) => {
    res.redirect('/pages/mainPage');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});









