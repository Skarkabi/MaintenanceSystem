import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';

import sequelize from '../mySQLDB';
import MaintenanceOrder from './MaintenanceOrder';

/**
 * Declaring the datatypes used within the Vehicle class
 */
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
  work_orders: {
    type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['work_orders']),
  },
  work_orders_cost: {
    type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.DOUBLE, ['work_orders_cost']),
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

/**
 * Defining the vehicel stocks table within the MySQL database using Sequelize
 */
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

/**
 * Function to add vehicle in vehicle stock
 * Function takes vehicle data and adds it into the database
 * @param {*} createVehicled 
 * @returns msg to be flashed to user
 */
Vehicle.addVehicle = (createVehicled) => {
  console.log("adding");
  const newVehicle = 
  //Creating the vehicle to be added in the database
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
    //Check if the vehicle plate number already exists in database
    Vehicle.findOne({where: {plate: newVehicle.plate}}).then(isVehicle => {
      console.log(isVehicle)
      //If vehicle plate number exists reject user input
      if (isVehicle){
        reject("Vehicle With Plate# " + newVehicle.plate + " Already Exists");

      }else{
        console.log(newVehicle);
        //If vehicle plate number doesn't exist add to database
        Vehicle.create(newVehicle).then(() => {
          resolve("Vehicle With Plate# " + newVehicle.plate + " Was Sucessfully Added!");

        }).catch(err => {
          reject("Vehicle With Plate# " + newVehicle.plate + " Could Not Be Added " + err);

        });

      }

    }).catch(() => {
      reject("Could not Connect to the Server");
    
    });  

  });

}

/**
 * Function to get vehicle from database by plate number
 * @param {*} plate 
 * @returns found vehicle
 */
Vehicle.getVehicleByPlate = plate => {
  return new Bluebird((resolve, reject) => {
    Vehicle.findOne({
      where: {
        plate: plate
      }
    }).then(found => {
        MaintenanceOrder.getOrdersByPlate(plate).then(orders => {
          if(orders){
            found.setDataValue('work_orders', orders);
            found.setDataValue('work_orders_cost', maintenanceCost(orders));
          }
         
          resolve(found);
        }).catch(err => {
          reject (err);
        })
        
    }).catch(err => {
      reject(err);
    })
  })
}

function maintenanceCost(orders){
  var sum = 0;
  orders.map(o => {
      sum = sum + o.total_cost
  });
 
  return sum;
}
  

/**
 * Function to delete vehicle from database by its plate and chassis number
 * @param {*} info 
 * @returns msh to flash to user
 */
Vehicle.deleteVehicleByPlateAndChassis = info => {
  return new Bluebird ((resolve, reject) => {
    //Checking if vehicle exists
    Vehicle.getVehicleByPlate(info.plate).then(foundVehicle => {
      //If vehicle exists delete it from database
      foundVehicle.destroy();
      resolve("Vehicle Plate# " + info.plate + " Chassis# " + info.chassis + " Was Sucessfully Removed From the System!");

    }).catch(err => {
      //If vehicle doesn't exist reject user request
      reject("An Error has Occured User with Employee ID# " + id + " Could not be Deleted " + err);

    });

  });

}

/**
 * Function to get all vehicles from database
 * @returns object with number of vehicles and list of vehicles
 */
Vehicle.getStock =() => {
  return new Bluebird((resolve, reject) => {
    //Getting all vehicles from database
    Vehicle.findAndCountAll({order: [
      ['year', 'ASC'],
  ],}).then(vehicle => {
      resolve(vehicle);

    }).catch(err => {
      reject(err);

    });

  });

}

Vehicle.getMappedStock = () => {
  return new Bluebird((resolve, reject) => {
    Vehicle.getStock().then(async vehicles => {
      var vehicleMap = [];
        await Promise.all(vehicles.rows.map(vehicle => {
          vehicleMap.push(vehicle);
        }));
        resolve(vehicleMap);
    })
  })
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
 * Function to return list of vehicles distinct values found within the database
 * @returns object that includes all distinct values of each vehicle spec
 */
Vehicle.getVehicleStock = () => {
  return new Bluebird((resolve, reject) => {
    //Declaring all variables to be returned
    var category, brand, model, year, plate, chassis, oilType;
    //Getting all vehicles from database
    Vehicle.getStock().then(vehicles => {
      //Mapping vehicle values to not return double values
      category = getDistinct(vehicles.rows.map(val => val.category));
      brand = getDistinct(vehicles.rows.map(val => val.brand));
      model = getDistinct(vehicles.rows.map(val => val.model));
      year = getDistinct(vehicles.rows.map(val => val.year));
      plate = getDistinct(vehicles.rows.map(val => val.plate));
      chassis = getDistinct(vehicles.rows.map(val => val.chassis));
      oilType = getDistinct(vehicles.rows.map(val => val.oilType));

      //Creating variable of all need variables to return
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
 
  return today;
}

export default Vehicle;