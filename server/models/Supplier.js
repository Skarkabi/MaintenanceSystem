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

    model: {
        type: Sequelize.STRING,
        allowNull: false
    },

    notification: {
        type: Sequelize.BOOLEAN,
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
            name: 'supplier_model_index',
            method: 'BTREE',
            fields: ['model'],
        },
        {
            name: 'supplier_notification_index',
            method: 'BTREE',
            fields: ['notification'],
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

export default Supplier;