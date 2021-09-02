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
        console.log("-------------AHHHHHHHHHHH------------");
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

export default MaterialRequest;
