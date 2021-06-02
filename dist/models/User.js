"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

/**
 * User schema that represent the database schema.
 */
var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    DataTypes = _require.DataTypes;

var sequelize = new Sequelize('calendar', 'root', 'mosjsfskmo1', {
  host: 'localhost',
  dialect: 'mysql'
});
var User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING // allowNull defaults to true

  }
}, {// Other model options go here
}); // `sequelize.define` also returns the model

console.log(User === sequelize.models.User); // true

/**
 * Find users based on the given query and retrieves users with the given fields
 * @param {*} query i.e. {firstName: "test"}
 * @param {*} data  i.e. ["firstName", "lastName", "email"]
 
User.findUsers = () =>
{
	return User.find().exec();
}
*/

var _default = User;
exports["default"] = _default;