"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _mySQLDB = _interopRequireDefault(require("../mySQLDB"));

var _multer = _interopRequireDefault(require("multer"));

/**
 * Declaring the datatypes used within the Quotation class
 */
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
/**
 * Defining the quotation table within the MySQL database using Sequelize
 */

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
/**
 * Function to upload pdf file to server using multer
 * @returns the uploaded file
 */


Quotation.uploadFile = function () {
  //Declating the multer storage variable
  var storage = _multer["default"].diskStorage({
    //Setting the upload destination
    destination: function destination(req, file, cb) {
      cb(null, './server/uploads');
    },
    //Setting the upload name
    filename: function filename(req, file, cb) {
      console.log("FILE");
      console.log(req);
      cb(null, req.body.quotation + ".pdf");
    }
  }); //Declaring the multer storage variable


  var upload = (0, _multer["default"])({
    storage: storage
  });
  return upload;
};
/**
 * Function to add new Quotation name and path to database
 * @param {*} newQuotation 
 */


Quotation.addQuotation = function (newQuotation) {
  Quotation.create(newQuotation);
};
/**
 * Function to retrieve quotation path from database
 * @param {*} quotationNumber 
 * @returns path to where the quotation exists
 */


Quotation.getQuotation = function (quotationNumber) {
  return new _bluebird["default"](function (resolve, reject) {
    //Checking if the quotation number exists
    Quotation.findOne({
      where: {
        quotationNumber: quotationNumber
      } //If quotation exists return its path 

    }).then(function (foundQuotation) {
      resolve(foundQuotation.quotationPath); //If dosent exists return error    
    })["catch"](function (err) {
      reject(err);
    });
  });
};

var _default = Quotation;
exports["default"] = _default;