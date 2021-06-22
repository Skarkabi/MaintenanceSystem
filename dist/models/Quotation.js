"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var _express = _interopRequireWildcard(require("express"));

var _Supplier = _interopRequireDefault(require("./Supplier"));

var _multer = _interopRequireDefault(require("multer"));

var _fs = _interopRequireDefault(require("fs"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var mappings = {
  quotationNumber: {
    type: _sequelize["default"].DataTypes.STRING,
    primaryKey: true
  },
  quotationPath: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: true
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

var Quotation = _mySQLDB["default"].define('Quotations', mappings, {
  indexes: [{
    name: 'quotation_quotationNumber_index',
    method: 'BTREE',
    fields: ['quotationNumber']
  }, {
    name: 'quotation_quotationPath_index',
    method: 'BTREE',
    fields: ['quotationPath']
  }, {
    name: 'quotation_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'quotation_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

var DIRECTORY = "./server/uploads";
var MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB file limit.

Quotation.uploadFile = function () {
  var storage = _multer["default"].diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, './server/uploads');
    },
    filename: function filename(req, file, cb) {
      console.log("FILE");
      console.log(req);
      cb(null, req.body.quotation);
    }
  });

  var upload = (0, _multer["default"])({
    storage: storage
  });
  return upload;
};

Quotation.addQuotation = function (newQuotation) {
  Quotation.create(newQuotation);
};

Quotation.getQuotation = function (quotationNumber) {
  return new _bluebird["default"](function (resolve, reject) {
    Quotation.findOne({
      where: {
        quotationNumber: quotationNumber
      }
    }).then(function (foundQuotation) {
      resolve(foundQuotation.quotationPath);
    })["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Quotation;
exports["default"] = _default;