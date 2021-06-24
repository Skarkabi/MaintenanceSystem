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
  },
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
    dateAdded: taskDate(),
    category: createVehicled.category,
    brand: createVehicled.brand,
    model: createVehicled.model,
    year: createVehicled.year,
    plate: createVehicled.plate,
    chassis: createVehicled.chassis,
    kmDriven: createVehicled.kmDrive,
    kmForOilChange: createVehicled.kmTillOilChange,
    oilType: createVehicled.oilType
  }


  return new Bluebird ((resolve, reject) => {
    Vehicle.getVehicleByPlate(newVehicle.plate).then(isVehicle => {
      if (isVehicle){
        reject("Vehicle With Plate# " + newVehicle.plate + " Already Exists");

      }else{
        Vehicle.create(newVehicle).then(() => {
          resolve("Vehicle With Plate# " + newVehicle.plate + " Was Sucessfully Added!");

        }).catch(err => {
          reject("Vehicle With Plate# " + newVehicle.plate + " Could Not Be Added");

        });

      }

    }).catch(() => {
      reject("Could not Connect to the Server");
    
    });  

  });

}

Vehicle.getVehicleByPlate = plate => Vehicle.findOne({
  where:{plate}
});

Vehicle.deleteVehicleByPlateAndChassis = info => {
  return new Bluebird ((resolve, reject) => {
    Vehicle.getVehicleByPlate(info.plate).then(foundVehicle => {
      foundVehicle.destroy();
      resolve("Vehicle Plate# " + info.plate + " Chassis# " + info.chassis + " Was Sucessfully Removed From the System!");

    }).catch(err => {
      reject("An Error has Occured User with Employee ID# " + id + " Could not be Deleted");

    });

  });

}

Vehicle.getStock =() => {
  return new Bluebird((resolve, reject) => {
    Vehicle.findAndCountAll().then(vehicle => {
      resolve(vehicle);

    }).catch(err => {
      reject(err);

    });

  });

}

function getDistinct(values){
  return values.filter((value, index, self) => self.indexOf(value) === index);
}

Vehicle.getVehicleStock = () => {
  return new Bluebird((resolve, reject) => {
    var category, brand, model, year, plate, chassis, oilType;
    Vehicle.getStock().then(vehicles => {
      category = getDistinct(vehicles.rows.map(val => val.category));
      brand = getDistinct(vehicles.rows.map(val => val.brand));
      model = getDistinct(vehicles.rows.map(val => val.model));
      year = getDistinct(vehicles.rows.map(val => val.year));
      plate = getDistinct(vehicles.rows.map(val => val.plate));
      chassis = getDistinct(vehicles.rows.map(val => val.chassis));
      oilType = getDistinct(vehicles.rows.map(val => val.oilType));

      var values = {
        category: category, brands: brand, models: model, years: year,
        plates: plate, chassis: chassis, oilTypes: oilType

      }

      resolve(values);

    }).catch(err => {
      reject("Error Connecting to the Server (" + err + ")");

    });

  }).catch(err => {
    reject("Error Connecting to the Server (" + err + ")");

  });

}

function taskDate() {
  var today = new Date();
  var dd = today.getDate();

  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 

  if(mm<10) 
  {
      mm='0'+mm;
  } 

  today = dd+'/'+mm+'/'+yyyy;
  console.log(today);
  return today;
}

export default Vehicle;