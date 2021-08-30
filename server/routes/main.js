import express from 'express';
import stream from 'stream';
import Consumable from '../models/Consumables';
import MaintenanceConsumables from '../models/consumables/MaintenanceConsumables';
import MaintenanceOrder from '../models/MaintenanceOrder'
import Vehicle from '../models/Vehicle';
import ExcelExporter from '../ExcelExporter';
import ExcelJS from 'exceljs';
import User from '../models/User';
const fs = require('fs');
const https = require('https')

const router = express.Router();

/**
 * Express Route to display all maintanence jobs
 */
router.get('/', (req, res,next) => {
    MaintenanceOrder.getOrders().then(orders => {
        res.render('displayMains', {
            title: (`Maintanence Requestds`),
            jumbotronDescription: `All Maintantence Requests`,
            orders: orders,
            msgType: req.flash()
       
        });
    }).catch(err => {console.log(err);});
    
});


/**
 * Express Route to load create new maintenace request page
 */
router.get('/create', (req,res,next) => {
    MaintenanceOrder.findOne({
        order: [ [ 'createdAt', 'DESC' ]],
    }).then(result => {
        var  matches="TMC000001";
        if(result){
            var matches = result.req;
            
        }
        var matches = matches.match(/(\d+)/);
       
       User.getUserById(req.user.id).then(mainUser => {
             Vehicle.getMappedStock().then(vehicles => {
            res.render('createUpdateMain', {
                title: (`New Maintanence Request`),
                jumbotronDescription: `Create a New Maintanence Request`,
                newReqNumber: "TMC" + JSON.stringify(parseInt(matches[0]) + 1),
                vehicles: vehicles,
                action: "/maintanence/create",
                msgType: req.flash(),
                mainUser: (mainUser.firstName + " " + mainUser.lastName)
        
            });
        })
       })
       /*
        Vehicle.getMappedStock().then(vehicles => {
            res.render('createUpdateMain', {
                title: (`New Maintanence Request`),
                jumbotronDescription: `Create a New Maintanence Request`,
                newReqNumber: "TMC" + JSON.stringify(parseInt(matches[0]) + 1),
                vehicles: vehicles,
                action: "/maintanence/create",
                msgType: req.flash()
        
            });
        })*/
        
    })
   

});

router.post('/create', (req, res, next) => {
    var newOrder = {
        req: req.body.reqNumber,
        division: "OPERATIONS",
        plate: req.body.plate,
        discription: req.body.discription
    }
    MaintenanceOrder.addOrder(newOrder).then(output => {
        req.flash('success_msg', output);
        res.redirect(`back`);
    })
})
/**
 * Express Route to get selected maintenance job details
 */
router.get('/:req', (req, res, next) => {
    Consumable.getFullStock().then(consumablesToSelect => {
        MaintenanceOrder.getByReq(req.params.req).then(found => {
            Consumable.getDistinctConsumableValues().then(values => {
            console.log(found.consumable_data);
                res.render('displayMain', {
                    title: (`Maintanence Request # ${found.req}`),
                    jumbotronDescription: `Request # ${found.req} for division ${found.division}`,
                    existingMain: found,
                    mainConsumable: found.consumable_data,
                    mainEmployee: found.employee_data,
                    consumableTable: consumablesToSelect,
                    values: values,
                    msgType: req.flash()
                });
            }).catch(err =>{
                console.log(err);
            })
        }).catch(err =>{
            console.log(err);
        })
    }).catch(err =>{
        console.log(err);
    });

});

router.post('/update/:req', (req, res,next) => {
    MaintenanceOrder.completeOrder(req.params.req).then(output => {
        req.flash('success_msg', output);
        res.redirect(`back`);
        
    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect(`back`);
    });
});

router.get('/exportExcel/newTable', (req,res,next) => {
     MaintenanceOrder.getOrders().then(orders => {
        var headerValues = [["#","Date", "Req#", "Material Req#", "Vehicle", "Status", "LPO#", "LPO Amount", "Purchase Department Remarks"],["Plate#", "Category", "Brand", "Model", "Year"]]
        var tableValues = []
        var count = 1
        orders.map(values => {
            tableValues.push([
                count, values.createdAt, values.req, values.material_request, values.vehicle_data.plate,
                values.vehicle_data.category, values.vehicle_data.brand, values.vehicle_data.model,
                values.vehicle_data.year, values.status, " ", " ", " "
            ]);
            count++;
        });
        
        ExcelExporter.getExcelTable(headerValues, tableValues).then( output => {
            const fileData = output;
            const fileName = `Maintenance Requests (${new Date().toISOString().slice(0,10)}).xlsx`
            const fileType = 'application/octet-stream'

            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Type': fileType,
            })

            const download = Buffer.from(fileData, 'base64')
            res.end(download);    
        })
    })
})

router.post('/update/material_request/:req', (req, res,next) => {
    MaintenanceOrder.updateMaterialRequest(req.params.req, req.body.materialRequest, req.body.discription, req.body.remark, req.body.work_hour).then(output => {
        req.flash('success_msg', output);
        res.redirect(`back`);
        
    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect(`back`);
    });
})

router.post('/update/material_request/add_consumables/:req/:category', async (req, res, next) => {
    var updateValues = [];
    var numOfInputs = 0;
    if(req.body.quantityInput){
        numOfInputs = req.body.quantityInput.length
    }
    var finished;
    var errorHappend = {error: false, msg:""};
    for(var i = 0; i < numOfInputs; i++){
        if(req.body.quantityInput[i] !== "" && req.body.quantityInput[i] !== "0" && req.body.quantityInput[i] !== 0){
            var newValue;
            if(req.params.category === "other"){
                newValue = {consumableId: req.body.consumable_id[i], quantity: req.body.quantityInput[i], category: req.body.consumable_category[i]};
            }else{
                newValue = {consumableId: req.body.consumable_id[i], quantity: req.body.quantityInput[i]};
            }
            
            updateValues.push(newValue);
        }
    }
    var category = req.params.category.toUpperCase();
    if(req.body.eOrN !== "new" && updateValues.length !== 0){
        await Promise.all(updateValues.map(consumables => {
            var usedCategory;
            var fromStock = true;
            if(category === "Other"){
                usedCategory = consumables.category;
                if(req.body.eOrN === "existing"){
                    fromStock = true
                }else{
                    fromStock = false
                }
            }else{
                usedCategory = category;
            }
            console.log("This Ones");
            console.log(usedCategory);
            MaintenanceConsumables.useConsumable(consumables.consumableId, usedCategory, req.params.req, parseFloat(consumables.quantity), "add", fromStock).then(output => {
                    finished = output;
            }).catch(err => {
                errorHappend = {error:true, msg: err}
            });
           
        }));
    }else{
        var testItem = {
            other_name: "Test",
            quantity: 12,
            singleCost: 34,
            totalCost: (12 * 34),
            details: "This si a test",
            supplierId: "1",
            quotationNumber: "TEST10001",
            materialRequestNumber: "TEEEST1010",
            maintenanceReq: "TMC9912",
        }
        await MaintenanceConsumables.useNonStockConsumable(testItem).then(output => {
            finished = output;
        }).catch(err => {
            errorHappend = {error:true, msg: err}
        });
    }
    
    if(errorHappend.error){
        req.flash('error_msg', errorHappend.msg);
        res.redirect(`back`);
    }else{
        req.flash('success_msg', `${category} Succesfully Used From Stock`);
        res.redirect(`back`);
    }
   
    
    //MaintenanceConsumables.useConsumable(req.params.consumableId, req.params.category, req.params)
})

function returnError(er, req, res){
    req.flash('error_msg', er);
    res.redirect(`back`);
}

export default router;