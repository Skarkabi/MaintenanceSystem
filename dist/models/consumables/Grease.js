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

var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  greaseSpec: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  typeOfGrease: {
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
  volume: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
  },
  minVolume: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
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

var Grease = _mySQLDB["default"].define('grease_stocks', mappings, {
  indexes: [{
    name: 'grease_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'grease_volume_index',
    method: 'BTREE',
    fields: ['volume']
  }, {
    name: 'grease_minVolume_index',
    method: 'BTREE',
    fields: ['minVolume']
  }, {
    name: 'grease_greaseSpec_index',
    method: 'BTREE',
    fields: ['greaseSpec']
  }, {
    name: 'grease_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'grease_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'grease_typeOfGrease_index',
    method: 'BTREE',
    fields: ['typeOfGrease']
  }, {
    name: 'grease_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'grease_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'grease_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'grease_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }]
});

Grease.updateGrease = function (newGrease, action) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Grease",
      quantity: newGrease.volume
    };
    Grease.findOne({
      where: {
        id: newGrease.id
      }
    }).then(function (foundGrease) {
      var quant;

      if (action === "add") {
        quant = parseFloat(newGrease.volume) + foundGrease.volume;
      } else if (action === "delet") {
        quant = foundGrease.volume - parseFloat(newGrease.volume);
      }

      if (quant === 0) {
        foundGrease.destroy().then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            resolve(newGrease.volume + " Liters Of Grease Sucessfully Deleted from Existing Stock!");
          })["catch"](function (err) {
            reject("An Error Occured Grease Could not be Deleted");
          });
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Deleted");
        });
      } else if (quant < 0) {
        reject("Can Not Delete More Than Exists in Stock!");
      } else {
        Grease.update({
          volume: quant
        }, {
          where: {
            id: newGrease.id
          }
        }).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            resolve(newGrease.volume + " Liters of Grease Sucessfully Added to Existing Stock!");
          })["catch"](function (err) {
            reject("An Error Occured Grease Could not be Added " + err);
          });
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Added " + err);
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Grease Could not be Added " + err);
    });
  });
};

Grease.addGrease = function (newGrease) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Grease",
      quantity: newGrease.volume
    };
    Grease.findOne({
      where: {
        greaseSpec: newGrease.greaseSpec,
        typeOfGrease: newGrease.typeOfGrease,
        carBrand: newGrease.carBrand,
        carYear: newGrease.carYear,
        supplierId: newGrease.supplierId,
        quotationNumber: newGrease.quotationNumber
      }
    }).then(function (foundGrease) {
      if (foundGrease) {
        reject("Grease With these Details Already Registered, Please Add to Existing Stock");
      } else {
        newGrease.volume = parseFloat(newGrease.volume);
        newGrease.minVolume = parseFloat(newGrease.minVolume);
        Grease.create(newGrease).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, "add").then(function () {
            resolve(newGrease.volume + " Liters of Greace Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Grease Could not be Added");
          });
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Added");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Grease Could not be Added");
    });
  });
};

Grease.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    Grease.findAndCountAll().then(function (grease) {
      _Supplier["default"].getSupplierNames(grease).then(function () {
        resolve(grease);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

function getDistinct(values) {
  return values.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

Grease.getGreaseStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var greaseC, greaseS, greaseSpec, typeOfGrease, carBrand, carYear;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _Supplier["default"].findAll().then(function (suppliers) {
                greaseS = suppliers;
                Grease.getStock().then(function (consumables) {
                  greaseC = consumables;
                  greaseSpec = getDistinct(greaseC.rows.map(function (val) {
                    return val.greaseSpec;
                  }));
                  typeOfGrease = getDistinct(greaseC.rows.map(function (val) {
                    return val.typeOfGrease;
                  }));
                  carBrand = getDistinct(greaseC.rows.map(function (val) {
                    return val.carBrand;
                  }));
                  carYear = getDistinct(greaseC.rows.map(function (val) {
                    return val.carYear;
                  }));
                  var values = {
                    consumables: greaseC.rows,
                    suppliers: greaseS,
                    specs: greaseSpec,
                    typeOfGrease: typeOfGrease,
                    carBrand: carBrand,
                    carYear: carYear
                  };
                  resolve(values);
                })["catch"](function (err) {
                  reject("Error Connecting to the Server (" + err + ")");
                });
              })["catch"](function (err) {
                reject("Error Connecting to the Server (" + err + ")");
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

Grease.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    Grease.findAndCountAll({
      where: {
        supplierId: supplierId
      }
    }).then( /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(foundGreases) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _Supplier["default"].getSupplierNames(foundGreases);

              case 2:
                resolve(foundGreases.rows);

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

Grease.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    Grease.findAll({
      attributes: ['greaseSpec', 'typeOfGrease', 'carBrand', 'carYear', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('volume')), 'volume']],
      group: ['greaseSpec', 'typeOfGrease', 'carBrand', 'carYear', 'supplierId']
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

var _default = Grease;
exports["default"] = _default;