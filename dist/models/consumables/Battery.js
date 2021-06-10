"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

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
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
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
  }]
});

var _default = Battery;
exports["default"] = _default;