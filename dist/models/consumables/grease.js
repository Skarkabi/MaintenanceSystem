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
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
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
  }]
});

Grease.getGreaseStock = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var greaseC, greaseSpec, typeOfGrease, carBrand, carYear, values;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _Consumables["default"].getSpecific("grease").then(function (consumables) {
            greaseC = consumables;
          });

        case 2:
          _context.next = 4;
          return Grease.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `greaseSpec`'), 'greaseSpec']],
            raw: true,
            nest: true
          }).then(function (spec) {
            greaseSpec = spec;
          });

        case 4:
          _context.next = 6;
          return Grease.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `typeOfGrease`'), 'typeOfGrease']],
            raw: true,
            nest: true
          }).then(function (spec) {
            typeOfGrease = spec;
          });

        case 6:
          _context.next = 8;
          return Grease.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `carBrand`'), 'carBrand']],
            raw: true,
            nest: true
          }).then(function (spec) {
            carBrand = spec;
          });

        case 8:
          _context.next = 10;
          return Grease.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `carYear`'), 'carYear']],
            raw: true,
            nest: true
          }).then(function (spec) {
            carYear = spec;
          });

        case 10:
          values = {
            consumables: greaseC.rows,
            specs: greaseSpec,
            typeOfGrease: typeOfGrease,
            carBrand: carBrand,
            carYear: carYear
          };
          return _context.abrupt("return", values);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
var _default = Grease;
exports["default"] = _default;