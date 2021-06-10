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

var _default = Filter;
exports["default"] = _default;