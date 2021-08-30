import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../../mySQLDB';
import Brake from './Brake';
import Battery from './Battery';
import Filter from './Filter';
import Grease from './Grease';
import Oil from './Oil';
import Consumable from '../Consumables';
import MaintenanceOrder from '../MaintenanceOrder';
import Supplier from '../Supplier';
import Other from './Other';
import NonStockConsumables from './NonStockConsumables';

const mappings = {
    consumable_id:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey:true
    },
    consumable_type:{
        type: Sequelize.DataTypes.STRING,
        primaryKey: true
    },
    maintenance_req:{
        type: Sequelize.DataTypes.STRING,
        primaryKey:true
    },
    consumable_quantity:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    consumable_data: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['consumable_data']),
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    from_stock: {
        type: Sequelize.DataTypes.BOOLEAN,
        primaryKey: true
    }

};

const MaintenanceConsumables = sequelize.define('maintenance_consumables', mappings, {
    indexes: [
        {
            name: 'maintenance_consumable_id_index',
            method: 'BTREE',
            fields: ['consumable_id']
        },
        {
            name: 'maintenance_consumable_type_index',
            method: 'BTREE',
            fields: ['consumable_type']
        },
        {
            name: 'maintenance_req_index',
            method: 'BTREE',
            fields: ['maintenance_req']
        },
        {
            name: 'maintenance_consumable_quantity_index',
            method: 'BTREE',
            fields: ['consumable_quantity']
        },
        {
            name: 'consumable_createdAt_index',
            method: 'BTREE',
            fields: ['createdAt'],
        },
        {
            name: 'consumable_updatedAt_index',
            method: 'BTREE',
            fields: ['updatedAt'],
        },
        {
            name: 'consumable_from_stock_index',
            method: 'BTREE',
            fields: ['from_stock'],
        }
    ]
});

MaintenanceConsumables.getConsumables = reqNumber => {
    return new Bluebird((resolve, reject) => {
        MaintenanceConsumables.getAllConsumables(reqNumber).then(async found => {
            var consumableMap = [];
            await Promise.all(found.map(async consumable => {
                var modelType;
                if(consumable.from_stock){
                    modelType = getConsumableModel(consumable.consumable_type);
                }else{
                    modelType = NonStockConsumables;
                }
                
                await modelType.findOne({
                    where: {
                        id: consumable.consumable_id
                    }
                }).then(foundConsumable => {
                    if(foundConsumable){
                        return consumableMap.push({type: consumable, consumable: foundConsumable});
                    }
                    
                });
            }))
            var result = {count: consumableMap.length, rows: consumableMap, isMain: true}
            Supplier.getSupplierNames(result).then(() => {
                resolve(result.rows);
            }).catch(err =>{
               reject(err);
            });
        }).catch(err => {
            reject(err);
        })
    })
}

MaintenanceConsumables.getAllConsumables = reqNumber => {
    return new Bluebird((resolve, reject) => {
        MaintenanceConsumables.findAll({
            where: {
                maintenance_req: reqNumber
            }
        }).then(found => {
            resolve(found);
        }).catch(err => {
            reject(err);
        })
    })
}

MaintenanceConsumables.useConsumable = (conusmableId, consumableCategory, reqNumber, quantity, action, fromStock) => {
    return new Bluebird((resolve,reject) => {
        const newConsumable = {
            id: conusmableId,
            category: consumableCategory,
            quantity: quantity
        }

        const newMaintenanceConsumable = {
            consumable_id: conusmableId,
            consumable_type: consumableCategory,
            maintenance_req: reqNumber,
            consumable_quantity: quantity,
            from_stock: fromStock
        }
        if(newConsumable.category === "BRAKE" || newConsumable.category === "Battery" || newConsumable.category === "Filter" || newConsumable.category === "Grease" || newConsumable.category === "OIL"){
            Consumable.updateConsumable(newConsumable, "delet").then(() => {
                MaintenanceConsumables.findOne({
                    where: {
                        consumable_id: conusmableId,
                        consumable_type: consumableCategory,
                        maintenance_req: reqNumber
                    }
                }).then(found => {
                console.log("FOUND YOU")
                console.log(found);
                    var quant;
                    if(found !== null){
                        if(action === "add"){
                            quant = quantity + found.consumable_quantity;
                        }else if(action === "delet"){
                            quant = found.consumable_quantity - quantity;
                        }
                        MaintenanceConsumables.update({consumable_quantity: quant}, {
                            where: {
                                consumable_id: conusmableId,
                                consumable_type: consumableCategory,
                                maintenance_req: reqNumber
                            }
                        }).then(() => {
                            resolve("Consumable used for Work Order");
            
                        }).catch(err => {
                            reject(err);
        
                        })
                    }else{
                        MaintenanceConsumables.create(newMaintenanceConsumable).then(() => {
                            resolve("Consumable used for Work Order");
                        
                        }).catch(err => {
                            reject(err);
                            
                        })
                        
                    }
                    
                }).catch(err => {
                    reject(err);
    
                })
    
            }).catch(err => {
                reject(err);
    
            })

        }else{
            newConsumable.other_name = consumableCategory
            Consumable.updateOtherConsumable(newConsumable, "delet").then(() => {
                MaintenanceConsumables.findOne({
                    where: {
                        consumable_id: conusmableId,
                        consumable_type: consumableCategory,
                        maintenance_req: reqNumber
                    }
                }).then(found => {
                    var quant;
                    if(found !== null){
                        if(action === "add"){
                            quant = quantity + found.consumable_quantity;
                        }else if(action === "delet"){
                            quant = found.consumable_quantity - quantity;
                        }
                        MaintenanceConsumables.findOne({
                            where: {
                                consumable_id: conusmableId,
                                consumable_type: consumableCategory,
                                maintenance_req: reqNumber
                            }
                        }).then(foundItem => {
                            if(foundItem !== null){
                                MaintenanceConsumables.update({consumable_quantity: quant}, {
                                    where: {
                                        consumable_id: conusmableId,
                                        consumable_type: consumableCategory,
                                        maintenance_req: reqNumber
                                    }
                                }).then(() => {
                                    resolve("Consumable used for Work Order");
                    
                                }).catch(err => {
                                    reject(err);
                
                                })
                            }else{
                                MaintenanceConsumables.create(newMaintenanceConsumable).then(() => {
                                    resolve("Consumable used for Work Order");
                                
                                }).catch(err => {
                                    reject(err);
                                    
                                })
                            }
                        })
                       
                    }else{
                        newMaintenanceConsumable.from_stock = true;
                        MaintenanceConsumables.create(newMaintenanceConsumable).then(() => {
                            resolve("Consumable used for Work Order");
                        
                        }).catch(err => {
                            reject(err);
                            
                        })
                        
                    }
                    
                }).catch(err => {
                    reject(err);
    
                })
    
            }).catch(err => {
                reject(err);
    
            })
        }
        
       
    })

}

MaintenanceConsumables.useNonStockConsumable = (nonStockConsumable) => {
    return new Bluebird((resolve, reject) => {
        const newMaintenanceConsumable = {
            consumable_type: nonStockConsumable.other_name,
            maintenance_req: nonStockConsumable.maintenanceReq,
            consumable_quantity: nonStockConsumable.quantity,
            from_stock: false
        }

        NonStockConsumables.create(nonStockConsumable).then(consumable => {
            newMaintenanceConsumable.consumable_id = consumable.id;
            MaintenanceConsumables.create(newMaintenanceConsumable).then(() => {
                resolve("Added to");
            }).catch(err => {
                reject(err);
            })
            
        }).catch(err => {
            reject(err);
        })
    })
}

function getConsumableModel(consumableModel) {
console.log("----------------------------");
console.log(consumableModel);
    if (consumableModel === "Brake"){
        return Brake;

    }else if(consumableModel === "Filter"){
        return Filter;

    }else if(consumableModel === "Grease"){
        return Grease;

    }else if(consumableModel === "OIL"){
        return Oil;

    }else if(consumableModel === "Battery"){
        return Battery;

    }else{
        return Other;
    }

};


export default MaintenanceConsumables;
