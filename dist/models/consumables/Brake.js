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

var _Supplier = _interopRequireDefault(require("../Supplier"));

var _Quotation = _interopRequireDefault(require("../Quotation"));

var _this = void 0;

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
  supplierId: {
    type: _sequelize["default"].DataTypes.INTEGER,
    allowNull: false
  },
  supplierName: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.STRING, ['supplierName'])
  },
  quotationNumber: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  minQuantity: {
    type: _sequelize["default"].DataTypes.INTEGER,
    allowNull: true
  },
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: false
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
  }, {
    name: 'brake_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'brake_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }]
});

Brake.updateBrake = function (newBrake, action) {
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
      var quant;

      if (action === "add") {
        quant = parseInt(newBrake.quantity) + foundBrake.quantity;
      } else if (action === "delet") {
        quant = foundBrake.quantity - parseInt(newBrake.quantity);
      }

      if (quant === 0) {
        foundBrake.destroy().then(function () {
          resolve("Brake Completly Removed From Stock!");
        })["catch"](function (err) {
          reject("An Error Occured Brakes Could not be Deleted");
        });
      } else if (quant < 0) {
        reject("Can Not Delete More Than Exists in Stock");
      } else {
        Brake.update({
          quantity: quant
        }, {
          where: {
            id: newBrake.id
          }
        }).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            if (action === "delet") {
              resolve(newBrake.quantity + " Brakes Sucessfully Deleted from Existing Stock!");
            } else if (action === "add") {
              resolve(newBrake.quantity + " Brakes Sucessfully Added to Existing Stock!");
            }
          })["catch"](function (err) {
            reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
          });
        })["catch"](function (err) {
          reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
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
        chassis: newBrake.chassis,
        supplierId: newBrake.supplierId,
        quotationNumber: newBrake.quotationNumber
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
          _Consumables["default"].updateConsumable(newConsumable, "add").then(function () {
            resolve(newBrake.quantity + " Brakes Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
          });
        })["catch"](function (err) {
          reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
    });
  });
};

Brake.getBrakeStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var brakeC, brakeS, brakeCategory, brakeCBrand, brakeCYear, brakeCChassis, brakeBrand, brakePBrand, brakeQuantity, values;
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
              return _Supplier["default"].findAll().then(function (suppliers) {
                brakeS = suppliers;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 4:
              _context.next = 6;
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

            case 6:
              _context.next = 8;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carBrand`'), 'carBrand']]
              }).then(function (spec) {
                brakeCBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 8:
              _context.next = 10;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carYear`'), 'carYear']]
              }).then(function (spec) {
                brakeCYear = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 10:
              _context.next = 12;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `chassis`'), 'chassis']]
              }).then(function (spec) {
                brakeCChassis = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 12:
              _context.next = 14;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `bBrand`'), 'bBrand']]
              }).then(function (spec) {
                brakeBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 14:
              _context.next = 16;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `preferredBrand`'), 'preferredBrand']]
              }).then(function (spec) {
                brakePBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 16:
              _context.next = 18;
              return Brake.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `quantity`'), 'quantity']]
              }).then(function (spec) {
                brakeQuantity = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 18:
              values = {
                consumable: brakeC.rows,
                suppliers: brakeS,
                brakeCategory: brakeCategory,
                brakeCBrand: brakeCBrand,
                brakeCYear: brakeCYear,
                brakeCChassis: brakeCChassis,
                brakeBrand: brakeBrand,
                brakePBrand: brakePBrand,
                brakeQuantity: brakeQuantity
              };
              resolve(values);

            case 20:
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

Brake.getQuotation = function () {
  return new _bluebird["default"](function (resolve, reject) {
    _Quotation["default"].getQuotation(_this.quotationNumber).then(function (foundQuotation) {
      resolve(foundQuotation);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Brake.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    Brake.findAndCountAll({
      where: {
        supplierId: supplierId
      }
    }).then( /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(foundBrakes) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _Supplier["default"].getSupplierNames(foundBrakes);

              case 2:
                resolve(foundBrakes.rows);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }())["catch"](function (err) {
      reject(err);
    });
  });
};

Brake.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    Brake.findAll({
      attributes: ['category', 'carBrand', 'carYear', 'chassis', 'bBrand', 'singleCost', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('quantity')), 'quantity']],
      group: ["category", "carBrand", "carYear", "chassis", "bBrand", "singleCost", "supplierId", "preferredBrand"]
    }).then( /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(values) {
        var result;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                result = {
                  count: values.length,
                  rows: values
                };
                _context3.next = 3;
                return _Supplier["default"].getSupplierNames(result);

              case 3:
                resolve(result);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x4) {
        return _ref3.apply(this, arguments);
      };
    }());
  });
};

var _default = Brake;
exports["default"] = _default;