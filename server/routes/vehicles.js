import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
import { body, validationResult } from 'express-validator';
import Vehicle from '../models/Vehicle';

const router = express.Router();

/** 
 * Displays login page.
 */
/*
router.get('/display-vehicle/:plate', (req,res,next) =>
{
    if(req.user)
    {
        User.getUserById(req.params.id).then(foundUser => {
            res.render('displayUser', {
                title: (`${foundUser.firstName} ${foundUser.lastName}'s Page`),
                jumbotronDescription: `This is ${foundUser.firstName} ${foundUser.lastName}'s profile page.`,
                existingUser: foundUser,
                showPii: req.user.admin || req.user.id == req.params.id,
            });
        });
    }
});
*/

router.get('/add', async (req, res, next) =>
{
    if(req.user){
       res.render('addUpdateVehicle', {
           title: 'Add New Vehicle',
           jumbotronDescription: `Register a new user account.`,
           submitButtonText: 'Create',
           action: "/users/create",
       });
    }
       
   
});

router.get('/display-vehicle/:id', async (req, res, next) =>
{
    if(req.user){
        console.log(req.params);
        Vehicle.getVehicleByPlate(req.params.id).then(foundVehicle => {
            var iconType;
            if(foundVehicle.category.includes("PICKUP") || foundVehicle.category === "4X4"){
                iconType = "pickup";
            }else if(foundVehicle.category.includes("TROLLY")){
                iconType = "trolly"
            }else{
                iconType = foundVehicle.category.toLowerCase();
            }
            

            res.render('displayVehical', {
                title: (`Vehicle ${foundVehicle.plate}'s Information`),
                jumbotronDescription: `Information for Vehicle ${foundVehicle.plate}.`,
                existingVehicle: foundVehicle,
                showPii: req.user.admin,
                iconType: iconType
            });
        });
    }
});

router.get('/', async (req, res, next) => 
{
    if (req.user)
    {
        Vehicle.findAndCountAll().then(vehicles => {
            console.log("here: " + JSON.stringify(vehicles.count));
            var entriesNum = []; 
            for(var i = 0; i < vehicles.count; i++){
                entriesNum[0] = i + 1;
                
            }
            console.log(vehicles.rows);
            res.render("displayVehicles", {
                title: "Vehicles",
                jumbotronDescription: "View all user vehicles in the system.",
                users: vehicles.rows
            });
        });
    }
    else
    {
        res.redirect('/');
    }
});

export default router;