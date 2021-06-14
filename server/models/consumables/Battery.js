import _ from 'lodash';
import bcrypt from 'bcrypt';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import Consumable from '../Consumables'
import sequelize from '../../mySQLDB';
import { response } from 'express';

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    batSpec: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carYear:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    minQuantity:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false,
    },
    quantity:{
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

const Battery = sequelize.define('battery_stocks', mappings, {
  indexes: [
    {
      name: 'battery_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'battery_quantity_index',
      method: 'BTREE',
      fields: ['quantity'],
    },
    {
        name: 'battery_batSpec_index',
        method: 'BTREE',
        fields: ['batSpec']
    },
    {
        name: 'battery_carBrand_index',
        method: 'BTREE',
        fields: ['carBrand']
    },
    {
        name: 'battery_carYear_index',
        method: 'BTREE',
        fields: ['carYear']
    },
    {
        name: 'battery_minQuantity_index',
        method: 'BTREE',
        fields: ['minQuantity']
    },
    {
      name: 'battery_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'battery_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
  ],
});

Battery.addBattery = (newBattery) =>{
    console.log(newBattery);
    return new Promise((resolve, reject) => {
        if(newBattery.id){
            Battery.findOne({
                where: {id: newBattery.id} 
            }).then(foundBattery =>{
                var quant = parseInt(newBattery.quantity) + foundBattery.quantity;
                resolve(Battery.update({quantity: quant}, {
                    where: {
                        id: newBattery.id
                    }
                }));
            }).catch(err=>{
                console.log(err);
            })
        }else{
            Battery.findOne({
                where: {
                    batSpec: newBattery.batSpec,
                    carBrand: newBattery.carBrand,
                    carYear: newBattery.carYear
                }
            }).then(foundBattery => {
                console.log(JSON.stringify(foundBattery));
                if(foundBattery){
                    var quant = parseInt(newBattery.quantity) + foundBattery.quantity;
                    console.log("adding " + quant);
                    resolve(Battery.update({quantity: quant}, {
                        where: {
                            batSpec: newBattery.batSpec,
                            carBrand: newBattery.carBrand,
                            carYear: newBattery.carYear
                        }
                    }));
                }else{
                    console.log("Adding this " + JSON.stringify(newBattery));
                    resolve(Battery.create(newBattery).then(()=> {
                        console.log("created")
                    }).catch(err =>{
                        console.log(err);
                    }));
                }
            }).catch(err =>{
                reject(err);
            });
        }
        
    });
}

Battery.getBatteryStocks = async () =>{
    var batteriesC, batSpecs, carBrands, carYears, batteryQuantity;
    await Consumable.getSpecific("battery").then(consumables => {
        console.log(consumables);
        batteriesC = consumables
    });
    
    await Battery.findAll({attributes: [[Sequelize.literal('DISTINCT `batSpec`'), 'batSpec']],raw:true, nest:true}).then(spec => {
        batSpecs = spec
        console.log(batSpecs);
        
    });
    await Battery.findAll({attributes: [[Sequelize.literal('DISTINCT `carBrand`'), 'carBrand']]}).then(spec => {
        carBrands = spec
        console.log(carBrands);
        
    });
    await Battery.findAll({attributes: [[Sequelize.literal('DISTINCT `carYear`'), 'carYear']]}).then(spec => {
        carYears = spec
        console.log(carYears);
        
    });
    var values = {
        consumable: batteriesC.rows, specs: batSpecs, brands: carBrands, years:carYears
    }
    return values;
}

export default Battery;