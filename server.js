const express = require('express');
const cors = require('cors');

const { setupRecipeRoutes } = require('./recipeRoutes');
const { setupStaticRoutes } = require('./pageRoutes');
const { configureMulter } = require('./multerImage');

const app = express();
app.use(cors());

// Static file serving
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/JS', express.static('js'));

const upload = configureMulter();

// Setup routes
setupRecipeRoutes(app, upload);
setupStaticRoutes(app);

app.get('/', (req, res) => {
    res.redirect('/pages/mainPage');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});