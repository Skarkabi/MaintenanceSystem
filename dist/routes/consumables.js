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

var _Consumables = _interopRequireDefault(require("../models/Consumables"));

//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
var router = _express["default"].Router();

router.get('/add', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var d, n, span, i;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.user) {
              d = new Date();
              n = d.getFullYear();
              span = [];

              for (i = n - 2000; i >= 0; i--) {
                span[i] = n - i;
                console.log("In here" + span[i]);
              }

              console.log(span);
              res.render('addUpdateVehicle', {
                title: 'Add New Vehicle',
                jumbotronDescription: "Register a new user account.",
                submitButtonText: 'Create',
                action: "/vehicles/add",
                years: span,
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
router.post('/add', [(0, _expressValidator.body)('category', "Vehicle Category field is mandatory").not().isEmpty(), (0, _expressValidator.body)('brand', "Vehicle brand field is mandatory").not().isEmpty(), (0, _expressValidator.body)('model', "Vehicle model field is mandatory").not().isEmpty(), (0, _expressValidator.body)('year', "Vehicle year field is mandatory").not().isEmpty(), (0, _expressValidator.body)('plate', "Vehicle Plate # field is mandatory").not().isEmpty(), (0, _expressValidator.body)('chassis', "Vehicle Chassis # field is mandatory").not().isEmpty(), (0, _expressValidator.body)('oilType', "Vehicle Oil Type field is mandatory").not().isEmpty()], function (req, res, next) {
  Vehicle.addVehicle(req.body).then(function () {
    req.flash('success_msg', req.body.brand + " " + req.body.model + " " + req.body.plate + " added successfully.");
    res.redirect('/vehicles');
  })["catch"](function (err) {
    req.flash('error_msg', "Vehicle could not be add (Error: " + err + ") ");
    res.redirect('/vehicles/add');
  });
});
router.get('/display-vehicle/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.user) {
              console.log(req.params);
              Vehicle.getVehicleByPlate(req.params.id).then(function (foundVehicle) {
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
    Vehicle.getVehicleByPlate(req.params.id).then(function (foundVehicle) {
      var vehicleDelete = {
        plate: foundVehicle.plate,
        chassis: foundVehicle.chassis
      };
      Vehicle.deleteVehicleByPlateAndChassis(vehicleDelete).then(function () {
        req.flash('success_msg', "Vehicle with Plate #: " + req.params.id + " deleted successfully.");
        res.redirect("/vehicles");
      })["catch"](function (err) {
        req.flash('error_msg', "Something happened while deleting the vehicle (Error: " + err + ").");
        res.redirect("/vehicles/display-vehicle/".concat(req.params.id));
      });
    });
  }
});
router.get('/', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.user) {
              _Consumables["default"].findAndCountAll().then(function (consumables) {
                console.log(consumables.rows);
                var entriesNum = [];

                for (var i = 0; i < consumables.count; i++) {
                  entriesNum[0] = i + 1;
                }

                res.render("displayConsumables", {
                  title: "Consumables",
                  jumbotronDescription: "View all consumables in the system.",
                  consumables: consumables.rows,
                  msgType: req.flash()
                });
              });
            } else {
              res.redirect('/');
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
router.get('/:category', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var title;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (req.user) {
              title = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);

              _Consumables["default"].getSpecific(req.params.category).then(function (consumables) {
                console.log(consumables);
                res.render("displaySpecificConsumables", {
                  title: title,
                  typeOf: req.params.category,
                  jumbotronDescription: "View all " + req.params.category + " in the system.",
                  consumables: consumables.rows,
                  msgType: req.flash()
                });
              });
            }

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;