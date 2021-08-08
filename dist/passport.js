"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _User = _interopRequireDefault(require("./models/User"));

var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    return _bluebird["default"].resolve().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var dbUser, user;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _User["default"].getUserById(id);

            case 2:
              dbUser = _context.sent;
              user = {
                username: dbUser.username
              };
              user.id = dbUser.id;
              user.profilePicture = dbUser.profilePicture;
              Object.assign(user, getUserType(dbUser));
              done(null, user);

            case 8:
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
              return _User["default"].getUserByUserName(firstName);

            case 2:
              user = _context2.sent;
              _context2.t0 = !user;

              if (_context2.t0) {
                _context2.next = 8;
                break;
              }

              _context2.next = 7;
              return user.comparePassword(lastName);

            case 7:
              _context2.t0 = !_context2.sent;

            case 8:
              if (!_context2.t0) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt("return", done(null, null));

            case 10:
              return _context2.abrupt("return", done(null, user));

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })))["catch"](done);
  }));

  function getUserType(user) {
    var result = {};

    if (user.userType === "admin") {
      result.admin = true;
    } else if (user.userType === "employee") {
      result.employee = true;
    }

    return result;
  }
};