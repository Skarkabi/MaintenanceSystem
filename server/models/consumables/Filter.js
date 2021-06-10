import _ from 'lodash';
import Sequelize from 'sequelize';

import sequelize from '../../mySQLDB';

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    carBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carModel:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carYear:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    category:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    fType:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    preferredBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    actualBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    singleCost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    totalCost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    quantity:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
    },
    minQuantity:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },
};

const Filter = sequelize.define('filter_stocks', mappings, {
    
    indexes: [
    {
      name: 'filter_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    
    {
      name: 'filter_quantity_index',
      method: 'BTREE',
      fields: ['quantity'],
    },
    
    {
        name: 'filter_carBrand_index',
        method: 'BTREE',
        fields: ['carBrand'],
    },
    
    {
        name: 'filter_carYear_index',
        method: 'BTREE',
        fields: ['carYear'],
    },
    
    {
        name: 'filter_carModel_index',
        method: 'BTREE',
        fields: ['carModel'],
    },
    
    {
        name: 'filter_fType_index',
        method: 'BTREE',
        fields: ['fType'],
    },
    
    {
        name: 'filter_preferredBrand_index',
        method: 'BTREE',
        fields: ['preferredBrand'],
    },
    
    {
        name: 'filter_actualBrand_index',
        method: 'BTREE',
        fields: ['actualBrand'],
    },
    
    {
        name: 'filter_category_index',
        method: 'BTREE',
        fields: ['category'],
    },
    {
        name: 'filter_singleCost_index',
        method: 'BTREE',
        fields: ['singleCost'],
    },
    {
        name: 'filter_totalCost_index',
        method: 'BTREE',
        fields: ['totalCost'],
    },
    {
        name: 'filter_minQuantity_index',
        method: 'BTREE',
        fields: ['minQuantity'],
    },
    {
      name: 'filter_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'filter_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
  ],
});


export default Filter;