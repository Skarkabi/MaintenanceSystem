"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var _Consumables = _interopRequireDefault(require("./Consumables"));

var _Vehicle = _interopRequireDefault(require("./Vehicle"));

var _User = _interopRequireDefault(require("./User"));

var _Battery = _interopRequireDefault(require("./consumables/Battery"));

var _MaintenanceConsumables = _interopRequireDefault(require("./consumables/MaintenanceConsumables"));

var mappings = {
  req: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: _sequelize["default"].DataTypes.STRING,
    defaultValue: "Not Started",
    allowNull: false
  },
  division: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  plate: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  vehicle_data: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.JSON, ['vehicle_data'])
  },
  discription: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: true
  },
  remarks: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: true
  },
  hour_cost: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
  },
  total_cost: {
    type: _sequelize["default"].DataTypes.DOUBLE,
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

function getDateWithoutTime(date) {
  return require('moment')(date).format('DD/MM/YYYY');
}

var MaintenanceOrder = _mySQLDB["default"].define('maintenance_orders', mappings, {
  indexes: [{
    name: 'maintenance_order_req_index',
    method: 'BTREE',
    fields: ['req']
  }, {
    name: 'maintenance_order_status_index',
    method: 'BTREE',
    fields: ['status']
  }, {
    name: 'maintenance_order_division_index',
    method: 'BTREE',
    fields: ['division']
  }, {
    name: 'maintenance_order_plate_index',
    method: 'BTREE',
    fields: ['plate']
  }, {
    name: 'maintenance_order_discription_index',
    method: 'BTREE',
    fields: ['discription']
  }, {
    name: 'maintenance_order_remarks_index',
    method: 'BTREE',
    fields: ['remarks']
  }, {
    name: 'maintenance_order_hour_cost_index',
    method: 'BTREE',
    fields: ['hour_cost']
  }, {
    name: 'maintenance_order_total_cost_index',
    method: 'BTREE',
    fields: ['total_cost']
  }, {
    name: 'consumable_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'consumable_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

MaintenanceOrder.getOrders = function () {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceOrder.findAll().then(function (orders) {
      getVehicle(orders).then(function () {
        console.log(orders);
        resolve(orders);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

MaintenanceOrder.getByReq = function (req) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceOrder.findOne({
      where: {
        req: req
      }
    }).then(function (found) {
      getSingleVehicle(found);
      resolve(found);
    });
  });
};

function getVehicle(orders) {
  return new _bluebird["default"](function (resolve, reject) {
    _Vehicle["default"].getStock().then(function (foundVehicles) {
      var vehicleMap = new Map();
      foundVehicles.rows.map(function (vehicles) {
        vehicleMap.set(vehicles.plate, vehicles);
      });
      orders.map(function (order) {
        order.setDataValue('createdAt', getDateWithoutTime(order.createdAt));
        order.setDataValue('vehicle_data', vehicleMap.get(order.plate));
      });
      resolve("Set All");
    })["catch"](function (err) {
      reject(err);
    });
  });
}

function getSingleVehicle(order) {
  return new _bluebird["default"](function (resolve, reject) {
    _Vehicle["default"].getVehicleByPlate(order.plate).then(function (foundVehicle) {
      order.setDataValue('createdAt', getDateWithoutTime(order.createdAt));
      order.setDataValue('vehicle_data', foundVehicle);
      resolve("Set Vehicle");
    })["catch"](function (err) {
      reject(err);
    });
  });
}

var _default = MaintenanceOrder;
exports["default"] = _default;