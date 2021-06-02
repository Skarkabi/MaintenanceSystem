import _ from 'lodash';
/**
 * User schema that represent the database schema.
 */

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('calendar', 'root', 'mosjsfskmo1', {
    host: 'localhost',
    dialect: 'mysql',
});

const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
});


// `sequelize.define` also returns the model
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

export default User;
