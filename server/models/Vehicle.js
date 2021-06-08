import _ from 'lodash';
import bcrypt from 'bcrypt';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';

import sequelize from '../mySQLDB';

const mappings = {
  dateAdded: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false, 
  },
  year: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false, 
  },
  plate: {
    type: Sequelize.DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  chassis: {
    type: Sequelize.DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  kmDriven: {
    type: Sequelize.DataTypes.DOUBLE,
    allowNull: true,
  },
  kmForOilChange: {
    type: Sequelize.DataTypes.DOUBLE,
    allowNull: true, 
  },
  oilType: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false, 
  },
  createdAt: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true,
  }
};

const Vehicle = sequelize.define('vehicle_stocks', mappings, {
  indexes: [
    {
      name: 'vehicle_dateAdded_index',
      method: 'BTREE',
      fields: ['dateAdded'],
    },
    {
      name: 'vehicle_category_index',
      method: 'BTREE',
      fields: ['category'],
    },
    {
      name: 'vehicle_brand_index',
      method: 'BTREE',
      fields: ['brand'],
    },
    {
      name: 'vehicle_model_index',
      method: 'BTREE',
      fields: ['model'],
    },
    {
      name: 'vehicle_year_index',
      method: 'BTREE',
      fields: ['year'],
    },
    {
      name: 'vehicle_plat_index',
      method: 'BTREE',
      fields: ['plate'],
    },
    {
      name: 'vehicle_chassis_index',
      method: 'BTREE',
      fields: ['chassis'],
    },
    {
      name: 'vehicle_kmDriven_index',
      method: 'BTREE',
      fields: ['kmDriven'],
    },
    {
      name: 'vehicle_kmForOilChange_index',
      method: 'BTREE',
      fields: ['kmForOilChange'],
    },
    {
      name: 'vehicle_oilType_index',
      method: 'BTREE',
      fields: ['oilType'],
    },
    {
      name: 'user_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'user_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
  ],
});

Vehicle.addVehicle = (createVehicled) => {
  const newVehicle = 
  {
    dateAdded: createVehicled.dateAdded,
    category: createVehicled.cateogry,
    brand: createVehicled.brand,
    model: createVehicled.model,
    year: createVehicled.year,
    plate: createVehicled.plate,
    chassis: createVehicled.chassis,
    kmDriven: createVehicled.kmDriven,
    kmForOilChange: createVehicled.kmForOilChange,
    oilType: createVehicled.oilType
  }

  return new Promise((resolve, reject) => {
    Vehicle.getVehicleByPlate(newVehicle.plate).then(isExists =>
      {
        if(isExists){
          reject ("Vehicle Plate # " + newVehicle.plate + " Already Exists");
        }else{
          console.log("Added");
          resolve(Vehicle.create(newVehicle));
        }
      });
  });
}

Vehicle.getVehicleByPlate = plate => Vehicle.findOne({
  where:{plate}
});
export default Vehicle;