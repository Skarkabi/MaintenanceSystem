import express from 'express';
import { promises } from 'stream';
import Consumable from '../models/Consumables';
import MaintenanceConsumables from '../models/consumables/MaintenanceConsumables';
import MaintenanceOrder from '../models/MaintenanceOrder'

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
    });
    
});

/**
 * Express Route to load create new maintenace request page
 */
router.get('/create', (req,res,next) => {
    res.render('createUpdateMain', {
        title: (`New Maintanence Request`),
        jumbotronDescription: `Create a New Maintanence Request`,
    
    });

});

/**
 * Express Route to get selected maintenance job details
 */
router.get('/:req', (req, res, next) => {
    Consumable.getFullStock().then(consumablesToSelect => {
        MaintenanceOrder.getByReq(req.params.req).then(found => {
            res.render('displayMain', {
                title: (`Maintanence Request # ${found.req}`),
                jumbotronDescription: `Request # ${found.req} for division ${found.division}`,
                existingMain: found,
                mainConsumable: found.consumable_data,
                mainEmployee: found.employee_data,
                consumableTable: consumablesToSelect,
                msgType: req.flash()
            });
        })
    });

});

router.post('/update/:req', (req, res,next) => {

    console.log("In Here");
    MaintenanceOrder.completeOrder(req.params.req).then(output => {
        req.flash('success_msg', output);
        res.redirect(`back`);
        
    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect(`back`);
    });
});

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
    console.log("AAAAAAAAAAAAAAA");
    var updateValues = [];
    var finished;
    for(var i = 0; i < req.body.quantityInput.length; i++){
        if(req.body.quantityInput[i] !== "" && req.body.quantityInput[i] !== "0" && req.body.quantityInput[i] !== 0){
            var newValue = {consumableId: req.body.consumable_id[i], quantity: req.body.quantityInput[i]};
            updateValues.push(newValue);
        }
    }
    var category = req.params.category[0].toUpperCase() + req.params.category.slice(1);
    if(updateValues.length !== 0){
        await Promise.all(updateValues.map(consumables => {
            MaintenanceConsumables.useConsumable(consumables.consumableId, category, req.params.req, parseFloat(consumables.quantity), "add").then(output => {
                finished = output;
            }).catch(err => {
                return returnError(err);
            });
        }));
    }
    
    req.flash('success_msg', `${category} Succesfully Used From Stock`);
    res.redirect(`back`);
    
    //MaintenanceConsumables.useConsumable(req.params.consumableId, req.params.category, req.params)
})

function returnError(er){
    req.flash('error_msg', er);
    res.redirect(`back`);
}

export default router;