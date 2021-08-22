"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _Supplier = _interopRequireDefault(require("../Supplier"));

var _Quotation = _interopRequireDefault(require("../Quotation"));

var _express = _interopRequireDefault(require("express"));

var _this = void 0;

var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  other_name: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  quantity: {
    type: _sequelize["default"].INTEGER,
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
  details: {
    type: _sequelize["default"].DataTypes.STRING,
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
  materialRequestNumber: {
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

var Other = _mySQLDB["default"].define('other_stocks', mappings, {
  indexes: [{
    name: 'other_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'other_other_name_index',
    method: 'BTREE',
    fields: ['other_name']
  }, {
    name: 'other_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
  }, {
    name: 'other_singleCost_index',
    method: 'BTREE',
    fields: ['singleCost']
  }, {
    name: 'other_totalCost_index',
    method: 'BTREE',
    fields: ['totalCost']
  }, {
    name: 'other_details_index',
    method: 'BTREE',
    fields: ['details']
  }, {
    name: 'other_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'other_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }, {
    name: 'other_supplierId_index',
    method: 'BTREE',
    fields: ['supplierId']
  }, {
    name: 'other_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }, {
    name: 'other_materialRequestNumber_index',
    method: 'BTREE',
    fields: ['materialRequestNumber']
  }]
});

Other.updateConsumable = function (newOther, action) {
  return new _bluebird["default"](function (resolve, reject) {
    if (!newOther.details) {
      newOther.details = "";
    }

    if (!newOther.supplierId) {
      newOther.supplierId = 0;
    }

    if (!newOther.quotationNumber) {
      newOther.quotationNumber = "N/A";
    }

    Other.findOne({
      where: {
        other_name: newOther.other_name,
        details: newOther.details,
        supplierId: newOther.supplierId,
        quotationNumber: newOther.quotationNumber
      }
    }).then(function (found) {
      newOther.quantity = parseInt(newOther.quantity);

      if (found && action === "delet") {
        var newQuant = found.quantity - newOther.quantity;
        Other.update({
          quantity: newQuant
        }, {
          where: {
            id: found.id
          }
        }).then(function () {
          resolve(newOther.other_name + " Removed From Stock");
        })["catch"](function (err) {
          reject(err);
        });
      } else if (found && found.quotationNumber !== "N/A") {
        reject("Item with this quotation number is already in the stock");
      } else if (found) {
        var newQuant = found.quantity + newOther.quantity;
        Other.update({
          quantity: newQuant
        }, {
          where: {
            id: found.id
          }
        }).then(function () {
          resolve(newOther.other_name + " Added to Stock");
        })["catch"](function (err) {
          reject(err);
        });
      } else {
        Other.findOne({
          where: {
            id: newOther.id
          }
        }).then(function (newFound) {
          var usedQuantity = 0;

          if (newFound && action === "delet") {
            usedQuantity = newFound.quantity - newOther.quantity;
            Other.update({
              quantity: usedQuantity
            }, {
              where: {
                id: newFound.id
              }
            }).then(function () {
              resolve(newOther.other_name + "Used for Order");
            })["catch"](function (err) {
              reject(err);
            });
          } else {
            newOther.singleCost = parseFloat(newOther.singleCost);
            newOther.quantity = parseInt(newOther.quantity);
            newOther.totalCost = newOther.singleCost * newOther.quantity;
            Other.create(newOther).then(function () {
              resolve(newOther.quantity + " " + newOther.other_name + " Successfully Added!");
            })["catch"](function (err) {
              reject("An Error Occured " + newOther.other_name + " Could not be Added (Error: " + err + ")");
            });
          }
        });
      }
    })["catch"](function (err) {
      console.log(err);
      reject("An Error Occured " + newOther.other_name + " Could not be Added (Error: " + err + ")");
    });
  });
};

Other.getStock = function () {
  return new _bluebird["default"](function (resolve, reject) {
    Other.findAndCountAll().then(function (others) {
      _Supplier["default"].getSupplierNames(others).then(function () {
        resolve(others);
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

Other.getOtherStocks = function () {
  return new _bluebird["default"](function (resolve, reject) {
    var othersC, othersS, name, details;

    _Supplier["default"].findAll().then(function (suppliers) {
      othersS = suppliers;
      Other.getStock().then(function (consumables) {
        othersC = consumables;
        name = getDistinct(othersC.rows.map(function (val) {
          return val.other_name;
        }));
        details = getDistinct(othersC.rows.map(function (val) {
          return val.details;
        }));
        var values = {
          consumables: othersC.rows,
          suppliers: othersS,
          names: name,
          details: details
        };
        resolve(values);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Other.getWithSupplier = function (category, supplierId) {
  return new _bluebird["default"](function (resolve, reject) {
    Other.findAndCountAll({
      where: {
        supplierId: supplierId,
        other_name: category
      }
    }).then(function (found) {
      _Supplier["default"].getSupplierNames(found).then(function () {
        resolve(found.rows);
      })["catch"](function (err) {
        reject(err);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Other.groupSupplier = function (category) {
  var tres = "Spark Plug";
  return new _bluebird["default"](function (resolve, reject) {
    Other.findAll({
      where: {
        other_name: category
      },
      attributes: ['other_name', 'supplierId', [_mySQLDB["default"].fn('sum', _mySQLDB["default"].col('quantity')), 'quantity']],
      group: ["other_name", "supplierId"]
    }).then(function (values) {
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

Other.getQuotation = function () {
  return new _bluebird["default"](function (resolve, reject) {
    //Getting the quotation from database
    _Quotation["default"].getQuotation(_this.quotationNumber).then(function (foundQuotation) {
      resolve(foundQuotation);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Other;
exports["default"] = _default;