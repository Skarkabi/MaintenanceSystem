"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var router = _express["default"].Router();
/** 
 * Express Route to Displays login page.
 */


router.get('/', function (req, res, next) {
  //Checking if a user is already logged in
  if (req.user) {
    res.render('dashboardForAdmins', {
      title: 'Home Page',
      jumbotronDescription: "Welcome! This is your dashboard and you can access everything from here easily.",
      msgType: req.flash()
    });
  } else {
    res.redirect('/login');
  }
});
var _default = router;
exports["default"] = _default;