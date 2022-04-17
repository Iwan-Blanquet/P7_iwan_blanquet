const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../utils/dbconfig');

// Singup
exports.signup = async (req, res, next) => {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = { ...req.body, hashPassword };

    let sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [user.email], function (err, result, fields) {
      if (result.length > 0) {
        res.status(401).json({ message: 'Email déja utilisé' })
        return
      } else {
        sql =
          'INSERT INTO users (users.email, users.password, users.firstname, users.lastname, users.pseudo, users.avatar) VALUES (?,?,?,?,?,?)'
        db.query(
            sql,
            [user.email, user.hashPassword, user.firstname, user.lastname, user.pseudo, user.avatar],
            function (err, result, fields) {
            if (!result) {
              res.status(400).json({ message: 'email déja utilisé' })
            } else {
              res.status(201).json({ message: 'utilisateur crée' })
            }
          }
        )
      }
    });
};

// Login
exports.login = (req, res, next) => {
    let email = req.body.email;
    let sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if(result.length === 0) {
            return res.status(403).json({ message: 'Utilisateur non trouvé !'});
        }
        const user = result[0];
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(403).json({ message: 'mot de passe inconnu'});
                }
                res.status(200).json({
                    userId: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    pseudo: user.pseudo,
                    avatar: user.avatar,
                    email: user.email,
                    token: jwt.sign(
                        { userId: user.id },
                        process.env.TOKEN_KEY,
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error =>res.status(500).json({ message: 'Utilisateur inconnu' }));
    });
};

// See a profil
exports.seeAprofil = (req, res, next) => {
  let profilId = req.params.id;
  let sql =
    'SELECT * FROM users WHERE users.id = ?'
  let query = db.query(sql, [profilId], function (err, results, fields) {
    if (err) {
      throw err
    }
    res.status(200).json(results)
  })
};

// Update account
exports.updateAccount = (req, res, next) => {
  const id = req.userId;
  const lastname = req.body.lastname;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const avatar = req.body.avatar;
  const bio = req.body.bio;
  const pseudo = req.body.pseudo;
  const sql = 'UPDATE users SET users.firstname = ?, users.lastname = ?, users.email = ?, users.avatar = ?, users.pseudo = ? WHERE users.id = ?'
  db.query(
    sql,
    [firstname, lastname, email, avatar,bio,pseudo, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ err })
      }
      res.status(200).json({ message: 'compte modifié' })
    }
  )
};

// Delete account
exports.deleteAccount = (req, res, next) => {
  const userId = req.userId;
  const sql = 'DELETE FROM users WHERE users.id = ?';
  db.query(sql, userId, (err, results) => {
    if (err) {
      return res.status(404).json({ err })
    }
    res.status(200).json({ message: 'compte supprimé' })
  })
};