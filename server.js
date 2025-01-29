const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
//middleware
app.use(express.json());

// Serve static files from the 'css' folder
app.use('/css', express.static('css'));

// Serve static files from the 'images' folder
app.use('/images', express.static('images'));

// Serve static files from the 'js' folder for client-side JavaScript
app.use('/JS', express.static('js'));


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

        console.log('Trying to read file:', filePath); // Debug code
        
        const content = await fs.readFile(filePath, 'utf8');
        res.json(JSON.parse(content));
    } catch (error) {
        res.status(404).json({ error: 'Data file not found' });
    }
});

app.get('/', (req, res) => {
    res.redirect('/pages/mainPage');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});

// const express = require('express');
// const fs = require('fs').promises;
// const path = require('path');
// const app = express();

// // Enable CORS and JSON parsing
// app.use(express.json());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

// // Endpoint to save recipe
// app.post('/save-recipe', async (req, res) => {
//     try {
//         // Update path to match your folder structure
//         const recipesPath = path.join(__dirname, 'Json', 'recipes.json');
        
//         // Log for debugging
//         console.log('Saving recipe to:', recipesPath);
//         console.log('Recipe data:', JSON.stringify(req.body, null, 2));

//         await fs.writeFile(recipesPath, JSON.stringify(req.body, null, 4));
//         res.json({ success: true });
//     } catch (error) {
//         console.error('Error saving recipe:', error);
//         res.status(500).json({ error: 'Failed to save recipe', details: error.message });
//     }
// });

// // Add a test endpoint to verify server is working
// app.get('/test', (req, res) => {
//     res.json({ message: 'Server is working!' });
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log(`Server directory: ${__dirname}`);
// });