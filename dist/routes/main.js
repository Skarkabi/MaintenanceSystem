"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _stream = require("stream");

var _Consumables = _interopRequireDefault(require("../models/Consumables"));

var _MaintenanceConsumables = _interopRequireDefault(require("../models/consumables/MaintenanceConsumables"));

var _MaintenanceOrder = _interopRequireDefault(require("../models/MaintenanceOrder"));

var _Vehicle = _interopRequireDefault(require("../models/Vehicle"));

var router = _express["default"].Router();
/**
 * Express Route to display all maintanence jobs
 */


router.get('/', function (req, res, next) {
  _MaintenanceOrder["default"].getOrders().then(function (orders) {
    res.render('displayMains', {
      title: "Maintanence Requestds",
      jumbotronDescription: "All Maintantence Requests",
      orders: orders,
      msgType: req.flash()
    });
  });
});
/**
 * Express Route to load create new maintenace request page
 */

router.get('/create', function (req, res, next) {
  _MaintenanceOrder["default"].findOne({
    order: [['createdAt', 'DESC']]
  }).then(function (result) {
    var str = result.req;
    var matches = str.match(/(\d+)/);

    _Vehicle["default"].getMappedStock().then(function (vehicles) {
      res.render('createUpdateMain', {
        title: "New Maintanence Request",
        jumbotronDescription: "Create a New Maintanence Request",
        newReqNumber: "TMC" + JSON.stringify(parseInt(matches[0]) + 1),
        vehicles: vehicles,
        action: "/maintanence/create",
        msgType: req.flash()
      });
    });
  });
});
router.post('/create', function (req, res, next) {
  console.log(req.body);
  var newOrder = {
    req: req.body.reqNumber,
    division: req.body.division,
    plate: req.body.plate,
    discription: req.body.discription
  };

  _MaintenanceOrder["default"].addOrder(newOrder).then(function (output) {
    req.flash('success_msg', output);
    res.redirect("back");
  });
});
/**
 * Express Route to get selected maintenance job details
 */

router.get('/:req', function (req, res, next) {
  _Consumables["default"].getFullStock().then(function (consumablesToSelect) {
    _MaintenanceOrder["default"].getByReq(req.params.req).then(function (found) {
      _Consumables["default"].getDistinctConsumableValues().then(function (values) {
        res.render('displayMain', {
          title: "Maintanence Request # ".concat(found.req),
          jumbotronDescription: "Request # ".concat(found.req, " for division ").concat(found.division),
          existingMain: found,
          mainConsumable: found.consumable_data,
          mainEmployee: found.employee_data,
          consumableTable: consumablesToSelect,
          values: values,
          msgType: req.flash()
        });
      })["catch"](function (err) {
        console.log("...................................");
        console.log(err);
        console.log("...................................");
      });
    })["catch"](function (err) {
      console.log("...................................");
      console.log(err);
      console.log("...................................");
    });
  })["catch"](function (err) {
    console.log("...................................");
    console.log(err);
    console.log("...................................");
  });
});
router.post('/update/:req', function (req, res, next) {
  console.log("In Here");

  _MaintenanceOrder["default"].completeOrder(req.params.req).then(function (output) {
    req.flash('success_msg', output);
    res.redirect("back");
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("back");
  });
});
router.post('/update/material_request/:req', function (req, res, next) {
  _MaintenanceOrder["default"].updateMaterialRequest(req.params.req, req.body.materialRequest, req.body.discription, req.body.remark, req.body.work_hour).then(function (output) {
    req.flash('success_msg', output);
    res.redirect("back");
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("back");
  });
});
router.post('/update/material_request/add_consumables/:req/:category', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var updateValues, numOfInputs, finished, errorHappend, i, newValue, category, testItem;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            updateValues = [];
            numOfInputs = 0;

            if (req.body.quantityInput) {
              numOfInputs = req.body.quantityInput.length;
            }

            errorHappend = {
              error: false,
              msg: ""
            };

            for (i = 0; i < numOfInputs; i++) {
              if (req.body.quantityInput[i] !== "" && req.body.quantityInput[i] !== "0" && req.body.quantityInput[i] !== 0) {
                if (req.params.category === "other") {
                  newValue = {
                    consumableId: req.body.consumable_id[i],
                    quantity: req.body.quantityInput[i],
                    category: req.body.consumable_category[i]
                  };
                } else {
                  newValue = {
                    consumableId: req.body.consumable_id[i],
                    quantity: req.body.quantityInput[i]
                  };
                }

                updateValues.push(newValue);
              }
            }

            console.log("PPPPPPPPLLLLLLLEEEEEEAAAASSSSEEE");
            console.log(updateValues);
            category = req.params.category[0].toUpperCase() + req.params.category.slice(1);

            if (!(req.body.eOrN !== "new" && updateValues.length !== 0)) {
              _context.next = 13;
              break;
            }

            _context.next = 11;
            return Promise.all(updateValues.map(function (consumables) {
              var usedCategory;
              var fromStock = true;

              if (category === "Other") {
                usedCategory = consumables.category;

                if (req.body.eOrN === "existing") {
                  fromStock = true;
                } else {
                  fromStock = false;
                }
              } else {
                usedCategory = category;
              }

              console.log("PPPPPPPPLLLLLLLEEEEEEAAAASSSSEEE");

              _MaintenanceConsumables["default"].useConsumable(consumables.consumableId, usedCategory, req.params.req, parseFloat(consumables.quantity), "add", fromStock).then(function (output) {
                finished = output;
              })["catch"](function (err) {
                errorHappend = {
                  error: true,
                  msg: err
                };
              });
            }));

          case 11:
            _context.next = 16;
            break;

          case 13:
            testItem = {
              other_name: "Test",
              quantity: 12,
              singleCost: 34,
              totalCost: 12 * 34,
              details: "This si a test",
              supplierId: "1",
              quotationNumber: "TEST10001",
              materialRequestNumber: "TEEEST1010",
              maintenanceReq: "TMC9912"
            };
            _context.next = 16;
            return _MaintenanceConsumables["default"].useNonStockConsumable(testItem).then(function (output) {
              finished = output;
            })["catch"](function (err) {
              console.log(err);
              errorHappend = {
                error: true,
                msg: err
              };
            });

          case 16:
            if (errorHappend.error) {
              req.flash('error_msg', errorHappend.msg);
              res.redirect("back");
            } else {
              req.flash('success_msg', "".concat(category, " Succesfully Used From Stock"));
              res.redirect("back");
            } //MaintenanceConsumables.useConsumable(req.params.consumableId, req.params.category, req.params)


          case 17:
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

function returnError(er, req, res) {
  req.flash('error_msg', er);
  res.redirect("back");
}

var _default = router;
exports["default"] = _default;