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
    carBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carModel:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carYear:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    category:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
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
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },
};

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
        name: 'filter_carBrand_index',
        method: 'BTREE',
        fields: ['carBrand'],
    },
    
    {
        name: 'filter_carYear_index',
        method: 'BTREE',
        fields: ['carYear'],
    },
    
    {
        name: 'filter_carModel_index',
        method: 'BTREE',
        fields: ['carModel'],
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
        name: 'filter_category_index',
        method: 'BTREE',
        fields: ['category'],
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
  ],
});

Filter.updateFilter = (newFilter) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Filter",
            quantity: newFilter.quantity
        };

        Filter.findOne({
            where: {id: newFilter.id}

        }).then(foundFilter => {
            var quant = parseInt(newFilter.quantity) + foundFilter.quantity;
            Filter.update({quantity:quant}, {
                where: {
                    id: newFilter.id
                }

            }).then(() => {
                Consumable.addConsumable(newConsumable).then(() => {
                    resolve(newFilter.quantity + " Fitlers Sucessfully Added to Existing Stock!");

                }).catch(err => {
                    reject("An Error Occured Filters Could not be Added");

                });

            }).catch(err => {
                reject("An Error Occured Filters Could not be Added");

            });

        }).catch(err => {
            reject("An Error Occured Filters Could not be Added");

        });

    });

}

Filter.addFilter = (newFilter) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Filter",
            quantity: newFilter.quantity
        };
        Filter.findOne({
            where: {
                carBrand: newFilter.carBrand,
                carModel: newFilter.carModel,
                category: newFilter.category,
                fType: newFilter.fType,
                preferredBrand: newFilter.preferredBrand,
                actualBrand: newFilter.actualBrand,
                singleCost: newFilter.singleCost
            }

        }).then(foundFilter => {
            if(foundFilter){
                reject("Filters With these Details Already Registered, Please Add to Existing Stock");

            }else{
                newFilter.quantity = parseInt(newFilter.quantity);
                newFilter.minQuantity = parseInt(newFilter.minQuantity);
                newFilter.singleCost = parseFloat(newFilter.singleCost);
                newFilter.totalCost = newFilter.singleCost * newFilter.quantity;
                newFilter.totalCost = parseFloat(newFilter.totalCost);
                Filter.create(newFilter).then(() => {
                    Consumable.addConsumable(newConsumable).then(() => {
                        resolve(newFilter.quantity + " Filters Sucessfully Added!");

                    }).catch(err => {
                        reject("An Error Occured Filters Could not be Added");

                    });

                }).catch(err => {
                   reject("An Error Occured Filters Could not be Added");

                });

            }
        }).catch(err => {
            reject("An Error Occured Filters Could not be Added");

        });
        
    });

}

Filter.getFilterStock = () => {
    return new Bluebird(async (resolve, reject) => {
        var filterC, typeF, carBrand, carModel, carYear, preferredBrand, carCategory, singleCost, actualBrand;

        await Consumable.getSpecific("filter").then(consumables => {
            console.log(consumables);
            filterC = consumables
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });
    
        await Filter.findAll({attributes: [[Sequelize.literal('DISTINCT `category`'), 'category']],raw:true, nest:true}).then(category => {
            carCategory = category ;
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Filter.findAll({attributes: [[Sequelize.literal('DISTINCT `fType`'), 'fType']],raw:true, nest:true}).then(filterType => {
            typeF = filterType; 
        
    
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Filter.findAll({attributes: [[Sequelize.literal('DISTINCT `carBrand`'), 'carBrand']]}).then(spec => {
            carBrand = spec
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Filter.findAll({attributes: [[Sequelize.literal('DISTINCT `carYear`'), 'carYear']]}).then(spec => {
            carYear = spec
    
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Filter.findAll({attributes: [[Sequelize.literal('DISTINCT `carModel`'), 'carModel']],raw:true, nest:true}).then(filterType => {
            carModel = filterType; 
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Filter.findAll({attributes: [[Sequelize.literal('DISTINCT `preferredBrand`'), 'preferredBrand']]}).then(spec => {
            preferredBrand = spec
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });
        await Filter.findAll({attributes: [[Sequelize.literal('DISTINCT `actualBrand`'), 'actualBrand']]}).then(spec => {
            actualBrand = spec
    
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Filter.findAll({attributes: [[Sequelize.literal('DISTINCT `singleCost`'), 'singleCost']]}).then(spec => {
            singleCost = spec
    
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        var values = {
            consumable: filterC.rows, filterType: typeF, carBrand: carBrand, carModel: carModel,
            carYear: carYear, preferredBrand: preferredBrand, carCategory: carCategory,
            singleCost: singleCost, actualBrand: actualBrand
    
        };
        resolve(values);

    });

}


export default Filter;