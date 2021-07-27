import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';
import Bluebird from 'bluebird';
import Supplier from '../Supplier';

/**
 * Declaring the datatypes used within the Grease class
 */
const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    greaseSpec: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    typeOfGrease: {
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
    volume:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull:false,
    },
    minVolume:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false
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

/**
 * Defining the grease stocks table within the MySQL database using Sequelize
 */
const Grease = sequelize.define('grease_stocks', mappings, {
  indexes: [
    {
        name: 'grease_id_index',
        method: 'BTREE',
        fields: ['id'],
    },
    {
        name: 'grease_volume_index',
        method: 'BTREE',
        fields: ['volume'],
    },
    {
        name: 'grease_minVolume_index',
        method: 'BTREE',
        fields: ['minVolume'],
      },
    {
        name: 'grease_greaseSpec_index',
        method: 'BTREE',
        fields: ['greaseSpec']
    },
    {
        name: 'grease_carBrand_index',
        method: 'BTREE',
        fields: ['carBrand']
    },
    {
        name: 'grease_carYear_index',
        method: 'BTREE',
        fields: ['carYear']
    },
    {
        name: 'grease_typeOfGrease_index',
        method: 'BTREE',
        fields: ['typeOfGrease']
    },
    {
        name: 'grease_createdAt_index',
        method: 'BTREE',
        fields: ['createdAt'],
    },
    {
        name: 'grease_updatedAt_index',
        method: 'BTREE',
        fields: ['updatedAt'],
    },
    {
        name: 'grease_supplierId_index',
        method: 'BTREE',
        fields: ['supplierId']
    },
    {
        name: 'grease_quotationNumber_index',
        method: 'BTREE',
        fields: ['quotationNumber']
    }
  ],
});

/**
 * Function to update Grease stock
 * Takes in the grease object and if the value should be deleted or added
 * @param {*} newFrease 
 * @param {*} action 
 * @returns msg to be flashed to user
 */
Grease.updateGrease = (newGrease,action) => {
    return new Bluebird((resolve, reject) => {
        //Creating the new Consumable value to be updated in the consumable databse
        const newConsumable = {
            category: "Grease",
            quantity: newGrease.volume
    
        };
    
        //Checking if the grease spec exists within the stock
        Grease.findOne({
            where: {id: newGrease.id}

        }).then(foundGrease =>{
            //If the grease exists in the databse the function sets the new quantity to the new value
            var quant;
            if(action === "add"){
                quant = parseFloat(newGrease.volume) + foundGrease.volume;
            
            }else if(action === "delet"){
                quant = foundGrease.volume - parseFloat(newGrease.volume);
            
            }
          
            //If the new value is 0 the brake definition is deleted from the stock
            if(quant === 0){
                foundGrease.destroy().then(() => {
                    Consumable.updateConsumable(newConsumable, action).then(() => {
                        resolve(newGrease.volume + " Liters Of Grease Sucessfully Deleted from Existing Stock!");

                    }).catch(err => {
                        reject("An Error Occured Grease Could not be Deleted " + err);

                    });

                }).catch(err => {
                    reject("An Error Occured Grease Could not be Deleted " + err);
                
                });

            }

            //If the new quantity is less than 0 rejects the user input
            else if(quant < 0){
                reject("Can Not Delete More Than Exists in Stock!");
            
            //If quantity is > 0 the grease quantity is updated
            }else{
                Grease.update({volume: quant}, {
                    where: {
                        id: newGrease.id
                    }
        
                }).then(() => {
                    //Updating the value from the consumables database
                    Consumable.updateConsumable(newConsumable, action).then(() => {
                        resolve(newGrease.volume + " Liters of Grease Sucessfully Added to Existing Stock!");
        
                    }).catch(err => {
                        reject("An Error Occured Grease Could not be Added " + err);
        
                    });
        
                }).catch(err =>{
                    reject("An Error Occured Grease Could not be Added " + err);
        
                });

            }
        
        }).catch(err => {
             reject("An Error Occured Grease Could not be Added " + err);
    
        });

    });

}

/**
 * Function to add a new grease into stock
 * Function takes an object with the needed grease info
 * @param {*} newGrease 
 * @returns msg to be flashed to user
 */
Grease.addGrease = (newGrease) => {
    return new Bluebird((resolve, reject) => {
        //Creating the new Consumable value to be updated in the consumable databse
        const newConsumable = {
            category: "Grease",
            quantity: newGrease.volume
    
        };
        //Looking if the grease with exact specs and same quotation number already exists in stock
        Grease.findOne({
            where: {
                greaseSpec: newGrease.greaseSpec,
                typeOfGrease: newGrease.typeOfGrease,
                carBrand: newGrease.carBrand,
                carYear: newGrease.carYear,
                supplierId: newGrease.supplierId,
                quotationNumber: newGrease.quotationNumber,
            }

        }).then(foundGrease => {
            //If this grease with this quotation number exists the function rejects the creation
            if(foundGrease){
                reject("Grease With these Details Already Registered, Please Add to Existing Stock");

            //If the grease is not found the function creates a brake and updates the consumable stock
            }else{
                //Converting values to appropiate number type
                newGrease.volume = parseFloat(newGrease.volume);
                newGrease.minVolume = parseFloat(newGrease.minVolume);
                Grease.create(newGrease).then(() =>{
                    //Updating consumable stock database
                    Consumable.updateConsumable(newConsumable, "add").then(() => {
                        resolve(newGrease.volume + " Liters of Greace Sucessfully Added!");
        
                    }).catch(err => {
                        reject("An Error Occured Grease Could not be Added (Error: " + err + ")");
        
                    });

                }).catch(err => {
                    reject("An Error Occured Grease Could not be Added (Error: " + err + ")");

                });

            }

        }).catch(err =>{
            reject("An Error Occured Grease Could not be Added (Error: " + err + ")");

        });       
        
    });

}

/**
 * Function to set virtual datatype supplier name using supplier ids in grease
 * @returns List of grease with their supplier names
 */
Grease.getStock = () => {
    return new Bluebird ((resolve, reject) => {
        //Getting all the grease found in the database
        Grease.findAndCountAll().then(grease => {
            //Calling supplier function to add supplier name to grease objects
            Supplier.getSupplierNames(grease).then(() => {
                resolve(grease);

            }).catch(err => {
                reject(err);

            });

        }).catch(err => {
            reject(err);

        });

    });

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
 * Function to return list of grease with their supplier names, as well as distinct values found within the database
 * @returns object that includes all grease, suppliers, and distinct values of each grease spec
 */
Grease.getGreaseStock = () => {
    return new Bluebird(async (resolve, reject) => {
        //Declaring all variables to be returned
        var greaseC, greaseS, greaseSpec, typeOfGrease, carBrand, carYear;
        //Getting all suppliers saved in database
        Supplier.findAll().then(suppliers => {
            greaseS = suppliers;
            //Getting all brakes from database and setting supplier names 
            Grease.getStock().then(consumables => {
                greaseC = consumables;
                //Mapping brake values to not return double values
                greaseSpec = getDistinct(greaseC.rows.map(val => val.greaseSpec));
                typeOfGrease = getDistinct(greaseC.rows.map(val => val.typeOfGrease));
                carBrand = getDistinct(greaseC.rows.map(val => val.carBrand));
                carYear = getDistinct(greaseC.rows.map(val => val.carYear));

                //Creating variable of all need variables to return
                var values = {
                    consumables: greaseC.rows, suppliers: greaseS, specs: greaseSpec, 
                    typeOfGrease: typeOfGrease, carBrand: carBrand, carYear: carYear
                };

                resolve(values);

            }).catch(err => {
                reject("Error Connecting to the Server (" + err + ")");

            });

        }).catch(err => {
            reject("Error Connecting to the Server (" + err + ")");

        });

    });
    
};

/**
 * Function to find all grease in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of grease purchased from that specified supplier ID
 */
Grease.getWithSupplier = supplierId => {
    return new Bluebird((resolve, reject) => {
        //Finding all grease with specified supplier ID
        Grease.findAndCountAll({
            where: {
                supplierId: supplierId
            }
        }).then(foundGreases => {
            //Adding supplier Name to Grease 
            Supplier.getSupplierNames(foundGreases).then(() => {
                resolve(foundGreases.rows);

            }).catch(err => {
                reject(err);
    
            });
           
        }).catch(err => {
            reject(err);

        });

    });
}

/**
 * Function to find different grease from a specific suppleir 
 * @returns list of grease values from specific supplier regardless of quotation numbers
 */
Grease.groupSupplier = () => {
    return new Bluebird((resolve, reject) => {
        //Finding grease from database and returning specified attributes 
        Grease.findAll({
            //Declaring attributes to return from database
            attributes:
              ['greaseSpec', 'typeOfGrease', 'carBrand', 'carYear', 'supplierId',
              [sequelize.fn('sum', sequelize.col('volume')), 'volume'],
            ],

            //Declaring how to group return values
            group: ['greaseSpec', 'typeOfGrease', 'carBrand', 'carYear', 'supplierId']
            
        }).then((values) => { 
            //Setting variable to return brakes with their supplier names
            var result = {count: values.length, rows: values}
            Supplier.getSupplierNames(result).then(() => {
                resolve(result);

            }).catch(err => {
                reject(err);

            });
           
        }).catch(err => {
            reject(err);

        });

    });
    
}

export default Grease;