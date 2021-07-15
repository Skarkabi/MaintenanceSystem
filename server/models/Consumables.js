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
import Supplier from './Supplier';

/**
 * Setting the Datatypes for the MySQL tables
 */
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

/**
 * Defining the Consumable MySQL Table
 */
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

Consumable.updateConsumable = (createConsumable, action) => {
    const newConsumable = 
    {
      category: createConsumable.category,
      quantity: parseFloat(createConsumable.quantity)
    }

    return new Bluebird((resolve, reject) => {
      Consumable.getConsumableByCategory(newConsumable.category).then(isCategory => {
        if (isCategory){
          if(action === "add"){
            var quant = newConsumable.quantity + isCategory.quantity;
          
          }else if(action === "delet"){
            var quant = isCategory.quantity - newConsumable.quantity;
          }
          
          Consumable.update({quantity: quant}, {
            where: {
              category: newConsumable.category
            }

          }).then(() => {
            resolve("Consumable updated");

          }).catch(err => {
            reject(err);

          });

        }else{
          Consumable.create(newConsumable).then(() => {
            resolve("New Consumable Created");

          }).catch(err => {
            reject (err);

          });

        }

      }).catch(err =>{
          reject(err);

      });  

  });

}

Consumable.getFullStock = () => {
    return new Bluebird((resolve, reject) => {
        Battery.getStock().then(batteries => {
            Brake.getStock().then(brakes => {
                Filter.getStock().then(filters => {
                    Grease.getStock().then(grease => {
                        Oil.getStock().then(oil => {
                            var values = {batteries: batteries.rows, brakes: brakes.rows,
                                          filters: filters.rows, grease: grease.rows, oil: oil.rows};

                            resolve(values);

                        }).catch(err => {
                          reject("Error Connecting to the server");
                        });

                    }).catch(err => {
                        reject("Error Connecting to the server");
                    
                    });
  
                }).catch(err => {
                  reject("Error Connecting to the server");

                });

            }).catch(err => {
              reject("Error Connecting to the server");

            });
        
        }).catch(err => {
          reject("Error Connecting to the server " + err);

        });  
    
    });
  
}

Consumable.getConsumableByCategory = category => Consumable.findOne({
  where:{category}

});

Consumable.getSpecific = (consumable) => {
    return new Bluebird(async (resolve, reject) => {
        if(consumable == "battery"){
            Battery.findAndCountAll({raw:false}).then(async batteries => {
              await Supplier.getSupplierNames(batteries);
              resolve(batteries);
              
            }).catch(err => {
                reject(err);

            });
    
        }else if(consumable == "brake"){   
            Brake.findAndCountAll().then(async brakes => {
                await Supplier.getSupplierNames(brakes);
                resolve (brakes);

            }).catch(err => {
                reject(err);

            });

        }else if(consumable == "filter"){
            Filter.findAndCountAll().then(async filters => {
                await Supplier.getSupplierNames(filters);
                resolve(filters);

            }).catch(err =>{
                reject(err);

            });
            
        }else if(consumable == "grease"){
            Grease.findAndCountAll().then(async grease => {
              await Supplier.getSupplierNames(grease);
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
        };
    });
};

export default Consumable;