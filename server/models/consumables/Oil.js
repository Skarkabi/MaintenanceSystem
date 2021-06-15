import _ from 'lodash';
import Sequelize from 'sequelize';

import sequelize from '../../mySQLDB';
import Consumable from '../Consumables';

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    oilSpec: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    typeOfOil: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    volume:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull:false,
    },
    minVolume:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false
    },
    preferredBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false  
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },
}

const Oil = sequelize.define('oil_stocks', mappings, {
  indexes: [
    {
      name: 'oil_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'oil_volume_index',
      method: 'BTREE',
      fields: ['volume'],
    },
    {
        name: 'oil_minVolume_index',
        method: 'BTREE',
        fields: ['minVolume'],
      },
    {
        name: 'oil_oilSpec_index',
        method: 'BTREE',
        fields: ['oilSpec']
    },
    {
        name: 'oil_typeOfOil_index',
        method: 'BTREE',
        fields: ['typeOfOil']
    },
    {
      name: 'oil_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'oil_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
  ],
});

Oil.getOilStock = async () => {
  var oilC, oilSpecs, typeOfOils, preferredBrands
  await Consumable.getSpecific("oil").then(consumables => {
    oilC = consumables;
  });

  await Oil.findAll({attributes: [[Sequelize.literal('DISTINCT `oilSpec`'), 'oilSpec']],raw:true, nest:true}).then(spec => {
    oilSpecs = spec
  });

  await Oil.findAll({attributes: [[Sequelize.literal('DISTINCT `typeOfOil`'), 'typeOfOil']],raw:true, nest:true}).then(spec => {
    typeOfOils = spec
  });

  await Oil.findAll({attributes: [[Sequelize.literal('DISTINCT `preferredBrand`'), 'preferredBrand']],raw:true, nest:true}).then(spec => {
    preferredBrands = spec
  });

  var values = {
    consumables: oilC.rows, specs: oilSpecs, typeOfOils: typeOfOils, preferredBrands: preferredBrands
  };

  return values;
}

export default Oil;