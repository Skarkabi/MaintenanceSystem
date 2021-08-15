"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

/**
 * Declaring the datatypes used within the Battery class
 */
var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  phone: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  email: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  category: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  brand: {
    type: _sequelize["default"].STRING,
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
 * Defining the supplier table within the MySQL database using Sequelize
 */

var Supplier = _mySQLDB["default"].define('Suppliers', mappings, {
  indexes: [{
    name: 'supplier_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'supplier_name_index',
    method: 'BTREE',
    fields: ['name']
  }, {
    name: 'supplier_phone_index',
    method: 'BTREE',
    fields: ['phone']
  }, {
    name: 'supplier_email_index',
    method: 'BTREE',
    fields: ['email']
  }, {
    name: 'supplier_category_index',
    method: 'BTREE',
    fields: ['category']
  }, {
    name: 'supplier_brand_index',
    method: 'BTREE',
    fields: ['brand']
  }, {
    name: 'supplier_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'supplier_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});
/**
 * Function to add a new suppleir into database
 * Function takes an object with the needed supplier info
 * @param {*} newSupplier 
 * @returns msg to flash for the user
 */


Supplier.addSupplier = function (newSupplier) {
  return new _bluebird["default"](function (resolve, reject) {
    //Declating variable to represent the supplier
    var supplierInfo = {
      name: newSupplier.name,
      category: newSupplier.category
    }; //Checking if supplier exists in database

    Supplier.getByNameAndCategory(supplierInfo).then(function (isSupplier) {
      //If Supplier Exists reject user input
      if (isSupplier) {
        reject("This Supplier Already Exists"); //If supplier doesn't exist add new supplier to database
      } else {
        Supplier.create(newSupplier).then(function () {
          resolve("New Supplier " + newSupplier.name + " Was Sucessfully Added to the System!");
        })["catch"](function (err) {
          reject("An Error has Occured, Supplier " + newSupplier.name + " Could not be Added to the System (" + err + ")");
        });
      }
    })["catch"](function (err) {
      reject("Could not Connect to the Server (" + err + ")");
    });
  });
};
/**
 * Function to get requested supplier from database
 * @param {*} info 
 * @returns found supplier
 */


Supplier.getByNameAndCategory = function (info) {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting the requested supplier 
    Supplier.findOne({
      where: {
        name: info.name,
        category: info.category
      } //If supplier found it is returned

    }).then(function (foundSupplier) {
      resolve(foundSupplier); //If not found return error
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * Function to get supplier info by supplier ID
 * @param {*} id 
 * @returns list of supplier names with their ids
 */


Supplier.getById = function (id) {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting all suppleirs with requested id
    Supplier.findAll({
      where: {
        id: id
      },
      //Declating attributes to return
      attributes: ['id', 'name']
    }).then(function (foundSupplier) {
      //Create a map of names and id to be returned
      var supplierMap = new Map(); //Mapping the found supplier's id and name

      foundSupplier.map(function (values) {
        return supplierMap.set(values.id, values.name);
      });
      resolve(supplierMap);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Supplier.getSpecficSupplier = function (id) {
  return new _bluebird["default"](function (resolve, reject) {
    Supplier.findOne({
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
 * Function to return list of distinct supplier values found within the database
 * @returns object that includes all distinct values of suppliers
 */


Supplier.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Declaring all variables to be returned
    var name, phone, email, category, brand; //Getting all suppliers saved in database

    Supplier.findAll().then(function (values) {
      //Mapping supplier values to not return double values
      name = getDistinct(values.map(function (val) {
        return val.name;
      }));
      phone = getDistinct(values.map(function (val) {
        return val.phone;
      }));
      email = getDistinct(values.map(function (val) {
        return val.email;
      }));
      category = getDistinct(values.map(function (val) {
        return val.category;
      }));
      brand = getDistinct(values.map(function (val) {
        return val.brand;
      })); //Creating variable of all need variables to return

      var suppliers = {
        names: name,
        phones: phone,
        emails: email,
        categories: category,
        brands: brand
      };
      resolve(suppliers);
    })["catch"](function () {
      reject("Error Connecting to the Server");
    });
  });
};
/**
 * Function to set virtual datatype supplier name of consumables
 * @param {*} consumable 
 * @returns list of consumables with their supplier names
 */


Supplier.getSupplierNames = function (consumable) {
  return new _bluebird["default"](function (resolve, reject) {
    //Initializing variable of distinct supplier IDs
    var values;

    if (consumable.isMain) {
      values = consumable.rows.map(function (a) {
        return a.consumable.supplierId;
      });
    } else {
      values = consumable.rows.map(function (a) {
        return a.supplierId;
      });
    } //Getting suppliers from the database


    Supplier.getById(values).then(function (supplierNames) {
      //Setting virtual datatype supplier name
      if (consumable.isMain) {
        consumable.rows.map(function (value) {
          return value.consumable.setDataValue('supplierName', supplierNames.get(value.consumable.supplierId));
        });
      } else {
        consumable.rows.map(function (value) {
          return value.setDataValue('supplierName', supplierNames.get(value.supplierId));
        });
      }

      resolve("completed");
    })["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Supplier;
exports["default"] = _default;