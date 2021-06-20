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

var _Supplier = _interopRequireDefault(require("../models/Supplier"));

//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
var router = _express["default"].Router();

router.get('/', function (req, res, next) {
  var msf = req.flash();

  _Supplier["default"].findAndCountAll().then(function (suppliers) {
    res.render("displaySuppliers", {
      tite: "Suppliers",
      jumbotronDesciption: "View all suppliers registered in the system",
      suppliers: suppliers.rows,
      msgType: req.flash()
    });
  })["catch"](function (err) {
    console.log(err);
  });
});
router.get('/display-supplier/:id', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _Supplier["default"].getById(req.params.id).then(function (foundSupplier) {
              console.log(JSON.stringify(foundSupplier));
              res.render('displaySupplier', {
                title: "".concat(foundSupplier.name),
                jumbotronDesciption: "Information for Supplier ".concat(foundSupplier.name),
                existingSupplier: foundSupplier,
                showPii: req.user.admin,
                msgType: req.flash()
              });
            })["catch"](function (err) {
              console.log(err);
            });

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
var _default = router;
exports["default"] = _default;