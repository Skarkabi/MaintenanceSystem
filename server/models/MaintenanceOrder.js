import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../mySQLDB';
import Consumable from './Consumables';
import Vehicle from './Vehicle';
import User from './User';
import Battery from './consumables/Battery';
import MaintenanceConsumables from './consumables/MaintenanceConsumables';
import MaintenanceEmployees from './consumables/MaintenanceEmployee';

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
    material_request:{
        type: Sequelize.DataTypes.STRING,
        allowNull: true
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
            name: 'maintenance_order_material_request_index',
            method: 'BTREE',
            fields: ['material_request']
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
        MaintenanceOrder.findAll().then(orders => {
            orders.map(o => {
                setStatus(o);
            })
           getVehicle(orders).then(() => {
               resolve(orders);
           });
            
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
        }).then(orders => {
            orders.map(o => {
                o.setDataValue('createdAt', getDateWithoutTime(o.createdAt));
                setStatus(o);
            })
            resolve(orders);
            
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
            console.log(0);
            getSingleVehicle(found).then(() => {
                console.log(1);
                getConsumables(found).then(() => {
                    console.log(2);
                    getEmployees(found).then(() => {
                        console.log(3);
                        getTotalMaterialCost(found).then(() => {
                            console.log(4);
                            setStatus(found);
                            resolve(found);
                        })
                    });
                }).catch(err =>{
                    console.log("...................................");
                    console.log(err);
                    console.log("...................................");
                });
            });
        });
    });
}


MaintenanceOrder.completeOrder = reqNumber => {
    return new Bluebird((resolve, reject) => {
        MaintenanceOrder.update({completedAt: getCurrentDate()}, {
            where: {
                req: reqNumber
            }
         }).then(() =>{
             console.log("updated");
             resolve("Order Has Been Set to Completed");
    
         }).catch(err => {
             reject("Order Status Could Not Be Set " + err);
         });
    })
}

MaintenanceOrder.updateMaterialRequest = (reqNumber, materialRequest, discription, remark, work_hour) => {
    return new Bluebird((resolve, reject) => {
        MaintenanceOrder.update({material_request: materialRequest, discription: discription, remarks: remark, work_hours: work_hour}, {
            where: {
                req: reqNumber
            }
        }).then(() => {
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
        })
    })
}

function setStatus(o){
    console.log(o.consumable_data);
    if((o.material_request === null || o.material_request === "") && (o.consumable_data === undefined || o.consumable_data.length === 0)){
        o.setDataValue('status', "Not Started");
    }else if(o.completedAt){
        o.setDataValue('status', "Completed");
    }else{
        getConsumables(o).then(() => {
            if(o.consumable_data.length !== 0 || o.material_request === "N/A"){
                o.setDataValue('status', "In Progress")
               
            }else if(o.material_request.substring(0,3) === "MCM" && o.consumable_data.length === 0){
                o.setDataValue('status', "Pending Material")
            }else{

            }
               
        })

    }
}

function getTotalMaterialCost(order){
    return new Bluebird((resolve, reject) => {
        var totalMaterialCost = 0;
        order.consumable_data.map(o => {
            totalMaterialCost = totalMaterialCost + o.consumable.totalCost;
        }) 
        var totalCost = (order.hour_cost * order.work_hours) + totalMaterialCost;
        order.setDataValue('total_material_cost', totalMaterialCost);
        order.setDataValue('total_cost', totalCost);
        resolve("done");
    })
}

function getConsumables(order){
    return new Bluebird((resolve, reject) => {
        MaintenanceConsumables.getConsumables(order.req).then(found =>{
            order.setDataValue('consumable_data', found);
            resolve("Set All");
        }).catch(err =>{
            console.log("...................................");
            console.log(err);
            console.log("...................................");
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