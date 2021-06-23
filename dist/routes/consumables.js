"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

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

var _Oil = _interopRequireDefault(require("../models/consumables/Oil"));

var _puppeteer = _interopRequireWildcard(require("puppeteer"));

var _Supplier = _interopRequireDefault(require("../models/Supplier"));

var _Quotation = _interopRequireDefault(require("../models/Quotation"));

var _multer = _interopRequireDefault(require("multer"));

var _fs = _interopRequireDefault(require("fs"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  _getStocks = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var batteries, brakes, filters, grease, oil, suppliers, values;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _Battery["default"].getBatteryStocks().then(function (values) {
              console.log("I am in here");
              batteries = values;
            });

          case 2:
            _context9.next = 4;
            return _Brake["default"].getBrakeStock().then(function (values) {
              brakes = values;
            });

          case 4:
            _context9.next = 6;
            return _Filter["default"].getFilterStock().then(function (values) {
              filters = values;
            });

          case 6:
            _context9.next = 8;
            return _Grease["default"].getGreaseStock().then(function (values) {
              grease = values;
            });

          case 8:
            _context9.next = 10;
            return _Oil["default"].getOilStock().then(function (values) {
              oil = values;
            });

          case 10:
            _context9.next = 12;
            return _Supplier["default"].findAll().then(function (values) {
              suppliers = values;
            });

          case 12:
            values = {
              batteries: batteries,
              brakes: brakes,
              filters: filters,
              grease: grease,
              oil: oil,
              supplier: suppliers
            };
            return _context9.abrupt("return", values);

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _getStocks.apply(this, arguments);
}

router.get('/add', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("I am in here Add");

            if (req.user) {
              getStocks().then(function (values) {
                res.render('addConsumable', {
                  title: 'Add New Consumable',
                  jumbotronDescription: "Add a new user Consumable.",
                  submitButtonText: 'Create',
                  action: "/upload/single",
                  values: values,
                  page: "add",
                  msgType: req.flash()
                });
              });
            }

          case 2:
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
router.post('/update-battery/:action/:id', function (req, res, next) {
  var newBattery = {
    id: req.params.id,
    quantity: req.body.newQuantity
  };

  _Battery["default"].updateBattery(newBattery, req.params.action).then(function (output) {
    console.log("Maded it in here");
    req.flash('success_msg', output);
    res.redirect('back');
  })["catch"](function (err) {
    req.flash('error_msg', err + " could not be added to");
    res.redirect('back');
  });
});
router.post('/add/battery', _Quotation["default"].uploadFile().single('upload'), function (req, res, next) {
  var newBattery = {
    batSpec: req.body.batSpec,
    carBrand: req.body.carBrand,
    carYear: req.body.carYear,
    quantity: req.body.quantityBatteries,
    minQuantity: req.body.quantityMinBatteries,
    supplierId: req.body.batteriesSupplierName,
    quotationNumber: req.body.quotation
  };
  var newQuotation = {
    quotationNumber: req.body.quotation,
    quotationPath: req.file.path
  };

  _Battery["default"].addBattery(newBattery).then(function (output) {
    _Quotation["default"].addQuotation(newQuotation);

    req.flash('success_msg', output);
    res.redirect("/consumables/add");
  })["catch"](function (err) {
    req.flash('error_msg', JSON.stringify(err));
    res.redirect("/consumables/add");
  });
});
router.post('/add/brake', _Quotation["default"].uploadFile().single('upload'), function (req, res, next) {
  var newBrake = {
    category: req.body.brakeCategory,
    carBrand: req.body.brakeCBrand,
    carYear: req.body.brakeCYear,
    bBrand: req.body.brakeBrand,
    preferredBrand: req.body.brakePBrand,
    chassis: req.body.brakeChassis,
    singleCost: req.body.brakePrice,
    quantity: req.body.quantityBrakes,
    minQuantity: req.body.minQuantityBrakes,
    supplierId: req.body.brakeSupplierName,
    quotationNumber: req.body.quotation
  };
  var newQuotation = {
    quotationNumber: req.body.quotation,
    quotationPath: req.file.path
  };

  _Brake["default"].addBrake(newBrake).then(function (output) {
    _Quotation["default"].addQuotation(newQuotation);

    req.flash('success_msg', output);
    res.redirect("/consumables/add");
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("/consumables/add");
  });
});
router.post('/update-brake/:action/:id', function (req, res, next) {
  var newBrake = {
    id: req.params.id,
    quantity: req.body.newQuantity
  };

  _Brake["default"].updateBrake(newBrake, req.params.action).then(function (output) {
    req.flash('success_msg', output);
    res.redirect("back");
  })["catch"](function (err) {
    req.flash('error_msg', "Error " + err);
    res.redirect("back");
  });
});
router.get('/display-vehicle/:id', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.user) {
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
router.post('/add/filter', _Quotation["default"].uploadFile().single('upload'), function (req, res, next) {
  var newFilter = {
    carBrand: req.body.filterCarBrand,
    carModel: req.body.filterCarModel,
    carYear: req.body.filterCarYear,
    category: req.body.vehicleCategory,
    fType: req.body.filterType,
    preferredBrand: req.body.filterPBrand,
    actualBrand: req.body.filterABrand,
    singleCost: req.body.filterPrice,
    quantity: req.body.quantityFilters,
    minQuantity: req.body.minFilterQuantity,
    supplierId: req.body.filterSupplierName,
    quotationNumber: req.body.quotation
  };
  var newQuotation = {
    quotationNumber: req.body.quotation,
    quotationPath: req.file.path
  };

  _Filter["default"].addFilter(newFilter).then(function (output) {
    _Quotation["default"].addQuotation(newQuotation);

    req.flash('success_msg', output);
    res.redirect("/consumables/add");
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("/consumables/add");
  });
});
router.post('/update-filter/:action/:id', function (req, res, next) {
  var newFilter = {
    id: req.params.id,
    quantity: req.body.newQuantity
  };

  _Filter["default"].updateFilter(newFilter, req.params.action).then(function (output) {
    req.flash('success_msg', output);
    res.redirect("back");
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("back");
  });
});
router.post('/add/grease', _Quotation["default"].uploadFile().single('upload'), function (req, res, next) {
  var newGrease = {
    greaseSpec: req.body.greaseSpec,
    typeOfGrease: req.body.greaseType,
    carBrand: req.body.greaseCarBrand,
    carYear: req.body.greaseCarYear,
    volume: req.body.quantityGrease,
    minVolume: req.body.quantityMinGrease,
    supplierId: req.body.greaseSupplierName,
    quotationNumber: req.body.quotation
  };
  var newQuotation = {
    quotationNumber: req.body.quotation,
    quotationPath: req.file.path
  };

  _Grease["default"].addGrease(newGrease).then(function (output) {
    _Quotation["default"].addQuotation(newQuotation);

    req.flash('success_msg', output);
    res.redirect("/consumables/add");
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("/consumables/add");
  });
});
router.post('/update-grease/:action/:id', function (req, res, next) {
  var newGrease = {
    id: req.params.id,
    volume: req.body.newQuantity
  };

  _Grease["default"].updateGrease(newGrease, req.params.action).then(function (output) {
    req.flash('success_msg', output);
    res.redirect("back");
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("back");
  });
});
router.post('/add/oil', _Quotation["default"].uploadFile().single('upload'), function (req, res, next) {
  var newOil = {
    oilSpec: req.body.oilSpec,
    typeOfOil: req.body.oilType,
    preferredBrand: req.body.preferredOilBrand,
    volume: req.body.quantityOil,
    minVolume: req.body.quantityMinOil,
    oilPrice: req.body.oilPrice,
    supplierId: req.body.oilSupplierName,
    quotationNumber: req.body.quotation
  };
  var newQuotation = {
    quotationNumber: req.body.quotation,
    quotationPath: req.file.path
  };

  _Oil["default"].addOil(newOil).then(function (output) {
    _Quotation["default"].addQuotation(newQuotation).then(function () {
      req.flash('success_msg', output);
      res.redirect("/consumables/add");
    });
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("/consumables/add");
  });
});
router.post('/update-oil/:action/:id', function (req, res, next) {
  var newOil = {
    id: req.params.id,
    volume: req.body.newQuantity
  };

  _Oil["default"].updateOil(newOil, req.params.action).then(function (output) {
    req.flash('success_msg', output);
    res.redirect("back");
  })["catch"](function (err) {
    req.flash('error_msg', err + " could not be added to");
    res.redirect("back");
  });
});
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
    var title, model;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (req.user) {
              title = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
              model = getConsumableModel(req.params.category);
              console.log("LOOK HERE: ");
              model.groupSupplier().then(function (consumables) {
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
router.get('/:category/:supplier', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var title, model;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (req.user) {
              title = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
              model = getConsumableModel(req.params.category);
              model.getWithSupplier(req.params.supplier).then(function (foundModel) {
                res.render("displaySpecificConsumables", {
                  title: title,
                  typeOf: req.params.category,
                  jumbotronDescription: "View all " + title + " from " + foundModel[0].supplierName + " in the system.",
                  consumables: foundModel,
                  page: "add",
                  specfic: true,
                  msgType: req.flash()
                });
              });
            }

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
router.get('/:category/download/:quotationNumber', /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var path, tempFile;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            path = "".concat(__dirname);
            tempFile = path.replace('/dist/routes', "/server/uploads/".concat(req.params.quotationNumber, ".pdf"));
            res.download(tempFile, function (err) {
              if (err) {
                req.flash("error_msg", "File Does Not Exist!");
                res.redirect("back");
              }
            });

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
router.get('/:category/view/:quotationNumber', /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var path, tempFile;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            path = "".concat(__dirname);
            tempFile = path.replace('/dist/routes', "/server/uploads/".concat(req.params.quotationNumber, ".pdf"));

            _fs["default"].readFile(tempFile, function (err, data) {
              res.contentType("application/pdf");
              res.send(data);
            });

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}());
router.get('/close', /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            res.render("closeWindow");

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}());

function getConsumableModel(consumableModel) {
  console.log("My Model Will be " + consumableModel);

  if (consumableModel === "brake") {
    console.log("My Model Will return " + consumableModel);
    return _Brake["default"];
  } else if (consumableModel === "filter") {
    return _Filter["default"];
  } else if (consumableModel === "grease") {
    return _Grease["default"];
  } else if (consumableModel === "oil") {
    return _Oil["default"];
  } else if (consumableModel === "battery") {
    return _Battery["default"];
  }
}

;
var _default = router;
exports["default"] = _default;