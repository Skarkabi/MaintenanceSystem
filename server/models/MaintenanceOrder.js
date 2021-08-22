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
        allowNull: false
    },
    work_hours: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false
    },
    total_material_cost: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.DOUBLE, ['total_material_cost']),
        allowNull: false
    },
    total_cost: {
        type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.DOUBLE, ['total_cost']),
        allowNull: false
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
        allowNull: false,
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
            getSingleVehicle(found).then(() => {
                getConsumables(found).then(() => {
                    getEmployees(found).then(() => {
                        getTotalMaterialCost(found).then(() => {
                            console.log(found);
                            setStatus(found);
                            resolve(found);
                        })
                    });
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

function setStatus(o){
    console.log("ORDERS");
    if(o.material_request === null || o.material_request === ""){
        o.setDataValue('status', "Not Started");
        console.log(1);
    }else if(o.completedAt){
        o.setDataValue('status', "Completed");
        console.log(2);
    }else{
        console.log(3);
        getConsumables(o).then(() => {
            if(o.material_request.substring(0,3) === "MCM" && o.consumable_data.length === 0){
                o.setDataValue('status', "Pending Material")
                console.log(4);
            console.log(o.material_request.substring(0,3));
            }else if(o.consumable_data.length !== 0 || o.material_request === "N/A"){
                o.setDataValue('status', "In Progress")
                console.log(5);
                
            }else{
                console.log(6);
            }
               
        })

    }
}

function getTotalMaterialCost(order){
    return new Bluebird((resolve, reject) => {
        console.log("--------------------------");
        var totalMaterialCost = 0;
        order.consumable_data.map(o => {
            totalMaterialCost = totalMaterialCost + o.consumable.totalCost;
            console.log(o.consumable);
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