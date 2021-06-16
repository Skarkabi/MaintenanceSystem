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

var _bluebird = _interopRequireDefault(require("bluebird"));

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

Brake.updateBrake = function (newBrake) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Brake",
      quantity: newBrake.quantity
    };
    Brake.findOne({
      where: {
        id: newBrake.id
      }
    }).then(function (foundBrake) {
      var quant = parseInt(newBrake.quantity) + foundBrake.quantity;
      Brake.update({
        quantity: quant
      }, {
        where: {
          id: newBrake.id
        }
      }).then(function () {
        _Consumables["default"].addConsumable(newConsumable).then(function () {
          resolve(newBrake.quantity + " Brakes Sucessfully Added to Existing Stock!");
        })["catch"](function (err) {
          reject("An Error Occured Brakes Could not be Added");
        });
      })["catch"](function (err) {
        reject("An Error Occured Brakes Could not be Added");
      });
    })["catch"](function (err) {
      reject("An Error Occured Brakes Could not be Added");
    });
  });
};

Brake.addBrake = function (newBrake) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Brake",
      quantity: newBrake.quantity
    };
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
        reject("Brakes With these Details Already Registered, Please Add to Existing Stock");
      } else {
        newBrake.singleCost = parseFloat(newBrake.singleCost);
        newBrake.quantity = parseInt(newBrake.quantity);
        newBrake.minQuantity = parseInt(newBrake.minQuantity);
        newBrake.totalCost = newBrake.singleCost * newBrake.quantity;
        Brake.create(newBrake).then(function () {
          _Consumables["default"].addConsumable(newConsumable).then(function () {
            resolve(newBrake.quantity + " Brakes Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Brakes Could not be Added");
          });
        })["catch"](function (err) {
          reject("An Error Occured Brakes Could not be Added");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Brakes Could not be Added");
    });
  });
};

Brake.getBrakeStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var brakeC, brakeCategory, brakeCBrand, brakeCYear, brakeCChassis, brakeBrand, brakePBrand, brakeQuantity, values;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _Consumables["default"].getSpecific("brake").then(function (consumables) {
                console.log(consumables);
                brakeC = consumables;
              })["catch"](function () {
                reject("Error Connecting to the Server");
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
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 4:
              _context.next = 6;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carBrand`'), 'carBrand']]
              }).then(function (spec) {
                brakeCBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 6:
              _context.next = 8;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carYear`'), 'carYear']]
              }).then(function (spec) {
                brakeCYear = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 8:
              _context.next = 10;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `chassis`'), 'chassis']]
              }).then(function (spec) {
                brakeCChassis = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 10:
              _context.next = 12;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `bBrand`'), 'bBrand']]
              }).then(function (spec) {
                brakeBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 12:
              _context.next = 14;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `preferredBrand`'), 'preferredBrand']]
              }).then(function (spec) {
                brakePBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 14:
              _context.next = 16;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `quantity`'), 'quantity']]
              }).then(function (spec) {
                brakeQuantity = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
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
              resolve(values);

            case 18:
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

var _default = Brake;
exports["default"] = _default;