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

var _User = _interopRequireDefault(require("../User"));

var mappings = {
  employee_id: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true
  },
  maintenance_req: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true
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

var MaintenanceEmployees = _mySQLDB["default"].define('maintenance_employees', mappings, {
  indexes: [{
    name: 'maintenance_employee_id_index',
    method: 'BTREE',
    fields: ['employee_id']
  }, {
    name: 'maintenance_req_index',
    method: 'BTREE',
    fields: ['maintenance_req']
  }, {
    name: 'maintenance_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'maintenance_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

MaintenanceEmployees.getEmployees = function (reqNumber) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceEmployees.getAllEmployeeId(reqNumber).then(function (employees) {
      var employeeMap = [];
      employees.map(function (e) {
        employeeMap.push(e.employee_id);
      });

      _User["default"].getAllUsersById(employeeMap).then(function (found) {
        resolve(found);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

MaintenanceEmployees.getAllEmployeeId = function (reqNumber) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceEmployees.findAll({
      where: {
        maintenance_req: reqNumber
      },
      attributes: ['employee_id'],
      raw: true
    }).then(function (found) {
      resolve(found);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = MaintenanceEmployees;
exports["default"] = _default;