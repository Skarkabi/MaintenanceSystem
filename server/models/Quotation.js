import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../mySQLDB';
import e, { response } from 'express';
import Supplier from './Supplier';
import multer from 'multer';
import fs from 'fs';

const mappings = {
    quotationNumber: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true
    },
    quotationPath: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
}

const Quotation = sequelize.define('Quotations', mappings, {
    indexes: [
        {
            name: 'quotation_quotationNumber_index',
            method: 'BTREE',
            fields:['quotationNumber']
        },
        {
            name: 'quotation_quotationPath_index',
            method: 'BTREE',
            fields:['quotationPath']
        },
        {
            name: 'quotation_createdAt_index',
            method: 'BTREE',
            fields: ['createdAt'],
          },
          {
            name: 'quotation_updatedAt_index',
            method: 'BTREE',
            fields: ['updatedAt'],
          },
    ]
});

const DIRECTORY = "./server/uploads";
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB file limit.

Quotation.uploadFile = () => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './server/uploads')
        },
        filename: function (req, file, cb) {
          console.log("FILE");
          console.log(req)
          cb(null, req.body.quotation)
        }
      })
      
      var upload = multer({ storage: storage })
      return upload;
}

Quotation.addQuotation = newQuotation => {
    Quotation.create(newQuotation);
}

Quotation.getQuotation = quotationNumber => {
    return new Bluebird((resolve, reject) => {
        Quotation.findOne({
            where: {
                quotationNumber: quotationNumber
            }
        }).then(foundQuotation => {
            resolve(foundQuotation.quotationPath);
        }).catch(err => {
            reject(err);
        });
    });
}

export default Quotation;