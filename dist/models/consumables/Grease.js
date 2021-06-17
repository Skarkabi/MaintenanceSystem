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
  greaseSpec: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  typeOfGrease: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carBrand: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  carYear: {
    type: _sequelize["default"].DataTypes.STRING,
    allowNull: false
  },
  volume: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
  },
  minVolume: {
    type: _sequelize["default"].DataTypes.DOUBLE,
    allowNull: false
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

var Grease = _mySQLDB["default"].define('grease_stocks', mappings, {
  indexes: [{
    name: 'grease_id_index',
    method: 'BTREE',
    fields: ['id']
  }, {
    name: 'grease_volume_index',
    method: 'BTREE',
    fields: ['volume']
  }, {
    name: 'grease_minVolume_index',
    method: 'BTREE',
    fields: ['minVolume']
  }, {
    name: 'grease_greaseSpec_index',
    method: 'BTREE',
    fields: ['greaseSpec']
  }, {
    name: 'grease_carBrand_index',
    method: 'BTREE',
    fields: ['carBrand']
  }, {
    name: 'grease_carYear_index',
    method: 'BTREE',
    fields: ['carYear']
  }, {
    name: 'grease_typeOfGrease_index',
    method: 'BTREE',
    fields: ['typeOfGrease']
  }, {
    name: 'grease_createdAt_index',
    method: 'BTREE',
    fields: ['createdAt']
  }, {
    name: 'grease_updatedAt_index',
    method: 'BTREE',
    fields: ['updatedAt']
  }]
});

Grease.updateGrease = function (newGrease, action) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Grease",
      quantity: newGrease.volume
    };
    Grease.findOne({
      where: {
        id: newGrease.id
      }
    }).then(function (foundGrease) {
      var quant;

      if (action === "add") {
        quant = parseFloat(newGrease.volume) + foundGrease.volume;
      } else if (action === "delet") {
        quant = foundGrease.volume - parseFloat(newGrease.volume);
      }

      if (quant === 0) {
        foundGrease.destroy().then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            resolve(newGrease.volume + " Liters Of Grease Sucessfully Deleted from Existing Stock!");
          })["catch"](function (err) {
            reject("An Error Occured Grease Could not be Deleted");
          });
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Deleted");
        });
      } else if (quant < 0) {
        reject("Can Not Delete More Than Exists in Stock!");
      } else {
        Grease.update({
          volume: quant
        }, {
          where: {
            id: newGrease.id
          }
        }).then(function () {
          _Consumables["default"].updateConsumable(newConsumable, action).then(function () {
            resolve(newGrease.volume + " Liters of Grease Sucessfully Added to Existing Stock!");
          })["catch"](function (err) {
            reject("An Error Occured Grease Could not be Added " + err);
          });
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Added " + err);
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Grease Could not be Added " + err);
    });
  });
};

Grease.addGrease = function (newGrease) {
  return new _bluebird["default"](function (resolve, reject) {
    var newConsumable = {
      category: "Grease",
      quantity: newGrease.volume
    };
    Grease.findOne({
      where: {
        greaseSpec: newGrease.greaseSpec,
        typeOfGrease: newGrease.typeOfGrease,
        carBrand: newGrease.carBrand,
        carYear: newGrease.carYear
      }
    }).then(function (foundGrease) {
      if (foundGrease) {
        reject("Grease With these Details Already Registered, Please Add to Existing Stock");
      } else {
        newGrease.volume = parseFloat(newGrease.volume);
        newGrease.minVolume = parseFloat(newGrease.minVolume);
        Grease.create(newGrease).then(function () {
          _Consumables["default"].addConsumable(newConsumable).then(function () {
            resolve(newGrease.volume + " Liters of Greace Sucessfully Added!");
          })["catch"](function (err) {
            reject("An Error Occured Grease Could not be Added");
          });
        })["catch"](function (err) {
          reject("An Error Occured Grease Could not be Added");
        });
      }
    })["catch"](function (err) {
      reject("An Error Occured Grease Could not be Added");
    });
  });
};

Grease.getGreaseStock = function () {
  return new _bluebird["default"]( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      var greaseC, greaseSpec, typeOfGrease, carBrand, carYear, values;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _Consumables["default"].getSpecific("grease").then(function (consumables) {
                greaseC = consumables;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 2:
              _context.next = 4;
              return Grease.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `greaseSpec`'), 'greaseSpec']],
                raw: true,
                nest: true
              }).then(function (spec) {
                greaseSpec = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 4:
              _context.next = 6;
              return Grease.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `typeOfGrease`'), 'typeOfGrease']],
                raw: true,
                nest: true
              }).then(function (spec) {
                typeOfGrease = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 6:
              _context.next = 8;
              return Grease.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carBrand`'), 'carBrand']],
                raw: true,
                nest: true
              }).then(function (spec) {
                carBrand = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 8:
              _context.next = 10;
              return Grease.findAll({
                attributes: [[_sequelize["default"].literal('DISTINCT `carYear`'), 'carYear']],
                raw: true,
                nest: true
              }).then(function (spec) {
                carYear = spec;
              })["catch"](function () {
                reject("Error Connecting to the Server");
              });

            case 10:
              values = {
                consumables: greaseC.rows,
                specs: greaseSpec,
                typeOfGrease: typeOfGrease,
                carBrand: carBrand,
                carYear: carYear
              };
              resolve(values);

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

var _default = Grease;
exports["default"] = _default;