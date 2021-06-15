import _ from 'lodash';
import bcrypt from 'bcrypt';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../mySQLDB';
import Battery from './consumables/Battery';
import Brake from './consumables/Brake';
import Filter from './consumables/Filter';
import Grease from './consumables/Grease';
import Oil from './consumables/Oil';

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    quantity:{
        type: Sequelize.DataTypes.DOUBLE,
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

const Consumable = sequelize.define('consumable_stocks', mappings, {
  indexes: [
    {
      name: 'consumable_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
        name: 'consumable_category_index',
        method: 'BTREE',
        fields: ['category']
    },
    {
      name: 'consumable_quantity_index',
      method: 'BTREE',
      fields: ['quantity'],
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
  ],
});

Consumable.addConsumable = (createConsumable) => {
    const newConsumable = 
    {
      category: createConsumable.category,
      quantity: parseFloat(createConsumable.quantity)
    }
    console.log(newConsumable);
    return new Promise ((resolve, reject) => {
      Consumable.getConsumableByCategory(newConsumable.category).then(isCategory => {
        if (isCategory){
            var quant = newConsumable.quantity + isCategory.quantity;
            console.log("adding " + quant);
          resolve(Consumable.update({ quantity: quant}, {
            where: {
              category: newConsumable.category
            }
        }))
        console.log("Updated");
        }else{
          resolve( Consumable.create(newConsumable));
        }
      }).catch(err =>{
          reject(err);
      });  
    });
  }

  Consumable.getConsumableByCategory = category => Consumable.findOne({
    where:{category}
  });

Consumable.getSpecific = (consumable) => {
   
    return new Promise((resolve, reject) => {
        if(consumable == "battery"){
            Battery.findAndCountAll().then(batteries => {
                resolve (batteries);
            }).catch(err => {
                reject(err);
            });
    
        }else if(consumable == "brake"){   
            Brake.findAndCountAll().then(brakes => {
                resolve (brakes);
            }).catch(err => {
                reject(err);
            });
        }else if(consumable == "filter"){
            Filter.findAndCountAll().then(filters => {
                resolve(filters);
            }).catch(err =>{
                reject(err);
            });
        }else if(consumable == "grease"){
            Grease.findAndCountAll().then(grease => {
                resolve(grease);
            }).catch(err =>{
                reject(err);
            });
        }else if(consumable == "oil"){
            Oil.findAndCountAll().then(oil => {
                resolve(oil);
            }).catch(err =>{
                reject(err);
            });
        }
    });
};

export default Consumable;