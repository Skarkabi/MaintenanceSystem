"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _User = _interopRequireDefault(require("../models/User"));

var router = _express["default"].Router();
/** 
 * Express Route to display sleected user information
 */


router.get('/display-user/:id', function (req, res, next) {
  //Checking if the logged in user has permission to view this info
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
router.get('/display-user/', function (req, res, next) {
  console.log(req.user.id);

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
router.get('/edit/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.render('editProfilePicture', {
              title: 'editUser',
              jumbotronDescription: "Edit Profile Picture.",
              msgType: req.flash()
            });

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
router.post('/edit/:id', function (req, res, next) {
  _User["default"].updateProfilePhoto(req.user.id, req.user.username, req.body.image);

  res.redirect('back');
});
/**
 * Displays create user page.
 */

router.get('/create', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
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
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
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

router.post('/create', function (req, res, next) {
  _User["default"].createUser(req.body).then(function (output) {
    req.flash('success_msg', output);
    res.redirect('/users/create');
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect('/users/create');
  });
});
var _default = router;
exports["default"] = _default;