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
    consumables[0] = c1;
    employees[0] = e1;
    var newMain = {
      status: "Not Started",
      req: "TMC6938",
      dateCreated: "24/06/2021",
      division: "Metal Doors",
      plate: "68734",
      category: "CAR",
      brand: "FORD",
      model: "MUSTANG",
      year: "2020",
      discription: "This is a test maintanence job order",
      remarks: "This is a test maintenance remark",
      consumables: consumables,
      employees: employees,
      hourCost: "12",
      materialCost: "46.4",
      totalCost: "58.4"
    };

    _MaintenanceOrder["default"].getByReq(req.params.req).then(function (found) {
      console.log("THIS IS THE ORDER");
      console.log(found);
      res.render('displayMain', {
        title: "Maintanence Request # ".concat(found.req),
        jumbotronDescription: "Reques # ".concat(found.req, " for division ").concat(newMain.division),
        existingMain: found,
        mainConsumable: consumables,
        mainEmployee: employees,
        consumableTable: consumablesToSelect
      });
    });
  });
});
var _default = router;
exports["default"] = _default;