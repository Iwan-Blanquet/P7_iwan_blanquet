const rateLimit = require('express-rate-limit');

// Limiter le nombre de tentative de connexion
const maximumAttempts = rateLimit({
    windowMs: 5*60*1000, // délai en miliseconde
    max: 3, // Nombre de tentaives autorisées
    message: "Votre compte est bloqué pendant 5 minutes suite à 3 tentatives infructueuses !"
});

module.exports = maximumAttempts;