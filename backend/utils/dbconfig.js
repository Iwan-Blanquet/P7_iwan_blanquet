const mysql = require('mysql');

//Connection à BD sql
const db = mysql.createConnection({
    host: "localhost", 
    user: "root", 
    password: "Papawannou@61289",
    database: "groupomania_database"
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
});

module.exports = db;