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

/**
 * Declaring the datatypes used within the Grease class
 */
var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  greaseSpec: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  typeOfGrease: {
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
  volume: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
  },
  minVolume: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
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
  },
  totalCost: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
  },
  price_per_litter: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
  }
};
/**
 * Defining the grease stocks table within the MySQL database using Sequelize
 */

var Grease = _mySQLDB["default"].define('grease_stocks', mappings, {
  indexes: [{
    name: 'grease_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'grease_volume_index',
    method: 'BTREE',
    fields: ['volume']
  }, {
    name: 'grease_minVolume_index',
    method: 'BTREE',
    fields: ['minVolume']
  }, {
    name: 'grease_greaseSpec_index',
    method: 'BTREE',
    fields: ['greaseSpec']
  }, {
    name: 'grease_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'grease_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'grease_typeOfGrease_index',
    method: 'BTREE',
    fields: ['typeOfGrease']
  }, {
    name: 'grease_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'grease_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'grease_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'grease_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }, {
    name: 'grease_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'grease_price_per_litter_index',
    method: 'BTREE',
    fields: ['price_per_litter']
  }]
});
/**
 * Function to update Grease stock
 * Takes in the grease object and if the value should be deleted or added
 * @param {*} newFrease 
 * @param {*} action 
 * @returns msg to be flashed to user
 */


Grease.updateConsumable = function (newGrease, action) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Grease",
      quantity: newGrease.volume
    }; //Checking if the grease spec exists within the stock

    Grease.findOne({
      where: {
        id: newGrease.id
      }
    }).then(function (foundGrease) {
      //If the grease exists in the databse the function sets the new quantity to the new value
      var quant;

      if (action === "add") {
        quant = parseFloat(newGrease.volume) + foundGrease.volume;
      } else if (action === "delet") {
        quant = foundGrease.volume - parseFloat(newGrease.volume);
      } //If the new value is 0 the brake definition is deleted from the stock


      if (quant === 0) {
        foundGrease.destroy().then(function () {
          resolve(newGrease.volume + " Liters Of Grease Sucessfully Deleted from Existing Stock!");
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Deleted " + err);
        });
      } //If the new quantity is less than 0 rejects the user input
      else if (quant < 0) {
        reject("Can Not Delete More Than Exists in Stock!"); //If quantity is > 0 the grease quantity is updated
      } else {
        Grease.update({
          volume: quant
        }, {
          where: {
            id: newGrease.id
          }
        }).then(function () {
          if (action === "delet") {
            resolve(newGrease.volume + " Litters of Grease Sucessfully Deleted from Existing Stock!");
          } else if (action === "add") {
            resolve(newGrease.volume + " Litters of Grease Sucessfully Added to Existing Stock!");
          }
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Added " + err);
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Grease Could not be Added " + err);
    });
  });
};
/**
 * Function to add a new grease into stock
 * Function takes an object with the needed grease info
 * @param {*} newGrease 
 * @returns msg to be flashed to user
 */


Grease.addGrease = function (newGrease) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Grease",
      quantity: newGrease.volume
    }; //Looking if the grease with exact specs and same quotation number already exists in stock

    Grease.findOne({
      where: {
        greaseSpec: newGrease.greaseSpec,
        typeOfGrease: newGrease.typeOfGrease,
        carBrand: newGrease.carBrand,
        carYear: newGrease.carYear,
        supplierId: newGrease.supplierId,
        quotationNumber: newGrease.quotationNumber,
        price_per_litter: parseFloat(newGrease.price_per_litter)
      }
    }).then(function (foundGrease) {
      //If this grease with this quotation number exists the function rejects the creation
      if (foundGrease) {
        reject("Grease With these Details Already Registered, Please Add to Existing Stock"); //If the grease is not found the function creates a brake and updates the consumable stock
      } else {
        //Converting values to appropiate number type
        newGrease.volume = parseFloat(newGrease.volume);
        newGrease.minVolume = parseFloat(newGrease.minVolume);
        newGrease.price_per_litter = parseFloat(newGrease.price_per_litter);
        newGrease.total_price = newGrease.price_per_litter * newGrease.volume;
        newGrease.total_price = parseFloat(newGrease.total_price);
        Grease.create(newGrease).then(function () {
          //Updating consumable stock database
          _Consumables["default"].updateConsumable(newConsumable, "update").then(function () {
            resolve(newGrease.volume + " Liters of Greace Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Grease Could not be Added (Error: " + err + ")");
          });
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Added (Error: " + err + ")");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Grease Could not be Added (Error: " + err + ")");
    });
  });
};
/**
 * Function to set virtual datatype supplier name using supplier ids in grease
 * @returns List of grease with their supplier names
 */


Grease.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting all the grease found in the database
    Grease.findAndCountAll().then(function (grease) {
      //Calling supplier function to add supplier name to grease objects
      _Supplier["default"].getSupplierNames(grease).then(function () {
        resolve(grease);
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
 * Function to return list of grease with their supplier names, as well as distinct values found within the database
 * @returns object that includes all grease, suppliers, and distinct values of each grease spec
 */


Grease.getGreaseStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var greaseC, greaseS, greaseSpec, typeOfGrease, carBrand, carYear;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              //Declaring all variables to be returned
              //Getting all suppliers saved in database
              _Supplier["default"].findAll().then(function (suppliers) {
                greaseS = suppliers; //Getting all brakes from database and setting supplier names 

                Grease.getStock().then(function (consumables) {
                  greaseC = consumables; //Mapping brake values to not return double values

                  greaseSpec = getDistinct(greaseC.rows.map(function (val) {
                    return val.greaseSpec;
                  }));
                  typeOfGrease = getDistinct(greaseC.rows.map(function (val) {
                    return val.typeOfGrease;
                  }));
                  carBrand = getDistinct(greaseC.rows.map(function (val) {
                    return val.carBrand;
                  }));
                  carYear = getDistinct(greaseC.rows.map(function (val) {
                    return val.carYear;
                  })); //Creating variable of all need variables to return

                  var values = {
                    consumables: greaseC.rows,
                    suppliers: greaseS,
                    specs: greaseSpec,
                    typeOfGrease: typeOfGrease,
                    carBrand: carBrand,
                    carYear: carYear
                  };
                  resolve(values);
                })["catch"](function (err) {
                  reject("Error Connecting to the Server (" + err + ")");
                });
              })["catch"](function (err) {
                reject("Error Connecting to the Server (" + err + ")");
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
 * Function to find all grease in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of grease purchased from that specified supplier ID
 */


Grease.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding all grease with specified supplier ID
    Grease.findAndCountAll({
      where: {
        supplierId: supplierId
      }
    }).then(function (foundGreases) {
      //Adding supplier Name to Grease 
      _Supplier["default"].getSupplierNames(foundGreases).then(function () {
        resolve(foundGreases.rows);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * Function to find different grease from a specific suppleir 
 * @returns list of grease values from specific supplier regardless of quotation numbers
 */


Grease.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding grease from database and returning specified attributes 
    Grease.findAll({
      //Declaring attributes to return from database
      attributes: ['greaseSpec', 'typeOfGrease', 'carBrand', 'carYear', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('volume')), 'volume']],
      //Declaring how to group return values
      group: ['greaseSpec', 'typeOfGrease', 'carBrand', 'carYear', 'supplierId']
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

var _default = Grease;
exports["default"] = _default;