import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../mySQLDB';
import Battery from './consumables/Battery';
import Brake from './consumables/Brake';
import Filter from './consumables/Filter';
import Grease from './consumables/Grease';
import Oil from './consumables/Oil';

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

/**
 * Function to update consumable stock
 * Takes in the consumable object and if the value should be deleted or added
 * @param {*} newBattery 
 * @param {*} action 
 * @returns msg to flash for the user
 */
Consumable.updateConsumable = (createConsumable, action) => {
    //Creating the new Consumable value to be updated in the consumable databse
    const newConsumable = 
    {
      category: createConsumable.category,
      quantity: parseFloat(createConsumable.quantity)
    }

    return new Bluebird((resolve, reject) => {
      //Checking if the consumable category already exists in stock
      Consumable.getConsumableByCategory(newConsumable.category).then(isCategory => {
        //If Consumable exists update the new vale
        if (isCategory){
          if(action === "add"){
            var quant = newConsumable.quantity + isCategory.quantity;
          
          }else if(action === "delet"){
            var quant = isCategory.quantity - newConsumable.quantity;
          }
          
          //Updating the consumable stock value
          Consumable.update({quantity: quant}, {
            where: {
              category: newConsumable.category
            }

          }).then(() => {
            resolve("Consumable updated");

          }).catch(err => {
            reject(err);

          });

        //If Consumable doesn't exist create a new category in database
        }else{
          //Creating new consumable category in database
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

/**
 * Function to get all consumable stocks 
 * Function gets all available consumable stock options 
 * @returns object with lists of all avialable consumables
 */
Consumable.getFullStock = () => {
    return new Bluebird((resolve, reject) => {
        //Getting battery stock
        Battery.getStock().then(batteries => {
            //Getting brake stock
            Brake.getStock().then(brakes => {
                //Getting filter stock
                Filter.getStock().then(filters => {
                    //Getting grease stock
                    Grease.getStock().then(grease => {
                        //Getting oil stock
                        Oil.getStock().then(oil => {
                            //Creating variable of all need lists to return
                            var values = {batteries: batteries.rows, brakes: brakes.rows,
                                          filters: filters.rows, grease: grease.rows, oil: oil.rows};

                            resolve(values);

                        }).catch(err => {
                          reject("Error Connecting to the server " + err);

                        });

                    }).catch(err => {
                        reject("Error Connecting to the server " + err);
                    
                    });
  
                }).catch(err => {
                  reject("Error Connecting to the server " + err);

                });

            }).catch(err => {
              reject("Error Connecting to the server " + err);

            });
        
        }).catch(err => {
          reject("Error Connecting to the server " + err);

        });  
    
    });
  
}

/**
 * Function to see if consumable category exists
 * @param {*} category 
 * @returns the found consumable category
 */
Consumable.getConsumableByCategory = category => Consumable.findOne({
  where:{category}

});


export default Consumable;