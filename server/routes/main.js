import express from 'express';
import Consumable from '../models/Consumables';
import MaintenanceConsumables from '../models/consumables/MaintenanceConsumables';
import MaintenanceOrder from '../models/MaintenanceOrder'
import Vehicle from '../models/Vehicle';
import ExcelExporter from '../ExcelExporter';
import Quotation from '../models/Quotation';
import User from '../models/User';
import MaterialRequest from '../models/consumables/MaterialRequest';
import NonStockConsumables from '../models/consumables/NonStockConsumables';
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
        var  matches="000001";
        if(result){
            var matches = result.req.match(/(\d+)/);
            var matches = parseInt(matches[0]) + 1;
            
        }
       
       User.getUserById(req.user.id).then(mainUser => {
             Vehicle.getMappedStock().then(vehicles => {
            res.render('createUpdateMain', {
                title: (`New Maintanence Request`),
                jumbotronDescription: `Create a New Maintanence Request`,
                newReqNumber: `TMC${matches}`,
                vehicles: vehicles,
                action: "/maintanence/create",
                msgType: req.flash(),
                mainUser: mainUser
        
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
        discription: req.body.discription,
        user_id: req.body.employeeId
    }
    MaintenanceOrder.addOrder(newOrder).then(output => {
        req.flash('success_msg', output);
        req.session.save(function() {
            res.redirect(`back`);
        })
    }).catch(err => {
        req.flash('error_msg', err);
        req.session.save(function() {
            res.redirect("back");
        });
    })
})
/**
 * Express Route to get selected maintenance job details
 */
router.get('/:req', (req, res, next) => {
    
    Consumable.getFullStock().then(consumablesToSelect => {
        MaintenanceOrder.getByReq(req.params.req).then(found => {
           
            var materialRequests = [];
            var itemsCount = 0;
            if(found.material_request_data !== ""){
                
                found.material_request_data.map(materialRequest => {
                    materialRequest.items.map(item => {
                        itemsCount += parseInt(item.pendingQuantity);
                    })
                    materialRequests.push(materialRequest.material_request)
                    
                })
               
                
            }
            found.consumable_data.map(materialRequest => {
                if(materialRequest.consumable.materialRequestNumber && (materialRequest.consumable.materialRequestNumber.search("MWS") === 0 || materialRequest.consumable.materialRequestNumber.search("mws") === 0)){

                        materialRequests.push(materialRequest.consumable.materialRequestNumber.toUpperCase())
                    
                }
               
            })
            let x = (materialRequests) => materialRequests.filter((v,i) => materialRequests.indexOf(v) === i)
            Consumable.getDistinctConsumableValues().then(values => {
                res.render('displayMain', {
                    title: (`Maintanence Request # ${found.req}`),
                    jumbotronDescription: `Request # ${found.req} for division ${found.division}`,
                    existingMain: found,
                    mainConsumable: found.consumable_data,
                    mainEmployee: found.employee_data,
                    consumableTable: consumablesToSelect,
                    materialRequest: x(materialRequests),
                    values: values,
                    pendingItems: JSON.stringify(itemsCount),
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
    console.log(req.body)
    MaintenanceOrder.updateMaterialRequest(req.params.req, req.body.materialRequest, req.body.discription, req.body.remark, req.body.work_hour, req.body.hour_cost).then(output => {
        req.flash('success_msg', output);
        res.redirect(`back`);
        
    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect(`back`);
    });
})

router.get('/delete/:req', (req, res, next) => {
    MaintenanceOrder.deleteOrder(req.params.req).then(output => {
        req.flash('success_msg', output);
        res.redirect(`/maintanence`);
    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect(`back`);
    })

})
router.get('/delete/item/:id/:quantity/:req/:name', (req, res, next) => {
    let consumableDelete = {id: req.params.id, quant: req.params.quantity, other_name: req.params.name, maintenance_req: req.params.req};
    MaintenanceConsumables.useNonStockConsumable(consumableDelete, "delete").then(output => {
        req.flash('success_msg', "Item Deleted");
        res.redirect(`back`);
    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect(`back`);
    })
    console.log("Deleteing")
})

router.get('/return/item/:id/:quantity/:req/:name', (req, res, next) => {
    let consumableDelete = {id: req.params.id, quant: req.params.quantity, consumable_type: req.params.name, maintenance_req: req.params.req};
    MaintenanceConsumables.returnStockConsumable(consumableDelete).then(output => {
        req.flash('success_msg', output);
        res.redirect(`back`);
    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect(`back`);
    })
})

router.post('/update/material_request/add_consumables/:req/:category',  Quotation.uploadFile().single('uploadOther'), async (req, res, next) => {
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
            MaintenanceConsumables.useConsumable(consumables.consumableId, usedCategory, req.params.req, parseFloat(consumables.quantity), "add", fromStock).then(output => {
                    finished = output;
            }).catch(err => {
                errorHappend = {error:true, msg: err}
            });
           
        }));
    }else{
        var quotationNumber;
        if(!req.body.quotation){
            quotationNumber = "N/A";
        }else{
            quotationNumber = req.body.quotation;
        }
        var testItem = {
            other_name: req.body.other_category,
            quantity: req.body.quantityOther,
            singleCost: req.body.otherPrice ,
            totalCost: req.body.quantityOther * req.body.otherPrice,
            details: req.body.otherDetails,
            supplierId: req.body.otherSupplierName,
            quotationNumber: quotationNumber,
            materialRequestNumber: req.body.otherMaterialRequest,
            maintenanceReq: req.params.req,
        }

         //Declaring new quotation to be added to database
         var newQuotation;
         //Creating quotation variable quotation was selected
         if(req.file){
             newQuotation = {
                 quotationNumber: req.body.quotation,
                 quotationPath: req.file.path
             }
         }
        
        await MaintenanceConsumables.useNonStockConsumable(testItem, "add").then(output => {
            if(req.file){
                Quotation.addQuotation(newQuotation);

            }
            finished = output;
        }).catch(err => {
            console.log(err);
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

router.post('/update/material_request/use_material/:req', (req, res, next) => {
    MaterialRequest.useItem(req.body.materialRequestNumber, req.body.itemId, req.body.receivedQuantity, req.body.receivedSupplier, req.body.receivedPrice, req.body.receivedQuotation).then(output => {
        req.flash('success_msg', output);
        res.redirect(`back`);
        
    })
    res.send(req.body);

});

router.get('/update/sucess/material_request/use_material/:req', (req, res, next) => {
    req.flash("success_msg", `Material Received!!!`);
    req.session.save(function() {
        res.redirect(`/maintanence/${req.params.req}`);
    });
})
router.post('/update/material_request/add_material/:req', (req, res, next) => {
    var items = [];
    if(req.body.numberOfItems < 2){
        var materialRequestItem = {
            other_name: req.body.other_category,
            quantity:0,
            pendingQuantity: req.body.quantityOther,
            details: req.body.otherDetails,
            quotationNumber: "N/A",
            materialRequestNumber: req.body.otherMaterialRequest,
            maintenanceReq: req.params.req,
        }
        items.push(materialRequestItem);
    }else{
        for(var i = 0; i < req.body.numberOfItems; i++){
            var materialRequestItem = {
                other_name: req.body.other_category[i],
                quantity: 0,
                pendingQuantity: req.body.quantityOther[i],
                details: req.body.otherDetails[i],
                quotationNumber: "N/A",
                materialRequestNumber: req.body.otherMaterialRequest,
                maintenanceReq: req.params.req,
            }
            items.push(materialRequestItem);
        }
    }
    
    for(var i = 0; i < items.length; i++){
        MaterialRequest.addMaterialRequest(items[i]).then(output => {
            if(i === items.length){
                req.flash('success_msg', `${req.body.otherMaterialRequest} Succesfully Updated For Order`);
                res.redirect(`back`);
            }
            
        }).catch(err => {
            console.log(err);
        })
    }
    
})

function returnError(er, req, res){
    req.flash('error_msg', er);
    res.redirect(`back`);
}

export default router;