import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';
import Bluebird from 'bluebird';

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
    createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
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
  ],
});

Grease.updateGrease = (newGrease) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Grease",
            quantity: newGrease.volume
    
        };
    
        Grease.findOne({
            where: {id: newGrease.id}
        }).then(foundGrease =>{
            var quant = parseFloat(newGrease.volume) + foundGrease.volume
            Grease.update({volume: quant}, {
                where: {
                    id: newGrease.id
                }
    
            }).then(() => {
                Consumable.addConsumable(newConsumable).then(() => {
                    resolve(newGrease.volume + " Liters of Grease Sucessfully Added to Existing Stock!");
    
                }).catch(err => {
                    reject("An Error Occured Grease Could not be Added");
    
                });
    
            }).catch(err =>{
                reject("An Error Occured Grease Could not be Added");
    
            });
    
        }).catch(err => {
             reject("An Error Occured Grease Could not be Added");
    
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
                carYear: newGrease.carYear
            }

        }).then(foundGrease => {
            if(foundGrease){
                reject("Grease With these Details Already Registered, Please Add to Existing Stock");

            }else{
                newGrease.volume = parseFloat(newGrease.volume);
                newGrease.minVolume = parseFloat(newGrease.minVolume);
                Grease.create(newGrease).then(() =>{
                    Consumable.addConsumable(newConsumable).then(() => {
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

Grease.getGreaseStock = () => {
    return new Bluebird(async (resolve, reject) => {
        var greaseC, greaseSpec, typeOfGrease, carBrand, carYear;
        await Consumable.getSpecific("grease").then(consumables => {
            greaseC = consumables;

        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Grease.findAll({attributes: [[Sequelize.literal('DISTINCT `greaseSpec`'), 'greaseSpec']],raw:true, nest:true}).then(spec => {
            greaseSpec = spec
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Grease.findAll({attributes: [[Sequelize.literal('DISTINCT `typeOfGrease`'), 'typeOfGrease']],raw:true, nest:true}).then(spec => {
            typeOfGrease = spec
        
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Grease.findAll({attributes: [[Sequelize.literal('DISTINCT `carBrand`'), 'carBrand']],raw:true, nest:true}).then(spec => {
            carBrand = spec
    
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });

        await Grease.findAll({attributes: [[Sequelize.literal('DISTINCT `carYear`'), 'carYear']],raw:true, nest:true}).then(spec => {
            carYear = spec
    
        }).catch(() => {
            reject("Error Connecting to the Server");
    
        });
    
        var values = {
            consumables: greaseC.rows, specs: greaseSpec, typeOfGrease: typeOfGrease, 
            carBrand: carBrand, carYear: carYear
        };
        resolve(values);

    });
    
};

export default Grease;