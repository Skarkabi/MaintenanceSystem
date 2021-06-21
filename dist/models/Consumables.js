"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var _Battery = _interopRequireDefault(require("./consumables/Battery"));

var _Brake = _interopRequireDefault(require("./consumables/Brake"));

var _Filter = _interopRequireDefault(require("./consumables/Filter"));

var _Grease = _interopRequireDefault(require("./consumables/Grease"));

var _Oil = _interopRequireDefault(require("./consumables/Oil"));

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
  quantity: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: true
  },
  createdAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: _sequelize["default"].DataTypes.DATE,
    allowNull: true
  }
};

var Consumable = _mySQLDB["default"].define('consumable_stocks', mappings, {
  indexes: [{
    name: 'consumable_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'consumable_category_index',
    method: 'BTREE',
    fields: ['category']
  }, {
    name: 'consumable_quantity_index',
    method: 'BTREE',
    fields: ['quantity']
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

Consumable.updateConsumable = function (createConsumable, action) {
  var newConsumable = {
    category: createConsumable.category,
    quantity: parseFloat(createConsumable.quantity)
  };
  return new _bluebird["default"](function (resolve, reject) {
    Consumable.getConsumableByCategory(newConsumable.category).then(function (isCategory) {
      if (isCategory) {
        if (action === "add") {
          var quant = newConsumable.quantity + isCategory.quantity;
        } else if (action === "delet") {
          var quant = isCategory.quantity - newConsumable.quantity;
        }

        Consumable.update({
          quantity: quant
        }, {
          where: {
            category: newConsumable.category
          }
        }).then(function () {
          resolve("Consumable updated");
        })["catch"](function (err) {
          reject(err);
        });
      } else {
        Consumable.create(newConsumable).then(function () {
          resolve("New Consumable Created");
        })["catch"](function (err) {
          reject(err);
        });
      }
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Consumable.getConsumableByCategory = function (category) {
  return Consumable.findOne({
    where: {
      category: category
    }
  });
};

Consumable.getSpecific = function (consumable) {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(resolve, reject) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (consumable == "battery") {
                _Battery["default"].findAndCountAll({
                  raw: false
                }).then( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(batteries) {
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            console.log("BATTERIES");
                            console.log(batteries);
                            _context.next = 4;
                            return _Battery["default"].getSupplierNames(batteries);

                          case 4:
                            console.log(batteries.rows[0].supplierName);
                            resolve(batteries);

                          case 6:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }())["catch"](function (err) {
                  reject(err);
                });
              } else if (consumable == "brake") {
                _Brake["default"].findAndCountAll().then(function (brakes) {
                  resolve(brakes);
                })["catch"](function (err) {
                  reject(err);
                });
              } else if (consumable == "filter") {
                _Filter["default"].findAndCountAll().then(function (filters) {
                  resolve(filters);
                })["catch"](function (err) {
                  reject(err);
                });
              } else if (consumable == "grease") {
                _Grease["default"].findAndCountAll().then(function (grease) {
                  resolve(grease);
                })["catch"](function (err) {
                  reject(err);
                });
              } else if (consumable == "oil") {
                _Oil["default"].findAndCountAll().then(function (oil) {
                  resolve(oil);
                })["catch"](function (err) {
                  reject(err);
                });
              }

              ;

            case 2:
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

var _default = Consumable;
exports["default"] = _default;