import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../../mySQLDB';
import Brake from './Brake';
import Battery from './Battery';
import Filter from './Filter';
import Grease from './Grease';
import Oil from './Oil';
import Consumable from '../Consumables';
import MaintenanceOrder from '../MaintenanceOrder';
import Supplier from '../Supplier';
import Other from './Other';
import MaintenanceConsumables from './MaintenanceConsumables';

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    other_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    singleCost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    totalCost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    details: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    supplierId:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    supplierName:{
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.STRING, ['supplierName']),
    },
    quotationNumber:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    materialRequestNumber:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    maintenanceReq:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    }
}

const NonStockConsumables = sequelize.define('non_stock_others', mappings, {
    indexes: [
        {
            name: 'non_stock_other_id_index',
            method: 'BTREE',
            fields: ['id'],
        },
        {
            name: 'non_stock_other_other_name_index',
            method: 'BTREE',
            fields: ['other_name']
        },
        {
            name: 'non_stock_other_quantity_index',
            method: 'BTREE',
            fields: ['quantity'],
        },
        {
            name: 'non_stock_other_singleCost_index',
            method: 'BTREE',
            fields: ['singleCost']
        },
        {
            name: 'non_stock_other_totalCost_index',
            method: 'BTREE',
            fields: ['totalCost']
        },
        {
            name: 'non_stock_other_details_index',
            method: 'BTREE',
            fields: ['details']
        },
        {
            name: 'non_stock_other_createdAt_index',
            method: 'BTREE',
            fields: ['createdAt'],
        },
        {
            name: 'non_stock_other_updatedAt_index',
            method: 'BTREE',
            fields: ['updatedAt'],
        },
        {
            name: 'non_stock_other_supplierId_index',
            method: 'BTREE',
            fields: ['supplierId']
        },
        {
            name: 'non_stock_other_quotationNumber_index',
            method: 'BTREE',
            fields: ['quotationNumber']
        },
        {
            name: 'non_stock_other_materialRequestNumber_index',
            method: 'BTREE',
            fields: ['materialRequestNumber']
        },
        {
            name: 'non_stock_other_maintenanceReq_index',
            method: 'BTREE',
            fields: ['maintenanceReq']
        }
    ]
});

NonStockConsumables.addNewConsumable = newConsumable => {
    return new Bluebird((resolve, reject) => {
        NonStockConsumables.create(newConsumable).then(consumable => {
            newConsumable.id = consumable.id;
            MaintenanceConsumables.useNonStockConsumable(newConsumable) .then(() => {
                resolve("Added to Database");
            })
        })
    })
    
}

export default NonStockConsumables;