import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../mySQLDB';
import multer from 'multer';

/**
 * Declaring the datatypes used within the Quotation class
 */
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

/**
 * Defining the quotation table within the MySQL database using Sequelize
 */
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


/**
 * Function to upload pdf file to server using multer
 * @returns the uploaded file
 */
Quotation.uploadFile = () => {
    //Declating the multer storage variable
    var storage = multer.diskStorage({
        //Setting the upload destination
        destination: function (req, file, cb) {
          cb(null, './server/uploads')

        },
        //Setting the upload name
        filename: function (req, file, cb) {
          console.log("FILE");
          console.log(req)
          cb(null, req.body.quotation + ".pdf")

        }
      })
      
      //Declaring the multer storage variable
      var upload = multer({ storage: storage })

      return upload;

}

/**
 * Function to add new Quotation name and path to database
 * @param {*} newQuotation 
 */
Quotation.addQuotation = newQuotation => {
    Quotation.create(newQuotation);

}

/**
 * Function to retrieve quotation path from database
 * @param {*} quotationNumber 
 * @returns path to where the quotation exists
 */
Quotation.getQuotation = quotationNumber => {
    return new Bluebird((resolve, reject) => {
        //Checking if the quotation number exists
        Quotation.findOne({
            where: {
                quotationNumber: quotationNumber
            }
        
        //If quotation exists return its path 
        }).then(foundQuotation => {
            resolve(foundQuotation.quotationPath);

        //If dosent exists return error    
        }).catch(err => {
            reject(err);
        });
    });
}

export default Quotation;