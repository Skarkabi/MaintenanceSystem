"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

/**
 * Sessions table is used to store user session persistently.
 * 
 *
 * Read more on https://www.npmjs.com/package/connect-session-sequelize
 */
var mappings = {
  sid: {
    type: _sequelize["default"].STRING,
    primaryKey: true
  },
  expires: _sequelize["default"].DATE,
  data: _sequelize["default"].TEXT
};

var Session = _mySQLDB["default"].define('Session', mappings, {
  indexes: [{
    name: 'session_sid_index',
    method: 'BTREE',
    fields: ['sid']
  }]
});

Session.getSessionById = function (sessionId) {
  return User.findOne({
    where: {
      sessionId: sessionId
    }
  });
};

var _default = Session;
exports["default"] = _default;