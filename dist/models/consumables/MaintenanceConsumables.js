"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../../mySQLDB"));

var _Brake = _interopRequireDefault(require("./Brake"));

var _Battery = _interopRequireDefault(require("./Battery"));

var _Filter = _interopRequireDefault(require("./Filter"));

var _Grease = _interopRequireDefault(require("./Grease"));

var _Oil = _interopRequireDefault(require("./Oil"));

var _Consumables = _interopRequireDefault(require("../Consumables"));

var _MaintenanceOrder = _interopRequireDefault(require("../MaintenanceOrder"));

var _Supplier = _interopRequireDefault(require("../Supplier"));

var _Other = _interopRequireDefault(require("./Other"));

var mappings = {
  consumable_id: {
    type: _sequelize["default"].DataTypes.INTEGER,
    primaryKey: true
  },
  consumable_type: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true
  },
  maintenance_req: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true
  },
  consumable_quantity: {
    type: _sequelize["default"].DataTypes.INTEGER,
    allowNull: false
  },
  consumable_data: {
    type: _sequelize["default"].DataTypes.VIRTUAL(_sequelize["default"].DataTypes.JSON, ['consumable_data'])
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

var MaintenanceConsumables = _mySQLDB["default"].define('maintenance_consumables', mappings, {
  indexes: [{
    name: 'maintenance_consumable_id_index',
    method: 'BTREE',
    fields: ['consumable_id']
  }, {
    name: 'maintenance_consumable_type_index',
    method: 'BTREE',
    fields: ['consumable_type']
  }, {
    name: 'maintenance_req_index',
    method: 'BTREE',
    fields: ['maintenance_req']
  }, {
    name: 'maintenance_consumable_quantity_index',
    method: 'BTREE',
    fields: ['consumable_quantity']
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

MaintenanceConsumables.getConsumables = function (reqNumber) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceConsumables.getAllConsumables(reqNumber).then( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(found) {
        var consumableMap, result;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                consumableMap = [];
                _context2.next = 3;
                return Promise.all(found.map( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(consumable) {
                    var modelType;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            modelType = getConsumableModel(consumable.consumable_type);
                            _context.next = 3;
                            return modelType.findOne({
                              where: {
                                id: consumable.consumable_id
                              }
                            }).then(function (foundConsumable) {
                              return consumableMap.push({
                                type: consumable,
                                consumable: foundConsumable
                              });
                            });

                          case 3:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 3:
                result = {
                  count: consumableMap.length,
                  rows: consumableMap,
                  isMain: true
                };

                _Supplier["default"].getSupplierNames(result).then(function () {
                  resolve(result.rows);
                });

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }())["catch"](function (err) {
      reject(err);
    });
  });
};

MaintenanceConsumables.getAllConsumables = function (reqNumber) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceConsumables.findAll({
      where: {
        maintenance_req: reqNumber
      }
    }).then(function (found) {
      resolve(found);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

MaintenanceConsumables.useConsumable = function (conusmableId, consumableCategory, reqNumber, quantity, action) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      id: conusmableId,
      category: consumableCategory,
      quantity: quantity
    };
    var newMaintenanceConsumable = {
      consumable_id: conusmableId,
      consumable_type: consumableCategory,
      maintenance_req: reqNumber,
      consumable_quantity: quantity
    };

    if (newConsumable.category === "Brake" || newConsumable.category === "Battery" || newConsumable.category === "Filter" || newConsumable.category === "Grease" || newConsumable.category === "Oil") {
      _Consumables["default"].updateConsumable(newConsumable, "delet").then(function () {
        MaintenanceConsumables.findOne({
          where: {
            consumable_id: conusmableId,
            consumable_type: consumableCategory,
            maintenance_req: reqNumber
          }
        }).then(function (found) {
          var quant;

          if (found !== null) {
            if (action === "add") {
              quant = quantity + found.consumable_quantity;
            } else if (action === "delet") {
              quant = found.consumable_quantity - quantity;
            }

            MaintenanceConsumables.update({
              consumable_quantity: quant
            }, {
              where: {
                consumable_id: conusmableId,
                consumable_type: consumableCategory,
                maintenance_req: reqNumber
              }
            }).then(function () {
              resolve("Consumable used for Work Order");
            })["catch"](function (err) {
              console.log("this errpr");
              reject(err);
            });
          } else {
            MaintenanceConsumables.create(newMaintenanceConsumable).then(function () {
              resolve("Consumable used for Work Order");
            })["catch"](function (err) {
              reject(err);
            });
          }
        })["catch"](function (err) {
          reject(err);
        });
      })["catch"](function (err) {
        reject(err);
      });
    } else {
      newConsumable.other_name = consumableCategory;
      console.log("Broke");

      _Consumables["default"].updateOtherConsumable(newConsumable, "delet").then(function () {
        MaintenanceConsumables.findOne({
          where: {
            consumable_id: conusmableId,
            consumable_type: consumableCategory,
            maintenance_req: reqNumber
          }
        }).then(function (found) {
          var quant;

          if (found !== null) {
            if (action === "add") {
              quant = quantity + found.consumable_quantity;
            } else if (action === "delet") {
              quant = found.consumable_quantity - quantity;
            }

            MaintenanceConsumables.update({
              consumable_quantity: quant
            }, {
              where: {
                consumable_id: conusmableId,
                consumable_type: consumableCategory,
                maintenance_req: reqNumber
              }
            }).then(function () {
              resolve("Consumable used for Work Order");
            })["catch"](function (err) {
              console.log("this errpr");
              reject(err);
            });
          } else {
            MaintenanceConsumables.create(newMaintenanceConsumable).then(function () {
              resolve("Consumable used for Work Order");
            })["catch"](function (err) {
              reject(err);
            });
          }
        })["catch"](function (err) {
          reject(err);
        });
      })["catch"](function (err) {
        reject(err);
      });
    }
  });
};

function getConsumableModel(consumableModel) {
  if (consumableModel === "Brake") {
    return _Brake["default"];
  } else if (consumableModel === "Filter") {
    return _Filter["default"];
  } else if (consumableModel === "Grease") {
    return _Grease["default"];
  } else if (consumableModel === "Oil") {
    return _Oil["default"];
  } else if (consumableModel === "Battery") {
    return _Battery["default"];
  } else {
    return _Other["default"];
  }
}

;
var _default = MaintenanceConsumables;
exports["default"] = _default;