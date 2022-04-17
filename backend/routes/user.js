const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const email = require('../middlewares/email');
const password = require('../middlewares/password');
const connexion = require('../middlewares/connexion');
const auth = require('../middlewares/auth');

router.post('/signup', email, password, userCtrl.signup);
router.post('/login', email, connexion, userCtrl.login);
router.get('/account', userCtrl.seeAprofil);
router.put('/updateaccount', userCtrl.updateAccount); // succes without modify in database
router.delete('/deleteaccount', userCtrl.deleteAccount); //userId undefined

module.exports = router;