"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("dotenv");

var _sequelize = _interopRequireDefault(require("sequelize"));

var dbName = 'maintanence';
var dbUserName = 'root';
var dbPassword = 'mosjsfskmo';
var dbHost = 'localhost';
var dbPort = '3306';
var mySQLDB = new _sequelize["default"](dbName, dbUserName, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql'
});
mySQLDB.sync().then(function () {
  console.log("Database & tables created!");
})["catch"](function (err) {
  console.log("Could not connect to database ".concat(err));
});
var _default = mySQLDB;
exports["default"] = _default;