import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';
import Bluebird from 'bluebird';

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
    supplierId:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    quotationNumber:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    minQuantity:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
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
    {
        name: 'brake_supplierId_index',
        method: 'BTREE',
        fields: ['supplierId']
    },
    {
        name: 'brake_quotationNumber_index',
        method: 'BTREE',
        fields: ['quotationNumber']
    }
  ],
});

Brake.updateBrake = (newBrake, action) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Brake",
            quantity: newBrake.quantity
        };
        Brake.findOne({
            where: {id: newBrake.id}

        }).then(foundBrake => {
            var quant;
            if(action === "add"){
               quant = parseInt(newBrake.quantity) + foundBrake.quantity;
            
            }else if(action ==="delet"){
                quant = foundBrake.quantity - parseInt(newBrake.quantity);

            } 

            if(quant === 0){
                foundBrake.destroy().then(() => {
                    resolve("Brake Completly Removed From Stock!");

                }).catch(err => {
                    reject("An Error Occured Brakes Could not be Deleted");

                });

            }else if(quant < 0){
                reject("Can Not Delete More Than Exists in Stock");

            }else{
                Brake.update({quantity:quant}, {
                    where: {
                        id: newBrake.id
                    }
    
                }).then(() => {
                    Consumable.updateConsumable(newConsumable,action).then(() => {
                        if(action === "delet"){
                            resolve(newBrake.quantity + " Brakes Sucessfully Deleted from Existing Stock!");
                        }else if(action === "add"){
                            resolve(newBrake.quantity + " Brakes Sucessfully Added to Existing Stock!");
                        }
    
                    }).catch(err => {
                        reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
    
                    });
                }).catch(err => {
                    reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
                        
                });
            }
                        
        }).catch(err => {
            reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");

        }); 
    
    });

}
Brake.addBrake = (newBrake) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Brake",
            quantity: newBrake.quantity
        };
        Brake.findOne({
            where: {
                category: newBrake.category,
                carBrand: newBrake.carBrand,
                carYear: newBrake.carYear,
                bBrand: newBrake.bBrand,
                preferredBrand: newBrake.preferredBrand,
                chassis: newBrake.chassis,
            }

        }).then(foundBrake => {
            if(foundBrake){
                reject("Brakes With these Details Already Registered, Please Add to Existing Stock");

            }else{
                newBrake.singleCost = parseFloat(newBrake.singleCost);
                newBrake.quantity = parseInt(newBrake.quantity);
                newBrake.minQuantity = parseInt(newBrake.minQuantity);
                newBrake.totalCost = newBrake.singleCost * newBrake.quantity;
                Brake.create(newBrake).then(() => {
                    Consumable.addConsumable(newConsumable).then(() => {
                        resolve(newBrake.quantity + " Brakes Sucessfully Added!");

                    }).catch(err => {
                        reject("An Error Occured Brakes Could not be Added");

                    });
                }).catch(err => {
                    reject("An Error Occured Brakes Could not be Added");

                });
            }
        }).catch(err => {
            reject("An Error Occured Brakes Could not be Added");

        });
    
    });

}

Brake.getBrakeStock = () =>{
    return new Bluebird(async (resolve,reject) => {
        var brakeC, brakeCategory, brakeCBrand, brakeCYear, brakeCChassis, brakeBrand, brakePBrand, brakeQuantity;
        await Consumable.getSpecific("brake").then(consumables => {
            console.log(consumables);
            brakeC = consumables

        }).catch(() => {
            reject("Error Connecting to the Server");
        
        });
    
        await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `category`'), 'category']],raw:true, nest:true}).then(category => {
            brakeCategory = category 
            console.log("B = " + JSON.stringify(brakeCategory));
    
        }).catch(() => {
            reject("Error Connecting to the Server");
        
        });

        await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `carBrand`'), 'carBrand']]}).then(spec => {
            brakeCBrand = spec
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `carYear`'), 'carYear']]}).then(spec => {
            brakeCYear = spec
    
        }).catch(() => {
            reject("Error Connecting to the Server");
        
        });

        await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `chassis`'), 'chassis']]}).then(spec => {
            brakeCChassis = spec
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `bBrand`'), 'bBrand']]}).then(spec => {
            brakeBrand = spec

        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `preferredBrand`'), 'preferredBrand']]}).then(spec => {
            brakePBrand = spec
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Brake.findAll({attributes: [[Sequelize.literal('DISTINCT `quantity`'), 'quantity']]}).then(spec => {
            brakeQuantity = spec

        }).catch(() => {
            reject("Error Connecting to the Server");

        });

        var values = {
            consumable: brakeC.rows, brakeCategory: brakeCategory, brakeCBrand: brakeCBrand, brakeCYear: brakeCYear,
            brakeCChassis: brakeCChassis, brakeBrand: brakeBrand, brakePBrand: brakePBrand, brakeQuantity: brakeQuantity
        };
        resolve(values);
    
    });

}


export default Brake;