"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Supplier = _interopRequireDefault(require("../Supplier"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

/**
 * Declaring the datatypes used within the Grease class
 */
var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  oilSpec: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  typeOfOil: {
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
  preferredBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  oilPrice: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
  },
  totalCost: {
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
  }
};
/**
 * Defining the oil stocks table within the MySQL database using Sequelize
 */

var Oil = _mySQLDB["default"].define('oil_stocks', mappings, {
  indexes: [{
    name: 'oil_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'oil_volume_index',
    method: 'BTREE',
    fields: ['volume']
  }, {
    name: 'oil_minVolume_index',
    method: 'BTREE',
    fields: ['minVolume']
  }, {
    name: 'oil_oilSpec_index',
    method: 'BTREE',
    fields: ['oilSpec']
  }, {
    name: 'oil_typeOfOil_index',
    method: 'BTREE',
    fields: ['typeOfOil']
  }, {
    name: 'oil_oilPrice_index',
    method: 'BTREE',
    fields: ['oilPrice']
  }, {
    name: 'oil_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'oil_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'oil_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'oil_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'oil_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }]
});
/**
 * Function to set virtual datatype supplier name using supplier ids in oil
 * @returns List of oil with their supplier names
 */


Oil.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting all the oil found in the database
    Oil.findAndCountAll().then(function (oil) {
      //Calling supplier function to add supplier name to oil objects
      _Supplier["default"].getSupplierNames(oil).then(function () {
        resolve(oil);
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
 * Function to return list of oil with their supplier names, as well as distinct values found within the database
 * @returns object that includes all oil, suppliers, and distinct values of each oil spec
 */


Oil.getOilStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Declaring all variables to be returned
    var oilC, oilS, oilSpecs, typeOfOils, preferredBrands; //Getting all suppliers saved in database

    _Supplier["default"].findAll().then(function (suppliers) {
      oilS = suppliers; //Getting all oil from database and setting supplier names 

      Oil.getStock().then(function (consumables) {
        oilC = consumables; //Mapping oil values to not return double values

        oilSpecs = getDistinct(oilC.rows.map(function (val) {
          return val.oilSpec;
        }));
        typeOfOils = getDistinct(oilC.rows.map(function (val) {
          return val.typeOfOil;
        }));
        preferredBrands = getDistinct(oilC.rows.map(function (val) {
          return val.preferredBrand;
        })); //Creating variable of all need variables to return

        var values = {
          consumables: oilC.rows,
          suppliers: oilS,
          specs: oilSpecs,
          typeOfOils: typeOfOils,
          preferredBrands: preferredBrands
        };
        resolve(values);
      })["catch"](function (err) {
        reject("Error Connecting to the Server (" + err + ")");
      });
    })["catch"](function (err) {
      reject("Error Connecting to the Server (" + err + ")");
    });
  });
};
/**
 * Function to update Oil stock
 * Takes in the oil object and if the value should be deleted or added
 * @param {*} nrewOil 
 * @param {*} action 
 * @returns msg to be flashed to user
 */


Oil.updateConsumable = function (newOil, action) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    //Checking if the oil spec exists within the stock
    Oil.findOne({
      where: {
        id: newOil.id
      }
    }).then(function (foundOil) {
      //If the oil exists in the databse the function sets the new quantity to the new value
      var quant;

      if (action === "add") {
        quant = parseFloat(newOil.volume) + foundOil.volume;
      } else if (action === "delet") {
        quant = foundOil.volume - parseFloat(newOil.volume);
      } //If the new value is 0 the oil definition is deleted from the stock


      if (quant === 0) {
        foundOil.destroy().then(function () {
          resolve(newOil.voulme + " liters Of Oil Successfully Deleted from Existing Stock!");
        })["catch"](function (err) {
          reject("An Error Occured Oil Could not be Deleted " + err);
        }); //If the new quantity is less than 0 rejects the user input  
      } else if (quant < 0) {
        reject("Can not Delete more than exists in stock"); //If quantity is > 0 the grease quantity is updated
      } else {
        Oil.update({
          volume: quant
        }, {
          where: {
            id: newOil.id
          }
        }).then(function () {
          //Updating the value from the consumables database
          if (action === "delet") {
            resolve(newOil.volume + " Litters of Oil Sucessfully Deleted from Existing Stock!");
          } else if (action === "add") {
            resolve(newOil.volume + " Litters of Oil Sucessfully Added to Existing Stock!");
          }
        })["catch"](function (err) {
          reject("An Error Occured Oil Could not be Added " + err);
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Oil Could not be Added " + err);
    });
  });
};
/**
 * Function to add a new oil into stock
 * Function takes an object with the needed oil info
 * @param {*} newOil 
 * @returns msg to be flashed to user
 */


Oil.addOil = function (newOil) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Oil",
      quantity: newOil.volume
    }; //Looking if the oil with exact specs and same quotation number already exists in stock

    Oil.findOne({
      where: {
        oilSpec: newOil.oilSpec,
        typeOfOil: newOil.typeOfOil,
        preferredBrand: newOil.preferredBrand,
        supplierId: newOil.supplierId,
        quotationNumber: newOil.quotationNumber,
        oilPrice: parseFloat(newOil.oilPrice)
      }
    }).then(function (foundOil) {
      //If this oil with this quotation number exists the function rejects the creation
      if (foundOil) {
        reject("Oil With these Details Already Registered, Please Add to Existing Stock"); //If the oil is not found the function creates a oil and updates the consumable stock
      } else {
        newOil.volume = parseFloat(newOil.volume);
        newOil.minVolume = parseFloat(newOil.minVolume);
        newOil.oilPrice = parseFloat(newOil.oilPrice);
        newOil.total_price = newOil.oilPrice * newOil.volume;
        newOil.total_price = parseFloat(newOil.total_price);
        Oil.create(newOil).then(function () {
          //Updating consumable stock database
          _Consumables["default"].updateConsumable(newConsumable, "update").then(function () {
            resolve(newOil.volume + " Liters of Oil Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Oil Could not be Added " + err);
          });
        })["catch"](function (err) {
          reject("An Error Occured Oil Could not be Added " + err);
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Oil Could not be Added " + err);
    });
  });
};
/**
 * Function to find different oil from a specific suppleir 
 * @returns list of oil values from specific supplier regardless of quotation numbers
 */


Oil.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding oil from database and returning specified attributes 
    Oil.findAll({
      //Declaring attributes to return from database
      attributes: ['oilSpec', 'typeOfOil', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('volume')), 'volume']],
      //Declaring how to group return values
      group: ['oilSpec', 'typeOfOil', 'supplierId']
    }).then(function (values) {
      //Setting variable to return oil with their supplier names
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
/**
 * Function to find all oil in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of oil purchased from that specified supplier ID
 */


Oil.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding all oil with specified supplier ID
    Oil.findAndCountAll({
      where: {
        supplierId: supplierId
      }
    }).then( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(foundGreases) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                //Adding supplier Name to Oil 
                _Supplier["default"].getSupplierNames(foundGreases).then(function () {
                  resolve(foundGreases.rows);
                })["catch"](function (err) {
                  reject(err);
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }())["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Oil;
exports["default"] = _default;