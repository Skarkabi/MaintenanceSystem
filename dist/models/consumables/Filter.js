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
 * Declaring the datatypes used within the Filter class
 */
var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  carBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carModel: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carYear: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  fType: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  preferredBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  actualBrand: {
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
  minQuantity: {
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
 * Defining the filter stocks table within the MySQL database using Sequelize
 */

var Filter = _mySQLDB["default"].define('filter_stocks', mappings, {
  indexes: [{
    name: 'filter_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'filter_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'filter_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'filter_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'filter_carModel_index',
    method: 'BTREE',
    fields: ['carModel']
  }, {
    name: 'filter_fType_index',
    method: 'BTREE',
    fields: ['fType']
  }, {
    name: 'filter_preferredBrand_index',
    method: 'BTREE',
    fields: ['preferredBrand']
  }, {
    name: 'filter_actualBrand_index',
    method: 'BTREE',
    fields: ['actualBrand']
  }, {
    name: 'filter_category_index',
    method: 'BTREE',
    fields: ['category']
  }, {
    name: 'filter_singleCost_index',
    method: 'BTREE',
    fields: ['singleCost']
  }, {
    name: 'filter_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'filter_minQuantity_index',
    method: 'BTREE',
    fields: ['minQuantity']
  }, {
    name: 'filter_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'filter_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'filter_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'filter_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }]
});
/**
 * Function to update Filter stock
 * Takes in the filter object and if the value should be deleted or added
 * @param {*} newFilter 
 * @param {*} action 
 * @returns msg to be flashed to user
 */


Filter.updateConsumable = function (newFilter, action) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Filter",
      quantity: newFilter.quantity
    }; //Checking if the filter spec exists within the stock

    Filter.findOne({
      where: {
        id: newFilter.id
      }
    }).then(function (foundFilter) {
      //If the filter exists in the databse the function sets the new quantity to the new value
      var quant;

      if (action === "add") {
        quant = parseInt(newFilter.quantity) + foundFilter.quantity;
      } else if (action === "delet") {
        quant = foundFilter.quantity - parseInt(newFilter.quantity);
      } //If the new value is 0 the filter definition is deleted from the stock


      if (quant === 0) {
        foundFilter.destroy().then(function () {
          resolve("Filter Completly Removed From Stock!");
        })["catch"](function (err) {
          reject("An Error Occured Filters Could not be Deleted");
        }); //If the new quantity is less than 0 rejects the user input
      } else if (quant < 0) {
        reject("Can Not Delete More Than Exists in Stock!"); //If quantity is > 0 the brake quantity is updated
      } else {
        //looking for the filter to update and setting the new quantity
        Filter.update({
          quantity: quant
        }, {
          where: {
            id: newFilter.id
          }
        }).then(function () {
          //Updating the value from the consumables database
          if (action === "add") {
            resolve(newFilter.quantity + " Fitlers Sucessfully Added to Existing Stock!");
          } else if (action === "delet") {
            resolve(newFilter.quantity + " Fitlers Sucessfully Deleted from Existing Stock!");
          }
        })["catch"](function (err) {
          reject("An Error Occured Filters Stock Could not be Updated (Error: " + err + ")");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Filters Stock Could not be Updated (Error: " + err + ")");
    });
  });
};
/**
 * Function to add a new Filter into stock
 * Function takes an object with the needed filter info
 * @param {*} newFilter 
 * @returns msg to be flashed to user
 */


Filter.addFilter = function (newFilter) {
  return new _bluebird["default"](function (resolve, reject) {
    //Creating the new Consumable value to be updated in the consumable databse
    var newConsumable = {
      category: "Filter",
      quantity: newFilter.quantity
    }; //Looking if the filter with exact specs and same quotation number already exists in stock

    Filter.findOne({
      where: {
        carBrand: newFilter.carBrand,
        carModel: newFilter.carModel,
        category: newFilter.category,
        fType: newFilter.fType,
        preferredBrand: newFilter.preferredBrand,
        actualBrand: newFilter.actualBrand,
        singleCost: newFilter.singleCost
      }
    }).then(function (foundFilter) {
      //If this filter with this quotation number exists the function rejects the creation
      if (foundFilter) {
        reject("Filters With these Details Already Registered, Please Add to Existing Stock"); //If the filter is not found the function creates a filter and updates the consumable stock
      } else {
        //Converting values to appropiate number type
        newFilter.quantity = parseInt(newFilter.quantity);
        newFilter.minQuantity = parseInt(newFilter.minQuantity);
        newFilter.singleCost = parseFloat(newFilter.singleCost);
        newFilter.totalCost = newFilter.singleCost * newFilter.quantity;
        newFilter.totalCost = parseFloat(newFilter.totalCost);
        Filter.create(newFilter).then(function () {
          //Updating consumable stock database
          _Consumables["default"].updateConsumable(newConsumable, "update").then(function () {
            resolve(newFilter.quantity + " Filters Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Filters Could not be Added " + err);
          });
        })["catch"](function (err) {
          reject("An Error Occured Filters Could not be Added " + err);
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Filters Could not be Added " + err);
    });
  });
};
/**
 * Function to set virtual datatype supplier name using supplier ids in filter
 * @returns List of filters with their supplier names
 */


Filter.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting all the brakes found in the database
    Filter.findAndCountAll().then(function (filters) {
      //Calling supplier function to add supplier name to brake objects
      _Supplier["default"].getSupplierNames(filters).then(function () {
        //returning the brakes 
        resolve(filters);
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
 * Function to return list of fitlers with their supplier names, as well as distinct values found within the database
 * @returns object that includes all filters, suppliers, and distinct values of each filter spec
 */


Filter.getFilterStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var filterC, filterS, typeF, carBrand, carModel, carYear, preferredBrand, carCategory, singleCost, actualBrand;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              //Declaring all variables to be returned
              //Getting all suppliers saved in database
              _Supplier["default"].findAll().then(function (suppliers) {
                filterS = suppliers; //Getting all filters from database and setting supplier names 

                Filter.getStock().then(function (consumables) {
                  filterC = consumables; //Mapping filter values to not return double values

                  carCategory = getDistinct(filterC.rows.map(function (val) {
                    return val.category;
                  }));
                  typeF = getDistinct(filterC.rows.map(function (val) {
                    return val.fType;
                  }));
                  carBrand = getDistinct(filterC.rows.map(function (val) {
                    return val.carBrand;
                  }));
                  carYear = getDistinct(filterC.rows.map(function (val) {
                    return val.carYear;
                  }));
                  carModel = getDistinct(filterC.rows.map(function (val) {
                    return val.carModel;
                  }));
                  preferredBrand = getDistinct(filterC.rows.map(function (val) {
                    return val.preferredBrand;
                  }));
                  actualBrand = getDistinct(filterC.rows.map(function (val) {
                    return val.actualBrand;
                  }));
                  singleCost = getDistinct(filterC.rows.map(function (val) {
                    return val.singleCost;
                  })); //Creating variable of all need variables to return

                  var values = {
                    consumable: filterC.rows,
                    suppliers: filterS,
                    filterType: typeF,
                    carBrand: carBrand,
                    carModel: carModel,
                    carYear: carYear,
                    preferredBrand: preferredBrand,
                    carCategory: carCategory,
                    singleCost: singleCost,
                    actualBrand: actualBrand
                  };
                  resolve(values);
                })["catch"](function (err) {
                  reject("Error Connectin to the Server (" + err + ")");
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
 * Function to find all filters in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of filters purchased from that specified supplier ID
 */


Filter.getWithSupplier = function (supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding all filters with specified supplier ID
    Filter.findAndCountAll({
      where: {
        supplierId: supplierId
      }
    }).then(function (foundFilter) {
      //Adding supplier Name to filters 
      _Supplier["default"].getSupplierNames(foundFilter).then(function () {
        resolve(foundFilter.rows);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};
/**
 * Function to find different filters from a specific suppleir 
 * @returns list of filters values from specific supplier regardless of quotation numbers
 */


Filter.groupSupplier = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Finding filters from database and returning specified attributes 
    Filter.findAll({
      //Declaring attributes to return from database
      attributes: ['category', 'fType', 'actualBrand', 'carModel', 'carBrand', 'carYear', 'singleCost', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('quantity')), 'quantity']],
      //Declaring how to group return values
      group: ['category', 'fType', 'actualBrand', 'carModel', 'carBrand', 'carYear', 'singleCost', 'supplierId']
    }).then( /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(values) {
        var result;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                //Setting variable to return filters with their supplier names
                result = {
                  count: values.length,
                  rows: values
                };

                _Supplier["default"].getSupplierNames(result).then(function () {
                  resolve(result);
                })["catch"](function (err) {
                  reject(err);
                });

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }())["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Filter;
exports["default"] = _default;