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

var _multer = _interopRequireDefault(require("multer"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

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
  var newUser = {
    id: createdUser.eID,
    firstName: createdUser.firstName,
    lastName: createdUser.lastName,
    username: createdUser.username,
    password: createdUser.password,
    userType: createdUser.userType
  };
  return new _bluebird["default"](function (resolve, reject) {
    _bcrypt["default"].genSalt(10, function (err, salt) {
      _bcrypt["default"].hash(newUser.password, salt, function (e, hash) {
        if (e) reject(e);
        User.getUserById(newUser.id).then(function (isUserRegestered) {
          if (isUserRegestered) {
            reject("Employee with ID# " + newUser.id + " Already Registered");
          } else {
            User.getUserByUserName(newUser.username).then(function (isUser) {
              if (isUser) {
                reject("Username " + newUser.username + " Already Taken");
              } else {
                newUser.password = hash;
                User.create(newUser).then(function () {
                  resolve("Emplyee With ID# " + newUser.id + " Was Sucessfully Added!");
                });
              }
            });
          }
        });
      });
    });
  });
};

User.deleteUserById = function (id) {
  return new _bluebird["default"](function (resolve, reject) {
    User.getUserById(id).then(function (foundUser) {
      foundUser.destroy();
      resolve("User with Employee ID# " + id + " Was Sucessfully Removed From the System!");
    })["catch"](function (err) {
      reject("An Error has Occured User with Employee ID# " + id + " Could not be Deleted");
    });
  });
};

User.getUserById = function (id) {
  return User.findOne({
    where: {
      id: id
    }
  });
};

User.getUserByFirstName = function (firstName) {
  return User.findOne({
    where: {
      firstName: firstName
    }
  });
};

User.getUserByUserName = function (userName) {
  return User.findOne({
    where: {
      userName: userName
    }
  });
};

User.prototype.comparePassword = function (password) {
  var _this = this;

  return _bluebird["default"].resolve().then(function () {
    return _bcrypt["default"].compare(password, _this.password);
  })["catch"](function (err) {
    return false;
  });
};

User.uploadProfilePhoto = function () {
  var storage = _multer["default"].diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, './public/profilePictures');
    },
    filename: function filename(req, file, cb) {
      console.log("FILEP");
      console.log(req.user);
      cb(null, req.user.username + ".png");
      User.getUserById(req.user.id).then(function (toUpdate) {
        toUpdate.profilePicture = "".concat(req.user.username, ".png");
        toUpdate.save();
      });
    }
  });

  var upload = (0, _multer["default"])({
    storage: storage
  });
  return upload;
};

var _default = User;
exports["default"] = _default;