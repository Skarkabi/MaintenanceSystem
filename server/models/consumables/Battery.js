import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import Consumable from '../Consumables'
import sequelize from '../../mySQLDB';
import Supplier from '../Supplier';
var os = require('os');

/**
 * Declaring the datatypes used within the Battery class
 */
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
    minQuantity:{
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
    supplierName:{
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.STRING, ['supplierName']),
       
    },
    quotationNumber:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    serialNumber:{
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

/**
 * Definxwing the battery stocks table within the MySQL database using Sequelize
 */
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
        name: 'battery_minQuantity_index',
        method: 'BTREE',
        fields: ['minQuantity']
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
        name: 'battery_serialNumber_index',
        method: 'BTREE',
        fields: ['serialNumber']
    },
    {
        name: 'battery_quotationNumber_index',
        method: 'BTREE',
        fields: ['quotationNumber']
    }
  ],
});

/**
 * Function to update battery stock
 * Takes in the battery object and if the value should be deleted or added
 * @param {*} newBattery 
 * @param {*} action 
 * @returns 
 */
Battery.updateConsumable = (newBattery, action) => {
    return new Bluebird((resolve, reject) => {
        //Creating the new Consumable value to be updated in the consumable databse
        const newConsumable = {
            category: "Battery",
            quantity: newBattery.quantity
        };

        //Checking if the battery spec exists within the stock
        Battery.findOne({
            where: {id: newBattery.id} 

        }).then(foundBattery =>{
            if(foundBattery){
                //If the battery exists in the databse the function sets the new quantity to the new value
                var quant;
                if(action === "add"){
                    quant = parseInt(newBattery.quantity) + foundBattery.quantity;

                } else if(action === "delet"){
                    quant = foundBattery.quantity - parseInt(newBattery.quantity);

                }

                //If the new value is 0 the battery definition is deleted from the stock
                //If the new quantity is less than 0 rejects the user input
                if(quant < 0){
                    reject ("Can not Delete More Than Exists in Stock");

                //If quantity is > 0 the battery quantity is updated
                }else{
                    //looking for the battery to update and setting the new quantity
                    Battery.update({quantity: quant, totalCost: foundBattery.singleCost * quant}, {
                        where: {
                            id: newBattery.id
                        }
    
                    }).then(() =>{
                        //Updating the value from the consumables database
                        if(action === "delet"){
                            foundBattery.destroy().then(() => {
                                resolve(newBattery.quantity + " Batteries Sucessfully Deleted from Existing Stock!");
                            })
                            
                        }else if(action === "add"){
                            resolve(newBattery.quantity + " Batteries Sucessfully Added to Existing Stock!");
                        }
    
                    }).catch(err => {
                        reject("An Error Occured Batteries Could not be " + action + "ed " + err);
    
                    });

                }
            }else{
                newBattery.singleCost = parseFloat(newBattery.singleCost);
                newBattery.quantity = parseInt(newBattery.quantity);
                newBattery.minQuantity = parseInt(newBattery.minQuantity);
                newBattery.totalCost = newBattery.singleCost * newBattery.quantity;
                Battery.create(newBattery).then(()=> {
                    //Updating consumable stock database
                    resolve(newBattery.quantity + " Batteries Sucessfully Added!");

                }).catch(err =>{
                    reject("An Error Occured Batteries Could not be Added " + err);

                });

            }
            

        }).catch(err=>{
            reject("An Error Occured Batteries Could not be " + action + "ed " + err);

        });

    });

}

/**
 * Function to add a new battery into stock
 * Function takes an object with the needed battery info
 * @param {*} newBattery 
 * @returns 
 */
Battery.addBattery = (newBattery) =>{
    return new Bluebird((resolve, reject) => {
        //Creating the new Consumable value to be updated in the consumable databse
        const newConsumable = {
            category: "Battery",
            quantity: newBattery.quantity
        };
        //Looking if the battery with exact specs and same quotation number already exists in stock
        Battery.findOne({
            where: {
                batSpec: newBattery.batSpec,
                supplierId: newBattery.supplierId,
                quotationNumber: newBattery.quotationNumber,
                serialNumber: newBattery.serialNumber

            }
            
        }).then(foundBattery => {
            //If this battery with this quotation number exists the function rejects the creation
            if(foundBattery){
                reject("Batteries With these Details Already Registered, Please Add to Existing Stock");

            //If the battery is not found the function creates a battery and updates the consumable stock
            }else{
                
            }

        }).catch(err =>{
            reject("An Error Occured Batteries Could not be Added " + err);

        });

    });

}

/**
 * Function to set virtual datatype supplier name using supplier ids in battery
 * @returns List of batteries with their supplier names
 */
Battery.getStock = () => {
    return new Bluebird ((resolve, reject) => {
        //Getting all the batteries found in the database
        Battery.findAndCountAll().then(batteries => {
            //Calling supplier function to add supplier name to battery objects
            Supplier.getSupplierNames(batteries).then(() => {
                //returning the batteries 
                resolve(batteries);
    
            }).catch(err => {
                reject(err);
          
            });
            
          }).catch(err => {
              reject(err);
        
          });
    })
    
}

Battery.getSupplierStock = sId =>{
    return new Bluebird ((resolve, reject) => {
        Battery.findAndCountAll({
            where: {supplierId: sId}
        }).then(batteries => {
            Supplier.getSupplierNames(batteries).then(() => {
                //returning the batteries 
                resolve(batteries);
    
            }).catch(err => {
                reject(err);
          
            });
        }).catch(err => {
            reject(err);
        });
    })
}

/**
 * Function to return list of batteries with their supplier names, as well as unique values found within the database
 * @returns object that includes all batteries, suppliers, and unique values of each battery spec
 */
Battery.getBatteryStocks = () => {
    return new Bluebird((resolve, reject) => {
        //Declaring all variables to be returned
        var batteriesC, batteriesS, batSpecs, carBrands, carYears;
        //Getting all suppliers saved in database
        Supplier.findAll().then(suppliers => {
            batteriesS = suppliers
            //Getting all batteries from database and setting supplier names 
            Battery.getStock().then(consumables => {
                batteriesC = consumables
                //Mapping battery values to not return double values
                batSpecs =  batteriesC.rows.map(val => val.batSpec).filter((value, index, self) => self.indexOf(value) === index)
                //Creating variable of all need variables to return
                var values = {consumable: batteriesC.rows, suppliers: batteriesS, 
                    specs: batSpecs}
    
                resolve(values);
    
            }).catch(err => {
               reject(err);

            });

        })
        
    });
    
}

/**
 * Function to find all batteries in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of batteries purchased from that specified supplier ID
 */
Battery.getWithSupplier = supplierId => {
    return new Bluebird((resolve, reject) => {
        //Finding all batteries with specified supplier ID
        Battery.findAndCountAll({
            where: {
                supplierId: supplierId
            }

        }).then(foundBrakes => {
            //Adding supplier Name to batteries 
            Supplier.getSupplierNames(foundBrakes).then(()=>{
                resolve(foundBrakes.rows);
            
            }).catch(err => {
                reject(err);

            });

        }).catch(err => {
            reject(err);

        });
    });
}


/**
 * Function to find different batteries from a specific suppleir 
 * @returns list of batter values from specific supplier regardless of quotation numbers
 */
Battery.groupSupplier = () => {
    return new Bluebird((resolve, reject) => {
        //Finding batteries from database and returning specified attributes 
        Battery.findAll({
            //Declating attributes to return from database
            attributes:
              ['batSpec', 'supplierId', 'minQuantity',
              [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
              [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost']
            ],

            //Declaring how to group return values
            group: ["batSpec","supplierId", 'minQuantity']
            
        }).then((values) => { 
            //Setting variable to return batteries with their supplier names
            var result = {count: values.length, rows: values}
            Supplier.getSupplierNames(result).then(()=>{
                resolve(result);

            }).catch(err => {
                reject(err);

            });
           
        }).catch(err => {
            reject(err);

        });

    });

}

Battery.groupWithOutSupplier = () => {
    return new Bluebird((resolve, reject) => {
        Battery.findAll({
            attributes:
                ['batSpec', 'minQuantity',
                [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
                [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost']
            ],
            group: ["batSpec", "minQuantity"]
          
        }).then(values => {
            resolve(values);
        })
    })
}

Battery.findMinimums = () => {
    return new Bluebird((resolve, reject) => {
        Battery.findAll({
            attributes:
              ['batSpec', 'minQuantity',
              [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
              [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost']
            ],

            //Declaring how to group return values
            group: ["batSpec", 'minQuantity'],
        }).then(values => {
            if(values.length > 0){
                var notification = "";
                Promise.all(values.map(battery => {
                    if(battery.minQuantity > battery.quantity){
                        notification = notification + ` - ${battery.batSpec} (Minimum: ${battery.minQuantity}, Current: ${battery.quantity})</br>`;
                    }
                })).then(() => {
                    if(notification !== ""){
                        notification = `Batteries:<br>${notification}<br>`
                    }
                    resolve(notification);
                })
            }else{
                resolve("")
            }
            
        })
    })
}

export default Battery;