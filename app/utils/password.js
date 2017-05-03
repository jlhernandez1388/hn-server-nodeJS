const crypto = require('crypto');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

function generateSalt() {
  return crypto.randomBytes(48).toString('hex');
}

function generateHash(password, salt) {
  return crypto.pbkdf2Sync(
    password,
    salt,
    100000,
    512,
    'sha512').toString('hex');
}

function verify(username, password, callback) {
  User.findOne({ user: username })
  .then((user) => {
    if (user) {

      const hash = generateHash(password, user.salt);

      User.count({ user: username, hash: hash })
      .then((c) => {
        if (c === 1) {
          const token = jwt.sign({ user: username }, process.env.JWT_SECRET);
          console.log('User Valid - ' + token);
          return callback(token);
        } else {
          console.log('User Invalid');
          return callback(false);
        }
      });
    } else {
      return callback(false);
    }
  });
}

module.exports = { generateSalt, generateHash, verify };
