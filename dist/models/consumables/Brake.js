"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _Supplier = _interopRequireDefault(require("../Supplier"));

var _Quotation = _interopRequireDefault(require("../Quotation"));

var _this = void 0;

/**
 * Declaring the datatypes used within the Brake class
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
  carBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carYear: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  bBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  preferredBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  chassis: {
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
  minQuantity: {
    type: _sequelize["default"].DataTypes.INTEGER,
    allowNull: true
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
 * Defining the brake stocks table within the MySQL database using Sequelize
 */

var Brake = _mySQLDB["default"].define('brake_stocks', mappings, {
  indexes: [{
    name: 'brake_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'brake_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'brake_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'brake_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'brake_chassis_index',
    method: 'BTREE',
    fields: ['chassis']
  }, {
    name: 'brake_bBrand_index',
    method: 'BTREE',
    fields: ['bBrand']
  }, {
    name: 'brake_preferredBrand_index',
    method: 'BTREE',
    fields: ['preferredBrand']
  }, {
    name: 'brake_singleCost_index',
    method: 'BTREE',
    fields: ['singleCost']
  }, {
    name: 'brake_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'brake_minQuantity_index',
    method: 'BTREE',
    fields: ['minQuantity']
  }, {
    name: 'brake_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'brake_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'brake_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'brake_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }]
});
/**
 * Function to update Brake stock
 * Takes in the brake object and if the value should be deleted or added
 * @param {*} newBrake 
 * @param {*} action 
 * @returns msg to be flashed to user
 */


Brake.updateBrake = function (newBrake, action) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Brake",
      quantity: newBrake.quantity
    }; //Checking if the brake spec exists within the stock

    Brake.findOne({
      where: {
        id: newBrake.id
      }
    }).then(function (foundBrake) {
      //If the brake exists in the databse the function sets the new quantity to the new value
      var quant;

      if (action === "add") {
        quant = parseInt(newBrake.quantity) + foundBrake.quantity;
      } else if (action === "delet") {
        quant = foundBrake.quantity - parseInt(newBrake.quantity);
      } //If the new value is 0 the brake definition is deleted from the stock


      if (quant === 0) {
        foundBrake.destroy().then(function () {
          resolve("Brake Completly Removed From Stock!");
        })["catch"](function (err) {
          reject("An Error Occured Brakes Could not be Deleted");
        }); //If the new quantity is less than 0 rejects the user input
      } else if (quant < 0) {
        reject("Can Not Delete More Than Exists in Stock"); //If quantity is > 0 the brake quantity is updated
      } else {
        //looking for the brake to update and setting the new quantity
        Brake.update({
          quantity: quant
        }, {
          where: {
            id: newBrake.id
          }
        }).then(function () {
          //Updating the value from the consumables database
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            if (action === "delet") {
              resolve(newBrake.quantity + " Brakes Sucessfully Deleted from Existing Stock!");
            } else if (action === "add") {
              resolve(newBrake.quantity + " Brakes Sucessfully Added to Existing Stock!");
            }
          })["catch"](function (err) {
            reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
          });
        })["catch"](function (err) {
          reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
    });
  });
};
/**
 * Function to add a new brake into stock
 * Function takes an object with the needed brake info
 * @param {*} newBrake 
 * @returns msg to be flashed to user
 */


Brake.addBrake = function (newBrake) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Brake",
      quantity: newBrake.quantity
    }; //Looking if the brake with exact specs and same quotation number already exists in stock

    Brake.findOne({
      where: {
        category: newBrake.category,
        carBrand: newBrake.carBrand,
        carYear: newBrake.carYear,
        bBrand: newBrake.bBrand,
        preferredBrand: newBrake.preferredBrand,
        chassis: newBrake.chassis,
        supplierId: newBrake.supplierId,
        quotationNumber: newBrake.quotationNumber
      }
    }).then(function (foundBrake) {
      //If this brake with this quotation number exists the function rejects the creation
      if (foundBrake) {
        reject("Brakes With these Details Already Registered, Please Add to Existing Stock"); //If the brake is not found the function creates a brake and updates the consumable stock
      } else {
        //Converting values to appropiate number type
        newBrake.singleCost = parseFloat(newBrake.singleCost);
        newBrake.quantity = parseInt(newBrake.quantity);
        newBrake.minQuantity = parseInt(newBrake.minQuantity);
        newBrake.totalCost = newBrake.singleCost * newBrake.quantity;
        Brake.create(newBrake).then(function () {
          //Updating consumable stock database
          _Consumables["default"].updateConsumable(newConsumable, "add").then(function () {
            resolve(newBrake.quantity + " Brakes Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
          });
        })["catch"](function (err) {
          reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
    });
  });
};
/**
 * Function to set virtual datatype supplier name using supplier ids in brake
 * @returns List of brakes with their supplier names
 */


Brake.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting all the brakes found in the database
    Brake.findAndCountAll().then(function (breakes) {
      //Calling supplier function to add supplier name to brake objects
      _Supplier["default"].getSupplierNames(breakes).then(function () {
        //returning the brakes 
        resolve(breakes);
      })["catch"](function (err) {
        reject(err);
      });
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
 * Function to return list of brakes with their supplier names, as well as distinct values found within the database
 * @returns object that includes all brakes, suppliers, and distinct values of each brake spec
 */


Brake.getBrakeStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var brakeC, brakeS, brakeCategory, brakeCBrand, brakeCYear, brakeCChassis, brakeBrand, brakePBrand, brakeQuantity;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              //Declaring all variables to be returned
              //Getting all suppliers saved in database
              _Supplier["default"].findAll().then(function (suppliers) {
                brakeS = suppliers; //Getting all brakes from database and setting supplier names 

                Brake.getStock().then(function (consumables) {
                  brakeC = consumables; //Mapping brake values to not return double values

                  brakeCategory = getDistinct(brakeC.rows.map(function (val) {
                    return val.category;
                  }));
                  brakeCBrand = getDistinct(brakeC.rows.map(function (val) {
                    return val.carBrand;
                  }));
                  brakeCYear = getDistinct(brakeC.rows.map(function (val) {
                    return val.carYear;
                  }));
                  brakeCChassis = getDistinct(brakeC.rows.map(function (val) {
                    return val.chassis;
                  }));
                  brakePBrand = getDistinct(brakeC.rows.map(function (val) {
                    return val.preferredBrand;
                  }));
                  brakeQuantity = getDistinct(brakeC.rows.map(function (val) {
                    return val.quantity;
                  }));
                  brakeBrand = getDistinct(brakeC.rows.map(function (val) {
                    return val.bBrand;
                  })); //Creating variable of all need variables to return

                  var values = {
                    consumable: brakeC.rows,
                    suppliers: brakeS,
                    brakeCategory: brakeCategory,
                    brakeCBrand: brakeCBrand,
                    brakeCYear: brakeCYear,
                    brakeCChassis: brakeCChassis,
                    brakeBrand: brakeBrand,
                    brakePBrand: brakePBrand,
                    brakeQuantity: brakeQuantity
                  };
                  resolve(values);
                })["catch"](function () {
                  reject("Error Connecting to the Server");
                });
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};
/**
 * Function to find matching quotation of brakes
 * @returns Quotation object
 */


Brake.getQuotation = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting the quotation from database
    _Quotation["default"].getQuotation(_this.quotationNumber).then(function (foundQuotation) {
      resolve(foundQuotation);
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * Function to find all brakes in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of brakes purchased from that specified supplier ID
 */


Brake.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding all brakes with specified supplier ID
    Brake.findAndCountAll({
      where: {
        supplierId: supplierId
      }
    }).then(function (foundBrakes) {
      //Adding supplier Name to filters 
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
 * Function to find different brakes from a specific suppleir 
 * @returns list of brake values from specific supplier regardless of quotation numbers
 */


Brake.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding brakes from database and returning specified attributes 
    Brake.findAll({
      //Declaring attributes to return from database
      attributes: ['category', 'carBrand', 'carYear', 'chassis', 'bBrand', 'singleCost', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('quantity')), 'quantity']],
      //Declaring how to group return values
      group: ["category", "carBrand", "carYear", "chassis", "bBrand", "singleCost", "supplierId", "preferredBrand"]
    }).then(function (values) {
      //Setting variable to return brakes with their supplier names
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

var _default = Brake;
exports["default"] = _default;