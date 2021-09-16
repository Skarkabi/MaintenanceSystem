import _, { reject } from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../mySQLDB';
import Vehicle from './Vehicle';
import MaintenanceConsumables from './consumables/MaintenanceConsumables';
import MaintenanceEmployees from './consumables/MaintenanceEmployee';
import MaterialRequest from './consumables/MaterialRequest';
import User from './User';

const mappings = {
    req: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.STRING, ['status']),
    },
    division: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    plate: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    user_id:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    user_data:{
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['user_data']),
    },
    material_request_data:{
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['material_request_data']),
    },
    vehicle_data: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['vehicle_data']),
    },
    consumable_data: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['consumable_data']),
    },
    employee_data: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.JSON, ['employee_data']),
    },
    discription: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    remarks: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    hour_cost: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    work_hours: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    total_material_cost: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.DOUBLE, ['total_material_cost']),

    },
    total_cost: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.DOUBLE, ['total_cost']),

    },
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
    },completedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },

};

function getDateWithoutTime(date) {
    return require('moment')(date).format('DD/MM/YYYY');
}

const MaintenanceOrder = sequelize.define('maintenance_orders', mappings, {
    indexes: [
        {
            name: 'maintenance_order_req_index',
            method: 'BTREE',
            fields: ['req']
        },
        {
            name: 'maintenance_order_division_index',
            method: 'BTREE',
            fields: ['division']
        },
        {
            name: 'maintenance_user_id_index',
            method: 'BTREE',
            fields: ['user_id']
        },
        {
            name: 'maintenance_order_plate_index',
            method: 'BTREE',
            fields: ['plate']
        },
        {
            name: 'maintenance_order_discription_index',
            method: 'BTREE',
            fields: ['discription']
        },
        {
            name: 'maintenance_order_remarks_index',
            method: 'BTREE',
            fields: ['remarks']
        },
        {
            name: 'maintenance_order_hour_cost_index',
            method: 'BTREE',
            fields: ['hour_cost']
        },
        {
            name: 'maintenance_work_hours_cost_index',
            method: 'BTREE',
            fields: ['work_hours']
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
            name: 'consumable_completedAt_index',
            method: 'BTREE',
            fields: ['completedAt'],
        }
    ]
});

MaintenanceOrder.getOrders = () => {
    return new Bluebird((resolve, reject) => {
        MaintenanceOrder.findAll({
            order: [
            ['createdAt', 'DESC']
            ]}).then(orders => {
            if(orders.length !== 0){
            getVehicle(orders).then( () => {
                getAllMaterialRequests(orders).then(() => {
                    getAllUsers(orders).then(() => {
                        setAllStatus(orders).then(() => {
                            console.log(orders);
                            resolve(orders);
                            
                        }).catch(err => {
                            reject(err);
    
                        })
                    }).catch(err => {
                        reject(err);
    
                    })
                    

                }).catch(err => {
                    reject(err);

                })
                
            }).catch(err =>{ 
                reject(err);

            });
        }else{
            resolve(null);
        }

        }).catch(err => {
            reject(err);

        })

    })

} 

MaintenanceOrder.getOrdersByPlate = plate => {
    return new Bluebird((resolve, reject) => {
        MaintenanceOrder.findAll({
            where: {
                plate: plate
            }
        }).then(async orders => {
            var count = 0;
            if(orders.length !== 0){
            await Promise.all(orders.map(o => {
                getConsumables(o).then(() => {
                    getMaterialRequests(o).then(() => {
                        getTotalMaterialCost(o).then(() => {
                            setStatus(o)
                            o.setDataValue('createdAt', getDateWithoutTime(o.createdAt));
                            count++;
                            if(count === orders.length){
                                resolve(orders);
                            }
                            
                        }).catch(err => {
                            reject(err);
                        })
                    }).catch(err => {
                        reject(err);
                    })
                    
                }).catch(err => {
                    reject(err);
                })
            }));
        }else{
            resolve(null);
        }
            
            
        }).catch(err => {
            reject(err);
        })
    })
} 



MaintenanceOrder.getByReq = req => {
    return new Bluebird((resolve, reject) => {
        MaintenanceOrder.findOne({
            where: {
                req: req
            }
        }).then(found => {
            getSingleVehicle(found).then(() => {
                getConsumables(found).then(() => {
                    getEmployees(found).then(() => {
                        getMaterialRequests(found).then(() => {
                            getTotalMaterialCost(found).then(() => {
                                setStatus(found);
                                resolve(found);
                            }).catch(err =>{
                                reject(err);
                        })
                        
                    }).catch(err =>{
                        reject(err);
                    })

                }).catch(err =>{
                    reject(err);
                });

            }).catch(err =>{
                reject(err);
            })

        }).catch(err =>{
            reject(err);
        });
    });
})
}


MaintenanceOrder.completeOrder = reqNumber => {
    return new Bluebird((resolve, reject) => {
        MaintenanceOrder.update({completedAt: getCurrentDate()}, {
            where: {
                req: reqNumber
            }
         }).then(() =>{
             resolve("Order Has Been Set to Completed");
    
         }).catch(err => {
             reject("Order Status Could Not Be Set " + err);
         });
    })
}

MaintenanceOrder.updateMaterialRequest = (reqNumber, materialRequest, discription, remark, work_hour, hour_cost) => {
    return new Bluebird((resolve, reject) => {
        MaintenanceOrder.update({material_request: materialRequest, discription: discription, remarks: remark, work_hours: work_hour, hour_cost: hour_cost}, {
            where: {
                req: reqNumber
            }
        }).then(found => {
            resolve(`Material Request Number ${materialRequest} Successfully Updated`);

        }).catch(err => {
            reject("Material Request Number Could not be Updated " + err);

        });

    });

}

MaintenanceOrder.addOrder = order => {
    return new Bluebird((resolve, reject) => {
        MaintenanceOrder.create(order).then(() => {
            resolve("New Order added");
        }).catch(err => {
            reject(`Order Could not be Added to The System`)
        })
    })
}

function setStatus(o){
    getConsumables(o).then(output => {
        if((!o.material_request_data  || o.material_request_data === "") && (o.consumable_data === undefined || o.consumable_data.length === 0)){
            o.setDataValue('status', "NOT STARTED");
        }else if(o.completedAt){
            o.setDataValue('status', "COMPLETED");
        }else{
            if(o.consumable_data.length !== 0 && o.material_request_data.length === 0){
                o.setDataValue('status', "IN PROGRESS")
            }else if(o.material_request_data.length !== 0){
                o.setDataValue('status', "PENDING MATERIAL")
            }else{
                
            }
                               
        }

    })
}

function setAllStatus(orders){
    return new Bluebird((resolve, reject) => {
        getAllConsumables(orders).then(async output => {
            await Promise.all(orders.map(o => {
                    if((!o.material_request_data || o.material_request_data === "") && (o.consumable_data === undefined || o.consumable_data.length === 0)){
                  
                        o.setDataValue('status', "NOT STARTED");
                    }else if(o.completedAt){
                     
                        o.setDataValue('status', "COMPLETED");
                        
                    }else{
                        if(o.consumable_data.length !== 0 && !o.material_request_data){
                              
                                o.setDataValue('status', "IN PROGRESS")
                               
                            }else if(o.material_request_data.length !== 0){
                              
                                o.setDataValue('status', "PENDING MATERIAL")
                            }else{
                
                            }
                               
                        }
                
            }))
            resolve("Done");
        })
    })
}

function getTotalMaterialCost(order){
    return new Bluebird((resolve, reject) => {
        var totalMaterialCost = 0;
        order.consumable_data.map(o => {
            if(o.type.consumable_type === "OIL"){
                totalMaterialCost = totalMaterialCost + (o.consumable.oilPrice * o.type.consumable_quantity);
            }else if(o.type.consumable_type === "GREASE"){
                totalMaterialCost = totalMaterialCost + (o.consumable.price_per_litter * o.type.consumable_quantity);
            
            }else{
            totalMaterialCost = totalMaterialCost + (o.consumable.singleCost * o.type.consumable_quantity);
            }
        }) 
        var totalCost = (order.hour_cost * order.work_hours) + totalMaterialCost;
        order.setDataValue('total_material_cost', totalMaterialCost);
        order.setDataValue('total_cost', totalCost);
        resolve("done");
    })
}

function getAllConsumables(orders){
    return new Bluebird(async (resolve, reject) => {
        var count = 0;
        await Promise.all(orders.map(o => {
            MaintenanceConsumables.getConsumables(o.req).then(found => {
                o.setDataValue('consumable_data', found);
                count++;
              
                if(count === orders.length){
                    resolve("done");
                }
            })
        }))
       
    })
}

function getAllUsers(orders){
    return new Bluebird(async (resolve, reject) => {
        var count = 0;
        await Promise.all(orders.map(o => {
            User.getUserById(o.user_id).then(user => {
                o.setDataValue('user_data', user)

                count++;
              
                if(count === orders.length){
                    resolve("done");
                }
            })
        }))
    })
}

function getAllMaterialRequests(orders){
    return new Bluebird(async (resolve, reject) => {
        var count = 0;
        await Promise.all(orders.map(o =>{
            MaterialRequest.getMaterialRequest(o.req).then(found => {
                o.setDataValue('material_request_data', found);
                count++;

                if(count === orders.length){
                    resolve("done");
                }

            }).catch(err => {
                reject(err);

            });

        }));

    });
}

function getMaterialRequests(order){
    return new Bluebird(async (resolve, reject) => {
        MaterialRequest.getMaterialRequest(order.req).then(found => {
            order.setDataValue('material_request_data', found);
            resolve("Done");
        }).catch(err => {
            reject(err);

        })
        
    })
}

function getConsumables(order){
    return new Bluebird(async (resolve, reject) => {
        MaintenanceConsumables.getConsumables(order.req).then(found =>{
            order.setDataValue('consumable_data', found);
            resolve("Set All");
        }).catch(err =>{
           reject(err);
        })
    })
}

function getEmployees(order){
    return new Bluebird((resolve, reject) => {
        MaintenanceEmployees.getEmployees(order.req).then(found => {
            order.setDataValue('employee_data', found)
            resolve("Done");
        })
    })
}

function getVehicle(orders) {
    return new Bluebird((resolve, reject) => {
        Vehicle.getStock().then(foundVehicles => {
            var vehicleMap = new Map();
            foundVehicles.rows.map(vehicles => {
                vehicleMap.set(vehicles.plate, vehicles);
            });
            orders.map(order => {
                order.setDataValue('createdAt', getDateWithoutTime(order.createdAt));
                order.setDataValue('vehicle_data', vehicleMap.get(order.plate));
            });
            resolve("Set All");
        }).catch(err => {
            reject(err);
        });
    })
}

function getCurrentDate(){
    var d = new Date();
    var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    return require('moment')(date).format('YYYY-MM-DD');
}

function getSingleVehicle(order){
    return new Bluebird((resolve, reject) => {
        Vehicle.getVehicleByPlate(order.plate).then(foundVehicle => {
            order.setDataValue('createdAt', getDateWithoutTime(order.createdAt));
            order.setDataValue('vehicle_data', foundVehicle);
            resolve("Set Vehicle");
        }).catch(err => {
            reject(err);
        });
    })
}
export default MaintenanceOrder