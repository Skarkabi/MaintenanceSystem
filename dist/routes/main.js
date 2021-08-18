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
  res.render('createUpdateMain', {
    title: "New Maintanence Request",
    jumbotronDescription: "Create a New Maintanence Request"
  });
});
/**
 * Express Route to get selected maintenance job details
 */

router.get('/:req', function (req, res, next) {
  _Consumables["default"].getFullStock().then(function (consumablesToSelect) {
    _MaintenanceOrder["default"].getByReq(req.params.req).then(function (found) {
      res.render('displayMain', {
        title: "Maintanence Request # ".concat(found.req),
        jumbotronDescription: "Request # ".concat(found.req, " for division ").concat(found.division),
        existingMain: found,
        mainConsumable: found.consumable_data,
        mainEmployee: found.employee_data,
        consumableTable: consumablesToSelect,
        msgType: req.flash()
      });
    });
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
  _MaintenanceOrder["default"].updateMaterialRequest(req.params.req, req.body.materialRequest, req.body.discription, req.body.remark).then(function (output) {
    req.flash('success_msg', output);
    res.redirect("back");
  })["catch"](function (err) {
    req.flash('error_msg', err);
    res.redirect("back");
  });
});
router.post('/update/material_request/add_consumables/:req/:category', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var updateValues, finished, i, newValue, category;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("AAAAAAAAAAAAAAA");
            updateValues = [];

            for (i = 0; i < req.body.quantityInput.length; i++) {
              if (req.body.quantityInput[i] !== "" && req.body.quantityInput[i] !== "0" && req.body.quantityInput[i] !== 0) {
                newValue = {
                  consumableId: req.body.consumable_id[i],
                  quantity: req.body.quantityInput[i]
                };
                updateValues.push(newValue);
              }
            }

            category = req.params.category[0].toUpperCase() + req.params.category.slice(1);

            if (!(updateValues.length !== 0)) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return Promise.all(updateValues.map(function (consumables) {
              _MaintenanceConsumables["default"].useConsumable(consumables.consumableId, category, req.params.req, parseFloat(consumables.quantity), "add").then(function (output) {
                finished = output;
              })["catch"](function (err) {
                return returnError(err);
              });
            }));

          case 7:
            req.flash('success_msg', "".concat(category, " Succesfully Used From Stock"));
            res.redirect("back"); //MaintenanceConsumables.useConsumable(req.params.consumableId, req.params.category, req.params)

          case 9:
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

function returnError(er) {
  req.flash('error_msg', er);
  res.redirect("back");
}

var _default = router;
exports["default"] = _default;