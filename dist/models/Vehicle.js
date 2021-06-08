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

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var mappings = {
  dateAdded: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  plate: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  chassis: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  kmDriven: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  kmForOilChange: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  oilType: {
    type: _sequelize["default"].DataTypes.STRING,
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

var Vehicle = _mySQLDB["default"].define('vehicle_stocks', mappings, {
  indexes: [{
    name: 'vehicle_dateAdded_index',
    method: 'BTREE',
    fields: ['dateAdded']
  }, {
    name: 'vehicle_category_index',
    method: 'BTREE',
    fields: ['category']
  }, {
    name: 'vehicle_brand_index',
    method: 'BTREE',
    fields: ['brand']
  }, {
    name: 'vehicle_model_index',
    method: 'BTREE',
    fields: ['model']
  }, {
    name: 'vehicle_year_index',
    method: 'BTREE',
    fields: ['year']
  }, {
    name: 'vehicle_plat_index',
    method: 'BTREE',
    fields: ['plate']
  }, {
    name: 'vehicle_chassis_index',
    method: 'BTREE',
    fields: ['chassis']
  }, {
    name: 'vehicle_kmDriven_index',
    method: 'BTREE',
    fields: ['kmDriven']
  }, {
    name: 'vehicle_kmForOilChange_index',
    method: 'BTREE',
    fields: ['kmForOilChange']
  }, {
    name: 'vehicle_oilType_index',
    method: 'BTREE',
    fields: ['oilType']
  }, {
    name: 'user_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'user_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

var _default = Vehicle;
exports["default"] = _default;