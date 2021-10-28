import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';
import Bluebird from 'bluebird';
import Supplier from '../Supplier';
import Quotation from '../Quotation';
import Vehicle from '../Vehicle';

/**
 * Declaring the datatypes used within the Brake class
 */
const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    plateNumber: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    vehicle_data: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['vehicle_data']),
    },
    bBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    preferredBrand:{
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

/**
 * Defining the brake stocks table within the MySQL database using Sequelize
 */
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
        name: 'brake_plateNumber_index',
        method: 'BTREE',
        fields: ['plateNumber']
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

/**
 * Function to update Brake stock
 * Takes in the brake object and if the value should be deleted or added
 * @param {*} newBrake 
 * @param {*} action 
 * @returns msg to be flashed to user
 */
Brake.updateConsumable = (newBrake, action) => {
    return new Bluebird((resolve, reject) => {
        //Creating the new Consumable value to be updated in the consumable databse
        const newConsumable = {
            category: "Brake",
            quantity: newBrake.quantity
        };

        //Checking if the brake spec exists within the stock
        Brake.findOne({
            where: {id: newBrake.id}

        }).then(foundBrake => {
            if(foundBrake){
                var quant;
                if(action === "add"){
                    quant = parseInt(newBrake.quantity) + foundBrake.quantity;
            
                }else if(action ==="delet"){
                    quant = foundBrake.quantity - parseInt(newBrake.quantity);

                } 

                //If the new value is 0 the brake definition is deleted from the stock
               if(quant < 0){
                    reject("Can Not Delete More Than Exists in Stock");

                //If quantity is > 0 the brake quantity is updated
                }else{
                    //looking for the brake to update and setting the new quantity
                    Brake.update({quantity:quant, totalCost: foundBrake.singleCost * quant}, {
                        where: {
                            id: newBrake.id
                        }
    
                    }).then(() => {
                        //Updating the value from the consumables database
                            if(action === "delet"){
                                resolve(newBrake.quantity + " Brakes Sucessfully Deleted from Existing Stock!");
                            }else if(action === "add"){
                                resolve(newBrake.quantity + " Brakes Sucessfully Added to Existing Stock!");
                            }

                    }).catch(err => {
                        reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
                        
                    });
                }
            }else{
                newBrake.singleCost = parseFloat(newBrake.singleCost);
                newBrake.quantity = parseInt(newBrake.quantity);
                newBrake.minQuantity = parseInt(newBrake.minQuantity);
                newBrake.totalCost = newBrake.singleCost * newBrake.quantity;
                Brake.create(newBrake).then(() => {
                    resolve(newBrake.quantity + " Brakes Sucessfully Added!");
                    
                }).catch(err =>{
                    reject(`This is my Err: ${err}`);

                });
            }
             //If the brake exists in the databse the function sets the new quantity to the new value
            
                        
        }).catch(err => {
            reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");

        }); 
        
    });

}

/**
 * Function to add a new brake into stock
 * Function takes an object with the needed brake info
 * @param {*} newBrake 
 * @returns msg to be flashed to user
 */
Brake.addBrake = (newBrake) => {
    return new Bluebird((resolve, reject) => {
        //Creating the new Consumable value to be updated in the consumable databse
        const newConsumable = {
            category: "Brake",
            quantity: newBrake.quantity
        };
        //Looking if the brake with exact specs and same quotation number already exists in stock
        Brake.findOne({
            where: {
                bBrand: newBrake.bBrand,
                preferredBrand: newBrake.preferredBrand,
                supplierId: newBrake.supplierId,
                quotationNumber: newBrake.quotationNumber,
                plateNumber: newBrake.plateNumber,
            }

        }).then(foundBrake => {
            //If this brake with this quotation number exists the function rejects the creation
            if(foundBrake){
                reject("Brakes With these Details Already Registered, Please Add to Existing Stock");

            //If the brake is not found the function creates a brake and updates the consumable stock
            }else{
                //Converting values to appropiate number type
                newBrake.singleCost = parseFloat(newBrake.singleCost);
                newBrake.quantity = parseInt(newBrake.quantity);
                newBrake.minQuantity = parseInt(newBrake.minQuantity);
                newBrake.totalCost = newBrake.singleCost * newBrake.quantity;
                Brake.create(newBrake).then(() => {
                    //Updating consumable stock database
                    Consumable.updateConsumable(newConsumable, "update").then(() => {
                        resolve(newBrake.quantity + " Brakes Sucessfully Added!");

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

/**
 * Function to set virtual datatype supplier name using supplier ids in brake
 * @returns List of brakes with their supplier names
 */
Brake.getStock = () => {
    return new Bluebird ((resolve, reject) => {
        //Getting all the brakes found in the database
        Brake.findAndCountAll().then(breakes => {
            //Calling supplier function to add supplier name to brake objects
            Supplier.getSupplierNames(breakes).then(() => {
                //returning the brakes 
                resolve(breakes);
    
            }).catch(err => {
                reject("This err:" + err);
          
            });
            
          }).catch(err => {
              reject(err);
        
          });
    })
}

Brake.getSupplierStock = sId => {
    return new Bluebird ((resolve, reject) => {
        //Getting all the brakes found in the database
        Brake.findAndCountAll({
            where: {supplierId: sId}
        }).then(breakes => {
            //Calling supplier function to add supplier name to brake objects
            Supplier.getSupplierNames(breakes).then(() => {
                //returning the brakes 
                resolve(breakes);
    
            }).catch(err => {
                reject(err);
          
            });
            
          }).catch(err => {
              reject(err);
        
          });
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
 * Function to return list of brakes with their supplier names, as well as distinct values found within the database
 * @returns object that includes all brakes, suppliers, and distinct values of each brake spec
 */
Brake.getBrakeStock = () =>{
    return new Bluebird(async (resolve,reject) => {
        //Declaring all variables to be returned
        var brakePlate, brakeC, brakeS, brakeBrand, brakePBrand, brakeQuantity;
        //Getting all suppliers saved in database
        Supplier.findAll().then(suppliers => {
            brakeS = suppliers
            //Getting all brakes from database and setting supplier names 
            Brake.getStock().then(consumables => {
                brakeC = consumables
                //Mapping brake values to not return double values
                brakePlate = getDistinct(brakeC.rows.map(val => val.plateNumber))
                brakePBrand = getDistinct(brakeC.rows.map(val => val.preferredBrand))
                brakeQuantity = getDistinct(brakeC.rows.map(val => val.quantity))
                brakeBrand = getDistinct(brakeC.rows.map(val => val.bBrand))

                //Creating variable of all need variables to return
                var values = {
                    consumable: brakeC.rows, suppliers: brakeS, plate: brakePlate,
                    brakeBrand: brakeBrand, brakePBrand: brakePBrand, brakeQuantity: brakeQuantity
                
                };
                resolve(values);

            }).catch(() => {
                reject("Error Connecting to the Server");
            
            });

        }).catch(() => {
            reject("Error Connecting to the Server");
        });
    
    });

}

/**
 * Function to find matching quotation of brakes
 * @returns Quotation object
 */
Brake.getQuotation = () => {
    return new Bluebird((resolve, reject) => {
        //Getting the quotation from database
        Quotation.getQuotation(this.quotationNumber).then(foundQuotation => {
            resolve(foundQuotation);
        }).catch(err =>{
            reject (err);
        })
    })
}

/**
 * Function to find all brakes in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of brakes purchased from that specified supplier ID
 */
Brake.getWithSupplier = supplierId => {
    return new Bluebird((resolve, reject) => {
        //Finding all brakes with specified supplier ID
        Brake.findAndCountAll({
            where: {
                supplierId: supplierId
            }

        }).then(foundBrakes => {
            //Adding supplier Name to filters
            getVehicle(foundBrakes.rows).then(() => {
                Supplier.getSupplierNames(foundBrakes).then(() => {
                    resolve(foundBrakes.rows);
    
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            })
            
            
        }).catch(err => {
            reject(err);
        });

    });

}

/**
 * Function to find different brakes from a specific suppleir 
 * @returns list of brake values from specific supplier regardless of quotation numbers
 */
Brake.groupSupplier = () => {
    return new Bluebird((resolve, reject) => {
        //Finding brakes from database and returning specified attributes 
        Brake.findAll({
            //Declaring attributes to return from database
            attributes:
              ['plateNumber', 'bBrand', 'preferredBrand', 'singleCost', 'supplierId', 'minQuantity',
              [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
              [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost']
            ],

            //Declaring how to group return values
            group: ["plateNumber", "bBrand", 'preferredBrand', "singleCost", "supplierId",   "preferredBrand", 'minQuantity']
            
        }).then((values) => { 
            //Setting variable to return brakes with their supplier names
            getVehicle(values).then(() => {
                var result = {count: values.length, rows: values}
                Supplier.getSupplierNames(result).then(() => {
                resolve(result);
            
            }).catch(err => {
                reject(err);

            });
            })
            

        }).catch(err => {
            reject(err);

        });

    });
    
}

Brake.groupWithOutSupplier = () => {
    return new Bluebird((resolve, reject) => {
        //Finding brakes from database and returning specified attributes 
        Brake.findAll({
            //Declaring attributes to return from database
            attributes:
              ['plateNumber', 'bBrand', 'preferredBrand', 'minQuantity',
              [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
              [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost']
            ],

            //Declaring how to group return values
            group: ["plateNumber", "bBrand", 'preferredBrand',  "preferredBrand", 'minQuantity']
            
        }).then((values) => { 
            //Setting variable to return brakes with their supplier names
            getVehicle(values).then(() => {
                resolve(values);
            })
            

        }).catch(err => {
            reject(err);

        });

    });
    
}

Brake.findMinimums = () => {
    return new Bluebird((resolve, reject) => {
        Brake.findAll({
            attributes: 
                ['plateNumber', 'bBrand', 'preferredBrand', 'minQuantity',
                [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
            ],

            group:["plateNumber", "bBrand", 'preferredBrand',  "preferredBrand", 'minQuantity'],
        }).then(values => {
            if(values.length > 0){
                var notification = "";
                getVehicle(values).then(() => {
                    Promise.all(values.map(brake => {
                        if(brake.minQuantity > brake.quantity){
                            notification = notification + ` - ${brake.vehicle_data.category} ${brake.vehicle_data.brand} ${brake.vehicle_data.model} ${brake.vehicle_data.year } ${brake.preferredBrand} (Minimum: ${brake.minQuantity}, Current: ${brake.quantity})</br>`
                        }
                    })).then(() => {
                        if(notification !== ""){
                            notification = `</br>Brakes:</br>${notification}`
                        }
                        resolve(notification);
                    })
                })
            }else{
                resolve("");
            }   
        })
    })
}
function getVehicle(brakes) {
    return new Bluebird((resolve, reject) => {
        var count = 0;
        Vehicle.getStock().then(foundVehicles => {
            var vehicleMap = new Map();
            foundVehicles.rows.map(vehicles => {
                vehicleMap.set(vehicles.plate, vehicles);
            });
            brakes.map(brake => {
                brake.setDataValue('vehicle_data', vehicleMap.get(brake.plateNumber));
                count++;

                if(count === brakes.length){
                    resolve("Set All");
                }
            });
            
        }).catch(err => {
            reject(err);
        });
    })
}


export default Brake;