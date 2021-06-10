"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

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

var _default = Brake;
exports["default"] = _default;