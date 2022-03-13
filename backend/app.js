const express = require('express');
const path = require('path');

const app = express();

const userRoutes = require('./routes/user');

//Connection à BD sql

//Autoriser toutes les origines à accéder à notre API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Analyser le corps de la requête en tant qu'objets JSON 
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

app.use((req,res,next) =>{
    res.status(200).json({ message: 'requête réussi !' })
});

module.exports = app;