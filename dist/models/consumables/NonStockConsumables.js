"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var _Brake = _interopRequireDefault(require("./Brake"));

var _Battery = _interopRequireDefault(require("./Battery"));

var _Filter = _interopRequireDefault(require("./Filter"));

var _Grease = _interopRequireDefault(require("./Grease"));

var _Oil = _interopRequireDefault(require("./Oil"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

var _MaintenanceOrder = _interopRequireDefault(require("../MaintenanceOrder"));

var _Supplier = _interopRequireDefault(require("../Supplier"));

var _Other = _interopRequireDefault(require("./Other"));

var _MaintenanceConsumables = _interopRequireDefault(require("./MaintenanceConsumables"));

var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  other_name: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  quantity: {
    type: _sequelize["default"].INTEGER,
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
  details: {
    type: _sequelize["default"].DataTypes.STRING,
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
  materialRequestNumber: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  maintenanceReq: {
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

var NonStockConsumables = _mySQLDB["default"].define('non_stock_others', mappings, {
  indexes: [{
    name: 'non_stock_other_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'non_stock_other_other_name_index',
    method: 'BTREE',
    fields: ['other_name']
  }, {
    name: 'non_stock_other_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'non_stock_other_singleCost_index',
    method: 'BTREE',
    fields: ['singleCost']
  }, {
    name: 'non_stock_other_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'non_stock_other_details_index',
    method: 'BTREE',
    fields: ['details']
  }, {
    name: 'non_stock_other_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'non_stock_other_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'non_stock_other_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'non_stock_other_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }, {
    name: 'non_stock_other_materialRequestNumber_index',
    method: 'BTREE',
    fields: ['materialRequestNumber']
  }, {
    name: 'non_stock_other_maintenanceReq_index',
    method: 'BTREE',
    fields: ['maintenanceReq']
  }]
});

NonStockConsumables.addNewConsumable = function (newConsumable) {
  return new _bluebird["default"](function (resolve, reject) {
    NonStockConsumables.create(newConsumable).then(function (consumable) {
      newConsumable.id = consumable.id;

      _MaintenanceConsumables["default"].useNonStockConsumable(newConsumable).then(function () {
        resolve("Added to Database");
      });
    });
  });
};

var _default = NonStockConsumables;
exports["default"] = _default;