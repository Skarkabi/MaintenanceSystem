"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

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
    Supplier.findOne({
      where: {
        id: id
      }
    }).then(function (foundSupplier) {
      resolve(foundSupplier);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Supplier;
exports["default"] = _default;