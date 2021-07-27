"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressValidator = require("express-validator");

var _Vehicle = _interopRequireDefault(require("../models/Vehicle"));

var router = _express["default"].Router();
/** 
 * Displays login page.
 */

/*
router.get('/display-vehicle/:plate', (req,res,next) =>
{
    if(req.user)
    {
        User.getUserById(req.params.id).then(foundUser => {
            res.render('displayUser', {
                title: (`${foundUser.firstName} ${foundUser.lastName}'s Page`),
                jumbotronDescription: `This is ${foundUser.firstName} ${foundUser.lastName}'s profile page.`,
                existingUser: foundUser,
                showPii: req.user.admin || req.user.id == req.params.id,
            });
        });
    }
});
*/


router.get('/add', function (req, res, next) {
  if (req.user) {
    var d = new Date();
    var n = d.getFullYear();
    var span = [];
    var i;

    for (i = n - 2000; i >= 0; i--) {
      span[i] = n - i;
      console.log("In here" + span[i]);
    }

    console.log(span);

    _Vehicle["default"].getVehicleStock().then(function (values) {
      res.render('addUpdateVehicle', {
        title: 'Add New Vehicle',
        jumbotronDescription: "Register a new user account.",
        submitButtonText: 'Create',
        action: "/vehicles/add",
        values: values,
        msgType: req.flash()
      });
    });
  }
});
router.post('/add', function (req, res, next) {
  _Vehicle["default"].addVehicle(req.body).then(function () {
    req.flash('success_msg', req.body.brand + " " + req.body.model + " " + req.body.plate + " added successfully.");
    res.redirect('/vehicles');
  })["catch"](function (err) {
    req.flash('error_msg', "Vehicle could not be add (Error: " + err + ") ");
    res.redirect('/vehicles/add');
  });
});
router.get('/display-vehicle/:id', function (req, res, next) {
  if (req.user) {
    _Vehicle["default"].getVehicleByPlate(req.params.id).then(function (foundVehicle) {
      var iconType;

      if (foundVehicle.category.includes("PICKUP") || foundVehicle.category === "4X4") {
        iconType = "pickup";
      } else if (foundVehicle.category.includes("TROLLY")) {
        iconType = "trolly";
      } else {
        iconType = foundVehicle.category.toLowerCase();
      }

      res.render('displayVehical', {
        title: "".concat(foundVehicle.brand, " ").concat(foundVehicle.model, " Plate # ").concat(foundVehicle.plate),
        jumbotronDescription: "Information for ".concat(foundVehicle.brand, " ").concat(foundVehicle.model, " Plate # ").concat(foundVehicle.plate, "."),
        existingVehicle: foundVehicle,
        showPii: req.user.admin,
        iconType: iconType,
        msgType: req.flash()
      });
    });
  }
});
router.get('/delete/:plate/:chassis', function (req, res, next) {
  if (req.user) {
    var vehicleDelete = {
      plate: req.params.plate,
      chassis: req.params.chassis
    };

    _Vehicle["default"].deleteVehicleByPlateAndChassis(vehicleDelete).then(function (output) {
      req.flash('success_msg', output);
      res.redirect("/vehicles");
    })["catch"](function (err) {
      req.flash('error_msg', err);
      res.redirect("/vehicles/display-vehicle/".concat(req.params.id));
    });
  }
});
router.get('/', function (req, res, next) {
  if (req.user) {
    _Vehicle["default"].findAndCountAll().then(function (vehicles) {
      res.render("displayVehicles", {
        title: "Vehicles",
        jumbotronDescription: "View all user vehicles in the system.",
        users: vehicles.rows,
        msgType: req.flash()
      });
    });
  } else {
    res.redirect('/');
  }
});
var _default = router;
exports["default"] = _default;