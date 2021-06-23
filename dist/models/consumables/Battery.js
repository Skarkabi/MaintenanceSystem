"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

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

var _express = _interopRequireWildcard(require("express"));

var _Supplier = _interopRequireDefault(require("../Supplier"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: false
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
  }, {
    name: 'battery_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'battery_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }]
});

Battery.updateBattery = function (newBattery, action) {
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
      var quant;

      if (action === "add") {
        quant = parseInt(newBattery.quantity) + foundBattery.quantity;
      } else if (action === "delet") {
        quant = foundBattery.quantity - parseInt(newBattery.quantity);
      }

      if (quant === 0) {
        console.log("About to destroy " + foundBattery);
        foundBattery.destroy().then(function () {
          resolve("Battery Completly removed from stock!");
        })["catch"](function (err) {
          console.log("About to destroy Failed");
          reject("An Error Occured Batteries Could not be deleted " + err + " ");
        });
      } else if (quant < 0) {
        reject("Can not Delete More Than Exists in Stock");
      } else {
        console.log("Hanging in here");
        Battery.update({
          quantity: quant
        }, {
          where: {
            id: newBattery.id
          }
        }).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            if (action === "delet") {
              resolve(newBattery.quantity + " Batteries Sucessfully Deleted from Existing Stock!");
            } else if (action === "add") {
              resolve(newBattery.quantity + " Batteries Sucessfully Added to Existing Stock!");
            }
          })["catch"](function (err) {
            reject("An Error Occured Batteries Could not be " + action + "ed");
          });
        })["catch"](function (err) {
          reject("An Error Occured Batteries Could not be " + action + "ed");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Batteries Could not be " + action + "ed");
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
        carYear: newBattery.carYear,
        supplierId: newBattery.supplierId,
        quotationNumber: newBattery.quotationNumber
      }
    }).then(function (foundBattery) {
      if (foundBattery) {
        reject("Batteries With these Details Already Registered, Please Add to Existing Stock");
      } else {
        console.log("Adding this " + JSON.stringify(newBattery));
        Battery.create(newBattery).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, "add").then(function () {
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

Battery.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    Battery.findAndCountAll().then(function (batteries) {
      _Supplier["default"].getSupplierNames(batteries).then(function () {
        resolve(batteries);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Battery.getBatteryStocks = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var batteriesC, batteriesS, batSpecs, carBrands, carYears, batteryQuantity, test, sTest;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _Supplier["default"].findAll().then(function (suppliers) {
                batteriesS = suppliers;
                Battery.getStock().then(function (consumables) {
                  batteriesC = consumables;
                  batSpecs = batteriesC.rows.map(function (val) {
                    return val.batSpec;
                  }).filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                  });
                  carBrands = batteriesC.rows.map(function (val) {
                    return val.carBrand;
                  }).filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                  });
                  carYears = batteriesC.rows.map(function (val) {
                    return val.carYear;
                  }).filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                  });
                  var values = {
                    consumable: batteriesC.rows,
                    suppliers: batteriesS,
                    specs: batSpecs,
                    brands: carBrands,
                    years: carYears
                  };
                  console.log("See if it works 5s");
                  console.log(values.years);
                  resolve(values);
                })["catch"](function () {
                  reject(err);
                });
              });

            case 1:
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

Battery.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    Battery.findAndCountAll({
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

Battery.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    Battery.findAll({
      attributes: ['batSpec', 'carBrand', 'carYear', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('quantity')), 'quantity']],
      group: ["batSpec", "carBrand", "carYear", "supplierId"]
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

var _default = Battery;
exports["default"] = _default;