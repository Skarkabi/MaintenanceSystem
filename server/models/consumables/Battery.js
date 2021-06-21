import _ from 'lodash';
import bcrypt from 'bcrypt';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import Consumable from '../Consumables'
import sequelize from '../../mySQLDB';
import e, { response } from 'express';
import Supplier from '../Supplier';

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    batSpec: {
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
    minQuantity:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false,
    },
    quantity:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
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

    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
};

const Battery = sequelize.define('battery_stocks', mappings, {
  indexes: [
    {
      name: 'battery_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'battery_quantity_index',
      method: 'BTREE',
      fields: ['quantity'],
    },
    {
        name: 'battery_batSpec_index',
        method: 'BTREE',
        fields: ['batSpec']
    },
    {
        name: 'battery_carBrand_index',
        method: 'BTREE',
        fields: ['carBrand']
    },
    {
        name: 'battery_carYear_index',
        method: 'BTREE',
        fields: ['carYear']
    },
    {
        name: 'battery_minQuantity_index',
        method: 'BTREE',
        fields: ['minQuantity']
    },
    {
      name: 'battery_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'battery_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
    {
        name: 'battery_supplierId_index',
        method: 'BTREE',
        fields: ['supplierId']
    },
    {
        name: 'battery_quotationNumber_index',
        method: 'BTREE',
        fields: ['quotationNumber']
    }
  ],
});

Battery.updateBattery = (newBattery, action) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Battery",
            quantity: newBattery.quantity
        };

        Battery.findOne({
            where: {id: newBattery.id} 

        }).then(foundBattery =>{
            var quant;
            if(action === "add"){
                quant = parseInt(newBattery.quantity) + foundBattery.quantity;

            } else if(action === "delet"){
                quant = foundBattery.quantity - parseInt(newBattery.quantity);

            }

            if(quant === 0){
                console.log("About to destroy " + (foundBattery));
                foundBattery.destroy().then(() => {
                    
                    resolve("Battery Completly removed from stock!");
                }).catch(err => {
                    console.log("About to destroy Failed");
                    reject("An Error Occured Batteries Could not be deleted " + err + " ");
                });

            }else if(quant < 0){
                reject ("Can not Delete More Than Exists in Stock");

            }else{
                console.log("Hanging in here");
                Battery.update({quantity: quant}, {
                    where: {
                        id: newBattery.id
                    }
    
                }).then(() =>{
                    Consumable.updateConsumable(newConsumable, action).then(() =>{
                        if(action === "delet"){
                            resolve(newBattery.quantity + " Batteries Sucessfully Deleted from Existing Stock!");
                        }else if(action === "add"){
                            resolve(newBattery.quantity + " Batteries Sucessfully Added to Existing Stock!");
                        }
                        
    
                    }).catch(err =>{
                        reject("An Error Occured Batteries Could not be " + action + "ed");
    
                    });
    
                }).catch(err => {
                    reject("An Error Occured Batteries Could not be " + action + "ed");
    
                });

            }

        }).catch(err=>{
            reject("An Error Occured Batteries Could not be " + action + "ed");

        });

    });

}

Battery.addBattery = (newBattery) =>{
    console.log(newBattery);
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Battery",
            quantity: newBattery.quantity
        };
        Battery.findOne({
            where: {
                batSpec: newBattery.batSpec,
                carBrand: newBattery.carBrand,
                carYear: newBattery.carYear
            }
        }).then(foundBattery => {
            if(foundBattery){
                reject("Batteries With these Details Already Registered, Please Add to Existing Stock");

            }else{
                console.log("Adding this " + JSON.stringify(newBattery));
                Battery.create(newBattery).then(()=> {
                    Consumable.updateConsumable(newConsumable, "add").then(() => {
                        resolve(newBattery.quantity + " Batteries Sucessfully Added!");

                    }).catch(err => {
                        reject("An Error Occured Batteries Could not be Added");

                    });

                }).catch(err =>{
                    reject("An Error Occured Batteries Could not be Added");

                });

            }

        }).catch(err =>{
            reject("An Error Occured Batteries Could not be Added");

        });

    });

}

Battery.getBatteryStocks = () => {
    return new Bluebird(async (resolve, reject) => {
        var batteriesC, batteriesS, batSpecs, carBrands, carYears, batteryQuantity;
        await Consumable.getSpecific("battery").then(consumables => {
            console.log(consumables);
            batteriesC = consumables

        }).catch(() => {
            reject("Error Connecting to the Server");
        });
    
        await Supplier.findAll().then(suppliers => {
            batteriesS = suppliers
            console.log(batteriesS);
        }).catch(() => {
            reject("Error Connecting to the Server");
        });

        await Battery.findAll({attributes: [[Sequelize.literal('DISTINCT `batSpec`'), 'batSpec']],raw:true, nest:true}).then(spec => {
            batSpecs = spec
            console.log(batSpecs);
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });
    
        await Battery.findAll({attributes: [[Sequelize.literal('DISTINCT `carBrand`'), 'carBrand']]}).then(spec => {
            carBrands = spec
            console.log(carBrands);
        
        }).catch(() => {
            reject("Error Connecting to the Server");
        
        });
    
        await Battery.findAll({attributes: [[Sequelize.literal('DISTINCT `carYear`'), 'carYear']]}).then(spec => {
            carYears = spec
            console.log(carYears);
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });
    
        var values = {consumable: batteriesC.rows, suppliers: batteriesS, specs: batSpecs, brands: carBrands, years:carYears}
        resolve(values);
        
    });
    
}

Battery.getSupplierNames = (batteries) => {
    return new Bluebird.resolve().then(async () => {
        for(var i = 0; i < batteries.count; i++){
            console.log("This one");
            batteries.rows[i].setDataValue('supplierName', await Supplier.getById(batteries.rows[i].supplierId));
        }
    });
}

export default Battery;