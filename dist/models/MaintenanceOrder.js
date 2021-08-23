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

var _MaintenanceEmployee = _interopRequireDefault(require("./consumables/MaintenanceEmployee"));

var mappings = {
  req: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.STRING, ['status'])
  },
  division: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  plate: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  material_request: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: true
  },
  vehicle_data: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.JSON, ['vehicle_data'])
  },
  consumable_data: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.JSON, ['consumable_data'])
  },
  employee_data: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.JSON, ['employee_data'])
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
    allowNull: true
  },
  work_hours: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  total_material_cost: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.DOUBLE, ['total_material_cost'])
  },
  total_cost: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.DOUBLE, ['total_cost'])
  },
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: false
  },
  completedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
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
    name: 'maintenance_order_material_request_index',
    method: 'BTREE',
    fields: ['material_request']
  }, {
    name: 'maintenance_order_remarks_index',
    method: 'BTREE',
    fields: ['remarks']
  }, {
    name: 'maintenance_order_hour_cost_index',
    method: 'BTREE',
    fields: ['hour_cost']
  }, {
    name: 'maintenance_work_hours_cost_index',
    method: 'BTREE',
    fields: ['work_hours']
  }, {
    name: 'consumable_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'consumable_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'consumable_completedAt_index',
    method: 'BTREE',
    fields: ['completedAt']
  }]
});

MaintenanceOrder.getOrders = function () {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceOrder.findAll().then(function (orders) {
      orders.map(function (o) {
        setStatus(o);
      });
      getVehicle(orders).then(function () {
        resolve(orders);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

MaintenanceOrder.getOrdersByPlate = function (plate) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceOrder.findAll({
      where: {
        plate: plate
      }
    }).then(function (orders) {
      orders.map(function (o) {
        o.setDataValue('createdAt', getDateWithoutTime(o.createdAt));
        setStatus(o);
      });
      resolve(orders);
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
      console.log(0);
      getSingleVehicle(found).then(function () {
        console.log(1);
        getConsumables(found).then(function () {
          console.log(2);
          getEmployees(found).then(function () {
            console.log(3);
            getTotalMaterialCost(found).then(function () {
              console.log(4);
              setStatus(found);
              resolve(found);
            });
          });
        })["catch"](function (err) {
          console.log("...................................");
          console.log(err);
          console.log("...................................");
        });
      });
    });
  });
};

MaintenanceOrder.completeOrder = function (reqNumber) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceOrder.update({
      completedAt: getCurrentDate()
    }, {
      where: {
        req: reqNumber
      }
    }).then(function () {
      console.log("updated");
      resolve("Order Has Been Set to Completed");
    })["catch"](function (err) {
      reject("Order Status Could Not Be Set " + err);
    });
  });
};

MaintenanceOrder.updateMaterialRequest = function (reqNumber, materialRequest, discription, remark, work_hour) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceOrder.update({
      material_request: materialRequest,
      discription: discription,
      remarks: remark,
      work_hours: work_hour
    }, {
      where: {
        req: reqNumber
      }
    }).then(function () {
      resolve("Material Request Number ".concat(materialRequest, " Successfully Updated"));
    })["catch"](function (err) {
      reject("Material Request Number Could not be Updated " + err);
    });
  });
};

MaintenanceOrder.addOrder = function (order) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceOrder.create(order).then(function () {
      resolve("New Order added");
    });
  });
};

function setStatus(o) {
  console.log(o.consumable_data);

  if ((o.material_request === null || o.material_request === "") && (o.consumable_data === undefined || o.consumable_data.length === 0)) {
    o.setDataValue('status', "Not Started");
  } else if (o.completedAt) {
    o.setDataValue('status', "Completed");
  } else {
    getConsumables(o).then(function () {
      if (o.consumable_data.length !== 0 || o.material_request === "N/A") {
        o.setDataValue('status', "In Progress");
      } else if (o.material_request.substring(0, 3) === "MCM" && o.consumable_data.length === 0) {
        o.setDataValue('status', "Pending Material");
      } else {}
    });
  }
}

function getTotalMaterialCost(order) {
  return new _bluebird["default"](function (resolve, reject) {
    var totalMaterialCost = 0;
    order.consumable_data.map(function (o) {
      totalMaterialCost = totalMaterialCost + o.consumable.totalCost;
    });
    var totalCost = order.hour_cost * order.work_hours + totalMaterialCost;
    order.setDataValue('total_material_cost', totalMaterialCost);
    order.setDataValue('total_cost', totalCost);
    resolve("done");
  });
}

function getConsumables(order) {
  return new _bluebird["default"](function (resolve, reject) {
    _MaintenanceConsumables["default"].getConsumables(order.req).then(function (found) {
      order.setDataValue('consumable_data', found);
      resolve("Set All");
    })["catch"](function (err) {
      console.log("...................................");
      console.log(err);
      console.log("...................................");
    });
  });
}

function getEmployees(order) {
  return new _bluebird["default"](function (resolve, reject) {
    _MaintenanceEmployee["default"].getEmployees(order.req).then(function (found) {
      order.setDataValue('employee_data', found);
      resolve("Done");
    });
  });
}

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

function getCurrentDate() {
  var d = new Date();
  var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  return require('moment')(date).format('YYYY-MM-DD');
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