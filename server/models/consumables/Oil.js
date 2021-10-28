import Bluebird from 'bluebird';
import _ from 'lodash';
import Sequelize from 'sequelize';
import Supplier from '../Supplier';
import sequelize from '../../mySQLDB';
import Consumable from '../Consumables';

/**
 * Declaring the datatypes used within the Grease class
 */
const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    oilSpec: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    typeOfOil: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    volume:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull:false,
    },
    minVolume:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false
    },
    preferredBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false  
    },
    oilPrice:{
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: false
    },
    totalCost: {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: false,
    },
    supplierId:{
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    supplierName:{
      type: Sequelize.DataTypes.VIRTUAL(Sequelize.DataTypes.STRING, ['supplierName']),
    },
    quotationNumber:{
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
}

/**
 * Defining the oil stocks table within the MySQL database using Sequelize
 */
const Oil = sequelize.define('oil_stocks', mappings, {
  indexes: [
    {
      name: 'oil_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'oil_volume_index',
      method: 'BTREE',
      fields: ['volume'],
    },
    {
      name: 'oil_minVolume_index',
      method: 'BTREE',
      fields: ['minVolume'],
    },
    {
      name: 'oil_oilSpec_index',
      method: 'BTREE',
      fields: ['oilSpec']
    },
    {
      name: 'oil_typeOfOil_index',
      method: 'BTREE',
      fields: ['typeOfOil']
    },
    {
      name: 'oil_oilPrice_index',
      method: 'BTREE',
      fields: ['oilPrice']
    },
    {
      name: 'oil_totalCost_index',
      method: 'BTREE',
      fields: ['totalCost']
    },
    {
      name: 'oil_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'oil_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
    {
      name: 'oil_supplierId_index',
      method: 'BTREE',
      fields: ['supplierId']
  },
  {
      name: 'oil_quotationNumber_index',
      method: 'BTREE',
      fields: ['quotationNumber']
  }
  ],
});

Oil.beforeCreate((oil, options) => {
  console.log("NEW BEFORE");
  oil.totalCost = oil.oilPrice * oil.volume;
});

/**
 * Function to set virtual datatype supplier name using supplier ids in oil
 * @returns List of oil with their supplier names
 */
Oil.getStock = () => {
  return new Bluebird((resolve, reject) => {
    //Getting all the oil found in the database
    Oil.findAndCountAll().then(oil => {
      //Calling supplier function to add supplier name to oil objects
      Supplier.getSupplierNames(oil).then(() => {
        resolve(oil);

      }).catch(err => {
        reject(err);

      });

    }).catch(err => {
        reject(err);

    });

  });

}

Oil.getSupplierStock = sId => {
  return new Bluebird((resolve, reject) => {
    //Getting all the oil found in the database
    Oil.findAndCountAll({
      where: {supplierId: sId}
    }).then(oil => {
      //Calling supplier function to add supplier name to oil objects
      Supplier.getSupplierNames(oil).then(() => {
        resolve(oil);

      }).catch(err => {
        reject(err);

      });

    }).catch(err => {
        reject(err);

    });

  });

}

/**
 * function to return distinct values in object
 * @param {*} values 
 * @returns filtered values 
 */
function getDistinct(values){
  return values.filter((value, index, self) => self.indexOf(value) === index);
}

/**
 * Function to return list of oil with their supplier names, as well as distinct values found within the database
 * @returns object that includes all oil, suppliers, and distinct values of each oil spec
 */
Oil.getOilStock = () => {
    return new Bluebird((resolve, reject) => {
        //Declaring all variables to be returned
        var oilC, oilS, oilSpecs, typeOfOils, preferredBrands;
        //Getting all suppliers saved in database
        Supplier.findAll().then(suppliers => {
            oilS = suppliers;
            //Getting all oil from database and setting supplier names 
            Oil.getStock().then(consumables => {
                oilC = consumables;
                //Mapping oil values to not return double values
                oilSpecs = getDistinct(oilC.rows.map(val => val.oilSpec));
                typeOfOils = getDistinct(oilC.rows.map(val => val.typeOfOil));
                preferredBrands = getDistinct(oilC.rows.map(val => val.preferredBrand));

                //Creating variable of all need variables to return
                var values = {
                    consumables: oilC.rows, suppliers: oilS, specs: oilSpecs, 
                    typeOfOils: typeOfOils, preferredBrands: preferredBrands
  
                };

                resolve(values);

            }).catch(err => {
              reject("Error Connecting to the Server (" + err + ")");

            });

        }).catch(err => {
          reject("Error Connecting to the Server (" + err + ")");
          
        });

    });

}

/**
 * Function to update Oil stock
 * Takes in the oil object and if the value should be deleted or added
 * @param {*} nrewOil 
 * @param {*} action 
 * @returns msg to be flashed to user
 */
Oil.updateConsumable = (newOil,action) => {
  return new Bluebird((resolve, reject) => {
    
    //Creating the new Consumable value to be updated in the consumable databse
    //Checking if the oil spec exists within the stock
    Oil.findOne({
      where: {
        id: newOil.id
      }

    }).then(foundOil => {
     
      //If the oil exists in the databse the function sets the new quantity to the new value
      if(foundOil){
        var newVolume;
        if(newOil.voluem){
          newVoulme = newOil.volume;
        }else{
          newVolume = newOil.quantity
        }
        var quant;
        if(action === "add"){
          quant = parseFloat(newVolume) + foundOil.volume;
      
        }else if(action === "delet"){
          quant = foundOil.volume - parseFloat(newVolume);
      
        }
        console.log("------------------------------------------");
        console.log(quant);
        if(quant < 0){
          reject("Can not Delete more than exists in stock");
        
        //If quantity is > 0 the grease quantity is updated
        }else{
          
          Oil.update({volume: quant}, {
            where: {
              id: newOil.id
            }
  
          }).then(() => {
            console.log("------------------------------------------");
            console.log("What");
            //Updating the value from the consumables database
            if(action === "delet"){
              resolve(newOil.volume + " Litters of Oil Sucessfully Deleted from Existing Stock!");
            }else if(action === "add"){
              resolve(newOil.volume + " Litters of Oil Sucessfully Added to Existing Stock!");
            }
  
          }).catch(err => {
            reject("An Error Occured Oil Could not be Added " + err);
  
          });

        }

      }else{
        newOil.volume = parseFloat(newOil.volume);
        newOil.minVolume = parseFloat(newOil.minVolume);
        newOil.oilPrice = parseFloat(newOil.oilPrice)
        newOil.totalCost = newOil.oilPrice * newOil.volume;
        newOil.totalCost = parseFloat(newOil.total_price);
        Oil.create(newOil).then(() => {
          resolve(newOil.volume + " Liters of Oil Sucessfully Added!");
        
        }).catch(err => {
          reject("An Error Occured Oil Could not be Added " + err);

        });

      }
      
    }).catch(err => {
      reject("An Error Occured Oil Could not be Added " + err);

    });

  });

}

/**
 * Function to add a new oil into stock
 * Function takes an object with the needed oil info
 * @param {*} newOil 
 * @returns msg to be flashed to user
 */
Oil.addOil = (newOil) => {
  return new Bluebird((resolve, reject) => {
    //Creating the new Consumable value to be updated in the consumable databse
    const newConsumable = {
      category: "Oil",
      quantity: newOil.volume
    };

    //Looking if the oil with exact specs and same quotation number already exists in stock
    Oil.findOne({
      where: {
        oilSpec: newOil.oilSpec,
        typeOfOil: newOil.typeOfOil,
        preferredBrand: newOil.preferredBrand,
        supplierId: newOil.supplierId,
        quotationNumber: newOil.quotationNumber,
        oilPrice: parseFloat(newOil.oilPrice)

      }

    }).then(foundOil => {
      //If this oil with this quotation number exists the function rejects the creation
      if(foundOil){
        reject("Oil With these Details Already Registered, Please Add to Existing Stock");

      //If the oil is not found the function creates a oil and updates the consumable stock
      }else{
       

      }

    }).catch(err => {
      reject("An Error Occured Oil Could not be Added " + err);

    });

  });

}

/**
 * Function to find different oil from a specific suppleir 
 * @returns list of oil values from specific supplier regardless of quotation numbers
 */
Oil.groupSupplier = () => {
  return new Bluebird((resolve, reject) => {
      //Finding oil from database and returning specified attributes 
      Oil.findAll({
          //Declaring attributes to return from database
          attributes:
            ['oilSpec', 'typeOfOil', 'supplierId', 'minVolume',
            [sequelize.fn('sum', sequelize.col('volume')), 'volume'],
          ],

          //Declaring how to group return values
          group: ['oilSpec', 'typeOfOil', 'supplierId', 'minVolume']
          
      }).then((values) => { 
          //Setting variable to return oil with their supplier names
          var result = {count: values.length, rows: values}
          Supplier.getSupplierNames(result).then(() => {
            resolve(result);

          }).catch(err => {
            reject(err);

          });
         
      }).catch(err => {
        reject(err);

    });

  });

}

Oil.groupWithOutSupplier = () => {
  return new Bluebird((resolve, reject) => {
    //Finding oil from database and returning specified attributes 
    Oil.findAll({
        //Declaring attributes to return from database
        attributes:
          ['oilSpec', 'typeOfOil', 'minVolume',
          [sequelize.fn('sum', sequelize.col('volume')), 'volume'],
          [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost'],
        ],

        //Declaring how to group return values
        group: ['oilSpec', 'typeOfOil', 'minVolume']
        
    }).then((values) => { 
        //Setting variable to return oil with their supplier names
        var result = {count: values.length, rows: values}
          resolve(values);
       
    }).catch(err => {
      reject(err);

  });

});

}

Oil.findMinimums = () => {
  return new Bluebird((resolve, reject) => {
    Oil.findAll({
      attributes:
          ['oilSpec', 'typeOfOil', 'minVolume',
          [sequelize.fn('sum', sequelize.col('volume')), 'volume'],
          [sequelize.fn('sum', sequelize.col('totalCost')), 'totalCost'],
        ],

        //Declaring how to group return values
        group: ['oilSpec', 'typeOfOil', 'minVolume'],
    }).then(values => {
      if(values.length > 0){
        var notification = "";
        Promise.all(values.map(oil => {
          if(oil.minVolume > oil.volume){
            notification = notification + ` - ${oil.oilSpec} ${oil.typeOfOil} (Minimum: ${oil.minVolume}, Current: ${oil.volume})</br>`;
          }
        
        })).then(() => {
          if(notification !== ""){
            notification = `Oil:<br>${notification}`
        }
          resolve(notification)
        })
      }else{
        resolve("")
      }
    })
  })
}

/**
 * Function to find all oil in database with specific supplier ID
 * Function takes in the supplier ID of the supplier being searched for
 * @param {*} supplierId 
 * @returns List of oil purchased from that specified supplier ID
 */
Oil.getWithSupplier = supplierId => {
  return new Bluebird((resolve, reject) => {
      //Finding all oil with specified supplier ID
      Oil.findAndCountAll({
          where: {
              supplierId: supplierId
          }

      }).then(async foundGreases => {
          //Adding supplier Name to Oil 
          Supplier.getSupplierNames(foundGreases).then(() => {
            resolve(foundGreases.rows);

          }).catch(err => {
            reject(err);

        });
          
      }).catch(err => {
          reject(err);

      });

  });
  
}

export default Oil;