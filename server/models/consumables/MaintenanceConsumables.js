import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../../mySQLDB';
import Brake from './Brake';
import Battery from './Battery';
import Filter from './Filter';
import Grease from './Grease';
import Consumable from '../Consumables';
import MaintenanceOrder from '../MaintenanceOrder';
import Supplier from '../Supplier';

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
        }
    ]
});

MaintenanceConsumables.getConsumables = reqNumber => {
    return new Bluebird((resolve, reject) => {
        MaintenanceConsumables.getAllConsumables(reqNumber).then(async found => {
            var consumableMap = [];
            await Promise.all(found.map(async consumable => {
                let modelType = getConsumableModel(consumable.consumable_type);
                await modelType.findOne({
                    where: {
                        id: consumable.consumable_id
                    }
                }).then(foundConsumable => {
                    return consumableMap.push({type: consumable, consumable: foundConsumable});
                });
            }))
            var result = {count: consumableMap.length, rows: consumableMap, isMain: true}
            Supplier.getSupplierNames(result).then(() => {
                //console.log(result.rows[0].consumable);
                resolve(result.rows);
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

MaintenanceConsumables.useConsumable = (conusmableId, consumableCategory, reqNumber, quantity, action) => {
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
            consumable_quantity: quantity
        }

        Consumable.updateConsumable(newConsumable, "delet").then(() => {
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
                        console.log(quant);
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
                        console.log("this errpr");
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
       
    })

}
/** 
function logMapElements(value, key, map) {
    console.log(`m[${key}] = ${value}`);
  }
  
MaintenanceConsumables.setData = orders => {
    return new Bluebird((resolve, reject) => {
        let values = orders.map(a => a.req);
        MaintenanceConsumables.getByReq(values).then(consumables => {
            var fullArray = [];
            consumables.forEach((value, key) => {
                fullArray.push({key: key.req, value: value});
            });
            var consumablesMap = new Map();
            for(var i = 0; i < fullArray.length; i++){
                var searchFor = JSON.stringify(fullArray[i].key);
                if(consumablesMap.get(fullArray[i].key)){
                    console.log(consumablesMap.get(fullArray[i]))
                    var temp = consumablesMap.get(fullArray[i].key);
                    var tempArray = temp;
                    tempArray.push(fullArray[i]);
                    console.log(1);
                    console.log(tempArray);
                    consumablesMap.set(fullArray[i].key, tempArray);
                }else{
                    consumablesMap.set(fullArray[i].key, [fullArray[i].value]);
                }
            }
            
            console.log(consumablesMap);
            resolve("completed");
        });
    });
}

MaintenanceConsumables.getByReq = req => {
    return new Bluebird((resolve, reject) => {
        MaintenanceConsumables.findAll({
            where: {
                maintenance_req: req
            },
            attributes: ['maintenance_req', 'consumable_id', 'consumable_type', 'consumable_quantity']
        }).then(foundConsumables => {
            MaintenanceConsumables.getConsumables(foundConsumables).then(output => {
                resolve(output);
            });
            
        }).catch(err => {
            reject(err);
        });

    });

}

MaintenanceConsumables.getConsumables = consumables => {
    return new Bluebird(async (resolve, reject) => {
        var consumableMap = new Map();
        await Bluebird.all(consumables.map(async value => {
            let model = getConsumableModel(value.consumable_type);
            await model.findAll({
                where: {
                    id: value.consumable_id
                }
            }).then(found => {
                found.map(values => {
                    consumableMap.set({type: value.consumable_type, consumable_id: value.consumable_id, req: value.maintenance_req}, {item: values, quantity: value.consumable_quantity})
                    
                });

            });

        }));

        resolve(consumableMap);

    });

}
*/

function getConsumableModel(consumableModel) {
    if (consumableModel === "Brake"){
        return Brake;

    }else if(consumableModel === "Filter"){
        return Filter;

    }else if(consumableModel === "Grease"){
        return Grease;

    }else if(consumableModel === "Oil"){
        return Oil;

    }else if(consumableModel === "Battery"){
        return Battery;

    }

};


export default MaintenanceConsumables;
