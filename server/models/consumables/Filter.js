import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';
import Bluebird from 'bluebird';
import Supplier from '../Supplier';

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

Filter.updateFilter = (newFilter, action) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Filter",
            quantity: newFilter.quantity
        };

        Filter.findOne({
            where: {id: newFilter.id}

        }).then(foundFilter => {
            var quant;
            if(action === "add"){
               quant = parseInt(newFilter.quantity) + foundFilter.quantity;

            }else if(action === "delet"){
                quant = foundFilter.quantity - parseInt(newFilter.quantity);

            }

            if(quant === 0){
                foundFilter.destroy().then(() => {
                    resolve("Filter Completly Removed From Stock!");

                }).catch(err => {
                    reject("An Error Occured Filters Could not be Deleted");

                });

            }else if(quant < 0){
                reject("Can Not Delete More Than Exists in Stock!");
    
            }else{
                Filter.update({quantity:quant}, {
                    where: {
                        id: newFilter.id
                    }
    
                }).then(() => {
                    Consumable.updateConsumable(newConsumable, action).then(() => {
                        if(action === "add"){
                            resolve(newFilter.quantity + " Fitlers Sucessfully Added to Existing Stock!");

                        }else if(action === "delet"){
                            resolve(newFilter.quantity + " Fitlers Sucessfully Deleted from Existing Stock!");

                        }
                        
    
                    }).catch(err => {
                        reject("An Error Occured Filters Stock Could not be Updated");
    
                    });
    
                }).catch(err => {
                    reject("An Error Occured Filters Stock Could not be Updated");
    
                });

            }
            
        }).catch(err => {
            reject("An Error Occured Filters Stock Could not be Updated");

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
                    Consumable.updateConsumable(newConsumable, "add").then(() => {
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

Filter.getStock = () => {
    return new Bluebird ((resolve, reject) => {
        Filter.findAndCountAll().then(filters => {
            Supplier.getSupplierNames(filters).then(() => {
                resolve(filters);

            }).catch(err => {
                reject(err);

            });

        }).catch(err => {
            reject(err);

        });

    });

}

function getDistinct(values){
    return values.filter((value, index, self) => self.indexOf(value) === index);
}

Filter.getFilterStock = () => {
    return new Bluebird(async (resolve, reject) => {
        var filterC, filterS, typeF, carBrand, carModel, carYear, preferredBrand, carCategory, singleCost, actualBrand;
        Supplier.findAll().then(suppliers => {
            filterS = suppliers
            Filter.getStock().then(consumables => {
                filterC = consumables;
                carCategory = getDistinct(filterC.rows.map(val => val.category));
                typeF = getDistinct(filterC.rows.map(val => val.fType));
                carBrand = getDistinct(filterC.rows.map(val => val.carBrand));
                carYear = getDistinct(filterC.rows.map(val => val.carYear));
                carModel = getDistinct(filterC.rows.map(val => val.carModel));
                preferredBrand = getDistinct(filterC.rows.map(val => val.preferredBrand));
                actualBrand = getDistinct(filterC.rows.map(val => val.actualBrand));
                singleCost = getDistinct(filterC.rows.map(val => val.singleCost));

                var values = {
                    consumable: filterC.rows, suppliers: filterS,filterType: typeF, carBrand: carBrand, 
                    carModel: carModel, carYear: carYear, preferredBrand: preferredBrand, carCategory: carCategory,
                    singleCost: singleCost, actualBrand: actualBrand
            
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

Filter.getWithSupplier = supplierId => {
    return new Bluebird((resolve, reject) => {
        Filter.findAndCountAll({
            where: {
                supplierId: supplierId
            }
        }).then(async foundFilter => {
            await Supplier.getSupplierNames(foundFilter);
            resolve(foundFilter.rows);
        }).catch(err => {
            reject(err);
        });
    });
}

Filter.groupSupplier = () => {
    return new Bluebird((resolve, reject) => {
        Filter.findAll({
            attributes:
              ['category', 'fType', 'actualBrand', 'carModel', 'carBrand', 'carYear', 'singleCost', 'supplierId',
              [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
            ],

            group: ['category', 'fType', 'actualBrand', 'carModel', 'carBrand', 'carYear', 'singleCost', 'supplierId']
            
        }).then(async (values) => { 
            var result = {count: values.length, rows: values}
            await Supplier.getSupplierNames(result);
           resolve(result);
        });
    })
}


export default Filter;