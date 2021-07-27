import Bluebird from 'bluebird';
import _ from 'lodash';
import Sequelize from 'sequelize';
import sequelize from '../mySQLDB';

/**
 * Declaring the datatypes used within the Battery class
 */
const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    phone: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    category: {
        type: Sequelize.STRING,
        allowNull: false
    },

    brand: {
        type: Sequelize.STRING,
        allowNull: false
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
 * Defining the supplier table within the MySQL database using Sequelize
 */
const Supplier = sequelize.define('Suppliers', mappings, {
    indexes: [
        {
            name: 'supplier_id_index',
            method: 'BTREE',
            fields: ['id'],
        },
        {
            name: 'supplier_name_index',
            method: 'BTREE',
            fields: ['name'],
        },
        {
            name: 'supplier_phone_index',
            method: 'BTREE',
            fields: ['phone'],
        },
        {
            name: 'supplier_email_index',
            method: 'BTREE',
            fields: ['email'],
        },
        {
            name: 'supplier_category_index',
            method: 'BTREE',
            fields: ['category'],
        },
        {
            name: 'supplier_brand_index',
            method: 'BTREE',
            fields: ['brand'],
        },
        {
            name: 'supplier_createdAt_index',
            method: 'BTREE',
            fields: ['createdAt'],
          },
          {
            name: 'supplier_updatedAt_index',
            method: 'BTREE',
            fields: ['updatedAt'],
          },
    ]

});

/**
 * Function to add a new suppleir into database
 * Function takes an object with the needed supplier info
 * @param {*} newSupplier 
 * @returns msg to flash for the user
 */
Supplier.addSupplier = (newSupplier) => {
    return new Bluebird((resolve, reject) => {
        //Declating variable to represent the supplier
        var supplierInfo = {name: newSupplier.name, category: newSupplier.category};
        //Checking if supplier exists in database
        Supplier.getByNameAndCategory(supplierInfo).then(isSupplier => {
            //If Supplier Exists reject user input
            if(isSupplier){
                reject("This Supplier Already Exists");

            //If supplier doesn't exist add new supplier to database
            }else{
                Supplier.create(newSupplier).then(() => {
                    resolve("New Supplier " + newSupplier.name + " Was Sucessfully Added to the System!");

                }).catch(err => {
                    reject("An Error has Occured, Supplier " + newSupplier.name + " Could not be Added to the System (" + err + ")");

                });

            }

        }).catch(err => {
            reject("Could not Connect to the Server (" + err + ")");

        });

    });

}

/**
 * Function to get requested supplier from database
 * @param {*} info 
 * @returns found supplier
 */
Supplier.getByNameAndCategory = info => {
    return new Bluebird((resolve, reject) => {
        //Getting the requested supplier 
        Supplier.findOne({
            where: {
                name: info.name,
                category: info.category,
            }

        //If supplier found it is returned
        }).then(foundSupplier => {
            resolve(foundSupplier);

        //If not found return error
        }).catch(err => {
            reject(err);

        });

    });

}

/**
 * Function to get supplier info by supplier ID
 * @param {*} id 
 * @returns list of supplier names with their ids
 */
Supplier.getById = id => {
    return new Bluebird((resolve, reject) => {
        //Getting all suppleirs with requested id
        Supplier.findAll({
            where: {
                id: id
            },

            //Declating attributes to return
            attributes:['id', 'name']

        }).then(foundSupplier => {
            //Create a map of names and id to be returned
            var supplierMap = new Map();
            //Mapping the found supplier's id and name
            foundSupplier.map(values => {
                return supplierMap.set(values.id, values.name)

            });
            
            resolve(supplierMap);

        }).catch(err => {
            reject(err);

        });

    });

}

/**
 * function to return distinct values in object
 * @param {*} values 
 * @returns filtered values 
 */
 function getDistinct(values){
    return values.filter((value, index, self) => self.indexOf(value) === index);
}

/**
 * Function to return list of distinct supplier values found within the database
 * @returns object that includes all distinct values of suppliers
 */
Supplier.getStock = () => {
    return new Bluebird((resolve, reject) => {
        //Declaring all variables to be returned
        var name, phone, email, category, brand;
        //Getting all suppliers saved in database
        Supplier.findAll().then(values => {
             //Mapping supplier values to not return double values
            name = getDistinct(values.map(val => val.name));
            phone = getDistinct(values.map(val => val.phone));
            email = getDistinct(values.map(val => val.email));
            category = getDistinct(values.map(val => val.category));
            brand = getDistinct(values.map(val => val.brand));

            //Creating variable of all need variables to return
            var suppliers = {
                names: name, phones: phone, emails: email, 
                categories: category, brands: brand
            };
            resolve(suppliers);

        }).catch(() => {
            reject("Error Connecting to the Server");

        });
    
    });
}

/**
 * Function to set virtual datatype supplier name of consumables
 * @param {*} consumable 
 * @returns list of consumables with their supplier names
 */
Supplier.getSupplierNames = (consumable) => {
    return new Bluebird((resolve, reject) => {
        //Initializing variable of distinct supplier IDs
        let values = consumable.rows.map(a => a.supplierId);
        //Getting suppliers from the database
        Supplier.getById(values).then(supplierNames => {
            //Setting virtual datatype supplier name
            consumable.rows.map(value => {
                return value.setDataValue('supplierName', supplierNames.get(value.supplierId));

            });

            resolve("completed");

        }).catch(err => {
            reject(err);

        });
            
    });

}

export default Supplier;