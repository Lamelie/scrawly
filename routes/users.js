var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/User');
const { restart } = require('nodemon');
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* formulaire register */
router.get('/register', (req, res) => res.render('users/register'));

/*Créer un compte utilisateur */

router.post('/register', async (req, res) => {
  const {username, password} = req.body;
  const user = new User({username : username})
  try {
    await User.register(user, password);
    res.redirect('/'); }
    catch (e) {
      console.log(e);
      res.redirect('/users/register');
    }
  });

/* Affichage formulaire de login */
router.get('/login', (req, res) => res.render('users/login', { csrfToken: req.csrfToken() }));

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

/* Déconnexion de l'utilisateur */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
