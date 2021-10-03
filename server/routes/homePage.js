import express from 'express';
import Consumable from '../models/Consumables';

const router = express.Router();

/** 
 * Express Route to Displays login page.
 */
router.get('/', (req, res, next) => {
    //Checking if a user is already logged in
    if (req.user){
        Consumable.checkMinimums().then(notification => {
            res.render('dashboardForAdmins', 
            {title: 'Home Page',
            jumbotronDescription: "Welcome! This is your dashboard and you can access everything from here easily.",
            msgType: req.flash(),
            minimums: notification
            });
            
        })
       

    }else{
       res.redirect('/login');

    }

});

export default router;

