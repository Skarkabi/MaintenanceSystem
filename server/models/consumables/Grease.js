import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';

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

Grease.addGrease = (newGrease) => {
    return new Promise((resolve, reject) => {
        if(newGrease.id){
            Grease.findOne({
                where: {id: newGrease.id}
            }).then(foundGrease =>{
                var quant = parseInt(newGrease.volume) + foundGrease.volume
                Grease.update({volume: quant}, {
                    where: {
                        id: newGrease.id
                    }
                }).then(() => {
                    resolve ("Grease was updated");
                }).catch(err =>{
                    reject("Grease could not be update (Error: " + err + ")");
                });
            }).catch(err => {
                reject("Grease could not be found");
            });
        }else{
            Grease.findOne({
                where: {
                    greaseSpec: newGrease.greaseSpec,
                    typeOfGrease: newGrease.typeOfGrease,
                    carBrand: newGrease.carBrand,
                    carYear: newGrease.carYear
                }
            }).then(foundGrease => {
                if(foundGrease){
                    reject("This Grease Already Exists in the Stock");
                }else{
                    newGrease.volume = parseFloat(newGrease.volume);
                    newGrease.minVolume = parseFloat(newGrease.minVolume);
                    Grease.create(newGrease).then(() =>{
                        resolve("New Grease was added into stock");
                    }).catch(err => {
                        reject("Grease could not be added into stock (Error: " + err + ")");
                    });
                }
            }).catch(err =>{
                reject("Error connecting to the database");
            });
        }
    });
}

Grease.getGreaseStock = async () => {
    var greaseC, greaseSpec, typeOfGrease, carBrand, carYear;
    await Consumable.getSpecific("grease").then(consumables => {
        greaseC = consumables;
    });

    await Grease.findAll({attributes: [[Sequelize.literal('DISTINCT `greaseSpec`'), 'greaseSpec']],raw:true, nest:true}).then(spec => {
        greaseSpec = spec
    });

    await Grease.findAll({attributes: [[Sequelize.literal('DISTINCT `typeOfGrease`'), 'typeOfGrease']],raw:true, nest:true}).then(spec => {
        typeOfGrease = spec
    });

    await Grease.findAll({attributes: [[Sequelize.literal('DISTINCT `carBrand`'), 'carBrand']],raw:true, nest:true}).then(spec => {
        carBrand = spec
    });

    await Grease.findAll({attributes: [[Sequelize.literal('DISTINCT `carYear`'), 'carYear']],raw:true, nest:true}).then(spec => {
        carYear = spec
    });
    var values = {
        consumables: greaseC.rows, specs: greaseSpec, typeOfGrease: typeOfGrease, 
        carBrand: carBrand, carYear: carYear
    };

    return values;
};

export default Grease;