import Bluebird from 'bluebird';
import _ from 'lodash';
import Sequelize from 'sequelize';
import Supplier from '../Supplier';
import sequelize from '../../mySQLDB';
import Consumable from '../Consumables';

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

Oil.getOilStock = () => {
  return new Bluebird(async(resolve, reject) => {
    var oilC, oilS, oilSpecs, typeOfOils, preferredBrands
    await Consumable.getSpecific("oil").then(consumables => {
      oilC = consumables;
  
    }).catch(() => {
      reject("Error Connecting to the Server");

    });

    await Supplier.findAll().then(suppliers => {
      oilS = suppliers
     
    }).catch(() => {
      reject("Error Connecting to the Server");
    });

    await Oil.findAll({attributes: [[Sequelize.literal('DISTINCT `oilSpec`'), 'oilSpec']],raw:true, nest:true}).then(spec => {
      oilSpecs = spec
  
    }).catch(() => {
      reject("Error Connecting to the Server");

    });

    await Oil.findAll({attributes: [[Sequelize.literal('DISTINCT `typeOfOil`'), 'typeOfOil']],raw:true, nest:true}).then(spec => {
      typeOfOils = spec
  
    }).catch(() => {
      reject("Error Connecting to the Server");

    });

    await Oil.findAll({attributes: [[Sequelize.literal('DISTINCT `preferredBrand`'), 'preferredBrand']],raw:true, nest:true}).then(spec => {
      preferredBrands = spec
  
    }).catch(() => {
      reject("Error Connecting to the Server");

    });

    var values = {
      consumables: oilC.rows, suppliers: oilS, specs: oilSpecs, 
      typeOfOils: typeOfOils, preferredBrands: preferredBrands
  
    };
    resolve(values);

  });
  
}

Oil.updateOil = (newOil,action) => {
  return new Bluebird((resolve, reject) => {
    const newConsumable = {
      category: "Oil",
      quantity: newOil.volume
    };

    Oil.findOne({
      where: {
        id: newOil.id
      }

    }).then(foundOil => {
      var quant;
      if(action === "add"){
          quant = parseFloat(newOil.volume) + foundOil.volume;
      
      }else if(action === "delet"){
          quant = foundOil.volume - parseFloat(newOil.volume);
      
      }

      if(quant === 0){
        foundOil.destroy().then(() => {
          Consumable.updateConsumable(newConsumable, action).then(() => {
            resolve(newOil.voulme + " liters Of Oil Successfully Deleted from Existing Stock!");
          
          }).catch(err => {
            reject("An Error Occured Oil Could not be Deleted");
          
          });
        
        }).catch(err => {
          reject("An Error Occured Oil Could not be Deleted");

        });
      }else if(quant < 0){
        reject("Can not Delete more than exists in stock");
        
      }else{
        Oil.update({volume: quant}, {
          where: {
            id: newOil.id
          }
  
        }).then(() => {
          Consumable.updateConsumable(newConsumable, action).then(() => {
            resolve(newOil.volume + " Liters of Oil Sucessfully Added to Existing Stock!");
      
          }).catch(err => {
              reject("An Error Occured Oil Could not be Added");
  
          });
  
        }).catch(err => {
          reject("An Error Occured Oil Could not be Added");
  
        });

      }

    }).catch(err => {
      reject("An Error Occured Oil Could not be Added");

    });

  });

}

Oil.addOil = (newOil) => {
  return new Bluebird((resolve, reject) => {
    const newConsumable = {
      category: "Oil",
      quantity: newOil.volume
    };

    Oil.findOne({
      where: {
        oilSpec: newOil.oilSpec,
        typeOfOil: newOil.typeOfOil,
        preferredBrand: newOil.preferredBrand,
        supplierId: newOil.supplierId,
        quotationNumber: newOil.quotationNumber,

      }

    }).then(foundOil => {
      if(foundOil){
        reject("Oil With these Details Already Registered, Please Add to Existing Stock");

      }else{
        newOil.volume = parseFloat(newOil.volume);
        newOil.minVolume = parseFloat(newOil.minVolume);
        Oil.create(newOil).then(() => {
          Consumable.updateConsumable(newConsumable, "add").then(() => {
            resolve(newOil.volume + " Liters of Oil Sucessfully Added!");

          }).catch(err => {
            reject("An Error Occured Oil Could not be Added");

          });

        }).catch(err => {
          reject("An Error Occured Oil Could not be Added");

        });

      }

    }).catch(err => {
      reject("An Error Occured Oil Could not be Added");

    });

  });

}

Oil.groupSupplier = () => {
  return new Bluebird((resolve, reject) => {
      Oil.findAll({
          attributes:
            ['oilSpec', 'typeOfOil', 'supplierId',
            [sequelize.fn('sum', sequelize.col('volume')), 'volume'],
          ],

          group: ['oilSpec', 'typeOfOil', 'supplierId']
          
      }).then(async (values) => { 
          var result = {count: values.length, rows: values}
          await Supplier.getSupplierNames(result);
         resolve(result);
      });
  })
}

Oil.getWithSupplier = supplierId => {
  return new Bluebird((resolve, reject) => {
      Oil.findAndCountAll({
          where: {
              supplierId: supplierId
          }
      }).then(async foundGreases => {
          await Supplier.getSupplierNames(foundGreases);
          resolve(foundGreases.rows);
      }).catch(err => {
          reject(err);
      });
  });
}

export default Oil;