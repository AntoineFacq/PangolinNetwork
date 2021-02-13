const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Pangolin Schema
const PangolinSchema = mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  family: {
    type: String,
    required: true
  },
  race: {
    type: String,
    required: true
  },
  food: {
    type: String,
    required: true
  },
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pangolin'}]

});

const Pangolin = module.exports = mongoose.model('Pangolin', PangolinSchema);


module.exports.addFriend = function (id1, id2, callback) {
  Pangolin.findById(id1, (err1, user) =>{
    Pangolin.findById(id2, (err2, user2) => {
      if(user.friends.indexOf(user2._id) === -1) {
        user.friends.push(user2);
        user.save(callback);
      }
      })
  });
}

module.exports.removeFriend = function (id1, id2, callback) {
  Pangolin.findById(id1, (err1, user) =>{
    Pangolin.findById(id2, (err2, user2) => {
      user.friends.splice(user.friends.indexOf(user2._id), 1);
      user.save(callback);
    })

  });
}



module.exports.getPangolinById = function (id, callback) {
  Pangolin.findById(id, callback);
}

module.exports.getAllPangolins = function (id, callback) {
  Pangolin.find({_id: {$ne : id}}, callback);
}

module.exports.getFriends = async function (id, callback) {
  const friends = await Pangolin.findById(id).populate('friends');

  callback(null, friends.friends)
}

module.exports.getUserByLogin = function (login, callback) {
  const query = {login: login}
  Pangolin.findOne(query, callback);
}

module.exports.addPangolin = function (newPangolin, callback) { // Adding a new Pangolin to the network :-)
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPangolin.password, salt, (err, hash) => {
      if (err) throw err;
      newPangolin.password = hash;
      newPangolin.save(callback);
    });
  });
}



module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}
