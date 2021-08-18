import _ from 'lodash';
import Bluebird from 'bluebird';
import Sequelize from 'sequelize';
import sequelize from '../mySQLDB';
import Battery from './consumables/Battery';
import Brake from './consumables/Brake';
import Filter from './consumables/Filter';
import Grease from './consumables/Grease';
import Oil from './consumables/Oil';
import Supplier from './Supplier';
import Other from './consumables/Other';
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
      if(action === "update"){
        Consumable.findOne({where: {
          category: newConsumable.category
        }}).then(found => {
          var newQuantity = newConsumable.quantity + found.quantity;
          Consumable.update({quantity: newQuantity}, {
            where: {
              category: newConsumable.category
            }
  
          }).then(() => {
            resolve("Consumable Update");
          }).catch(err => {
            reject(err);
          })
        })
        
      }else{
        var model = getConsumableModel(newConsumable.category.toLowerCase());
        model.findOne({
          where: {
            id: createConsumable.id
          }
        }).then(found => {
          if(found === null){
            reject("Item does not exist in stock");
          }else{
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
                    var consumableToUpdate;
                    if(createConsumable.category === "Grease" || createConsumable.category === "Oil"){
                      consumableToUpdate = 
                      {
                        id: createConsumable.id,
                        volume: newConsumable.quantity
                      }
                
                    }else{
                      consumableToUpdate = 
                      {
                        id: createConsumable.id,
                        quantity: newConsumable.quantity
                      }
                    }
    
                    console.log("AAAAAAAAAAAAAAAAAAAAAA");
                    console.log(consumableToUpdate);
                    model.updateConsumable(consumableToUpdate, action).then(output => {
                      resolve(output);
                    }).catch(err => {
                      reject (err);
                    })
    
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
          }
      
        })
      }
  });

}

Consumable.updateOtherConsumable = (createConsumable, action) => {
  const newConsumable = 
    {
      category: createConsumable.other_name,
      quantity: parseFloat(createConsumable.quantity)
    }
    return new Bluebird((resolve, reject) => {
      Consumable.findOne({
        where: {
          category: newConsumable.category
        }
      }).then(found => {
        if(found === null){
          Consumable.create(newConsumable).then(() => {
            Other.updateConsumable(createConsumable, action).then(output => {
              resolve(output);

            }).catch(err => {
              reject(err);

            });
            
          }).catch(err => {
            reject(err);

          });

        }else{
          if(action === "add"){
            var quant = newConsumable.quantity + found.quantity;

          }else if(action === "delete"){
            var quant = found.quantity - newConsumable.quantity;

          }

          Other.updateConsumable(createConsumable, action).then(output => {
            Consumable.update({quantity: quant}, {
              where: {
                category: newConsumable.category
  
              }
  
            }).then(() => {
              resolve(output);

            }).catch(err => {
              reject(err);

            })

          }).catch(err => {
            reject(err);
          })

        }

      }).catch(err => {
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
                            //Getting all Supplier Stock
                            Supplier.findAll().then(suppliers => {
                                //Creating variable of all need lists to return
                                var values = {
                                  batteries: batteries.rows, brakes: brakes.rows,
                                  filters: filters.rows, grease: grease.rows, 
                                  oil: oil.rows, supplier: suppliers
                                };

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
        
        }).catch(err => {
          reject("Error Connecting to the server " + err);

        });  
    
    });
  
}

Consumable.getFullSupplierStock = sId => {
    return new Bluebird((resolve, reject) => {
        var consumables = [];
        Battery.getSupplierStock(sId).then(batteries => {
            batteries.rows.map(battery => consumables.push(
              {category: "Battery", quantity: battery.quantity, totalCost: battery.totalCost, singleCost: battery.singleCost, quotationNum: battery.quotationNumber}
              )
            );

            resolve(consumables);
        })
    })
}

Consumable.getDistinctConsumableValues = () => {
    return new Bluebird((resolve, reject) => {
        Battery.getBatteryStocks().then(batteries =>{
            Brake.getBrakeStock().then(brakes =>{
                Filter.getFilterStock().then(filters =>{
                    Grease.getGreaseStock().then(grease => {
                        Oil.getOilStock().then(oil => {
                            Supplier.findAll().then(suppliers => {
                                var values = {
                                    batteries: batteries, brakes: brakes, filters: filters,
                                    grease: grease, oil: oil, supplier: suppliers
                                };
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

Consumable.getBattery = () => {
  return new Bluebird((resolve, reject) => {
    resolve(Battery);
  })
  
}

Consumable.getBrake = () => {
  return new Brake;
}

Consumable.getFilter = () => {
  return new Filter;
}

Consumable.getOil = () => {
  return new Oil;
}

Consumable.getGrease = () => {
  return new Grease;
}

function getConsumableModel(consumableModel) {
  if (consumableModel === "brake"){
      return Brake;

  }else if(consumableModel === "filter"){
      return Filter;

  }else if(consumableModel === "grease"){
      return Grease;

  }else if(consumableModel === "oil"){
      return Oil;

  }else if(consumableModel === "battery"){
      return Battery;

  }

};

export default Consumable;