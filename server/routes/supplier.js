import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
import { body, validationResult } from 'express-validator';
import Supplier from '../models/Supplier';

const router = express.Router();

router.get('/', (req,res,next) => {
    let msf = req.flash();
    Supplier.findAndCountAll().then(suppliers => {
        res.render("displaySuppliers", {
            tite: "Suppliers",
            jumbotronDesciption: "View all suppliers registered in the system",
            suppliers: suppliers.rows,
            msgType: req.flash()
        });
    }).catch(err => {
        console.log(err);
    });
});

router.get('/display-supplier/:id', async (req,res,next) => {
    Supplier.getById(req.params.id).then(foundSupplier => {
        console.log(JSON.stringify(foundSupplier));
        res.render('displaySupplier', {
            title: (`${foundSupplier.name}`),
            jumbotronDesciption: `Information for Supplier ${foundSupplier.name}`,
            existingSupplier: foundSupplier,
            showPii: req.user.admin,
            msgType: req.flash()
        });
    }).catch(err => {
        console.log(err);
    });
});

export default router;
