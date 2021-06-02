"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

/**
 * User schema that represent the database schema.
 */
var User = _mySQLDB["default"].define('User', {
  // Model attributes are defined here
  firstName: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  lastName: {
    type: _sequelize["default"].STRING // allowNull defaults to true

  }
}, {
  // Other model options go here
  tableName: "people_in_test"
});

User.findUsers = function () {
  return User.findAll({
    where: {
      firstName: ["Saleem", "Jane"]
    }
  });
};

User.addUser = function (newUser) {
  return newUser.save();
}; // `sequelize.define` also returns the model


console.log(User === _mySQLDB["default"].models.User); // true

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