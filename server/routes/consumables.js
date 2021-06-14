import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
import { body, validationResult,check } from 'express-validator';
import Consumable from '../models/Consumables';
import Battery from '../models/consumables/Battery';
import Brake from '../models/consumables/Brake';
import Filter from '../models/consumables/Filter';
import Sequelize from 'sequelize';

const router = express.Router();

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  
  // usage example:
  var a = ['a', 1, 'a', 2, '1'];
  var unique = a.filter(onlyUnique);
  
  console.log(unique); // ['a', 1, 2, '1']

async function getStocks(){
    var batteries, brakes, filters;
    await Battery.getBatteryStocks().then(values =>{
        batteries = values;
    });

    await Brake.getBrakeStock().then(values =>{
        brakes = values;
    })

    await Filter.getFilterStock().then(values =>{
        filters = values;
    })

    var values = {batteries: batteries, brakes: brakes, filters: filters};
    return values
}

router.get('/add', async (req, res, next) =>
{
    if(req.user){
        getStocks().then(values =>{
            console.log(JSON.stringify(values));
            res.render('addConsumable', {
                title: 'Add New Consumable',
                jumbotronDescription: `Add a new user Consumable.`,
                submitButtonText: 'Create',
                action: "/consumables/add",
                values: values,
                page: "add",
                msgType: req.flash()
                
            });
        });
     }
});

router.post('/add', (req, res, next) =>{
    console.log("posting");
    console.log(req.body);
   });

router.get('/update-battery/:id/:quantity', (req,res,next) =>{
    console.log("my body is " + req.body);
    const newBattery = {
        id: req.params.id,
        quantity: req.params.quantity
    }
    console.log("my battery is " + new Battery);

    Battery.addBattery(newBattery).then(() =>{
        const category = "Battery";
        const newConsumable = {
            category: category,
            quantity: req.params.quantity
        }
        Consumable.addConsumable(newConsumable).then(()=>{
            req.flash('success_msg', category + " was added to stock");
            res.redirect("/consumables/add");
        
        }).catch(err =>{
            req.flash('error_msg', "Consumable could not be added");
            res.redirect("/consumables/add");
        });

        req.flash('success_msg', "Battery was added to stock");
        res.redirect("/consumables/add");
    }).catch(err =>{
        req.flash('error_msg', err +  " could not be added to");
        res.redirect("/consumables/add");
    });
})


router.post('/add/battery', 
    [body('batSpec').not().isEmpty(), 
    body('carBrand').not().isEmpty(),
    body('carYear').not().isEmpty(),
    body('quantityBatteries').not().isEmpty(),
    body('quantityMinBatteries').not().isEmpty()
]
, (req, res, next) =>{   
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(req.body);
        req.flash('error_msg', "Could not add consumable please make sure all fields are fild");
        res.redirect("/consumables/add");
    }else{
        const category = req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1);
        const newConsumable = {
            category: category,
            quantity: req.body.quantityBatteries
          }

        const newBattery = {
            batSpec: req.body.batSpec,
            carBrand: req.body.carBrand,
            carYear: req.body.carYear,
            quantity: req.body.quantityBatteries,
            minQuantity: req.body.quantityMinBatteries
        }
        Battery.addBattery(newBattery).then(()=>{
            Consumable.addConsumable(newConsumable).then(()=>{
                req.flash('success_msg', category + " was added to stock");
                res.redirect("/consumables/add");
            
            }).catch(err =>{
                req.flash('error_msg', "Consumable could not be added");
                res.redirect("/consumables/add");
            });

        }).catch(err =>{
            req.flash('error_msg', category + " could not be added to");
            res.redirect("/consumables/add");
        })
        
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
                page: "view",
                msgType: req.flash()
            });
        })
    }
})

export default router;