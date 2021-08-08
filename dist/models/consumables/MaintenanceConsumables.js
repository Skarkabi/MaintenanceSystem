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

var _Consumables = _interopRequireDefault(require("../Consumables"));

var _MaintenanceOrder = _interopRequireDefault(require("../MaintenanceOrder"));

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

function logMapElements(value, key, map) {
  console.log("m[".concat(key, "] = ").concat(value));
}

MaintenanceConsumables.setData = function (orders) {
  return new _bluebird["default"](function (resolve, reject) {
    var values = orders.map(function (a) {
      return a.req;
    });
    MaintenanceConsumables.getByReq(values).then(function (consumables) {
      var fullArray = [];
      consumables.forEach(function (value, key) {
        fullArray.push({
          key: key.req,
          value: value
        });
      });
      var consumablesMap = new Map();

      for (var i = 0; i < fullArray.length; i++) {
        var searchFor = JSON.stringify(fullArray[i].key);

        if (consumablesMap.get(fullArray[i].key)) {
          console.log(consumablesMap.get(fullArray[i]));
          var temp = consumablesMap.get(fullArray[i].key);
          var tempArray = temp;
          tempArray.push(fullArray[i]);
          console.log(1);
          console.log(tempArray);
          consumablesMap.set(fullArray[i].key, tempArray);
        } else {
          consumablesMap.set(fullArray[i].key, [fullArray[i].value]);
        }
      }

      console.log(consumablesMap);
      resolve("completed");
    });
  });
};

MaintenanceConsumables.getByReq = function (req) {
  return new _bluebird["default"](function (resolve, reject) {
    MaintenanceConsumables.findAll({
      where: {
        maintenance_req: req
      },
      attributes: ['maintenance_req', 'consumable_id', 'consumable_type', 'consumable_quantity']
    }).then(function (foundConsumables) {
      MaintenanceConsumables.getConsumables(foundConsumables).then(function (output) {
        resolve(output);
      });
    })["catch"](function (err) {
      reject(err);
    });
  });
};

MaintenanceConsumables.getConsumables = function (consumables) {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(resolve, reject) {
      var consumableMap;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              consumableMap = new Map();
              _context2.next = 3;
              return _bluebird["default"].all(consumables.map( /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(value) {
                  var model;
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          model = getConsumableModel(value.consumable_type);
                          _context.next = 3;
                          return model.findAll({
                            where: {
                              id: value.consumable_id
                            }
                          }).then(function (found) {
                            found.map(function (values) {
                              consumableMap.set({
                                type: value.consumable_type,
                                consumable_id: value.consumable_id,
                                req: value.maintenance_req
                              }, {
                                item: values,
                                quantity: value.consumable_quantity
                              });
                            });
                          });

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x3) {
                  return _ref2.apply(this, arguments);
                };
              }()));

            case 3:
              resolve(consumableMap);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

function getConsumableModel(consumableModel) {
  if (consumableModel === "Brake") {
    return _Brake["default"];
  } else if (consumableModel === "Filter") {
    return _Filter["default"];
  } else if (consumableModel === "Grease") {
    return _Grease["default"];
  } else if (consumableModel === "Oil") {
    return Oil;
  } else if (consumableModel === "Battery") {
    return _Battery["default"];
  }
}

;
var _default = MaintenanceConsumables;
exports["default"] = _default;