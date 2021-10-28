import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';
import Bluebird from 'bluebird';
import Supplier from '../Supplier';
import Vehicle from '../Vehicle';

/**
 * Declaring the datatypes used within the Filter class
 */
const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    plateNumber:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    vehicle_data:{
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['vehicle_data']),
    },
    fType:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    preferredBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    actualBrand:{
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
    minQuantity:{
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

/**
 * Defining the filter stocks table within the MySQL database using Sequelize
 */
const Filter = sequelize.define('filter_stocks', mappings, {
    
    indexes: [
    {
        name: 'filter_id_index',
        method: 'BTREE',
        fields: ['id'],
    },
    
    {
        name: 'filter_quantity_index',
        method: 'BTREE',
        fields: ['quantity'],
    },
    
    {
        name: 'filter_plateNumber_index',
        method: 'BTREE',
        fields: ['plateNumber'],
    },
    
    {
        name: 'filter_fType_index',
        method: 'BTREE',
        fields: ['fType'],
    },
    
    {
        name: 'filter_preferredBrand_index',
        method: 'BTREE',
        fields: ['preferredBrand'],
    },
    
    {
        name: 'filter_actualBrand_index',
        method: 'BTREE',
        fields: ['actualBrand'],
    },
    
    {
        name: 'filter_singleCost_index',
        method: 'BTREE',
        fields: ['singleCost'],
    },
    {
        name: 'filter_totalCost_index',
        method: 'BTREE',
        fields: ['totalCost'],
    },
    {
        name: 'filter_minQuantity_index',
        method: 'BTREE',
        fields: ['minQuantity'],
    },
    {
        name: 'filter_createdAt_index',
        method: 'BTREE',
        fields: ['createdAt'],
    },
    {
        name: 'filter_updatedAt_index',
        method: 'BTREE',
        fields: ['updatedAt'],
    },
    {
        name: 'filter_supplierId_index',
        method: 'BTREE',
        fields: ['supplierId']
    },
    {
        name: 'filter_quotationNumber_index',
        method: 'BTREE',
        fields: ['quotationNumber']
    }
  ],
});

/**
 * Function to update Filter stock
 * Takes in the filter object and if the value should be deleted or added
 * @param {*} newFilter 
 * @param {*} action 
 * @returns msg to be flashed to user
 */
Filter.updateConsumable = (newFilter, action) => {
    return new Bluebird((resolve, reject) => {
        //Creating the new Consumable value to be updated in the consumable databse
        const newConsumable = {
            category: "Filter",
            quantity: newFilter.quantity
        };

        //Checking if the filter spec exists within the stock
        Filter.findOne({
            where: {id: newFilter.id}

        }).then(foundFilter => {
            if(foundFilter){
                //If the filter exists in the databse the function sets the new quantity to the new value
                var quant;
                if(action === "add"){
                quant = parseInt(newFilter.quantity) + foundFilter.quantity;

                }else if(action === "delet"){
                    quant = foundFilter.quantity - parseInt(newFilter.quantity);

                }

                //If the new value is 0 the filter definition is deleted from the stock
                if(quant < 0){
                    reject("Can Not Delete More Than Exists in Stock!");
    
                //If quantity is > 0 the brake quantity is updated
                }else{
                    //looking for the filter to update and setting the new quantity
                    Filter.update({quantity:quant, totalCost: foundFilter.singleCost * quant}, {
                        where: {
                            id: newFilter.id
                        }
    
                    }).then(() => {
                        //Updating the value from the consumables database
                            if(action === "add"){
                                resolve(newFilter.quantity + " Fitlers Sucessfully Added to Existing Stock!");

                            }else if(action === "delet"){
                                resolve(newFilter.quantity + " Fitlers Sucessfully Deleted from Existing Stock!");

                            }

                    }).catch(err => {
                        reject("An Error Occured Filters Stock Could not be Updated (Error: " + err + ")");
    
                    });

                }
            }else{
                newFilter.quantity = parseInt(newFilter.quantity);
                newFilter.minQuantity = parseInt(newFilter.minQuantity);
                newFilter.singleCost = parseFloat(newFilter.singleCost);
                newFilter.totalCost = newFilter.singleCost * newFilter.quantity;
                newFilter.totalCost = parseFloat(newFilter.totalCost);
                Filter.create(newFilter).then(() => {
                    //Updating consumable stock database
                        resolve(newFilter.quantity + " Filters Sucessfully Added!");

                }).catch(err => {
                    reject("An Error Occured Filters Could not be Added " + err);

                });

            }
            
            
        }).catch(err => {
            reject("An Error Occured Filters Stock Could not be Updated (Error: " + err + ")");

        });

    });

}

/**
 * Function to add a new Filter into stock
 * Function takes an object with the needed filter info
 * @param {*} newFilter 
 * @returns msg to be flashed to user
 */
Filter.addFilter = (newFilter) => {
    return new Bluebird((resolve, reject) => {
        //Creating the new Consumable value to be updated in the consumable databse
        const newConsumable = {
            category: "Filter",
            quantity: newFilter.quantity
        };

        //Looking if the filter with exact specs and same quotation number already exists in stock
        Filter.findOne({
            where: {
                fType: newFilter.fType,
                preferredBrand: newFilter.preferredBrand,
                actualBrand: newFilter.actualBrand,
                supplierId: newFilter.supplierId,
                singleCost: newFilter.singleCost
            }

        }).then(foundFilter => {
            //If this filter with this quotation number exists the function rejects the creation
            if(foundFilter){
                reject("Filters With these Details Already Registered, Please Add to Existing Stock");

            //If the filter is not found the function creates a filter and updates the consumable stock
            }else{
                //Converting values to appropiate number type
                newFilter.quantity = parseInt(newFilter.quantity);
                newFilter.minQuantity = parseInt(newFilter.minQuantity);
                newFilter.singleCost = parseFloat(newFilter.singleCost);
                newFilter.totalCost = newFilter.singleCost * newFilter.quantity;
                newFilter.totalCost = parseFloat(newFilter.totalCost);
                Filter.create(newFilter).then(() => {
                    //Updating consumable stock database
                    Consumable.updateConsumable(newConsumable, "update").then(() => {
                        resolve(newFilter.quantity + " Filters Sucessfully Added!");

                    }).catch(err => {
                        reject("An Error Occured Filters Could not be Added " + err);

                    });

                }).catch(err => {
                   reject("An Error Occured Filters Could not be Added " + err);

                });

            }
        }).catch(err => {
            reject("An Error Occured Filters Could not be Added " + err );

        });
        
    });

}

/**
 * Function to set virtual datatype supplier name using supplier ids in filter
 * @returns List of filters with their supplier names
 */
Filter.getStock = () => {
    return new Bluebird ((resolve, reject) => {
        //Getting all the brakes found in the database
        Filter.findAndCountAll().then(filters => {
            //Calling supplier function to add supplier name to brake objects
            Supplier.getSupplierNames(filters).then(() => {
                //returning the brakes 
                resolve(filters);

            }).catch(err => {
                reject(err);

            });

        }).catch(err => {
            reject(err);

        });

    });

}

Filter.getSupplierStock = sId => {
    return new Bluebird ((resolve, reject) => {
        //Getting all the brakes found in the database
        Filter.findAndCountAll({
            where: {supplierId: sId}
        }).then(filters => {
            //Calling supplier function to add supplier name to brake objects
            Supplier.getSupplierNames(filters).then(() => {
                //returning the brakes 
                resolve(filters);

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
 * Function to return list of fitlers with their supplier names, as well as distinct values found within the database
 * @returns object that includes all filters, suppliers, and distinct values of each filter spec
 */
Filter.getFilterStock = () => {
    return new Bluebird(async (resolve, reject) => {
        //Declaring all variables to be returned
        var filterC, filterS, typeF, filterPlate, preferredBrand, singleCost, actualBrand;
        //Getting all suppliers saved in database
        Supplier.findAll().then(suppliers => {
            filterS = suppliers
            //Getting all filters from database and setting supplier names 
            Filter.getStock().then(consumables => {
                filterC = consumables;
                //Mapping filter values to not return double values
                filterPlate = getDistinct(filterC.rows.map(val => val.plateNumber));
                typeF = getDistinct(filterC.rows.map(val => val.fType));
                preferredBrand = getDistinct(filterC.rows.map(val => val.preferredBrand));
                actualBrand = getDistinct(filterC.rows.map(val => val.actualBrand));
                singleCost = getDistinct(filterC.rows.map(val => val.singleCost));

                //Creating variable of all need variables to return
                var values = {
                    consumable: filterC.rows, suppliers: filterS,filterType: typeF, plate: filterPlate, 
                    preferredBrand: preferredBrand, singleCost: singleCost, actualBrand: actualBrand
            
                };

                resolve(values);

            }).catch(err => {
                reject("Error Connectin to the Server (" + err + ")");

            });

        }).catch(err => {
            reject("Error Connecting to the Server (" + err + ")");

        });

    });

}

/**
 * Function to find all filters in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of filters purchased from that specified supplier ID
 */
Filter.getWithSupplier = supplierId => {
    return new Bluebird((resolve, reject) => {
        //Finding all filters with specified supplier ID
        Filter.findAndCountAll({
            where: {
                supplierId: supplierId
            }
        }).then(foundFilter => {
            //Adding supplier Name to filters 
            getVehicle(foundFilter.rows).then(() => {
                Supplier.getSupplierNames(foundFilter).then(() => {
                    resolve(foundFilter.rows);
                
                }).catch(err => {
                    reject(err);
    
                });

            }).catch(err=> {
                reject(err);
            })
            
            
        }).catch(err => {
            reject(err);

        });

    });

}

/**
 * Function to find different filters from a specific suppleir 
 * @returns list of filters values from specific supplier regardless of quotation numbers
 */
Filter.groupSupplier = () => {
    return new Bluebird((resolve, reject) => {
        //Finding filters from database and returning specified attributes 
        Filter.findAll({
            //Declaring attributes to return from database
            attributes:
              ['fType', 'actualBrand','plateNumber', 'singleCost', 'supplierId', 'minQuantity',
              [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
            ],

            //Declaring how to group return values
            group: ['fType', 'actualBrand', 'plateNumber', 'minQuantity', 'singleCost', 'supplierId']
            
        }).then(async (values) => { 
            //Setting variable to return filters with their supplier names
            var result = {count: values.length, rows: values}
            getVehicle(values).then(() => {
                Supplier.getSupplierNames(result).then(() => {
                    resolve(result);
    
                }).catch(err => {
                    reject(err);
    
                });
            }).catch(err=> {
                reject(err)
            })
            
           
        }).catch(err => {
            reject(err);

        });

    });
    
}

Filter.groupWithOutSupplier = () => {
    return new Bluebird((resolve, reject) => {
        //Finding filters from database and returning specified attributes 
        Filter.findAll({
            //Declaring attributes to return from database
            attributes:
              ['fType', 'actualBrand','plateNumber', 'minQuantity',
              [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
              [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost']
            ],

            //Declaring how to group return values
            group: ['fType', 'actualBrand', 'plateNumber', 'minQuantity']
            
        }).then(async (values) => { 
            //Setting variable to return filters with their supplier names
            getVehicle(values).then(() => {
                    resolve(values);

            }).catch(err=> {
                reject(err)
            })
            
           
        }).catch(err => {
            reject(err);

        });

    });
    
}

Filter.findMinimums= () => {
    return new Bluebird((resolve, reject) => {
        Filter.findAll({
            attributes:
            ['fType', 'actualBrand','plateNumber', 'minQuantity',
            [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
            [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost']
          ],

          //Declaring how to group return values
          group: ['fType', 'actualBrand', 'plateNumber', 'minQuantity'],
          where: {
            minQuantity: {[Sequelize.Op.gt]: sequelize.col('quantity')}
            }
        }).then(values => {
            if(values.length > 0){
            var notification = "</br>Filters:</br>";
            getVehicle(values).then(() => {
                Promise.all(values.map(filter => {
                    notification = notification + ` - ${filter.vehicle_data.category} ${filter.vehicle_data.brand} ${filter.vehicle_data.model} ${filter.vehicle_data.year} ${filter.fType} ${filter.actualBrand} (Minimum: ${filter.minQuantity}, Current: ${filter.quantity})</br>`
                })).then(() => {
                    resolve(notification);
                })
            })
        }else{
            resolve("");
        }
        })
    })
}

function getVehicle(filters) {
    return new Bluebird((resolve, reject) => {
        var count = 0;
        Vehicle.getStock().then(foundVehicles => {
            var vehicleMap = new Map();
            foundVehicles.rows.map(vehicles => {
                vehicleMap.set(vehicles.plate, vehicles);
            });
            filters.map(filter => {
                filter.setDataValue('vehicle_data', vehicleMap.get(filter.plateNumber));
                count++;

                if(count === filters.length){
                    resolve("Set All");
                }
            });
            
        }).catch(err => {
            reject(err);
        });
    })
}


export default Filter;