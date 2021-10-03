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
import NonStockConsumables from './consumables/NonStockConsumables';
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
   
    var cQuantity;
    if(createConsumable.volume){
      cQuantity = createConsumable.volume;

    }else{
      cQuantity = createConsumable.quantity

    }

    const newConsumable = 
    {
      category: createConsumable.consumanbleCategory,
      quantity: parseFloat(cQuantity)
    }

    return new Bluebird((resolve, reject) => {
      //Checking if the consumable category already exists in stock
        Consumable.findOne({where: {
          category: newConsumable.category
        }}).then(isCategory => {
          const model = getConsumableModel(newConsumable.category.toLowerCase());
              model.updateConsumable(createConsumable, action).then(output => {
                if(isCategory){
                  var quant;
                  if(action === "add"){
                    quant = newConsumable.quantity + isCategory.quantity;
                
                  }else if(action === "delet"){
                    quant = isCategory.quantity - newConsumable.quantity;
                  }

                  Consumable.update({quantity: quant}, {
                    where: {
                      category: newConsumable.category
                    }
                  }).then(() => {
                    resolve(output);
  
                  }).catch(err => {
                    reject(err);
  
                  })

                }else{
                  Consumable.create(newConsumable).then(() => {
                    resolve(output);
      
                  }).catch(err => {
                    reject (err);
      
                  });
                }
                
              }).catch(err => {
                reject(err);

              })

    
        })

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

          }else if(action === "delet"){
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
                          Other.getStock().then(others => {
                            Supplier.findAll().then(suppliers => {
                              //Creating variable of all need lists to return
                              var values = {
                                batteries: batteries.rows, brakes: brakes.rows,
                                filters: filters.rows, grease: grease.rows, 
                                oil: oil.rows, others: others.rows, supplier: suppliers
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
        
        }).catch(err => {
          reject("Error Connecting to the server " + err);

        });  
    
    });
  
}

Consumable.getFullSupplierStock = sId => {
  return new Bluebird((resolve, reject) => {
    Battery.getSupplierStock(sId).then(batteries => {
      Brake.getSupplierStock(sId).then(brakes => {
        Filter.getSupplierStock(sId).then(filters => {
          Grease.getSupplierStock(sId).then(grease => {
            Oil.getSupplierStock(sId).then(oil => {
              Other.getSupplierStock(sId).then(others => {
                NonStockConsumables.getSupplierStock(sId).then(nonStockConsumables => {
                  var values = {
                    batteries: batteries.rows, brakes: brakes.rows, filters: filters.rows,
                    grease: grease.rows, oil: oil.rows, others: others.rows, nonStockConsumables: nonStockConsumables.rows
                  };
        
                  resolve(values);
  
                }).catch(err => {
                  reject(err);
  
                });
               
              }).catch(err => {
                reject(err);

              });

            }).catch(err => {
              reject(err);

            });

          }).catch(err => {
            reject(err);

          });

        }).catch(err => {
          reject(err);

        });

      }).catch(err => {
        reject(err);

      });

    }).catch(err => {
      reject(err);

    });

  })

}

Consumable.getDistinctConsumableValues = () => {
    return new Bluebird((resolve, reject) => {
        Battery.getBatteryStocks().then(batteries =>{
            Brake.getBrakeStock().then(brakes =>{
                Filter.getFilterStock().then(filters =>{
                    Grease.getGreaseStock().then(grease => {
                        Oil.getOilStock().then(oil => {
                          Other.getOtherStocks().then(other => {
                            Supplier.findAll().then(suppliers => {
                              var values = {
                                  batteries: batteries, brakes: brakes, filters: filters,
                                  grease: grease, oil: oil, other: other, supplier: suppliers
                              };
                              resolve(values);

                            }).catch(err => {
                              reject("Error Connecting to the server " + err);

                            });

                          }).catch(err => {
                            reject("Error Connecting to the server " + err);
                          })

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

Consumable.checkMinimums = () => {
  return new Bluebird((resolve, reject) => {
    Battery.findMinimums().then(foundBatteries => {
      Brake.findMinimums().then(foundBrakes => {
        Filter.findMinimums().then(foundFilters => {
          Grease.findMinimums().then(foundGrease => {
            Oil.findMinimums().then(foundOil => {
              var output = `${foundBatteries}${foundBrakes}${foundFilters}${foundGrease}${foundOil}`
              resolve(output.toUpperCase());
            })
           
          })
          
        })
      })
     
    })
  })
 
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