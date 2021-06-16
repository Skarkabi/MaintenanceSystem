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


router.get('/display-user/:id', function (req, res, next) {
  console.log(req.user.id + " " + req.params.id);

  if (req.user.id == req.params.id || req.user.admin) {
    var msg = req.flash();

    _User["default"].getUserById(req.params.id).then(function (foundUser) {
      res.render('displayUser', {
        title: "".concat(foundUser.firstName, " ").concat(foundUser.lastName, "'s Page"),
        jumbotronDescription: "This is ".concat(foundUser.firstName, " ").concat(foundUser.lastName, "'s profile page."),
        existingUser: foundUser,
        showPii: req.user.admin || req.user.id == req.params.id,
        msgType: msg
      });
    });
  } else {
    req.flash('error_msg', "You do not have access to this page.");
    res.render("accessDenied", {
      title: "Access Denied",
      msgType: req.flash()
    });
  }
});
router.get('/', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.user.admin) {
              _User["default"].findAndCountAll().then(function (users) {
                console.log("here: " + JSON.stringify(users.count));
                var entriesNum = [];

                for (var i = 0; i < users.count; i++) {
                  entriesNum[0] = i + 1;
                }

                res.render("displayUsers", {
                  title: "Users",
                  jumbotronDescription: "View all user accounts for professors, students and admins registered in the university's system.",
                  users: users.rows,
                  user: req.user,
                  msgType: req.flash()
                });
              });
            } else {
              req.flash('error_msg', "You do not have access to this page.");
              res.render("accessDenied", {
                title: "Access Denied",
                msgType: req.flash()
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
 * Displays create user page.
 */

router.get('/create', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.user.admin) {
              res.render('createUpdateUser', {
                title: 'Create New User',
                jumbotronDescription: "Register a new user account.",
                submitButtonText: 'Create',
                action: "/users/create",
                msgType: req.flash()
              });
            } else {
              req.flash('error_msg', "You do not have access to this page.");
              res.render("accessDenied", {
                title: "Access Denied",
                msgType: req.flash()
              });
            }

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get('/delete/:id', function (req, res, next) {
  if (req.user) {
    _User["default"].deleteUserById(req.params.id).then(function (output) {
      req.flash('success_msg', output);
      res.redirect("/users");
    })["catch"](function (err) {
      req.flash('error_msg', err);
      res.redirect("/users/display-user/".concat(req.params.id));
    });
  }
});
/**
 * Creates an user.
 */

router.post('/create', [(0, _expressValidator.body)('eID', "Employee ID field is mandatory").not().isEmpty(), (0, _expressValidator.body)('firstName', "First name field is mandatory").not().isEmpty(), (0, _expressValidator.body)('lastName', "Last name field is mandatory").not().isEmpty(), (0, _expressValidator.body)('username', "Username field is mandatory").not().isEmpty(), (0, _expressValidator.body)('password', "Password lenght should be at least 6 chars long").isLength({
  min: 5
})], function (req, res, next) {
  _User["default"].createUser(req.body).then(function (output) {
    req.flash('success_msg', output);
    res.redirect('/users/create');
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect('/users/create');
  });
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