const jwt = require('jsonwebtoken');
const { AuthenticationError, ExtendedError } = require('~helpers/extended-errors');

function verifyJWT(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decodedData) => {
      if (err || !decodedData) {
        if (err.name === 'TokenExpiredError') {
          reject(new ExtendedError(err.message, 'ExpiryError', 410));
        } else {
          reject(new AuthenticationError(err.message || 'Not authenticated'));
        }
      } else {
        resolve(decodedData);
      }
    });
  });
}

function createJWT(details, secret, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(details, secret, options, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

module.exports = {
  verifyJWT,
  createJWT,
};
