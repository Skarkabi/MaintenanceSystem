"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _passport = _interopRequireDefault(require("passport"));

var _bluebird = _interopRequireDefault(require("bluebird"));

/**
  * Authenticate with passport.
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  */
exports.Authenticate = function (req, res, next) {
  return new _bluebird["default"](function (resolve, reject) {
    _passport["default"].authenticate('local', function (err, user) {
      if (err) {
        return reject(err);
      }

      return resolve(user);
    })(req, res, next);
  });
};
/**
  * Login
  * @param {Object} req
  * @param {Object} user
  */


exports.Login = function (req, user) {
  return new _bluebird["default"](function (resolve, reject) {
    req.login(user, function (err) {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};
/**
 * Regenerate user session.
 * @param {Object} req
*/


exports.RegenerateSession = function (req) {
  return new _bluebird["default"](function (resolve, reject) {
    req.session.regenerate(function (err) {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};
/**
  * Save user session.
  * @param {Object} req
  */


exports.SaveSession = function (req) {
  return new _bluebird["default"](function (resolve, reject) {
    req.session.save(function (err) {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};