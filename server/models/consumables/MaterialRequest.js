import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../../mySQLDB';
import NonStockConsumables from './NonStockConsumables';
import MaintenanceConsumables from './MaintenanceConsumables';

const mappings = {
    material_request: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true
    },
    maintenance_req:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    items:{
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['items']),
        allowNull: true
    },
    cost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    }
}

const MaterialRequest = sequelize.define('material_request', mappings, {
    indexes: [
        {
            name: 'material_request_material_request_index',
            method: 'BTREE',
            fields: ['material_request']
        },
        {
            name: 'material_request_maintenance_req_index',
            method: 'BTREE',
            fields: ['maintenance_req']
        },
        {
            name: 'material_request_cost_index',
            method: 'BTREE',
            fields: ['cost'],
        },
        {
            name: 'material_request_createdAt_index',
            method: 'BTREE',
            fields: ['createdAt'],
        },
        {
            name: 'material_request_updatedAt_index',
            method: 'BTREE',
            fields: ['updatedAt'],
        }
    ]
});

MaterialRequest.addMaterialRequest = newMaterialRequest => {
    return new Bluebird((resolve, reject) => {
        var materialRequest = {
            material_request: newMaterialRequest.materialRequestNumber,
            maintenance_req: newMaterialRequest.maintenanceReq,
            items: newMaterialRequest
        }
        MaintenanceConsumables.useNonStockConsumable(newMaterialRequest).then(output => {
            MaterialRequest.create(materialRequest).then(() => {
                resolve("Material Request Added");
    
            }).catch(err => {
                reject(err);
    
            });
        }).catch(err => {
            reject(err);
        })
    });

}

MaterialRequest.getMaterialRequest = maintenance_req => {
    return new Bluebird((resolve, reject) => {
        var count = 0;
        
        MaterialRequest.findAll({where: {maintenance_req: maintenance_req, cost: null}}).then(async found => {
            if(found.length){
                await Promise.all(found.map(request => {
                    NonStockConsumables.getForMaterialRequest(request.material_request).then(items => {
                        request.setDataValue('items', items);
                        count++;
                        if(count === found.length){
                            resolve(found);
                        }
                    })
                })) 
            }else{
                resolve("");
            }
                
            
        }).catch(err => {
            reject(err);
        });
    })
}

MaterialRequest.useItem = (materialRequest, item, quantity, supplierId, textPrice, quotationNumber) => {
    return new Bluebird((resolve, reject) => {
        var price = parseFloat(textPrice);
        MaterialRequest.findOne({
            where: {material_request: materialRequest}
        }).then(found => {
            if(found){
                NonStockConsumables.findOne({
                    where: {
                        id: item
                    }
                }).then(foundItem => {
                    if(foundItem){
                        console.log(foundItem.supplierId);
                        console.log(foundItem.singleCost);
                        console.log(price)
                        if((foundItem.supplierId !== parseInt(supplierId) && foundItem.supplierId !== null) || (parseFloat(foundItem.singleCost) !== parseFloat(price) && foundItem.singleCost !== null)){
                            var newItem = {
                                other_name: foundItem.other_name,
                                quantity: quantity,
                                singleCost: price/quantity,
                                pendingQuantity: 0,
                                totalCost: price,
                                details: foundItem.details,
                                supplierId: supplierId,
                                quotationNumber: quotationNumber,
                                materialRequestNumber: foundItem.materialRequestNumber,
                                maintenanceReq: foundItem.maintenanceReq,
                            }
                            MaintenanceConsumables.useNonStockConsumable(newItem).then(() => {
                                foundItem.pendingQuantity = parseInt(foundItem.pendingQuantity) - parseInt(quantity);
                                foundItem.quantity = parseInt(foundItem.quantity) + parseInt(quantity);
                                foundItem.save().then(() => {
                                    NonStockConsumables.findAll({
                                        where: {
                                            materialRequestNumber: materialRequest,
                                        }
                                    }).then(foundMaterials => {
                                       if(foundMaterials){
                                           var count = 0;
                                           var numberOfMaterials = foundMaterials.length;
                                           foundMaterials.map(materials => {
                                               if(materials.pendingQuantity === parseInt(0)){
                                                   numberOfMaterials -= 1;
                                               }
                                               if(numberOfMaterials === 0){
                                                    found.destroy().then(() => {
                                                        resolve("Material Recieved!!");
                                                    }).catch(err => {
                                                        reject(err);
                                                    });
                                                }
                                                if(count === foundMaterials.length){
                                                    resolve("Material Recieved!!");
                                                }
                                           }) 

                                        }    

                                    })
                                    
                                }).catch(err => {
                                    reject(`Server Error ${err}`);
                                })
                                
                            }).catch(err => {
                                reject(`Server Error ${err}`);
                            });
                        }else{
                            console.log(foundItem);
                            foundItem.pendingQuantity = parseInt(foundItem.pendingQuantity) - parseInt(quantity);
                            foundItem.quantity = parseInt(foundItem.quantity) + parseInt(quantity);
                            foundItem.singleCost =parseFloat(price);
                            foundItem.totalCost = foundItem.singleCost * foundItem.quantity;
                            foundItem.supplierId = supplierId;
                            console.log(foundItem);
                            MaintenanceConsumables.findOne({where: {consumable_id: foundItem.id}}).then(foundConsumable => {
                                foundItem.save().then(() => {
                                    foundConsumable.consumable_quantity = parseInt(foundConsumable.consumable_quantity) + parseInt(quantity);
                                    foundConsumable.save().then(() => {
                                        NonStockConsumables.findAll({
                                            where: {
                                                materialRequestNumber: materialRequest,
                                            }
                                        }).then(foundMaterials => {
                                           if(foundMaterials){
                                               var count = 0;
                                               var numberOfMaterials = foundMaterials.length;
                                               foundMaterials.map(materials => {
                                                   if(materials.pendingQuantity === parseInt(0)){
                                                       numberOfMaterials -= 1;
                                                   }
                                                   if(numberOfMaterials === 0){
                                                        found.destroy().then(() => {
                                                            resolve("Material Recieved!!");
                                                        }).catch(err => {
                                                            reject(err);
                                                        });
                                                    }
                                                    if(count === foundMaterials.length){
                                                        resolve("Material Recieved!!");
                                                    }
                                               }) 
    
                                            }    
    
                                        }).catch(err => {
                                            reject(err);
                                        })

                                    }).catch(err => {
                                        reject(`Server Error ${err}`);

                                    }); 
                                    

                                }).catch(err => {
                                    reject(`Server Error ${err}`);

                                });

                            }).catch(err => {
                                reject(`Server Error ${err}`);
                                    
                            });

                        }
                       
                    }else{
                        reject("No Item To Update");

                    }
                
                }).catch(err => {
                    reject(`Item Could Not Be Updated ${err}`);

                })

            }else{
                reject("No Request To Update");

            }

        }).catch(err => {
            reject(`Request Could Not Be Updated ${err}`);
            
        })
    })
}

export default MaterialRequest;
