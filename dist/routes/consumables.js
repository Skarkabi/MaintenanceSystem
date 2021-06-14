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

var _Battery = _interopRequireDefault(require("../models/consumables/Battery"));

var _Brake = _interopRequireDefault(require("../models/consumables/Brake"));

var _Filter = _interopRequireDefault(require("../models/consumables/Filter"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Grease = _interopRequireDefault(require("../models/consumables/Grease"));

//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
var router = _express["default"].Router();

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
} // usage example:


var a = ['a', 1, 'a', 2, '1'];
var unique = a.filter(onlyUnique);
console.log(unique); // ['a', 1, 2, '1']

function getStocks() {
  return _getStocks.apply(this, arguments);
}

function _getStocks() {
  _getStocks = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var batteries, brakes, filters, grease, values;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _Battery["default"].getBatteryStocks().then(function (values) {
              batteries = values;
            });

          case 2:
            _context5.next = 4;
            return _Brake["default"].getBrakeStock().then(function (values) {
              brakes = values;
            });

          case 4:
            _context5.next = 6;
            return _Filter["default"].getFilterStock().then(function (values) {
              filters = values;
            });

          case 6:
            _context5.next = 8;
            return _Grease["default"].getGreaseStock().then(function (values) {
              grease = values;
            });

          case 8:
            values = {
              batteries: batteries,
              brakes: brakes,
              filters: filters,
              grease: grease
            };
            return _context5.abrupt("return", values);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getStocks.apply(this, arguments);
}

router.get('/add', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.user) {
              getStocks().then(function (values) {
                console.log(JSON.stringify(values));
                res.render('addConsumable', {
                  title: 'Add New Consumable',
                  jumbotronDescription: "Add a new user Consumable.",
                  submitButtonText: 'Create',
                  action: "/consumables/add",
                  values: values,
                  page: "add",
                  msgType: req.flash()
                });
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
router.post('/add', function (req, res, next) {
  console.log("posting");
  console.log(req.body);
});
router.get('/update-battery/:id/:quantity', function (req, res, next) {
  console.log("my body is " + req.body);
  var newBattery = {
    id: req.params.id,
    quantity: req.params.quantity
  };
  console.log("my battery is " + new _Battery["default"]());

  _Battery["default"].addBattery(newBattery).then(function () {
    var category = "Battery";
    var newConsumable = {
      category: category,
      quantity: req.params.quantity
    };

    _Consumables["default"].addConsumable(newConsumable).then(function () {
      req.flash('success_msg', category + " was added to stock");
      res.redirect("/consumables/add");
    })["catch"](function (err) {
      req.flash('error_msg', "Consumable could not be added");
      res.redirect("/consumables/add");
    });
  })["catch"](function (err) {
    req.flash('error_msg', err + " could not be added to");
    res.redirect("/consumables/add");
  });
});
router.post('/add/battery', [(0, _expressValidator.body)('batSpec').not().isEmpty(), (0, _expressValidator.body)('carBrand').not().isEmpty(), (0, _expressValidator.body)('carYear').not().isEmpty(), (0, _expressValidator.body)('quantityBatteries').not().isEmpty(), (0, _expressValidator.body)('quantityMinBatteries').not().isEmpty()], function (req, res, next) {
  var errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    console.log(req.body);
    req.flash('error_msg', "Could not add consumable please make sure all fields are fild");
    res.redirect("/consumables/add");
  } else {
    var category = req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1);
    var newConsumable = {
      category: category,
      quantity: req.body.quantityBatteries
    };
    var newBattery = {
      batSpec: req.body.batSpec,
      carBrand: req.body.carBrand,
      carYear: req.body.carYear,
      quantity: req.body.quantityBatteries,
      minQuantity: req.body.quantityMinBatteries
    };

    _Battery["default"].addBattery(newBattery).then(function () {
      _Consumables["default"].addConsumable(newConsumable).then(function () {
        req.flash('success_msg', category + " was added to stock");
        res.redirect("/consumables/add");
      })["catch"](function (err) {
        req.flash('error_msg', "Consumable could not be added");
        res.redirect("/consumables/add");
      });
    })["catch"](function (err) {
      req.flash('error_msg', category + " could not be added to");
      res.redirect("/consumables/add");
    });
  }
});
router.post('/add/brake', [(0, _expressValidator.body)('brakeCategory').not().isEmpty(), (0, _expressValidator.body)('brakeCBrand').not().isEmpty(), (0, _expressValidator.body)('brakeCYear').not().isEmpty(), (0, _expressValidator.body)('brakeChassis').not().isEmpty(), (0, _expressValidator.body)('brakeBrand').not().isEmpty(), (0, _expressValidator.body)('brakePBrand').not().isEmpty(), (0, _expressValidator.body)('quantityBrakes').not().isEmpty(), (0, _expressValidator.body)('minQuantityBrakes').not().isEmpty(), (0, _expressValidator.body)('brakePrice').not().isEmpty()], function (req, res, next) {
  var errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    console.log(req.body);
    req.flash('error_msg', "Could not add consumable please make sure all fields are fild");
    res.redirect("/consumables/add");
  } else {
    var category = req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1);
    var newConsumable = {
      category: category,
      quantity: req.body.quantityBrakes
    };
    var newBrake = {
      category: req.body.brakeCategory,
      carBrand: req.body.brakeCBrand,
      carYear: req.body.brakeCYear,
      bBrand: req.body.brakeBrand,
      preferredBrand: req.body.brakePBrand,
      chassis: req.body.brakeChassis,
      singleCost: req.body.brakePrice,
      quantity: req.body.quantityBrakes,
      minQuantity: req.body.minQuantityBrakes
    };
    console.log(newBrake);

    _Brake["default"].addBrake(newBrake).then(function () {
      _Consumables["default"].addConsumable(newConsumable).then(function () {
        req.flash('success_msg', category + " was added to stock");
        res.redirect("/consumables/add");
      })["catch"](function (err) {
        req.flash('error_msg', "Consumable could not be added");
        res.redirect("/consumables/add");
      });
    })["catch"](function (err) {
      req.flash('error_msg', category + " could not be added to");
      res.redirect("/consumables/add");
    });
  }
});
router.get('/update-brake/:id/:quantity', function (req, res, next) {
  var newBrake = {
    id: req.params.id,
    quantity: req.params.quantity
  };

  _Brake["default"].addBrake(newBrake).then(function () {
    var newConsumable = {
      category: "Brake",
      quantity: req.params.quantity
    };

    _Consumables["default"].addConsumable(newConsumable).then(function () {
      req.flash('success_msg', "Brake was added to stock");
      res.redirect("/consumables/add");
    })["catch"](function (err) {
      req.flash('error_msg', "Brake could not be added");
      res.redirect("/consumables/add");
    });
  })["catch"](function (err) {
    req.flash('error_msg', err + "Brake could not be added to");
    res.redirect("/consumables/add");
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
                  page: "view",
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