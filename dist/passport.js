"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _User = _interopRequireDefault(require("./models/User"));

var LocalStrategy = require('passport-local').Strategy;

console.log("I got into the passpott");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    return _bluebird["default"].resolve().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var user;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("this is my ID: " + id);
              _context.next = 3;
              return _User["default"].getUserById(id);

            case 3:
              user = _context.sent;
              done(null, user);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })))["catch"](done);
  });
  passport.use('local', new LocalStrategy({
    usernameField: 'fName',
    passwordField: 'lName',
    passReqToCallback: true
  }, function (req, firstName, lastName, done) {
    return _bluebird["default"].resolve().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var user;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _User["default"].getUserByFirstName(firstName);

            case 2:
              user = _context2.sent;
              console.log("mine is: " + JSON.stringify(user));
              _context2.t0 = !user;

              if (_context2.t0) {
                _context2.next = 9;
                break;
              }

              _context2.next = 8;
              return user.comparePassword(lastName);

            case 8:
              _context2.t0 = !_context2.sent;

            case 9:
              if (!_context2.t0) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", done(null, null));

            case 11:
              return _context2.abrupt("return", done(null, user));

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })))["catch"](done);
  }));
};