import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
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

Brake.getBrakeStock = async () =>{
    var brakeC, brakeCategory, brakeCBrand, brakeCYear, brakeCChassis, brakeBrand, brakePBrand, brakeQuantity;
    await Consumable.getSpecific("brake").then(consumables => {
        console.log(consumables);
        brakeC = consumables
    });
    
    await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `category`'), 'category']],raw:true, nest:true}).then(category => {
        brakeCategory = category 
        console.log("B = " + JSON.stringify(brakeCategory));
    });

    await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `carBrand`'), 'carBrand']]}).then(spec => {
        brakeCBrand = spec
        
    });
    await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `carYear`'), 'carYear']]}).then(spec => {
        brakeCYear = spec
    });

    await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `chassis`'), 'chassis']]}).then(spec => {
        brakeCChassis = spec
        
    });
    await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `bBrand`'), 'bBrand']]}).then(spec => {
        brakeBrand = spec
    });

    await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `preferredBrand`'), 'preferredBrand']]}).then(spec => {
        brakePBrand = spec
        
    });
    await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `quantity`'), 'quantity']]}).then(spec => {
        brakeQuantity = spec
    });

    var values = {
        consumable: brakeC.rows, brakeCategory: brakeCategory, brakeCBrand: brakeCBrand, brakeCYear: brakeCYear,
        brakeCChassis: brakeCChassis, brakeBrand: brakeBrand, brakePBrand: brakePBrand, brakeQuantity: brakeQuantity
    };

    return values;

}


export default Brake;