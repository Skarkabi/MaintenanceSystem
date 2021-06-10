import _ from 'lodash';
import Sequelize from 'sequelize';

import sequelize from '../../mySQLDB';

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carYear:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    bBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    preferredBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    chassis:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false,
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

const Brake = sequelize.define('brake_stocks', mappings, {
  indexes: [
    {
      name: 'brake_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'brake_quantity_index',
      method: 'BTREE',
      fields: ['quantity'],
    },
    {
        name: 'brake_carBrand_index',
        method: 'BTREE',
        fields: ['carBrand']
    },
    {
        name: 'brake_carYear_index',
        method: 'BTREE',
        fields: ['carYear']
    },
    {
        name: 'brake_chassis_index',
        method: 'BTREE',
        fields: ['chassis']
    },
    {
        name: 'brake_bBrand_index',
        method: 'BTREE',
        fields: ['bBrand']
    },
    {
        name: 'brake_preferredBrand_index',
        method: 'BTREE',
        fields: ['preferredBrand']
    },
    {
        name: 'brake_singleCost_index',
        method: 'BTREE',
        fields: ['singleCost']
    },
    {
        name: 'brake_totalCost_index',
        method: 'BTREE',
        fields: ['totalCost']
    },
    {
        name: 'brake_minQuantity_index',
        method: 'BTREE',
        fields: ['minQuantity']
    },
    {
      name: 'brake_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'brake_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
  ],
});

export default Brake;