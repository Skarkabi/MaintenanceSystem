"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var _Battery = _interopRequireDefault(require("./consumables/Battery"));

var _Brake = _interopRequireDefault(require("./consumables/Brake"));

var _Filter = _interopRequireDefault(require("./consumables/Filter"));

var _Grease = _interopRequireDefault(require("./consumables/Grease"));

var _Oil = _interopRequireDefault(require("./consumables/Oil"));

var _Supplier = _interopRequireDefault(require("./Supplier"));

/**
 * Setting the Datatypes for the MySQL tables
 */
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
/**
 * Defining the Consumable MySQL Table
 */

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
/**
 * Function to update consumable stock
 * Takes in the consumable object and if the value should be deleted or added
 * @param {*} newBattery 
 * @param {*} action 
 * @returns msg to flash for the user
 */


Consumable.updateConsumable = function (createConsumable, action) {
  //Creating the new Consumable value to be updated in the consumable databse
  var newConsumable = {
    category: createConsumable.category,
    quantity: parseFloat(createConsumable.quantity)
  };
  return new _bluebird["default"](function (resolve, reject) {
    //Checking if the consumable category already exists in stock
    Consumable.getConsumableByCategory(newConsumable.category).then(function (isCategory) {
      //If Consumable exists update the new vale
      if (isCategory) {
        if (action === "add") {
          var quant = newConsumable.quantity + isCategory.quantity;
        } else if (action === "delet") {
          var quant = isCategory.quantity - newConsumable.quantity;
        } //Updating the consumable stock value


        Consumable.update({
          quantity: quant
        }, {
          where: {
            category: newConsumable.category
          }
        }).then(function () {
          resolve("Consumable updated");
        })["catch"](function (err) {
          reject(err);
        }); //If Consumable doesn't exist create a new category in database
      } else {
        //Creating new consumable category in database
        Consumable.create(newConsumable).then(function () {
          resolve("New Consumable Created");
        })["catch"](function (err) {
          reject(err);
        });
      }
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * Function to get all consumable stocks 
 * Function gets all available consumable stock options 
 * @returns object with lists of all avialable consumables
 */


Consumable.getFullStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting battery stock
    _Battery["default"].getStock().then(function (batteries) {
      //Getting brake stock
      _Brake["default"].getStock().then(function (brakes) {
        //Getting filter stock
        _Filter["default"].getStock().then(function (filters) {
          //Getting grease stock
          _Grease["default"].getStock().then(function (grease) {
            //Getting oil stock
            _Oil["default"].getStock().then(function (oil) {
              //Getting all Supplier Stock
              _Supplier["default"].findAll().then(function (suppliers) {
                //Creating variable of all need lists to return
                var values = {
                  batteries: batteries.rows,
                  brakes: brakes.rows,
                  filters: filters.rows,
                  grease: grease.rows,
                  oil: oil.rows,
                  supplier: suppliers
                };
                resolve(values);
              })["catch"](function (err) {
                reject("Error Connecting to the server " + err);
              });
            })["catch"](function (err) {
              reject("Error Connecting to the server " + err);
            });
          })["catch"](function (err) {
            reject("Error Connecting to the server " + err);
          });
        })["catch"](function (err) {
          reject("Error Connecting to the server " + err);
        });
      })["catch"](function (err) {
        reject("Error Connecting to the server " + err);
      });
    })["catch"](function (err) {
      reject("Error Connecting to the server " + err);
    });
  });
};

Consumable.getFullSupplierStock = function (sId) {
  return new _bluebird["default"](function (resolve, reject) {
    var consumables = [];

    _Battery["default"].getSupplierStock(sId).then(function (batteries) {
      batteries.rows.map(function (battery) {
        return consumables.push({
          category: "Battery",
          quantity: battery.quantity,
          totalCost: battery.totalCost,
          singleCost: battery.singleCost,
          quotationNum: battery.quotationNumber
        });
      });
      resolve(consumables);
    });
  });
};

Consumable.getDistinctConsumableValues = function () {
  return new _bluebird["default"](function (resolve, reject) {
    _Battery["default"].getBatteryStocks().then(function (batteries) {
      _Brake["default"].getBrakeStock().then(function (brakes) {
        _Filter["default"].getFilterStock().then(function (filters) {
          _Grease["default"].getGreaseStock().then(function (grease) {
            _Oil["default"].getOilStock().then(function (oil) {
              _Supplier["default"].findAll().then(function (suppliers) {
                var values = {
                  batteries: batteries,
                  brakes: brakes,
                  filters: filters,
                  grease: grease,
                  oil: oil,
                  supplier: suppliers
                };
                resolve(values);
              })["catch"](function (err) {
                reject("Error Connecting to the server " + err);
              });
            })["catch"](function (err) {
              reject("Error Connecting to the server " + err);
            });
          })["catch"](function (err) {
            reject("Error Connecting to the server " + err);
          });
        })["catch"](function (err) {
          reject("Error Connecting to the server " + err);
        });
      })["catch"](function (err) {
        reject("Error Connecting to the server " + err);
      });
    })["catch"](function (err) {
      reject("Error Connecting to the server " + err);
    });
  });
};
/**
 * Function to see if consumable category exists
 * @param {*} category 
 * @returns the found consumable category
 */


Consumable.getConsumableByCategory = function (category) {
  return Consumable.findOne({
    where: {
      category: category
    }
  });
};

Consumable.getBattery = function () {
  return new _bluebird["default"](function (resolve, reject) {
    resolve(_Battery["default"]);
  });
};

Consumable.getBrake = function () {
  return new _Brake["default"]();
};

Consumable.getFilter = function () {
  return new _Filter["default"]();
};

Consumable.getOil = function () {
  return new _Oil["default"]();
};

Consumable.getGrease = function () {
  return new _Grease["default"]();
};

var _default = Consumable;
exports["default"] = _default;