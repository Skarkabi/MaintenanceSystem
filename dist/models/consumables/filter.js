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
  carBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carModel: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carYear: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  fType: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  preferredBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  actualBrand: {
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

var Filter = _mySQLDB["default"].define('filter_stocks', mappings, {
  indexes: [{
    name: 'filter_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'filter_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'filter_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'filter_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'filter_carModel_index',
    method: 'BTREE',
    fields: ['carModel']
  }, {
    name: 'filter_fType_index',
    method: 'BTREE',
    fields: ['fType']
  }, {
    name: 'filter_preferredBrand_index',
    method: 'BTREE',
    fields: ['preferredBrand']
  }, {
    name: 'filter_actualBrand_index',
    method: 'BTREE',
    fields: ['actualBrand']
  }, {
    name: 'filter_category_index',
    method: 'BTREE',
    fields: ['category']
  }, {
    name: 'filter_singleCost_index',
    method: 'BTREE',
    fields: ['singleCost']
  }, {
    name: 'filter_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'filter_minQuantity_index',
    method: 'BTREE',
    fields: ['minQuantity']
  }, {
    name: 'filter_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'filter_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

Filter.getFilterStock = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var filterC, typeF, carBrand, carModel, carYear, preferredBrand, carCategory, singleCost, actualBrand, values;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _Consumables["default"].getSpecific("filter").then(function (consumables) {
            console.log(consumables);
            filterC = consumables;
          });

        case 2:
          _context.next = 4;
          return Filter.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `category`'), 'category']],
            raw: true,
            nest: true
          }).then(function (category) {
            carCategory = category;
          });

        case 4:
          _context.next = 6;
          return Filter.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `fType`'), 'fType']],
            raw: true,
            nest: true
          }).then(function (filterType) {
            typeF = filterType;
          });

        case 6:
          _context.next = 8;
          return Filter.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `carBrand`'), 'carBrand']]
          }).then(function (spec) {
            carBrand = spec;
          });

        case 8:
          _context.next = 10;
          return Filter.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `carYear`'), 'carYear']]
          }).then(function (spec) {
            carYear = spec;
          });

        case 10:
          _context.next = 12;
          return Filter.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `carModel`'), 'carModel']],
            raw: true,
            nest: true
          }).then(function (filterType) {
            carModel = filterType;
          });

        case 12:
          _context.next = 14;
          return Filter.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `preferredBrand`'), 'preferredBrand']]
          }).then(function (spec) {
            preferredBrand = spec;
          });

        case 14:
          _context.next = 16;
          return Filter.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `actualBrand`'), 'actualBrand']]
          }).then(function (spec) {
            actualBrand = spec;
          });

        case 16:
          _context.next = 18;
          return Filter.findAll({
            attributes: [[_sequelize["default"].literal('DISTINCT `singleCost`'), 'singleCost']]
          }).then(function (spec) {
            singleCost = spec;
          });

        case 18:
          values = {
            consumable: filterC.rows,
            filterType: typeF,
            carBrand: carBrand,
            carModel: carModel,
            carYear: carYear,
            preferredBrand: preferredBrand,
            carCategory: carCategory,
            singleCost: singleCost,
            actualBrand: actualBrand
          };
          return _context.abrupt("return", values);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
var _default = Filter;
exports["default"] = _default;