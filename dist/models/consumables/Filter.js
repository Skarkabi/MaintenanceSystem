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

Filter.updateFilter = function (newFilter, action) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Filter",
      quantity: newFilter.quantity
    };
    Filter.findOne({
      where: {
        id: newFilter.id
      }
    }).then(function (foundFilter) {
      var quant;

      if (action === "add") {
        quant = parseInt(newFilter.quantity) + foundFilter.quantity;
      } else if (action === "delet") {
        quant = foundFilter.quantity - parseInt(newFilter.quantity);
      }

      if (quant === 0) {
        foundFilter.destroy().then(function () {
          resolve("Filter Completly Removed From Stock!");
        })["catch"](function (err) {
          reject("An Error Occured Filters Could not be Deleted");
        });
      } else if (quant < 0) {
        reject("Can Not Delete More Than Exists in Stock!");
      } else {
        Filter.update({
          quantity: quant
        }, {
          where: {
            id: newFilter.id
          }
        }).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            if (action === "add") {
              resolve(newFilter.quantity + " Fitlers Sucessfully Added to Existing Stock!");
            } else if (action === "delet") {
              resolve(newFilter.quantity + " Fitlers Sucessfully Deleted from Existing Stock!");
            }
          })["catch"](function (err) {
            reject("An Error Occured Filters Stock Could not be Updated");
          });
        })["catch"](function (err) {
          reject("An Error Occured Filters Stock Could not be Updated");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Filters Stock Could not be Updated");
    });
  });
};

Filter.addFilter = function (newFilter) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Filter",
      quantity: newFilter.quantity
    };
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
      if (foundFilter) {
        reject("Filters With these Details Already Registered, Please Add to Existing Stock");
      } else {
        newFilter.quantity = parseInt(newFilter.quantity);
        newFilter.minQuantity = parseInt(newFilter.minQuantity);
        newFilter.singleCost = parseFloat(newFilter.singleCost);
        newFilter.totalCost = newFilter.singleCost * newFilter.quantity;
        newFilter.totalCost = parseFloat(newFilter.totalCost);
        Filter.create(newFilter).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, "add").then(function () {
            resolve(newFilter.quantity + " Filters Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Filters Could not be Added");
          });
        })["catch"](function (err) {
          reject("An Error Occured Filters Could not be Added");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Filters Could not be Added");
    });
  });
};

Filter.getFilterStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var filterC, typeF, carBrand, carModel, carYear, preferredBrand, carCategory, singleCost, actualBrand, values;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _Consumables["default"].getSpecific("filter").then(function (consumables) {
                console.log(consumables);
                filterC = consumables;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 2:
              _context.next = 4;
              return Filter.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `category`'), 'category']],
                raw: true,
                nest: true
              }).then(function (category) {
                carCategory = category;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 4:
              _context.next = 6;
              return Filter.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `fType`'), 'fType']],
                raw: true,
                nest: true
              }).then(function (filterType) {
                typeF = filterType;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 6:
              _context.next = 8;
              return Filter.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carBrand`'), 'carBrand']]
              }).then(function (spec) {
                carBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 8:
              _context.next = 10;
              return Filter.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carYear`'), 'carYear']]
              }).then(function (spec) {
                carYear = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 10:
              _context.next = 12;
              return Filter.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carModel`'), 'carModel']],
                raw: true,
                nest: true
              }).then(function (filterType) {
                carModel = filterType;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 12:
              _context.next = 14;
              return Filter.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `preferredBrand`'), 'preferredBrand']]
              }).then(function (spec) {
                preferredBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 14:
              _context.next = 16;
              return Filter.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `actualBrand`'), 'actualBrand']]
              }).then(function (spec) {
                actualBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 16:
              _context.next = 18;
              return Filter.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `singleCost`'), 'singleCost']]
              }).then(function (spec) {
                singleCost = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 18:
              values = {
                consumable: filterC.rows,
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

            case 20:
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

var _default = Filter;
exports["default"] = _default;