"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var _Supplier = _interopRequireDefault(require("../Supplier"));

/**
 * Declaring the datatypes used within the Battery class
 */
var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batSpec: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carYear: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  minQuantity: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  singleCost: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  totalCost: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  quantity: {
    type: _sequelize["default"].DataTypes.INTEGER,
    allowNull: true
  },
  supplierId: {
    type: _sequelize["default"].DataTypes.INTEGER,
    allowNull: false
  },
  supplierName: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.STRING, ['supplierName'])
  },
  quotationNumber: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: false
  }
};
/**
 * Definxwing the battery stocks table within the MySQL database using Sequelize
 */

var Battery = _mySQLDB["default"].define('battery_stocks', mappings, {
  indexes: [{
    name: 'battery_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'battery_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'battery_batSpec_index',
    method: 'BTREE',
    fields: ['batSpec']
  }, {
    name: 'battery_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'battery_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'battery_minQuantity_index',
    method: 'BTREE',
    fields: ['minQuantity']
  }, {
    name: 'brake_singleCost_index',
    method: 'BTREE',
    fields: ['singleCost']
  }, {
    name: 'brake_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'battery_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'battery_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'battery_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'battery_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }]
});
/**
 * Function to update battery stock
 * Takes in the battery object and if the value should be deleted or added
 * @param {*} newBattery 
 * @param {*} action 
 * @returns 
 */


Battery.updateConsumable = function (newBattery, action) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Battery",
      quantity: newBattery.quantity
    }; //Checking if the battery spec exists within the stock

    Battery.findOne({
      where: {
        id: newBattery.id
      }
    }).then(function (foundBattery) {
      //If the battery exists in the databse the function sets the new quantity to the new value
      var quant;

      if (action === "add") {
        quant = parseInt(newBattery.quantity) + foundBattery.quantity;
      } else if (action === "delet") {
        quant = foundBattery.quantity - parseInt(newBattery.quantity);
      } //If the new value is 0 the battery definition is deleted from the stock


      if (quant === 0) {
        console.log("About to destroy " + foundBattery);
        foundBattery.destroy().then(function () {
          resolve("Battery Completly removed from stock!");
        })["catch"](function (err) {
          reject("An Error Occured Batteries Could not be deleted " + err + " ");
        }); //If the new quantity is less than 0 rejects the user input
      } else if (quant < 0) {
        reject("Can not Delete More Than Exists in Stock"); //If quantity is > 0 the battery quantity is updated
      } else {
        //looking for the battery to update and setting the new quantity
        Battery.update({
          quantity: quant
        }, {
          where: {
            id: newBattery.id
          }
        }).then(function () {
          //Updating the value from the consumables database
          if (action === "delet") {
            resolve(newBattery.quantity + " Batteries Sucessfully Deleted from Existing Stock!");
          } else if (action === "add") {
            resolve(newBattery.quantity + " Batteries Sucessfully Added to Existing Stock!");
          }
        })["catch"](function (err) {
          reject("An Error Occured Batteries Could not be " + action + "ed " + err);
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Batteries Could not be " + action + "ed " + err);
    });
  });
};
/**
 * Function to add a new battery into stock
 * Function takes an object with the needed battery info
 * @param {*} newBattery 
 * @returns 
 */


Battery.addBattery = function (newBattery) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Battery",
      quantity: newBattery.quantity
    }; //Looking if the battery with exact specs and same quotation number already exists in stock

    Battery.findOne({
      where: {
        batSpec: newBattery.batSpec,
        carBrand: newBattery.carBrand,
        carYear: newBattery.carYear,
        supplierId: newBattery.supplierId,
        quotationNumber: newBattery.quotationNumber
      }
    }).then(function (foundBattery) {
      //If this battery with this quotation number exists the function rejects the creation
      if (foundBattery) {
        reject("Batteries With these Details Already Registered, Please Add to Existing Stock"); //If the battery is not found the function creates a battery and updates the consumable stock
      } else {
        newBattery.singleCost = parseFloat(newBattery.singleCost);
        newBattery.quantity = parseInt(newBattery.quantity);
        newBattery.minQuantity = parseInt(newBattery.minQuantity);
        newBattery.totalCost = newBattery.singleCost * newBattery.quantity;
        Battery.create(newBattery).then(function () {
          //Updating consumable stock database
          _Consumables["default"].updateConsumable(newConsumable, "add").then(function () {
            resolve(newBattery.quantity + " Batteries Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Batteries Could not be Added " + err);
          });
        })["catch"](function (err) {
          reject("An Error Occured Batteries Could not be Added " + err);
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Batteries Could not be Added " + err);
    });
  });
};
/**
 * Function to set virtual datatype supplier name using supplier ids in battery
 * @returns List of batteries with their supplier names
 */


Battery.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting all the batteries found in the database
    Battery.findAndCountAll().then(function (batteries) {
      //Calling supplier function to add supplier name to battery objects
      _Supplier["default"].getSupplierNames(batteries).then(function () {
        //returning the batteries 
        resolve(batteries);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Battery.getSupplierStock = function (sId) {
  return new _bluebird["default"](function (resolve, reject) {
    Battery.findAndCountAll({
      where: {
        supplierId: sId
      }
    }).then(function (batteries) {
      _Supplier["default"].getSupplierNames(batteries).then(function () {
        //returning the batteries 
        resolve(batteries);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * Function to return list of batteries with their supplier names, as well as unique values found within the database
 * @returns object that includes all batteries, suppliers, and unique values of each battery spec
 */


Battery.getBatteryStocks = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Declaring all variables to be returned
    var batteriesC, batteriesS, batSpecs, carBrands, carYears; //Getting all suppliers saved in database

    _Supplier["default"].findAll().then(function (suppliers) {
      batteriesS = suppliers; //Getting all batteries from database and setting supplier names 

      Battery.getStock().then(function (consumables) {
        batteriesC = consumables; //Mapping battery values to not return double values

        batSpecs = batteriesC.rows.map(function (val) {
          return val.batSpec;
        }).filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
        carBrands = batteriesC.rows.map(function (val) {
          return val.carBrand;
        }).filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
        carYears = batteriesC.rows.map(function (val) {
          return val.carYear;
        }).filter(function (value, index, self) {
          return self.indexOf(value) === index;
        }); //Creating variable of all need variables to return

        var values = {
          consumable: batteriesC.rows,
          suppliers: batteriesS,
          specs: batSpecs,
          brands: carBrands,
          years: carYears
        };
        resolve(values);
      })["catch"](function (err) {
        reject(err);
      });
    });
  });
};
/**
 * Function to find all batteries in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of batteries purchased from that specified supplier ID
 */


Battery.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding all batteries with specified supplier ID
    Battery.findAndCountAll({
      where: {
        supplierId: supplierId
      }
    }).then(function (foundBrakes) {
      //Adding supplier Name to batteries 
      _Supplier["default"].getSupplierNames(foundBrakes).then(function () {
        resolve(foundBrakes.rows);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * Function to find different batteries from a specific suppleir 
 * @returns list of batter values from specific supplier regardless of quotation numbers
 */


Battery.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding batteries from database and returning specified attributes 
    Battery.findAll({
      //Declating attributes to return from database
      attributes: ['batSpec', 'carBrand', 'carYear', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('quantity')), 'quantity']],
      //Declaring how to group return values
      group: ["batSpec", "carBrand", "carYear", "supplierId"]
    }).then(function (values) {
      //Setting variable to return batteries with their supplier names
      var result = {
        count: values.length,
        rows: values
      };

      _Supplier["default"].getSupplierNames(result).then(function () {
        resolve(result);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Battery;
exports["default"] = _default;