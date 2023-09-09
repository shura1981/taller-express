const express = require('express');
const path = require('path');

// Configuración de Express
const expressApp = express();
const port = 3000;

expressApp.set('view engine', 'ejs');
expressApp.set('views', path.join(__dirname, 'views'));

// añadir public a express
expressApp.use(express.static(path.join(__dirname, 'public')));

expressApp.get('/', (req, res) => res.render('index'));



const startServer = () => {
    expressApp.listen(port, () => {
        console.log(`Express app listening at http://localhost:${port}`);
    });
}

module.exports = { startServer, port };