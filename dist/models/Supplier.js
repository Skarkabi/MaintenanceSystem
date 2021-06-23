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

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var _Brake = _interopRequireDefault(require("./consumables/Brake"));

var mappings = {
  id: {
    type: _sequelize["default"].INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  phone: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  email: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  category: {
    type: _sequelize["default"].STRING,
    allowNull: false
  },
  brand: {
    type: _sequelize["default"].STRING,
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

var Supplier = _mySQLDB["default"].define('Suppliers', mappings, {
  indexes: [{
    name: 'supplier_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'supplier_name_index',
    method: 'BTREE',
    fields: ['name']
  }, {
    name: 'supplier_phone_index',
    method: 'BTREE',
    fields: ['phone']
  }, {
    name: 'supplier_email_index',
    method: 'BTREE',
    fields: ['email']
  }, {
    name: 'supplier_category_index',
    method: 'BTREE',
    fields: ['category']
  }, {
    name: 'supplier_brand_index',
    method: 'BTREE',
    fields: ['brand']
  }, {
    name: 'supplier_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'supplier_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

Supplier.addSupplier = function (newSupplier) {
  return new _bluebird["default"](function (resolve, reject) {
    var supplierInfo = {
      name: newSupplier.name,
      category: newSupplier.category
    };
    Supplier.getByNameAndCategory(supplierInfo).then(function (isSupplier) {
      if (isSupplier) {
        reject("This Supplier Already Exists");
      } else {
        Supplier.create(newSupplier).then(function () {
          resolve("New Supplier " + newSupplier.name + " Was Sucessfully Added to the System!");
        })["catch"](function (err) {
          reject("An Error has Occured, Supplier " + newSupplier.name + " Could not be Added to the System (" + err + ")");
        });
      }
    })["catch"](function (err) {
      reject("Could not Connect to the Server (" + err + ")");
    });
  });
};

Supplier.getByNameAndCategory = function (info) {
  return new _bluebird["default"](function (resolve, reject) {
    Supplier.findOne({
      where: {
        name: info.name,
        category: info.category
      }
    }).then(function (foundSupplier) {
      resolve(foundSupplier);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Supplier.getById = function (id) {
  return new _bluebird["default"](function (resolve, reject) {
    Supplier.findAll({
      where: {
        id: id
      },
      attributes: ['id', 'name']
    }).then(function (foundSupplier) {
      //var supplierMap = foundSupplier.map(values => {return new Map(values.id,values.name)});
      var supplierMap = new Map();
      foundSupplier.map(function (values) {
        return supplierMap.set(values.id, values.name);
      });
      resolve(supplierMap);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

Supplier.getStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var name, phone, email, category, brand, suppliers;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Supplier.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `name`'), 'name']]
              }).then(function (values) {
                name = values;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 2:
              _context.next = 4;
              return Supplier.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `phone`'), 'phone']]
              }).then(function (values) {
                phone = values;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 4:
              _context.next = 6;
              return Supplier.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `email`'), 'email']]
              }).then(function (values) {
                email = values;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 6:
              _context.next = 8;
              return Supplier.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `category`'), 'category']]
              }).then(function (values) {
                category = values;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 8:
              _context.next = 10;
              return Supplier.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `brand`'), 'brand']]
              }).then(function (values) {
                brand = values;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 10:
              suppliers = {
                names: name,
                phones: phone,
                emails: email,
                categories: category,
                brands: brand
              };
              resolve(suppliers);

            case 12:
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

Supplier.getSupplierNames = function (brakes) {
  return new _bluebird["default"](function (resolve, reject) {
    var values = brakes.rows.map(function (a) {
      return a.supplierId;
    });
    Supplier.getById(values).then(function (supplierNames) {
      brakes.rows.map(function (value) {
        return value.setDataValue('supplierName', supplierNames.get(value.supplierId));
      });
      resolve("completed");
    });
  });
};

var _default = Supplier;
exports["default"] = _default;