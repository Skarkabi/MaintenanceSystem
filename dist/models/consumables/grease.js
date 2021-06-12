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

var _default = Grease;
exports["default"] = _default;