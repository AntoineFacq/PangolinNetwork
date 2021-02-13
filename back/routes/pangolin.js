const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Pangolin = require('../models/pangolin');

// Register a pangolin
router.post('/register', (req, res, next) => {
  console.log("Register")
  let newUser = new Pangolin({
    login: req.body.login,
    password: req.body.password,
    age: req.body.age,
    food: req.body.food,
    family: req.body.family,
    race: req.body.race,

  });

  Pangolin.addPangolin(newUser, (err, user) => {
    if (err) {
      res.json({success: false, msg: "Erreur à l'enregistrement"});
    } else {
      res.json({success: true, msg: 'Pangolin enregistré!'});
    }
  });
});

// Pangoling authentication
router.post('/login', (req, res, next) => {
  console.log("Login")
  const login = req.body.login;
  const password = req.body.password;

  Pangolin.getUserByLogin(login, (err, pangolin) => {
    if (err) throw err;
    if (!pangolin) {
      return res.json({success: false, msg: 'Pangolin inconnu!'});
    }

    Pangolin.comparePassword(password, pangolin.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({pangolin}, config.secret, {
          expiresIn: 604800
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: pangolin
        });
      } else {
        return res.json({success: false, msg: 'Mauvais mot de passe'});
      }
    });
  });
});

router.post('/addFriend',
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    console.log("Ad")
    Pangolin.addFriend(req.user._id, req.body.id, (err, pangolin) => {
      Pangolin.getAllPangolins(req.user._id, (err, pangos) => {
        Pangolin.getFriends(req.user._id, (err, friends) => {
          res.json({
              pangolin: req.user, friends: friends,
              otherPangos: pangos
            }
          )
        });
      })
    })
  });

router.post('/removeFriend',
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    console.log("Rm")
    Pangolin.removeFriend(req.user._id, req.body.id, (err, pangolin) => {
      Pangolin.getAllPangolins(req.user._id, (err, pangos) => {
        Pangolin.getFriends(req.user._id, (err, friends) => {
          res.json({
              pangolin: req.user, friends: friends,
              otherPangos: pangos
            }
          )
        });
      })
    })
  });


// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Pangolin.getAllPangolins(req.user._id, (err, pangos) => {
    Pangolin.getFriends(req.user._id, (err, friends) => {
      res.json({
          pangolin: req.user, friends: friends,
          otherPangos: pangos
        }
      )
    });
  })

});

router.post('/updatePangolin', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  Pangolin.findOneAndUpdate({'_id': req.user._id}, req.body.pangolin, {upsert: true}, function(err, doc) {
    if (err) return res.send(500, {error: err});
    return res.send('Succesfully saved.');
  });
});



module.exports = router;
