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
import Grease from '../models/consumables/Grease';
import Oil from '../models/consumables/Oil';
import { errors } from 'puppeteer';

const router = express.Router();

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  
  // usage example:
  var a = ['a', 1, 'a', 2, '1'];
  var unique = a.filter(onlyUnique);
  
  console.log(unique); // ['a', 1, 2, '1']

async function getStocks(){
    var batteries, brakes, filters, grease, oil;
    await Battery.getBatteryStocks().then(values =>{
        batteries = values;
    });

    await Brake.getBrakeStock().then(values =>{
        brakes = values;
    });

    await Filter.getFilterStock().then(values =>{
        filters = values;
    });

    await Grease.getGreaseStock().then(values => {
        grease = values;
    });

    await Oil.getOilStock().then(values => {
        oil = values;
    })

    var values = {
        batteries: batteries, brakes: brakes, filters: filters,
        grease: grease, oil: oil
    };
    return values
}

router.get('/add', async (req, res, next) =>
{
    console.log("I am in here Add");
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


router.post('/update-battery/:action/:id', (req,res,next) =>{
    const newBattery = {
        id: req.params.id,
        quantity: req.body.newQuantity
    }
    
    Battery.updateBattery(newBattery, req.params.action).then(output =>{
        console.log("Maded it in here");
        req.flash('success_msg', output);
        res.redirect('back');

    }).catch(err =>{
        req.flash('error_msg', err +  " could not be added to");
        res.redirect('back');
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
    console.log("I am in here Battery Add");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(req.body);
        req.flash('error_msg', "Could not add consumable please make sure all fields are fild");
        res.redirect("/consumables/add");
    }else{
        const newBattery = {
            batSpec: req.body.batSpec,
            carBrand: req.body.carBrand,
            carYear: req.body.carYear,
            quantity: req.body.quantityBatteries,
            minQuantity: req.body.quantityMinBatteries
        }
        Battery.addBattery(newBattery).then(output =>{
            req.flash('success_msg',  output);
            res.redirect("/consumables/add");

        }).catch(err =>{
            req.flash('error_msg', err);
            res.redirect("/consumables/add");
        })
        
    }
   
});

router.post('/add/brake', 
[body('brakeCategory').not().isEmpty(), 
body('brakeCBrand').not().isEmpty(),
body('brakeCYear').not().isEmpty(),
body('brakeChassis').not().isEmpty(),
body('brakeBrand').not().isEmpty(),
body('brakePBrand').not().isEmpty(),
body('quantityBrakes').not().isEmpty(),
body('minQuantityBrakes').not().isEmpty(),
body('brakePrice').not().isEmpty()
],
 (req,res,next) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()){
        console.log(req.body);
        req.flash('error_msg', "Could not add consumable please make sure all fields are fild");
        res.redirect("/consumables/add");
    }else{
        const newBrake = {
            category: req.body.brakeCategory,
            carBrand: req.body.brakeCBrand,
            carYear: req.body.brakeCYear,
            bBrand: req.body.brakeBrand,
            preferredBrand: req.body.brakePBrand,
            chassis: req.body.brakeChassis,
            singleCost: req.body.brakePrice,
            quantity: req.body.quantityBrakes,
            minQuantity: req.body.minQuantityBrakes
        }

        console.log(newBrake);
        Brake.addBrake(newBrake).then(output =>{
            req.flash('success_msg', output);
            res.redirect("/consumables/add");

        }).catch(err =>{
            req.flash('error_msg', err);
            res.redirect("/consumables/add");

        });
    }
 });

router.post('/update-brake/:id', (req,res,next) => {
    const newBrake = {
        id: req.params.id,
        quantity: req.body.newQuantity
    };

    Brake.updateBrake(newBrake).then(output => {
            req.flash('success_msg', output);
            res.redirect("/consumables/add");
    }).catch(err => {
        req.flash('error_msg', "Error " + err);
        res.redirect("/consumables/add");
    });
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

router.post('/add/filter', 
[body('filterType').not().isEmpty(),
body('vehicleCategory').not().isEmpty(),
body('filterABrand').not().isEmpty(),
body('filterPBrand').not().isEmpty(),
body('filterCarBrand').not().isEmpty(),
body('filterCarModel').not().isEmpty(),
body('filterCarYear').not().isEmpty(),
body('quantityFilters').not().isEmpty(),
body('minFilterQuantity').not().isEmpty(),
body('filterPrice').not().isEmpty(),
], (req, res, next) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('error_msg', "Could not add consumable please make sure all fields are fild");
        res.redirect("/consumables/add");
    }else{
        const newFilter = {
            carBrand: req.body.filterCarBrand,
            carModel: req.body.filterCarModel,
            carYear: req.body.filterCarYear,
            category: req.body.vehicleCategory,
            fType: req.body.filterType,
            preferredBrand: req.body.filterPBrand,
            actualBrand: req.body.filterABrand,
            singleCost: req.body.filterPrice,
            quantity: req.body.quantityFilters,
            minQuantity: req.body.minFilterQuantity

        };
        Filter.addFilter(newFilter).then(output => {    
            req.flash('success_msg', output);
            res.redirect("/consumables/add");

        }).catch(err =>{
            req.flash('error_msg', err);
            res.redirect("/consumables/add");

        });
    }

});

router.post('/update-filter/:id', (req,res,next) => {
    const newFilter = {
        id: req.params.id,
        quantity: req.body.newQuantity
    };

    Filter.updateFilter(newFilter).then(output => {
        req.flash('success_msg', output);
        res.redirect("/consumables/add");

    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect("/consumables/add");

    });

})

router.post('/add/grease',
[body('greaseSpec').not().isEmpty(), 
body('greaseType').not().isEmpty(),
body('greaseCarBrand').not().isEmpty(),
body('greaseCarYear').not().isEmpty(),
body('quantityGrease').not().isEmpty(),
body('quantityMinGrease').not().isEmpty()
]
, (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(req.body);
        req.flash('error_msg', "Could not add consumable please make sure all fields are fild");
        res.redirect("/consumables/add");

    }else{
        const newGrease = {
            greaseSpec: req.body.greaseSpec,
            typeOfGrease: req.body.greaseType,
            carBrand: req.body.greaseCarBrand,
            carYear: req.body.greaseCarYear,
            volume: req.body.quantityGrease,
            minVolume: req.body.quantityMinGrease

        };

        Grease.addGrease(newGrease).then(output => {
            req.flash('success_msg', output);
            res.redirect("/consumables/add");
            
        }).catch(err =>{
            req.flash('error_msg', err);
            res.redirect("/consumables/add");

        });

    }

});

router.post('/update-grease/:id', (req,res,next) =>{
    const newGrease = {
        id: req.params.id,
        volume: req.body.newQuantity
    };

    Grease.updateGrease(newGrease).then(output => {
        req.flash('success_msg', output);
        res.redirect("/consumables/add");
        
    }).catch(err =>{
        req.flash('error_msg', err);
        res.redirect("/consumables/add");

    });

})

router.post('/add/oil',
[body('oilSpec').not().isEmpty(), 
body('oilType').not().isEmpty(),
body('preferredOilBrand').not().isEmpty(),
body('oilPrice').not().isEmpty(),
body('quantityOil').not().isEmpty(),
body('quantityMinOil').not().isEmpty()
]
, (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('error_msg', "Could not add consumable please make sure all fields are fild");
        res.redirect("/consumables/add");

    }else{
        const newOil = { 
            oilSpec: req.body.oilSpec,
            typeOfOil: req.body.oilType,
            preferredBrand: req.body.preferredOilBrand,
            volume: req.body.quantityOil,
            minVolume: req.body.quantityMinOil,
            oilPrice: req.body.oilPrice
        }

        Oil.addOil(newOil).then(output => {
            req.flash('success_msg', output);
            res.redirect("/consumables/add");

        }).catch(err =>{
            req.flash('error_msg', err);
            res.redirect("/consumables/add");

        });

    }

});

router.post('/update-oil/:id', (req,res,next) => {
    const newOil = { 
        id: req.params.id,
        volume: req.body.newQuantity
    };

    Oil.updateOil(newOil).then(output => {
        req.flash('success_msg', output);
        res.redirect("/consumables/add");

    }).catch(err =>{
        req.flash('error_msg', err +  " could not be added to");
        res.redirect("/consumables/add");

    });
    
})

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