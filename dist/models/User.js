"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var mappings = {
  id: {
    type: _sequelize["default"].DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: _sequelize["default"].DataTypes.UUIDV4
  },
  firstName: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
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
    name: 'user_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'user_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});
/**
 * Creates user with bcrypt.
 * @param {*} user
 */


User.createUser = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var newUser;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newUser = {
            id: "100944655",
            firstName: "John",
            lastName: "Larn"
          };
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            _bcrypt["default"].genSalt(10, function (err, salt) {
              _bcrypt["default"].hash(newUser.lastName, salt, function (e, hash) {
                if (e) reject(e);
                newUser.lastName = hash;
                console.log("Creating user with lName: " + newUser.lastName);
                resolve(User.create(newUser));
              });
            });
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));

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

User.prototype.comparePassword = function (lastName) {
  var _this = this;

  return _bluebird["default"].resolve().then(function () {
    return _bcrypt["default"].compareSync(lastName, _this.lastName);
  })["catch"](function (err) {
    console.log(err);
    return false;
  });
};
/*
User.hook = ('beforeSave', (user) => {
  user.firstName = _.trim(user.firstName);

  if ((user.previous('lastName') !== user.lastName) && (!_.isEmpty(user.lastName))) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.lastName, salt);
    user.lastName = hash;
  }
  return user;
});

*/


var _default = User;
/**
 * User schema that represent the database schema.
 

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


export default User;
*/

exports["default"] = _default;