import db from "../mySQLDB";
import _ from 'lodash';
import DataTypes from 'sequelize';

/**
 * User schema that represent the database schema.
 */

const User = db.define('User', {
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
  tableName: "people_in_test"
});

User.findUsers = () =>
{
	return User.findAll({
		where: {
			firstName: ["Saleem", "Jane"]
		}		
	});
}

User.addUser = (newUser) =>
{
	return newUser.save()
} 
// `sequelize.define` also returns the model
console.log(User === db.models.User); // true
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
