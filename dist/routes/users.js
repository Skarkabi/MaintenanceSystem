"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _expressValidator = require("express-validator");

var _User = _interopRequireDefault(require("../models/User"));

//import passport from 'passport';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';

/* 
* Models
import Utils from '../Utils';
import CourseInstance from '../models/CourseInstance';
import Grade from '../models/Grade';
import Faculty from '../models/Faculty';

import EmailSender from '../EmailSender'
import ErrorHandler from '../errorHandler';
import Counter from '../models/IdCounter';
*/
var router = _express["default"].Router();
/**
 * We will have 3 different types of users as following
 * Admin
 * professor
 * Student
 */

/**
 * Displays login page.
 */


router.get('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.user) {
              console.log("I am here");
              res.redirect('/');
            } else {
              console.log("No Actually I am here");
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
/**
 * Allows users to login to system.
 */

router.post('/users/login', function (req, res, next) {
  var firstName = req.body.fName;
  var newUser = new _User["default"]({
    firstName: req.body.fName,
    lastName: req.body.lName
  });

  _User["default"].addUser(newUser).then(function (result) {
    console.log("You successfully added user ".concat(result.firstName, "."));
  })["catch"](function (err) {
    console.log(err);
  }); // Make sure that we are not showing the user login page, if the user already logged in.


  if (req.user) {
    console.log("AAAAAA1");
    res.render('/');
  } else {
    console.log("AAAAAAAAAA");
    res.render('login', {
      title: 'Login',
      landingPage: true
    });
  }
});
/**
 * Allows users to logout from the system.
 */

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/users/login');
});
var _default = router;
exports["default"] = _default;