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
        var d = new Date();
        var n = d.getFullYear();

        var span = [];
        var i;
        for(i = n - 2000; i >= 0; i--){
            span[i] = n - i;
            console.log("In here" + span[i]);
        }
        console.log(span);
        Vehicle.getVehicleStock().then(values => {
            res.render('addUpdateVehicle', {
                title: 'Add New Vehicle',
                jumbotronDescription: `Register a new user account.`,
                submitButtonText: 'Create',
                action: "/vehicles/add",
                values: values,
                msgType: req.flash()
                
            });

        });
      
    }
       
});

router.post('/add', [
    body('category', "Vehicle Category field is mandatory").not().isEmpty(),
    body('brand', "Vehicle brand field is mandatory").not().isEmpty(),
    body('model', "Vehicle model field is mandatory").not().isEmpty(),
    body('year', "Vehicle year field is mandatory").not().isEmpty(),
    body('plate', "Vehicle Plate # field is mandatory").not().isEmpty(),
    body('chassis', "Vehicle Chassis # field is mandatory").not().isEmpty(),
    body('oilType', "Vehicle Oil Type field is mandatory").not().isEmpty()
], (req, res, next) =>{
        Vehicle.addVehicle(req.body).then(() => {
            req.flash('success_msg', req.body.brand + " " + req.body.model + " " + req.body.plate + " added successfully.")
            res.redirect('/vehicles')
        }).catch(err => {
            req.flash('error_msg', "Vehicle could not be add (Error: " + err+ ") ");
            res.redirect('/vehicles/add')
        })
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
                title: (`${foundVehicle.brand} ${foundVehicle.model} Plate # ${foundVehicle.plate}`),
                jumbotronDescription: `Information for ${foundVehicle.brand} ${foundVehicle.model} Plate # ${foundVehicle.plate}.`,
                existingVehicle: foundVehicle,
                showPii: req.user.admin,
                iconType: iconType,
                msgType: req.flash()
            });
        });
    }
});

router.get('/delete/:plate/:chassis', (req, res, next) =>
{
    console.log("PArams: " + req.params);
    if(req.user){
        const vehicleDelete = {plate: req.params.plate, chassis: req.params.chassis};
        Vehicle.deleteVehicleByPlateAndChassis(vehicleDelete).then(output => {
            req.flash('success_msg', output);
            res.redirect(`/vehicles`);
        
        }).catch(err => {
            req.flash('error_msg', err);
            res.redirect(`/vehicles/display-vehicle/${req.params.id}`);

        });

    }
    
});

router.get('/', async (req, res, next) => 
{
    if (req.user)
    {
        Vehicle.findAndCountAll().then(vehicles => {
            var entriesNum = []; 
            for(var i = 0; i < vehicles.count; i++){
                entriesNum[0] = i + 1;
                
            }
            res.render("displayVehicles", {
                title: "Vehicles",
                jumbotronDescription: "View all user vehicles in the system.",
                users: vehicles.rows,
                msgType: req.flash()
            });
        });
    }
    else
    {
        res.redirect('/');
    }
});

export default router;