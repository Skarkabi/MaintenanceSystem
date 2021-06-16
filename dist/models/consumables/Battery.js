"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var _express = require("express");

var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batSpec: {
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
  minQuantity: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  quantity: {
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

var Battery = _mySQLDB["default"].define('battery_stocks', mappings, {
  indexes: [{
    name: 'battery_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'battery_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'battery_batSpec_index',
    method: 'BTREE',
    fields: ['batSpec']
  }, {
    name: 'battery_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'battery_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'battery_minQuantity_index',
    method: 'BTREE',
    fields: ['minQuantity']
  }, {
    name: 'battery_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'battery_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

Battery.updateBattery = function (newBattery) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Battery",
      quantity: newBattery.quantity
    };
    Battery.findOne({
      where: {
        id: newBattery.id
      }
    }).then(function (foundBattery) {
      var quant = parseInt(newBattery.quantity) + foundBattery.quantity;
      Battery.update({
        quantity: quant
      }, {
        where: {
          id: newBattery.id
        }
      }).then(function () {
        _Consumables["default"].addConsumable(newConsumable).then(function () {
          resolve(newBattery.quantity + " Batteries Sucessfully Added to Existing Stock!");
        })["catch"](function (err) {
          reject("An Error Occured Batteries Could not be Added");
        });
      })["catch"](function (err) {
        reject("An Error Occured Batteries Could not be Added");
      });
    })["catch"](function (err) {
      reject("An Error Occured Batteries Could not be Added");
    });
  });
};

Battery.addBattery = function (newBattery) {
  console.log(newBattery);
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Battery",
      quantity: newBattery.quantity
    };
    Battery.findOne({
      where: {
        batSpec: newBattery.batSpec,
        carBrand: newBattery.carBrand,
        carYear: newBattery.carYear
      }
    }).then(function (foundBattery) {
      if (foundBattery) {
        reject("Batteries With these Details Already Registered, Please Add to Existing Stock");
      } else {
        console.log("Adding this " + JSON.stringify(newBattery));
        Battery.create(newBattery).then(function () {
          _Consumables["default"].addConsumable(newConsumable).then(function () {
            resolve(newBattery.quantity + " Batteries Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Batteries Could not be Added");
          });
        })["catch"](function (err) {
          reject("An Error Occured Batteries Could not be Added");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Batteries Could not be Added");
    });
  });
};

Battery.getBatteryStocks = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var batteriesC, batSpecs, carBrands, carYears, batteryQuantity, values;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _Consumables["default"].getSpecific("battery").then(function (consumables) {
                console.log(consumables);
                batteriesC = consumables;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 2:
              _context.next = 4;
              return Battery.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `batSpec`'), 'batSpec']],
                raw: true,
                nest: true
              }).then(function (spec) {
                batSpecs = spec;
                console.log(batSpecs);
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 4:
              _context.next = 6;
              return Battery.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carBrand`'), 'carBrand']]
              }).then(function (spec) {
                carBrands = spec;
                console.log(carBrands);
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 6:
              _context.next = 8;
              return Battery.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carYear`'), 'carYear']]
              }).then(function (spec) {
                carYears = spec;
                console.log(carYears);
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 8:
              values = {
                consumable: batteriesC.rows,
                specs: batSpecs,
                brands: carBrands,
                years: carYears
              };
              resolve(values);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var _default = Battery;
exports["default"] = _default;