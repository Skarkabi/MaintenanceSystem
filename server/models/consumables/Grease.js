import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';
import Bluebird from 'bluebird';
import Supplier from '../Supplier';

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    greaseSpec: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    typeOfGrease: {
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
    volume:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull:false,
    },
    minVolume:{
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
};

const Grease = sequelize.define('grease_stocks', mappings, {
  indexes: [
    {
      name: 'grease_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'grease_volume_index',
      method: 'BTREE',
      fields: ['volume'],
    },
    {
        name: 'grease_minVolume_index',
        method: 'BTREE',
        fields: ['minVolume'],
      },
    {
        name: 'grease_greaseSpec_index',
        method: 'BTREE',
        fields: ['greaseSpec']
    },
    {
        name: 'grease_carBrand_index',
        method: 'BTREE',
        fields: ['carBrand']
    },
    {
        name: 'grease_carYear_index',
        method: 'BTREE',
        fields: ['carYear']
    },
    {
        name: 'grease_typeOfGrease_index',
        method: 'BTREE',
        fields: ['typeOfGrease']
    },
    {
      name: 'grease_createdAt_index',
      method: 'BTREE',
      fields: ['createdAt'],
    },
    {
      name: 'grease_updatedAt_index',
      method: 'BTREE',
      fields: ['updatedAt'],
    },
    {
        name: 'grease_supplierId_index',
        method: 'BTREE',
        fields: ['supplierId']
    },
    {
        name: 'grease_quotationNumber_index',
        method: 'BTREE',
        fields: ['quotationNumber']
    }
  ],
});

Grease.updateGrease = (newGrease,action) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Grease",
            quantity: newGrease.volume
    
        };
    
        Grease.findOne({
            where: {id: newGrease.id}
        }).then(foundGrease =>{
            var quant;
            if(action === "add"){
                quant = parseFloat(newGrease.volume) + foundGrease.volume;
            
            }else if(action === "delet"){
                quant = foundGrease.volume - parseFloat(newGrease.volume);
            
            }
          
            if(quant === 0){
                foundGrease.destroy().then(() => {
                    Consumable.updateConsumable(newConsumable, action).then(() => {
                        resolve(newGrease.volume + " Liters Of Grease Sucessfully Deleted from Existing Stock!");

                    }).catch(err => {
                        reject("An Error Occured Grease Could not be Deleted");

                    });

                }).catch(err => {
                    reject("An Error Occured Grease Could not be Deleted");
                
                });

            }

            else if(quant < 0){
                reject("Can Not Delete More Than Exists in Stock!");
            
            }else{
                Grease.update({volume: quant}, {
                    where: {
                        id: newGrease.id
                    }
        
                }).then(() => {
                    Consumable.updateConsumable(newConsumable,action).then(() => {
                        resolve(newGrease.volume + " Liters of Grease Sucessfully Added to Existing Stock!");
        
                    }).catch(err => {
                        reject("An Error Occured Grease Could not be Added " + err);
        
                    });
        
                }).catch(err =>{
                    reject("An Error Occured Grease Could not be Added " + err);
        
                });

            }
            
    
        }).catch(err => {
             reject("An Error Occured Grease Could not be Added " + err);
    
        });

    });

}

Grease.addGrease = (newGrease) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Grease",
            quantity: newGrease.volume
    
        };
        Grease.findOne({
            where: {
                greaseSpec: newGrease.greaseSpec,
                typeOfGrease: newGrease.typeOfGrease,
                carBrand: newGrease.carBrand,
                carYear: newGrease.carYear,
                supplierId: newGrease.supplierId,
                quotationNumber: newGrease.quotationNumber,
            }

        }).then(foundGrease => {
            if(foundGrease){
                reject("Grease With these Details Already Registered, Please Add to Existing Stock");

            }else{
                newGrease.volume = parseFloat(newGrease.volume);
                newGrease.minVolume = parseFloat(newGrease.minVolume);
                Grease.create(newGrease).then(() =>{
                    Consumable.updateConsumable(newConsumable, "add").then(() => {
                        resolve(newGrease.volume + " Liters of Greace Sucessfully Added!");
        
                    }).catch(err => {
                        reject("An Error Occured Grease Could not be Added");
        
                    });

                }).catch(err => {
                    reject("An Error Occured Grease Could not be Added");

                });

            }

        }).catch(err =>{
            reject("An Error Occured Grease Could not be Added");

        });       
        
    });

}

Grease.getStock = () => {
    return new Bluebird ((resolve, reject) => {
        Grease.findAndCountAll().then(grease => {
            Supplier.getSupplierNames(grease).then(() => {
                resolve(grease);

            }).catch(err => {
                reject(err);

            });

        }).catch(err => {
            reject(err);

        });

    })

}

function getDistinct(values){
    return values.filter((value, index, self) => self.indexOf(value) === index);
}

Grease.getGreaseStock = () => {
    return new Bluebird(async (resolve, reject) => {
        var greaseC, greaseS, greaseSpec, typeOfGrease, carBrand, carYear;
        Supplier.findAll().then(suppliers => {
            greaseS = suppliers;
            Grease.getStock().then(consumables => {
                greaseC = consumables;
                greaseSpec = getDistinct(greaseC.rows.map(val => val.greaseSpec));
                typeOfGrease = getDistinct(greaseC.rows.map(val => val.typeOfGrease));
                carBrand = getDistinct(greaseC.rows.map(val => val.carBrand));
                carYear = getDistinct(greaseC.rows.map(val => val.carYear));

                var values = {
                    consumables: greaseC.rows, suppliers: greaseS, specs: greaseSpec, 
                    typeOfGrease: typeOfGrease, carBrand: carBrand, carYear: carYear
                };

                resolve(values);

            }).catch(err => {
                reject("Error Connecting to the Server (" + err + ")");

            });

        }).catch(err => {
            reject("Error Connecting to the Server (" + err + ")");

        });

    });
    
};

Grease.getWithSupplier = supplierId => {
    return new Bluebird((resolve, reject) => {
        Grease.findAndCountAll({
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

Grease.groupSupplier = () => {
    return new Bluebird((resolve, reject) => {
        Grease.findAll({
            attributes:
              ['greaseSpec', 'typeOfGrease', 'carBrand', 'carYear', 'supplierId',
              [sequelize.fn('sum', sequelize.col('volume')), 'volume'],
            ],

            group: ['greaseSpec', 'typeOfGrease', 'carBrand', 'carYear', 'supplierId']
            
        }).then(async (values) => { 
            var result = {count: values.length, rows: values}
            await Supplier.getSupplierNames(result);
           resolve(result);
        });
    })
}

export default Grease;