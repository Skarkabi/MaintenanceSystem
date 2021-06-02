"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var mySQLDB = new _sequelize["default"]('calendar', 'root', 'mosjsfskmo1', {
  host: 'localhost',
  dialect: 'mysql'
});
var _default = mySQLDB;
exports["default"] = _default;