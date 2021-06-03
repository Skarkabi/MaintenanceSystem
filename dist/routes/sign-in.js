"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var router = _express["default"].Router();
/**
  * Authenticate with passport.
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  */


var authenticate = function authenticate(req, res, next) {
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


var login = function login(req, user) {
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


var regenerateSession = function regenerateSession(req) {
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


var saveSession = function saveSession(req) {
  return new _bluebird["default"](function (resolve, reject) {
    req.session.save(function (err) {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};
/**
  * HTTP handler for sign in.
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
*/


router.get('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", _bluebird["default"].resolve().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
              var user, temp;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      console.log("Please be here");
                      _context.next = 3;
                      return authenticate(req.body, res, next);

                    case 3:
                      user = _context.sent;

                      if (!user) {
                        _context.next = 17;
                        break;
                      }

                      _context.next = 7;
                      return login(req, user);

                    case 7:
                      temp = req.session.passport;
                      _context.next = 10;
                      return regenerateSession(req);

                    case 10:
                      req.session.passport = temp;
                      _context.next = 13;
                      return saveSession(req);

                    case 13:
                      console.log("I am here");
                      res.redirect('/');
                      _context.next = 19;
                      break;

                    case 17:
                      console.log("No Actually I am here");
                      res.render('login', {
                        title: 'Login',
                        landingPage: true
                      });

                    case 19:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })))["catch"](next));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/users/login', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", _bluebird["default"].resolve().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
              var user, temp;
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return authenticate(req, res, next);

                    case 2:
                      user = _context3.sent;

                      if (!user) {
                        _context3.next = 17;
                        break;
                      }

                      console.log("AAAAAA1");
                      _context3.next = 7;
                      return login(req, user);

                    case 7:
                      temp = req.session.passport;
                      _context3.next = 10;
                      return regenerateSession(req);

                    case 10:
                      req.session.passport = temp;
                      _context3.next = 13;
                      return saveSession(req);

                    case 13:
                      console.log("I am here"); // Make sure that we are not showing the user login page, if the user already logged in.

                      // Make sure that we are not showing the user login page, if the user already logged in.
                      res.render('layout');
                      _context3.next = 19;
                      break;

                    case 17:
                      console.log("AAAAAAAAAA");
                      res.render('login', {
                        title: 'Login',
                        landingPage: true
                      });

                    case 19:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })))["catch"](next));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;