import _ from 'lodash';
import bcrypt from 'bcrypt';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';

import sequelize from '../mySQLDB';

const mappings = {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: Sequelize.DataTypes.UUIDV4,
  },
  firstName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false, 
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false, 
  },
  createdAt: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true,
  },
};

const User = sequelize.define('User', mappings, {
  indexes: [
    {
      name: 'user_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'user_firstName_index',
      method: 'BTREE',
      fields: ['firstName'],
    },
    {
      name: 'user_lastName_index',
      method: 'BTREE',
      fields: ['lastName'],
    },
    {
      name: 'user_userName_index',
      method: 'BTREE',
      fields: ['userName'],
    },
    {
      name: 'user_password_index',
      method: 'BTREE',
      fields: ['password'],
    },
    {
      name: 'user_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'user_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
  ],
});

/**
 * Creates user with bcrypt.
 * @param {*} user
 */
 User.createUser = async () =>
 {
    var newUser = {
     id: "100944655",
     firstName: "Saleem",
     lastName: "Karkabi",
     username: "skarkabi",
     password: "123456789"
    };

    return new Promise((resolve,reject) => {
      bcrypt.genSalt(10,function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (e, hash){
          if (e) reject(e);
          newUser.password = hash;
          resolve(User.create(newUser));
        })
      })
    })
 }

User.getUserById = id => User.findOne({
  where:{id},
});

User.getUserByFirstName = firstName => User.findOne({
  where: {firstName},
});

User.getUserByUserName = userName => User.findOne({
  where: {userName},
});


User.prototype.comparePassword = function (password) {
  return Bluebird.resolve().then(() => 
    bcrypt.compare(password, this.password)).catch(
      (err) => {
        return false;
      }
    );
};

export default User;