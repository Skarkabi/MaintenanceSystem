"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _fs = _interopRequireDefault(require("fs"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

/**
 * Declaring the datatypes used within the User class
 */
var mappings = {
  id: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true,
    defaultValue: _sequelize["default"].DataTypes.UUIDV4
  },
  firstName: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: _sequelize["default"].DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  },
  userType: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: true
  }
};
/**
 * Defining the user table within the MySQL database using Sequelize
 */

var User = _mySQLDB["default"].define('User', mappings, {
  indexes: [{
    name: 'user_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'user_firstName_index',
    method: 'BTREE',
    fields: ['firstName']
  }, {
    name: 'user_lastName_index',
    method: 'BTREE',
    fields: ['lastName']
  }, {
    name: 'user_userName_index',
    method: 'BTREE',
    fields: ['userName']
  }, {
    name: 'user_password_index',
    method: 'BTREE',
    fields: ['password']
  }, {
    name: 'user_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'user_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'user_userType_index',
    method: 'BTREE',
    fields: ['userType']
  }, {
    name: 'user_profilePicture_index',
    method: 'BTREE',
    fields: ['profilePicture']
  }]
});
/**
 * Creates user with bcrypt.
 * @param {*} user
 */


User.createUser = function (createdUser) {
  //Declaring the new User variable to be added
  var newUser = {
    id: createdUser.eID,
    firstName: createdUser.firstName,
    lastName: createdUser.lastName,
    username: createdUser.username,
    password: createdUser.password,
    userType: createdUser.userType
  };
  return new _bluebird["default"](function (resolve, reject) {
    //using bcrypt to encrypt the password for the user before saving
    _bcrypt["default"].genSalt(10, function (err, salt) {
      _bcrypt["default"].hash(newUser.password, salt, function (e, hash) {
        if (e) reject(e); //Checking if the user id already exists

        User.getUserById(newUser.id).then(function (isUserRegestered) {
          //If user id exists reject user input
          if (isUserRegestered) {
            reject("Employee with ID# " + newUser.id + " Already Registered");
          } else {
            //Checking if user name already exists
            User.getUserByUserName(newUser.username).then(function (isUser) {
              //If user name already exists reject user input
              if (isUser) {
                reject("Username " + newUser.username + " Already Taken"); //If user name and id do not exist add new user to database
              } else {
                newUser.password = hash;
                User.create(newUser).then(function () {
                  resolve("Emplyee With ID# " + newUser.id + " Was Sucessfully Added!");
                })["catch"](function (err) {
                  reject(err);
                });
              }
            });
          }
        });
      });
    });
  });
};
/**
 * Funciton to delete user from database
 * @param {*} id 
 * @returns msg to flash to user
 */


User.deleteUserById = function (id) {
  return new _bluebird["default"](function (resolve, reject) {
    //Check if user exists
    User.getUserById(id).then(function (foundUser) {
      //If exists delete from database
      foundUser.destroy();
      resolve("User with Employee ID# " + id + " Was Sucessfully Removed From the System!");
    })["catch"](function (err) {
      //If dosent exist inform user error occured
      reject("An Error has Occured User with Employee ID# " + id + " Could not be Deleted " + err);
    });
  });
};
/**
 * Function to find user by ID
 * @param {*} id 
 * @returns found user
 */


User.getUserById = function (id) {
  return User.findOne({
    where: {
      id: id
    }
  });
};

User.getAllUsersById = function (id) {
  return new _bluebird["default"](function (resolve, reject) {
    User.findAll({
      where: {
        id: id
      }
    }).then(function (found) {
      resolve(found);
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * Function to find user by first name
 * @param {*} firstName 
 * @returns  found user
 */


User.getUserByFirstName = function (firstName) {
  return User.findOne({
    where: {
      firstName: firstName
    }
  });
};
/**
 * Function to find user by username
 * @param {*} userName 
 * @returns found user
 */


User.getUserByUserName = function (userName) {
  return User.findOne({
    where: {
      userName: userName
    }
  });
};
/**
 * Function to decypt password and check if it is a match
 * @param {*} password 
 * @returns false if password does not match
 */


User.prototype.comparePassword = function (password) {
  var _this = this;

  return _bluebird["default"].resolve().then(function () {
    return _bcrypt["default"].compare(password, _this.password);
  })["catch"](function (err) {
    return false;
  });
};
/**
 * Fucntion to update the users profile picture
 * Function saves image to server and sets the image name
 * @param {*} userId 
 * @param {*} username 
 * @param {*} profilePicture 
 */


User.updateProfilePhoto = function (userId, username, profilePicture) {
  //Converting profile picture object to string to be uploaded 
  profilePicture = JSON.stringify(profilePicture).slice(23); //Saving profile picture to server

  _fs["default"].writeFileSync("./public/profilePictures/".concat(username, ".jpeg"), new Buffer.from(profilePicture, 'base64', function (err) {
    if (err) return console.error(err);
  })); //Getting the user from database who's profile picture will be updated


  User.getUserById(userId).then(function (toUpdate) {
    //Updating profile picture name in database
    toUpdate.profilePicture = "".concat(username, ".jpeg"); //Saving update in database

    toUpdate.save();
  })["catch"](function (err) {
    console.log("This happened " + err);
  });
};

var _default = User;
exports["default"] = _default;