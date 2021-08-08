import express from 'express';
import Consumable from '../models/Consumables';
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
            orders: orders
       
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
        var consumables = [];
        var employees = [];
        var c1 = {mr: "Stock", material: "Filter", cost: "23.2", supplier: "T.M.I.", quantity:"2"};
        var e1 = {eId: "T11538", firstName: "Wissam", lastName: "Hnien"};
        var c2 = {};
        consumables.push(c1);
        employees[0] = e1;
        MaintenanceOrder.getByReq(req.params.req).then(found => {
            res.render('displayMain', {
                title: (`Maintanence Request # ${found.req}`),
                jumbotronDescription: `Reques # ${found.req} for division ${found.division}`,
                existingMain: found,
                mainConsumable: found.consumable_data,
                mainEmployee: found.employee_data,
                consumableTable: consumablesToSelect,
            });
        })
    });

});

export default router;