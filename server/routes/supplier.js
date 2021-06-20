import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
import { body, validationResult } from 'express-validator';
import Supplier from '../models/Supplier';

const router = express.Router();

router.get('/', (req,res,next) => {
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

router.get('/register', async (req,res,next) => {
    Supplier.getStock().then(suppliers => {
        res.render('addUpdateSupplier', {
            title: 'Register Supplier',
            jumbotronDesciption: 'Register a new Supplier in the system',
            submitButtonText: 'Register',
            supplier: suppliers,
            msgType: req.flash()
        })
    })
})

router.post('/register', 
[body('name').not().isEmpty(),
body('phone').not().isEmpty(),
body('email').not().isEmpty(),
body('category').not().isEmpty(),
body('brand').not().isEmpty(),],
async (req,res,next) => {
    const newSupplier = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        category: req.body.category,
        brand: req.body.brand
    }

    Supplier.addSupplier(newSupplier).then(output => {
        req.flash('success_msg', output);
        res.redirect('/suppliers');
    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect('/register');
    })
})

export default router;
