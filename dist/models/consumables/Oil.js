"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Supplier = _interopRequireDefault(require("../Supplier"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  oilSpec: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  typeOfOil: {
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
  preferredBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  oilPrice: {
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

var Oil = _mySQLDB["default"].define('oil_stocks', mappings, {
  indexes: [{
    name: 'oil_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'oil_volume_index',
    method: 'BTREE',
    fields: ['volume']
  }, {
    name: 'oil_minVolume_index',
    method: 'BTREE',
    fields: ['minVolume']
  }, {
    name: 'oil_oilSpec_index',
    method: 'BTREE',
    fields: ['oilSpec']
  }, {
    name: 'oil_typeOfOil_index',
    method: 'BTREE',
    fields: ['typeOfOil']
  }, {
    name: 'oil_oilPrice_index',
    method: 'BTREE',
    fields: ['oilPrice']
  }, {
    name: 'oil_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'oil_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'oil_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'oil_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }]
});

Oil.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    Oil.findAndCountAll().then(function (oil) {
      _Supplier["default"].getSupplierNames(oil).then(function () {
        resolve(oil);
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

Oil.getOilStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var oilC, oilS, oilSpecs, typeOfOils, preferredBrands;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _Supplier["default"].findAll().then(function (suppliers) {
                oilS = suppliers;
                Oil.getStock().then(function (consumables) {
                  oilC = consumables;
                  oilSpecs = getDistinct(oilC.rows.map(function (val) {
                    return val.oilSpec;
                  }));
                  typeOfOils = getDistinct(oilC.rows.map(function (val) {
                    return val.typeOfOil;
                  }));
                  preferredBrands = getDistinct(oilC.rows.map(function (val) {
                    return val.preferredBrand;
                  }));
                  var values = {
                    consumables: oilC.rows,
                    suppliers: oilS,
                    specs: oilSpecs,
                    typeOfOils: typeOfOils,
                    preferredBrands: preferredBrands
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

Oil.updateOil = function (newOil, action) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Oil",
      quantity: newOil.volume
    };
    Oil.findOne({
      where: {
        id: newOil.id
      }
    }).then(function (foundOil) {
      var quant;

      if (action === "add") {
        quant = parseFloat(newOil.volume) + foundOil.volume;
      } else if (action === "delet") {
        quant = foundOil.volume - parseFloat(newOil.volume);
      }

      if (quant === 0) {
        foundOil.destroy().then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            resolve(newOil.voulme + " liters Of Oil Successfully Deleted from Existing Stock!");
          })["catch"](function (err) {
            reject("An Error Occured Oil Could not be Deleted");
          });
        })["catch"](function (err) {
          reject("An Error Occured Oil Could not be Deleted");
        });
      } else if (quant < 0) {
        reject("Can not Delete more than exists in stock");
      } else {
        Oil.update({
          volume: quant
        }, {
          where: {
            id: newOil.id
          }
        }).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            resolve(newOil.volume + " Liters of Oil Sucessfully Added to Existing Stock!");
          })["catch"](function (err) {
            reject("An Error Occured Oil Could not be Added");
          });
        })["catch"](function (err) {
          reject("An Error Occured Oil Could not be Added");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Oil Could not be Added");
    });
  });
};

Oil.addOil = function (newOil) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Oil",
      quantity: newOil.volume
    };
    Oil.findOne({
      where: {
        oilSpec: newOil.oilSpec,
        typeOfOil: newOil.typeOfOil,
        preferredBrand: newOil.preferredBrand,
        supplierId: newOil.supplierId,
        quotationNumber: newOil.quotationNumber
      }
    }).then(function (foundOil) {
      if (foundOil) {
        reject("Oil With these Details Already Registered, Please Add to Existing Stock");
      } else {
        newOil.volume = parseFloat(newOil.volume);
        newOil.minVolume = parseFloat(newOil.minVolume);
        Oil.create(newOil).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, "add").then(function () {
            resolve(newOil.volume + " Liters of Oil Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Oil Could not be Added");
          });
        })["catch"](function (err) {
          reject("An Error Occured Oil Could not be Added");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Oil Could not be Added");
    });
  });
};

Oil.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    Oil.findAll({
      attributes: ['oilSpec', 'typeOfOil', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('volume')), 'volume']],
      group: ['oilSpec', 'typeOfOil', 'supplierId']
    }).then( /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(values) {
        var result;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                result = {
                  count: values.length,
                  rows: values
                };
                _context2.next = 3;
                return _Supplier["default"].getSupplierNames(result);

              case 3:
                resolve(result);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
};

Oil.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    Oil.findAndCountAll({
      where: {
        supplierId: supplierId
      }
    }).then( /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(foundGreases) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _Supplier["default"].getSupplierNames(foundGreases);

              case 2:
                resolve(foundGreases.rows);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x4) {
        return _ref3.apply(this, arguments);
      };
    }())["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Oil;
exports["default"] = _default;