"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _Consumables = _interopRequireDefault(require("../models/Consumables"));

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
      orders: orders
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
    var consumables = [];
    var employees = [];
    var c1 = {
      mr: "Stock",
      material: "Filter",
      cost: "23.2",
      supplier: "T.M.I.",
      quantity: "2"
    };
    var e1 = {
      eId: "T11538",
      firstName: "Wissam",
      lastName: "Hnien"
    };
    var c2 = {};
    consumables.push(c1);
    employees[0] = e1;

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
var _default = router;
exports["default"] = _default;