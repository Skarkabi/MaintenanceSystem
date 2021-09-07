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
    other_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    singleCost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    totalCost:{
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    details: {
        type: Sequelize.DataTypes.STRING,
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
    materialRequestNumber:{
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
    }

};

const Other = sequelize.define('other_stocks', mappings, {
    indexes: [
        {
            name: 'other_id_index',
            method: 'BTREE',
            fields: ['id'],
        },
        {
            name: 'other_other_name_index',
            method: 'BTREE',
            fields: ['other_name']
        },
        {
            name: 'other_quantity_index',
            method: 'BTREE',
            fields: ['quantity'],
        },
        {
            name: 'other_singleCost_index',
            method: 'BTREE',
            fields: ['singleCost']
        },
        {
            name: 'other_totalCost_index',
            method: 'BTREE',
            fields: ['totalCost']
        },
        {
            name: 'other_details_index',
            method: 'BTREE',
            fields: ['details']
        },
        {
            name: 'other_createdAt_index',
            method: 'BTREE',
            fields: ['createdAt'],
        },
        {
            name: 'other_updatedAt_index',
            method: 'BTREE',
            fields: ['updatedAt'],
        },
        {
            name: 'other_supplierId_index',
            method: 'BTREE',
            fields: ['supplierId']
        },
        {
            name: 'other_quotationNumber_index',
            method: 'BTREE',
            fields: ['quotationNumber']
        },
        {
            name: 'other_materialRequestNumber_index',
            method: 'BTREE',
            fields: ['materialRequestNumber']
        }
    ]
});

Other.updateConsumable = (newOther, action) => {
    return new Bluebird((resolve, reject) => {
        if(!newOther.details){
            newOther.details="";
        }
        if(!newOther.supplierId){
            newOther.supplierId=0;
        }
        if(!newOther.quotationNumber){
            newOther.quotationNumber="N/A";
        }
        Other.findOne({
            where: {
                other_name: newOther.other_name,
                details: newOther.details,
                supplierId: newOther.supplierId,
                quotationNumber: newOther.quotationNumber
            }
        }).then(found => {
            
            newOther.quantity = parseInt(newOther.quantity);
            if(found && action === "delet"){
                var newQuant = found.quantity - newOther.quantity;
                Other.update({quantity: newQuant, totalCost: (newQuant * found.singleCost)}, {
                    where: {
                        id: found.id

                    }

                }).then(() => {
                    resolve(newOther.other_name + " Removed From Stock");

                }).catch(err => {
                    reject(err);

                });
            }else if(found && found.quotationNumber !== "N/A"){
                reject("Item with this quotation number is already in the stock");
            
            }else if(found){
                var newQuant = found.quantity + newOther.quantity;
                Other.update({quantity: newQuant, totalCost: (newQuant * found.singleCost)}, {
                    where: {
                        id: found.id

                    }

                }).then(() => {
                    resolve(newOther.other_name + " Added to Stock");

                }).catch(err => {
                    reject(err);

                });
            }else{
                var newId = newOther.id;
                if(!newOther.id){
                    newId=0;
                }
                Other.findOne({
                    where:{
                        id: newId
                    }
                }).then(newFound => {
                    var usedQuantity = 0;
                    if(newFound && action === "delet"){
                        usedQuantity = newFound.quantity - newOther.quantity;
                        Other.update({quantity: usedQuantity}, {
                            where:{id: newFound.id}
                        }).then(() => {
                            resolve(newOther.other_name + "Used for Order");
                        }).catch(err => {
                            reject(err);
                        })
                    }else{
                        newOther.singleCost = parseFloat(newOther.singleCost);
                        newOther.quantity = parseInt(newOther.quantity);
                        newOther.totalCost = newOther.singleCost * newOther.quantity;
                        Other.create(newOther).then(() => {
                            resolve(newOther.quantity + " " + newOther.other_name + " Successfully Added!");

                        }).catch(err => {
                            reject("An Error Occured " + newOther.other_name + " Could not be Added (Error: " + err + ")");

                        });
                    }
                })

            }

        }).catch(err => {
            reject("An Error Occured " + newOther.other_name + " Could not be Added (Error: " + err + ")");

        });

    });

}

Other.getStock = () => {
    return new Bluebird((resolve, reject) => {
        Other.findAndCountAll().then(others => {
            Supplier.getSupplierNames(others).then(() => {
                resolve(others);

            }).catch(err => {
                reject(err);
            
            })
        
        }).catch(err => {
            reject(err);

        });

    });

}

Other.getSupplierStock = sId => {
    return new Bluebird((resolve, reject) => {
        Other.findAndCountAll({
            where: {supplierId: sId}
        }).then(others => {
            Supplier.getSupplierNames(others).then(() => {
                resolve(others);

            }).catch(err => {
                reject(err);
            
            })
        
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

Other.getOtherStocks = () => {
    return new Bluebird((resolve, reject) => {
        var othersC, othersS, name, details;
        Supplier.findAll().then(suppliers => {
            othersS = suppliers;
            Other.getStock().then(consumables => {
                othersC = consumables;
                name = getDistinct(othersC.rows.map(val => val.other_name));
                details = getDistinct(othersC.rows.map(val => val.details));

                var values = {
                    consumables: othersC.rows, suppliers: othersS, names: name, details: details
                };
                resolve(values);

            }).catch(err => {
                reject(err);

            })
        
        }).catch(err => {
            reject(err);

        });

    });

}

Other.getWithSupplier = (category, supplierId) => {
    return new Bluebird((resolve, reject) => {
        Other.findAndCountAll({
            where:{
                supplierId: supplierId,
                other_name: category
            }
        }).then(found => {
            Supplier.getSupplierNames(found).then(() => {
                resolve(found.rows);
    
            }).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        })
    })
}

Other.groupSupplier = (category) => {
    var tres = "Spark Plug";
    return new Bluebird((resolve, reject) => {
        Other.findAll({
            where: {
                other_name: category
            },
            attributes:
                ['other_name', 'supplierId', [sequelize.fn('sum', sequelize.col('quantity')), 'quantity'],
            ],
            group: ["other_name", "supplierId"]
        }).then((values) => {
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

Other.getQuotation = () => {
    return new Bluebird((resolve, reject) => {
        //Getting the quotation from database
        Quotation.getQuotation(this.quotationNumber).then(foundQuotation => {
            resolve(foundQuotation);
        }).catch(err =>{
            reject (err);
        })
    })
}

export default Other;