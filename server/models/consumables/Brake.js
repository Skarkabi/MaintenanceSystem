import _ from 'lodash';
import Sequelize from 'sequelize';
import Consumable from '../Consumables';
import sequelize from '../../mySQLDB';
import Bluebird from 'bluebird';
import Supplier from '../Supplier';
import Quotation from '../Quotation';

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
    carBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    carYear:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    bBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    preferredBrand:{
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    chassis:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false,
    },
    singleCost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    totalCost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    quantity:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
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
    minQuantity:{
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
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

const Brake = sequelize.define('brake_stocks', mappings, {
  indexes: [
    {
      name: 'brake_id_index',
      method: 'BTREE',
      fields: ['id'],
    },
    {
      name: 'brake_quantity_index',
      method: 'BTREE',
      fields: ['quantity'],
    },
    {
        name: 'brake_carBrand_index',
        method: 'BTREE',
        fields: ['carBrand']
    },
    {
        name: 'brake_carYear_index',
        method: 'BTREE',
        fields: ['carYear']
    },
    {
        name: 'brake_chassis_index',
        method: 'BTREE',
        fields: ['chassis']
    },
    {
        name: 'brake_bBrand_index',
        method: 'BTREE',
        fields: ['bBrand']
    },
    {
        name: 'brake_preferredBrand_index',
        method: 'BTREE',
        fields: ['preferredBrand']
    },
    {
        name: 'brake_singleCost_index',
        method: 'BTREE',
        fields: ['singleCost']
    },
    {
        name: 'brake_totalCost_index',
        method: 'BTREE',
        fields: ['totalCost']
    },
    {
        name: 'brake_minQuantity_index',
        method: 'BTREE',
        fields: ['minQuantity']
    },
    {
        name: 'brake_createdAt_index',
        method: 'BTREE',
        fields: ['createdAt'],
    },
    {
        name: 'brake_updatedAt_index',
        method: 'BTREE',
        fields: ['updatedAt'],
    },
    {
        name: 'brake_supplierId_index',
        method: 'BTREE',
        fields: ['supplierId']
    },
    {
        name: 'brake_quotationNumber_index',
        method: 'BTREE',
        fields: ['quotationNumber']
    }
  ],
});

Brake.updateBrake = (newBrake, action) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Brake",
            quantity: newBrake.quantity
        };
        Brake.findOne({
            where: {id: newBrake.id}

        }).then(foundBrake => {
            var quant;
            if(action === "add"){
               quant = parseInt(newBrake.quantity) + foundBrake.quantity;
            
            }else if(action ==="delet"){
                quant = foundBrake.quantity - parseInt(newBrake.quantity);

            } 

            if(quant === 0){
                foundBrake.destroy().then(() => {
                    resolve("Brake Completly Removed From Stock!");

                }).catch(err => {
                    reject("An Error Occured Brakes Could not be Deleted");

                });

            }else if(quant < 0){
                reject("Can Not Delete More Than Exists in Stock");

            }else{
                Brake.update({quantity:quant}, {
                    where: {
                        id: newBrake.id
                    }
    
                }).then(() => {
                    Consumable.updateConsumable(newConsumable,action).then(() => {
                        if(action === "delet"){
                            resolve(newBrake.quantity + " Brakes Sucessfully Deleted from Existing Stock!");
                        }else if(action === "add"){
                            resolve(newBrake.quantity + " Brakes Sucessfully Added to Existing Stock!");
                        }
    
                    }).catch(err => {
                        reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
    
                    });
                }).catch(err => {
                    reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");
                        
                });
            }
                        
        }).catch(err => {
            reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");

        }); 
    
    });

}
Brake.addBrake = (newBrake) => {
    return new Bluebird((resolve, reject) => {
        const newConsumable = {
            category: "Brake",
            quantity: newBrake.quantity
        };
        Brake.findOne({
            where: {
                category: newBrake.category,
                carBrand: newBrake.carBrand,
                carYear: newBrake.carYear,
                bBrand: newBrake.bBrand,
                preferredBrand: newBrake.preferredBrand,
                chassis: newBrake.chassis,
                supplierId: newBrake.supplierId,
                quotationNumber: newBrake.quotationNumber,
            }

        }).then(foundBrake => {
            if(foundBrake){
                reject("Brakes With these Details Already Registered, Please Add to Existing Stock");

            }else{
                newBrake.singleCost = parseFloat(newBrake.singleCost);
                newBrake.quantity = parseInt(newBrake.quantity);
                newBrake.minQuantity = parseInt(newBrake.minQuantity);
                newBrake.totalCost = newBrake.singleCost * newBrake.quantity;
                Brake.create(newBrake).then(() => {
                    Consumable.updateConsumable(newConsumable, "add").then(() => {
                        resolve(newBrake.quantity + " Brakes Sucessfully Added!");

                    }).catch(err => {
                        reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");

                    });
                }).catch(err => {
                    reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");

                });
            }
        }).catch(err => {
            reject("An Error Occured Brakes Could not be Added (Error: " + err + ")");

        });
    
    });

}
Brake.getStock = () => {
    return new Bluebird ((resolve, reject) => {
        Brake.findAndCountAll().then(breakes => {
            Supplier.getSupplierNames(breakes).then(() => {
                resolve(breakes);
    
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

Brake.getBrakeStock = () =>{
    return new Bluebird(async (resolve,reject) => {
        var brakeC, brakeS, brakeCategory, brakeCBrand, brakeCYear, brakeCChassis, brakeBrand, brakePBrand, brakeQuantity;
        Supplier.findAll().then(suppliers => {
            brakeS = suppliers
            Brake.getStock().then(consumables => {
                brakeC = consumables
                brakeCategory = getDistinct(brakeC.rows.map(val => val.category))
                brakeCBrand = getDistinct(brakeC.rows.map(val => val.carBrand))
                brakeCYear = getDistinct(brakeC.rows.map(val => val.carYear))
                brakeCChassis = getDistinct(brakeC.rows.map(val => val.chassis))
                brakePBrand = getDistinct(brakeC.rows.map(val => val.preferredBrand))
                brakeQuantity = getDistinct(brakeC.rows.map(val => val.quantity))
                brakeBrand = getDistinct(brakeC.rows.map(val => val.bBrand))

                var values = {
                    consumable: brakeC.rows, suppliers: brakeS, brakeCategory: brakeCategory, brakeCBrand: brakeCBrand, brakeCYear: brakeCYear,
                    brakeCChassis: brakeCChassis, brakeBrand: brakeBrand, brakePBrand: brakePBrand, brakeQuantity: brakeQuantity
                
                };
                resolve(values);

            }).catch(() => {
                reject("Error Connecting to the Server");
            
            });

        }).catch(() => {
            reject("Error Connecting to the Server");
        });
    
    });

}

Brake.getQuotation = () => {
    return new Bluebird((resolve, reject) => {
        Quotation.getQuotation(this.quotationNumber).then(foundQuotation => {
            resolve(foundQuotation);
        }).catch(err =>{
            reject (err);
        })
    })
}

Brake.getWithSupplier = supplierId => {
    return new Bluebird((resolve, reject) => {
        Brake.findAndCountAll({
            where: {
                supplierId: supplierId
            }
        }).then(async foundBrakes => {
            await Supplier.getSupplierNames(foundBrakes);
            resolve(foundBrakes.rows);
        }).catch(err => {
            reject(err);
        });
    });
}

Brake.groupSupplier = () => {
    return new Bluebird((resolve, reject) => {
        Brake.findAll({
            attributes:
              ['category', 'carBrand', 'carYear', 'chassis', 'bBrand', 'singleCost', 'supplierId',
              [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
            ],

            group: ["category", "carBrand", "carYear", "chassis", "bBrand", "singleCost", "supplierId",   "preferredBrand",]
            
        }).then(async (values) => { 
            var result = {count: values.length, rows: values}
            await Supplier.getSupplierNames(result);
           resolve(result);
        });
    })
}



export default Brake;