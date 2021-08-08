"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _authenticator = require("../authenticator");

;

var router = _express["default"].Router();
/**
  * HTTP handler for sign in.
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
*/


router.get('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.user) {
              res.redirect('/');
            } else {
              res.render('login', {
                title: 'Login',
                landingPage: true
              });
            }

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", _bluebird["default"].resolve().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
              var user, temp;
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return (0, _authenticator.Authenticate)(req, res, next);

                    case 2:
                      user = _context2.sent;

                      if (!user) {
                        _context2.next = 16;
                        break;
                      }

                      _context2.next = 6;
                      return (0, _authenticator.Login)(req, user);

                    case 6:
                      temp = req.session.passport;
                      _context2.next = 9;
                      return (0, _authenticator.RegenerateSession)(req);

                    case 9:
                      req.session.passport = temp;
                      _context2.next = 12;
                      return (0, _authenticator.SaveSession)(req);

                    case 12:
                      // Make sure that we are not showing the user login page, if the user already logged in.
                      console.log(user);
                      res.redirect('/');
                      _context2.next = 17;
                      break;

                    case 16:
                      res.render('login', {
                        error_msg: "Invalid Username or password",
                        title: 'Login',
                        landingPage: true
                      });

                    case 17:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            })))["catch"](next));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;