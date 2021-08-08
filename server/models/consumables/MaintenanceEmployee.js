import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../../mySQLDB';
import User from '../User';

const mappings = {
    employee_id:{
        type: Sequelize.DataTypes.STRING,
        primaryKey:true
    },
    maintenance_req:{
        type: Sequelize.DataTypes.STRING,
        primaryKey:true
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

const MaintenanceEmployees = sequelize.define('maintenance_employees', mappings, {
    indexes: [
        {
            name: 'maintenance_employee_id_index',
            method: 'BTREE',
            fields: ['employee_id']
        },
        {
            name: 'maintenance_req_index',
            method: 'BTREE',
            fields: ['maintenance_req']
        },
        {
            name: 'maintenance_createdAt_index',
            method: 'BTREE',
            fields: ['createdAt'],
        },
        {
            name: 'maintenance_updatedAt_index',
            method: 'BTREE',
            fields: ['updatedAt'],
        }
    ]
});

MaintenanceEmployees.getEmployees = reqNumber => {
    return new Bluebird((resolve, reject) => {
        MaintenanceEmployees.getAllEmployeeId(reqNumber).then(employees => {
            var employeeMap = [];
            employees.map(e =>{
                console.log(1)
                console.log(e.employee_id);
                employeeMap.push(e.employee_id);
              
            });
            console.log(2);
            console.log(employeeMap);
            User.getAllUsersById(employeeMap).then(found => {
                
                resolve(found);
            })
        }).catch(err => {
            reject(err);
        });
    });
}

MaintenanceEmployees.getAllEmployeeId = reqNumber => {
    return new Bluebird((resolve, reject) => {
        MaintenanceEmployees.findAll({
            where: {
                maintenance_req: reqNumber
            },
            attributes: ['employee_id'],
            raw: true,
        }).then(found => {
            resolve(found);
        }).catch(err => {
            reject(err);
        })
    })
}

export default MaintenanceEmployees;