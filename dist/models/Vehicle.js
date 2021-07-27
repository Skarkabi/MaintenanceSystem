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

/**
 * Declaring the datatypes used within the Vehicle class
 */
var mappings = {
  dateAdded: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  plate: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  chassis: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  kmDriven: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  kmForOilChange: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  oilType: {
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
  }
};
/**
 * Defining the vehicel stocks table within the MySQL database using Sequelize
 */

var Vehicle = _mySQLDB["default"].define('vehicle_stocks', mappings, {
  indexes: [{
    name: 'vehicle_dateAdded_index',
    method: 'BTREE',
    fields: ['dateAdded']
  }, {
    name: 'vehicle_category_index',
    method: 'BTREE',
    fields: ['category']
  }, {
    name: 'vehicle_brand_index',
    method: 'BTREE',
    fields: ['brand']
  }, {
    name: 'vehicle_model_index',
    method: 'BTREE',
    fields: ['model']
  }, {
    name: 'vehicle_year_index',
    method: 'BTREE',
    fields: ['year']
  }, {
    name: 'vehicle_plat_index',
    method: 'BTREE',
    fields: ['plate']
  }, {
    name: 'vehicle_chassis_index',
    method: 'BTREE',
    fields: ['chassis']
  }, {
    name: 'vehicle_kmDriven_index',
    method: 'BTREE',
    fields: ['kmDriven']
  }, {
    name: 'vehicle_kmForOilChange_index',
    method: 'BTREE',
    fields: ['kmForOilChange']
  }, {
    name: 'vehicle_oilType_index',
    method: 'BTREE',
    fields: ['oilType']
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
 * Function to add vehicle in vehicle stock
 * Function takes vehicle data and adds it into the database
 * @param {*} createVehicled 
 * @returns msg to be flashed to user
 */


Vehicle.addVehicle = function (createVehicled) {
  var newVehicle = //Creating the vehicle to be added in the database
  {
    dateAdded: taskDate(),
    category: createVehicled.category,
    brand: createVehicled.brand,
    model: createVehicled.model,
    year: createVehicled.year,
    plate: createVehicled.plate,
    chassis: createVehicled.chassis,
    kmDriven: createVehicled.kmDrive,
    kmForOilChange: createVehicled.kmTillOilChange,
    oilType: createVehicled.oilType
  };
  return new _bluebird["default"](function (resolve, reject) {
    //Check if the vehicle plate number already exists in database
    Vehicle.getVehicleByPlate(newVehicle.plate).then(function (isVehicle) {
      //If vehicle plate number exists reject user input
      if (isVehicle) {
        reject("Vehicle With Plate# " + newVehicle.plate + " Already Exists");
      } else {
        //If vehicle plate number doesn't exist add to database
        Vehicle.create(newVehicle).then(function () {
          resolve("Vehicle With Plate# " + newVehicle.plate + " Was Sucessfully Added!");
        })["catch"](function (err) {
          reject("Vehicle With Plate# " + newVehicle.plate + " Could Not Be Added " + err);
        });
      }
    })["catch"](function () {
      reject("Could not Connect to the Server");
    });
  });
};
/**
 * Function to get vehicle from database by plate number
 * @param {*} plate 
 * @returns found vehicle
 */


Vehicle.getVehicleByPlate = function (plate) {
  return Vehicle.findOne({
    where: {
      plate: plate
    }
  });
};
/**
 * Function to delete vehicle from database by its plate and chassis number
 * @param {*} info 
 * @returns msh to flash to user
 */


Vehicle.deleteVehicleByPlateAndChassis = function (info) {
  return new _bluebird["default"](function (resolve, reject) {
    //Checking if vehicle exists
    Vehicle.getVehicleByPlate(info.plate).then(function (foundVehicle) {
      //If vehicle exists delete it from database
      foundVehicle.destroy();
      resolve("Vehicle Plate# " + info.plate + " Chassis# " + info.chassis + " Was Sucessfully Removed From the System!");
    })["catch"](function (err) {
      //If vehicle doesn't exist reject user request
      reject("An Error has Occured User with Employee ID# " + id + " Could not be Deleted " + err);
    });
  });
};
/**
 * Function to get all vehicles from database
 * @returns object with number of vehicles and list of vehicles
 */


Vehicle.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting all vehicles from database
    Vehicle.findAndCountAll().then(function (vehicle) {
      resolve(vehicle);
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * function to return distinct values in object
 * @param {*} values 
 * @returns filtered values 
 */


function getDistinct(values) {
  return values.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}
/**
 * Function to return list of vehicles distinct values found within the database
 * @returns object that includes all distinct values of each vehicle spec
 */


Vehicle.getVehicleStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Declaring all variables to be returned
    var category, brand, model, year, plate, chassis, oilType; //Getting all vehicles from database

    Vehicle.getStock().then(function (vehicles) {
      //Mapping vehicle values to not return double values
      category = getDistinct(vehicles.rows.map(function (val) {
        return val.category;
      }));
      brand = getDistinct(vehicles.rows.map(function (val) {
        return val.brand;
      }));
      model = getDistinct(vehicles.rows.map(function (val) {
        return val.model;
      }));
      year = getDistinct(vehicles.rows.map(function (val) {
        return val.year;
      }));
      plate = getDistinct(vehicles.rows.map(function (val) {
        return val.plate;
      }));
      chassis = getDistinct(vehicles.rows.map(function (val) {
        return val.chassis;
      }));
      oilType = getDistinct(vehicles.rows.map(function (val) {
        return val.oilType;
      })); //Creating variable of all need variables to return

      var values = {
        category: category,
        brands: brand,
        models: model,
        years: year,
        plates: plate,
        chassis: chassis,
        oilTypes: oilType
      };
      resolve(values);
    })["catch"](function (err) {
      reject("Error Connecting to the Server (" + err + ")");
    });
  })["catch"](function (err) {
    reject("Error Connecting to the Server (" + err + ")");
  });
};

function taskDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = dd + '/' + mm + '/' + yyyy;
  console.log(today);
  return today;
}

var _default = Vehicle;
exports["default"] = _default;