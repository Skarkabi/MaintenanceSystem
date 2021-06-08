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

var _expressValidator = require("express-validator");

var _User = _interopRequireDefault(require("../models/User"));

//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
var router = _express["default"].Router();
/** 
 * Displays login page.
 */


router.get('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!req.user) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", _bluebird["default"].resolve().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
              var users, entriesNum, i;
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return _User["default"].findAndCountAll();

                    case 2:
                      users = _context.sent;
                      console.log("here: " + JSON.stringify(users.count));
                      entriesNum = [];

                      for (i = 0; i < users.count; i++) {
                        entriesNum[0] = i + 1;
                      }

                      res.render("displayUsers", {
                        title: "Users",
                        jumbotronDescription: "View all user accounts for professors, students and admins registered in the university's system.",
                        users: users.rows
                      });

                    case 7:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }))));

          case 4:
            res.redirect('/');

          case 5:
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
/**
 * Displays create user page.
 */

router.get('/create', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.user) {
              res.render('createUpdateUser', {
                title: 'Create New User',
                jumbotronDescription: "Register a new user account.",
                submitButtonText: 'Create',
                action: "/users/create"
              });
            }

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
/**
 * Creates an user.
 */

router.post('/create', [(0, _expressValidator.body)('eID', "Employee ID field is mandatory").not().isEmpty(), (0, _expressValidator.body)('firstName', "First name field is mandatory").not().isEmpty(), (0, _expressValidator.body)('lastName', "Last name field is mandatory").not().isEmpty(), (0, _expressValidator.body)('username', "Username field is mandatory").not().isEmpty(), (0, _expressValidator.body)('password', "Password field is mandatory").not().isEmpty(), (0, _expressValidator.body)('password', "Password lenght should be at least 6 chars long").isLength({
  min: 5
})], function (req, res, next) {
  if (req.user) {
    try {
      _User["default"].createUser(req.body);

      res.render('createUpdateUser', {
        title: 'Create New User',
        jumbotronDescription: "Register a new user account.",
        submitButtonText: 'Create',
        action: "/users/create",
        success_msg: "User created successfully"
      });
    } catch (_unused) {
      res.render('createUpdateUser', {
        title: 'Create New User',
        jumbotronDescription: "Register a new user account.",
        submitButtonText: 'Create',
        action: "/users/create",
        error_msg: "User could not be created (Error: User already exists)"
      });
    }
  }

  ;
});
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

/**
 * We will have 3 different types of users as following
 * Admin
 * professor
 * Student
 */

/**
 * Allows users to login to system.
 */

/*
router.post('/users/login', (req, res, next) =>
{
    var firstName = req.body.fName;
    const newUser = new User(
        {
            firstName: req.body.fName,
            lastName: req.body.lName
        }
    );

    User.addUser(newUser).then(result =>
        {
            console.log(`You successfully added user ${result.firstName}.`);
        }).catch(err =>
        {
            console.log(err);
        });

    // Make sure that we are not showing the user login page, if the user already logged in.
    if (req.user)
    {
        console.log("AAAAAA1");
        res.render('/');
    }
    else
    {
        console.log("AAAAAAAAAA");
        res.render('login', { title: 'Login', landingPage: true });
    }
});

/**
 * Allows users to logout from the system.
 */

/*
router.get('/logout', (req, res) =>
{
    req.logout();
    res.redirect('/users/login');
});
*/

var _default = router;
exports["default"] = _default;