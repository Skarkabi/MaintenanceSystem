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

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var _Battery = _interopRequireDefault(require("./consumables/Battery"));

var _Brake = _interopRequireDefault(require("./consumables/Brake"));

var _Filter = _interopRequireDefault(require("./consumables/Filter"));

var _Grease = _interopRequireDefault(require("./consumables/Grease"));

var _Oil = _interopRequireDefault(require("./consumables/Oil"));

var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: _sequelize["default"].DataTypes.DOUBLE,
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

var Consumable = _mySQLDB["default"].define('consumable_stocks', mappings, {
  indexes: [{
    name: 'consumable_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'consumable_category_index',
    method: 'BTREE',
    fields: ['category']
  }, {
    name: 'consumable_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'consumable_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'consumable_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

Consumable.addConsumable = function (createConsumable) {
  var newConsumable = {
    category: createConsumable.category,
    quantity: parseFloat(createConsumable.quantity)
  };
  console.log(newConsumable);
  return new Promise(function (resolve, reject) {
    Consumable.getConsumableByCategory(newConsumable.category).then(function (isCategory) {
      if (isCategory) {
        var quant = newConsumable.quantity + isCategory.quantity;
        console.log("adding " + quant);
        resolve(Consumable.update({
          quantity: quant
        }, {
          where: {
            category: newConsumable.category
          }
        }));
        console.log("Updated");
      } else {
        resolve(Consumable.create(newConsumable));
      }
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Consumable.getConsumableByCategory = function (category) {
  return Consumable.findOne({
    where: {
      category: category
    }
  });
};

Consumable.getSpecific = function (consumable) {
  return new Promise(function (resolve, reject) {
    if (consumable == "battery") {
      _Battery["default"].findAndCountAll().then(function (batteries) {
        resolve(batteries);
      })["catch"](function (err) {
        reject(err);
      });
    } else if (consumable == "brake") {
      _Brake["default"].findAndCountAll().then(function (brakes) {
        resolve(brakes);
      })["catch"](function (err) {
        reject(err);
      });
    } else if (consumable == "filter") {
      _Filter["default"].findAndCountAll().then(function (filters) {
        resolve(filters);
      })["catch"](function (err) {
        reject(err);
      });
    } else if (consumable == "grease") {
      _Grease["default"].findAndCountAll().then(function (grease) {
        resolve(grease);
      })["catch"](function (err) {
        reject(err);
      });
    } else if (consumable == "oil") {
      _Oil["default"].findAndCountAll().then(function (oil) {
        resolve(oil);
      })["catch"](function (err) {
        reject(err);
      });
    }
  });
};

var _default = Consumable;
exports["default"] = _default;