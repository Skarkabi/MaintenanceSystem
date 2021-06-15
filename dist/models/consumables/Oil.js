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
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
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
  }]
});

Oil.getOilStock = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var oilC, oilSpecs, typeOfOils, preferredBrands, values;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _Consumables["default"].getSpecific("oil").then(function (consumables) {
            oilC = consumables;
          });

        case 2:
          _context.next = 4;
          return Oil.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `oilSpec`'), 'oilSpec']],
            raw: true,
            nest: true
          }).then(function (spec) {
            oilSpecs = spec;
          });

        case 4:
          _context.next = 6;
          return Oil.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `typeOfOil`'), 'typeOfOil']],
            raw: true,
            nest: true
          }).then(function (spec) {
            typeOfOils = spec;
          });

        case 6:
          _context.next = 8;
          return Oil.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `preferredBrand`'), 'preferredBrand']],
            raw: true,
            nest: true
          }).then(function (spec) {
            preferredBrands = spec;
          });

        case 8:
          values = {
            consumables: oilC.rows,
            specs: oilSpecs,
            typeOfOils: typeOfOils,
            preferredBrands: preferredBrands
          };
          return _context.abrupt("return", values);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));

Oil.addOil = function (newOil) {
  return new Promise(function (resolve, reject) {
    var newConsumable = {
      category: "Oil",
      quantity: newOil.volume
    };

    if (newOil.id) {
      console.log("Existing OIL: " + JSON.stringify(newOil));
      Oil.findOne({
        where: {
          id: newOil.id
        }
      }).then(function (foundOil) {
        var quant = parseFloat(newOil.volume) + foundOil.volume;
        Oil.update({
          volume: quant
        }, {
          where: {
            id: newOil.id
          }
        }).then(function () {
          _Consumables["default"].addConsumable(newConsumable).then(function () {
            resolve("New Oil was Added to Stock");
          })["catch"](function (err) {
            reject("Something happend (Error: " + err + ")");
          });
        })["catch"](function (err) {
          reject("Something happend (Error: " + err + ")");
        });
      })["catch"](function (err) {
        reject("Something happend (Error: " + err + ")");
      });
    } else {
      Oil.findOne({
        where: {
          oilSpec: newOil.oilSpec,
          typeOfOil: newOil.typeOfOil,
          preferredBrand: newOil.preferredBrand
        }
      }).then(function (foundOil) {
        if (foundOil) {
          console.log("FOUNd OIL: " + JSON.stringify(foundOil));
          reject("This Oil Already Exists in the Stock");
        } else {
          newOil.volume = parseFloat(newOil.volume);
          newOil.minVolume = parseFloat(newOil.minVolume);
          console.log("NEW OIL: " + JSON.stringify(newOil));
          Oil.create(newOil).then(function () {
            _Consumables["default"].addConsumable(newConsumable).then(function () {
              resolve("New Oil was Added to Stock");
            })["catch"](function (err) {
              reject("Something happened (Error: " + err + ")");
            });
          })["catch"](function (err) {
            reject("Something happened (Error: " + err + ")");
          });
        }
      })["catch"](function (err) {
        reject("Something happened (Error: " + err + ")");
      });
    }
  });
};

var _default = Oil;
exports["default"] = _default;