import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
import { body, validationResult } from 'express-validator';
import Consumable from '../models/Consumables';

const router = express.Router();


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
       res.render('addUpdateVehicle', {
           title: 'Add New Vehicle',
           jumbotronDescription: `Register a new user account.`,
           submitButtonText: 'Create',
           action: "/vehicles/add",
           years: span,
           msgType: req.flash()
           
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

router.get('/delete/:id', (req, res, next) =>
{
    if(req.user){
        Vehicle.getVehicleByPlate(req.params.id).then(foundVehicle => {
            const vehicleDelete = {plate: foundVehicle.plate, chassis: foundVehicle.chassis}
            Vehicle.deleteVehicleByPlateAndChassis(vehicleDelete).then(() => 
        {
            req.flash('success_msg', "Vehicle with Plate #: " + req.params.id + " deleted successfully.");
            res.redirect(`/vehicles`);
        }).catch(err =>
        {
            req.flash('error_msg', "Something happened while deleting the vehicle (Error: " + err +").");
            res.redirect(`/vehicles/display-vehicle/${req.params.id}`);
        });
        })
    }
    
});

router.get('/', async (req, res, next) => 
{
    if (req.user)
    {
        Consumable.findAndCountAll().then(consumables => {
            console.log(consumables.rows);
            var entriesNum = []; 
            for(var i = 0; i < consumables.count; i++){
                entriesNum[0] = i + 1;
                
            }
            res.render("displayConsumables", {
                title: "Consumables",
                jumbotronDescription: "View all consumables in the system.",
                consumables: consumables.rows,
                msgType: req.flash()
            });
        });
    }
    else
    {
        res.redirect('/');
    }
});

router.get('/:category', async (req, res, next) =>{
    if(req.user){
        var title = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
        Consumable.getSpecific(req.params.category).then(consumables => {
            console.log(consumables);
            res.render("displaySpecificConsumables", {
                title: title,
                typeOf: req.params.category,
                jumbotronDescription: "View all " + req.params.category + " in the system.",
                consumables: consumables.rows,
                msgType: req.flash()
            });
        })
    }
})

export default router;