import _ from 'lodash';
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

const Consumable = sequelize.define('consumable_stocks', mappings, {
  indexes: [
    {
      name: 'consumable_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'consumable_quantity_index',
      method: 'BTREE',
      fields: ['quantity'],
    },
    {
      name: 'user_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'user_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
  ],
});

Consumable.addConsumable = (createConsumable) => {
    const newConsumable = 
    {
      category: createConsumable.category,
      quantity: createConsumable.quantity
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

export default Consumable;