const path = require('path');
const fs = require('fs/promises');

exports.setupStaticRoutes = (app) => {
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
    
            //console.log('Trying to read file:', filePath); // Debug code
            
            const content = await fs.readFile(filePath, 'utf8');
            res.json(JSON.parse(content));
        } catch (error) {
            res.status(404).json({ error: 'Data file not found' });
        }
    });
};