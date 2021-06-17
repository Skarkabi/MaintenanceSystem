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

Oil.getOilStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var oilC, oilSpecs, typeOfOils, preferredBrands, values;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _Consumables["default"].getSpecific("oil").then(function (consumables) {
                oilC = consumables;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 2:
              _context.next = 4;
              return Oil.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `oilSpec`'), 'oilSpec']],
                raw: true,
                nest: true
              }).then(function (spec) {
                oilSpecs = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 4:
              _context.next = 6;
              return Oil.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `typeOfOil`'), 'typeOfOil']],
                raw: true,
                nest: true
              }).then(function (spec) {
                typeOfOils = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 6:
              _context.next = 8;
              return Oil.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `preferredBrand`'), 'preferredBrand']],
                raw: true,
                nest: true
              }).then(function (spec) {
                preferredBrands = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 8:
              values = {
                consumables: oilC.rows,
                specs: oilSpecs,
                typeOfOils: typeOfOils,
                preferredBrands: preferredBrands
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
        preferredBrand: newOil.preferredBrand
      }
    }).then(function (foundOil) {
      if (foundOil) {
        reject("Oil With these Details Already Registered, Please Add to Existing Stock");
      } else {
        newOil.volume = parseFloat(newOil.volume);
        newOil.minVolume = parseFloat(newOil.minVolume);
        Oil.create(newOil).then(function () {
          _Consumables["default"].addConsumable(newConsumable).then(function () {
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

var _default = Oil;
exports["default"] = _default;