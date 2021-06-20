import Bluebird from 'bluebird';
import _ from 'lodash';
import Sequelize from 'sequelize';

import sequelize from '../mySQLDB';

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

Supplier.addSupplier = (newSupplier) => {
    return new Bluebird((resolve, reject) => {
        var supplierInfo = {name: newSupplier.name, category: newSupplier.category};
        Supplier.getByNameAndCategory(supplierInfo).then(isSupplier => {
            if(isSupplier){
                reject("This Supplier Already Exists");

            }else{
                Supplier.create(newSupplier).then(() => {
                    resolve("New Supplier " + newSupplier.name + " Was Sucessfully Added to the System!");

                }).catch(err => {
                    reject("An Error has Occured, Supplier " + newSupplier.name + " Could not be Added to the System (" + err + ")");

                })
            }

        }).catch(err => {
            reject("Could not Connect to the Server (" + err + ")");

        });
    })
}

Supplier.getByNameAndCategory = info => {
    return new Bluebird((resolve, reject) => {
        Supplier.findOne({
            where: {
                name: info.name,
                category: info.category,
            }

        }).then(foundSupplier => {
            resolve(foundSupplier);

        }).catch(err => {
            reject(err);

        });

    });

}

Supplier.getById = id => {
    return new Bluebird((resolve, reject) => {
        Supplier.findOne({
            where: {
                id: id
            }
        }).then(foundSupplier => {
            resolve(foundSupplier);

        }).catch(err => {
            reject(err);

        })
    })
}

Supplier.getStock = () => {
    return new Bluebird(async (resolve, reject) => {
        var name, phone, email, category, brand;
        await Supplier.findAll({attributes: [[Sequelize.literal('DISTINCT `name`'), 'name']]}).then(values => {
            name = values;

        }).catch(() => {
            reject("Error Connecting to the Server");

        });

        await Supplier.findAll({attributes: [[Sequelize.literal('DISTINCT `phone`'), 'phone']]}).then(values => {
            phone = values;

        }).catch(() => {
            reject("Error Connecting to the Server");

        });

        await Supplier.findAll({attributes: [[Sequelize.literal('DISTINCT `email`'), 'email']]}).then(values => {
            email = values;

        }).catch(() => {
            reject("Error Connecting to the Server");

        });

        await Supplier.findAll({attributes: [[Sequelize.literal('DISTINCT `category`'), 'category']]}).then(values => {
            category = values;

        }).catch(() => {
            reject("Error Connecting to the Server");

        });

        await Supplier.findAll({attributes: [[Sequelize.literal('DISTINCT `brand`'), 'brand']]}).then(values => {
            brand = values;

        }).catch(() => {
            reject("Error Connecting to the Server");

        });

        var suppliers = {names: name, phones: phone, emails: email, categories: category, brands: brand};
        resolve(suppliers);
    })
}

export default Supplier;