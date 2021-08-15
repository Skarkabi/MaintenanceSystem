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

var _Consumables = _interopRequireDefault(require("../models/Consumables"));

//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
var router = _express["default"].Router();

router.get('/', function (req, res, next) {
  _Supplier["default"].findAndCountAll().then(function (suppliers) {
    res.render("displaySuppliers", {
      title: "Suppliers",
      jumbotronDescription: "View all suppliers registered in the system",
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
            _Supplier["default"].getSpecficSupplier(req.params.id).then(function (foundSupplier) {
              console.log(foundSupplier);
              res.render('displaySupplier', {
                title: "".concat(foundSupplier.name),
                jumbotronDescription: "Information for Supplier ".concat(foundSupplier.name),
                existingSupplier: foundSupplier,
                showPii: req.user.admin,
                consumables: foundSupplier.items,
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
router.get('/unavailable', function (req, res, next) {
  req.flash('error_msg', "Quotation is Not Available");
  res.redirect("back");
});
router.get('/register', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _Supplier["default"].getStock().then(function (suppliers) {
              res.render('addUpdateSupplier', {
                title: 'Register Supplier',
                jumbotronDesciption: 'Register a new Supplier in the system',
                submitButtonText: 'Register',
                supplier: suppliers,
                msgType: req.flash()
              });
            });

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
router.post('/register', [(0, _expressValidator.body)('name').not().isEmpty(), (0, _expressValidator.body)('phone').not().isEmpty(), (0, _expressValidator.body)('email').not().isEmpty(), (0, _expressValidator.body)('category').not().isEmpty(), (0, _expressValidator.body)('brand').not().isEmpty()], /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var newSupplier;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            newSupplier = {
              name: req.body.name,
              phone: req.body.phone,
              email: req.body.email,
              category: req.body.category,
              brand: req.body.brand
            };

            _Supplier["default"].addSupplier(newSupplier).then(function (output) {
              req.flash('success_msg', output);
              res.redirect('/suppliers');
            })["catch"](function (err) {
              req.flash('error_msg', err);
              res.redirect('/register');
            });

          case 2:
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
var _default = router;
exports["default"] = _default;