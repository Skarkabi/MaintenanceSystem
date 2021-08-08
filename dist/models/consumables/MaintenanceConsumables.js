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

var _Supplier = _interopRequireDefault(require("../Supplier"));

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
                  rows: consumableMap
                };

                _Supplier["default"].getSupplierNames(result).then(function () {
                  //console.log(result.rows[0].consumable);
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
/** 
function logMapElements(value, key, map) {
    console.log(`m[${key}] = ${value}`);
  }
  
MaintenanceConsumables.setData = orders => {
    return new Bluebird((resolve, reject) => {
        let values = orders.map(a => a.req);
        MaintenanceConsumables.getByReq(values).then(consumables => {
            var fullArray = [];
            consumables.forEach((value, key) => {
                fullArray.push({key: key.req, value: value});
            });
            var consumablesMap = new Map();
            for(var i = 0; i < fullArray.length; i++){
                var searchFor = JSON.stringify(fullArray[i].key);
                if(consumablesMap.get(fullArray[i].key)){
                    console.log(consumablesMap.get(fullArray[i]))
                    var temp = consumablesMap.get(fullArray[i].key);
                    var tempArray = temp;
                    tempArray.push(fullArray[i]);
                    console.log(1);
                    console.log(tempArray);
                    consumablesMap.set(fullArray[i].key, tempArray);
                }else{
                    consumablesMap.set(fullArray[i].key, [fullArray[i].value]);
                }
            }
            
            console.log(consumablesMap);
            resolve("completed");
        });
    });
}

MaintenanceConsumables.getByReq = req => {
    return new Bluebird((resolve, reject) => {
        MaintenanceConsumables.findAll({
            where: {
                maintenance_req: req
            },
            attributes: ['maintenance_req', 'consumable_id', 'consumable_type', 'consumable_quantity']
        }).then(foundConsumables => {
            MaintenanceConsumables.getConsumables(foundConsumables).then(output => {
                resolve(output);
            });
            
        }).catch(err => {
            reject(err);
        });

    });

}

MaintenanceConsumables.getConsumables = consumables => {
    return new Bluebird(async (resolve, reject) => {
        var consumableMap = new Map();
        await Bluebird.all(consumables.map(async value => {
            let model = getConsumableModel(value.consumable_type);
            await model.findAll({
                where: {
                    id: value.consumable_id
                }
            }).then(found => {
                found.map(values => {
                    consumableMap.set({type: value.consumable_type, consumable_id: value.consumable_id, req: value.maintenance_req}, {item: values, quantity: value.consumable_quantity})
                    
                });

            });

        }));

        resolve(consumableMap);

    });

}
*/


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