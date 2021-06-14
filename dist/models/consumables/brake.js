"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carYear: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  bBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  preferredBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  chassis: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  singleCost: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  totalCost: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  quantity: {
    type: _sequelize["default"].DataTypes.INTEGER,
    allowNull: true
  },
  minQuantity: {
    type: _sequelize["default"].DataTypes.INTEGER,
    allowNull: true
  },
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  }
};

var Brake = _mySQLDB["default"].define('brake_stocks', mappings, {
  indexes: [{
    name: 'brake_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'brake_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'brake_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'brake_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'brake_chassis_index',
    method: 'BTREE',
    fields: ['chassis']
  }, {
    name: 'brake_bBrand_index',
    method: 'BTREE',
    fields: ['bBrand']
  }, {
    name: 'brake_preferredBrand_index',
    method: 'BTREE',
    fields: ['preferredBrand']
  }, {
    name: 'brake_singleCost_index',
    method: 'BTREE',
    fields: ['singleCost']
  }, {
    name: 'brake_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'brake_minQuantity_index',
    method: 'BTREE',
    fields: ['minQuantity']
  }, {
    name: 'brake_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'brake_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

Brake.addBrake = function (newBrake) {
  return new Promise(function (resolve, reject) {
    if (newBrake.id) {
      resolve(Brake.findOne({
        where: {
          id: newBrake.id
        }
      }).then(function (foundBrake) {
        var quant = parseInt(newBrake.quantity) + foundBrake.quantity;
        resolve(Brake.update({
          quantity: quant
        }, {
          where: {
            id: newBrake.id
          }
        })["catch"](function (err) {
          reject(err);
        }));
      })["catch"](function (err) {
        reject(err);
      }));
    } else {
      Brake.findOne({
        where: {
          category: newBrake.category,
          carBrand: newBrake.carBrand,
          carYear: newBrake.carYear,
          bBrand: newBrake.bBrand,
          preferredBrand: newBrake.preferredBrand,
          chassis: newBrake.chassis
        }
      }).then(function (foundBrake) {
        if (foundBrake) {
          reject("This Brake Already Exists in the Stock");
        } else {
          newBrake.singleCost = parseFloat(newBrake.singleCost);
          newBrake.quantity = parseInt(newBrake.quantity);
          newBrake.minQuantity = parseInt(newBrake.minQuantity);
          newBrake.totalCost = newBrake.singleCost * newBrake.quantity;
          resolve(Brake.create(newBrake).then(function () {
            console.log("created");
          })["catch"](function (err) {
            console.log(err);
            reject(err);
          }));
        }
      })["catch"](function (err) {
        reject(err);
      });
    }
  });
};

Brake.getBrakeStock = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var brakeC, brakeCategory, brakeCBrand, brakeCYear, brakeCChassis, brakeBrand, brakePBrand, brakeQuantity, values;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _Consumables["default"].getSpecific("brake").then(function (consumables) {
            console.log(consumables);
            brakeC = consumables;
          });

        case 2:
          _context.next = 4;
          return Brake.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `category`'), 'category']],
            raw: true,
            nest: true
          }).then(function (category) {
            brakeCategory = category;
            console.log("B = " + JSON.stringify(brakeCategory));
          });

        case 4:
          _context.next = 6;
          return Brake.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `carBrand`'), 'carBrand']]
          }).then(function (spec) {
            brakeCBrand = spec;
          });

        case 6:
          _context.next = 8;
          return Brake.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `carYear`'), 'carYear']]
          }).then(function (spec) {
            brakeCYear = spec;
          });

        case 8:
          _context.next = 10;
          return Brake.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `chassis`'), 'chassis']]
          }).then(function (spec) {
            brakeCChassis = spec;
          });

        case 10:
          _context.next = 12;
          return Brake.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `bBrand`'), 'bBrand']]
          }).then(function (spec) {
            brakeBrand = spec;
          });

        case 12:
          _context.next = 14;
          return Brake.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `preferredBrand`'), 'preferredBrand']]
          }).then(function (spec) {
            brakePBrand = spec;
          });

        case 14:
          _context.next = 16;
          return Brake.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `quantity`'), 'quantity']]
          }).then(function (spec) {
            brakeQuantity = spec;
          });

        case 16:
          values = {
            consumable: brakeC.rows,
            brakeCategory: brakeCategory,
            brakeCBrand: brakeCBrand,
            brakeCYear: brakeCYear,
            brakeCChassis: brakeCChassis,
            brakeBrand: brakeBrand,
            brakePBrand: brakePBrand,
            brakeQuantity: brakeQuantity
          };
          return _context.abrupt("return", values);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
var _default = Brake;
exports["default"] = _default;