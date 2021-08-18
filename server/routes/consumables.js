import express from 'express';
import Consumable from '../models/Consumables';
import Battery from '../models/consumables/Battery';
import Brake from '../models/consumables/Brake';
import Filter from '../models/consumables/Filter';
import Grease from '../models/consumables/Grease';
import Oil from '../models/consumables/Oil';
import Quotation from '../models/Quotation';
import fs from 'fs';
import Other from '../models/consumables/Other';

const router = express.Router();

/**
 * Express route to get add a new consumbale page
 */
router.get('/add', (req, res, next) =>
{
    //Check if a user is loged in
    if(req.user){
        //If User exists get all distinct consumable and supplier values and load add new consumable page
        Consumable.getDistinctConsumableValues().then(values =>{
            res.render('addConsumable', {
                title: 'Add New Consumable',
                jumbotronDescription: `Add a new user Consumable.`,
                submitButtonText: 'Create',
                action: "/upload/single",
                values: values,
                page: "add",
                msgType: req.flash()
                
            });

        });

    }

});

/**
 * Express route to update battery data
 * Route takes the id and action from the req paramaters and quantity from user input  
 */
router.post('/update-battery/:action/:id', (req,res,next) => {
    //Creating new battery variable to update
    const newBattery = {
        id: req.params.id,
        quantity: req.body.newQuantity
    }
    
    //Updating battery in database
    Battery.updateBattery(newBattery, req.params.action).then(output => { 
        req.flash('success_msg', output);
        res.redirect('back');

    }).catch(err =>{
        req.flash('error_msg', err +  " could not be added to");
        res.redirect('back');

    });

});

/**
 * Express route to add a new battery in database
 * Route takes battery and quotation data from user input 
 */
router.post('/add/battery', Quotation.uploadFile().single('upload'), (req, res, next) => {
    var quotationNumber;
    if(!req.body.quotation){
        quotationNumber = "N/A";
    }else{
        quotationNumber = req.body.quotation;
    }
    //Creating new battrey variable to be added to database   
    const newBattery = {
        batSpec: req.body.batSpec,
        carBrand: req.body.carBrand,
        carYear: req.body.carYear,
        quantity: req.body.quantityBatteries,
        minQuantity: req.body.quantityMinBatteries,
        supplierId: req.body.batteriesSupplierName,
        singleCost: req.body.batteryPrice,
        quotationNumber: quotationNumber

    }

    //Declaring new quotation to be added to database
    var newQuotation;
    //Creating quotation variable quotation was selected
    if(req.file){
        newQuotation = {
            quotationNumber: req.body.quotation,
            quotationPath: req.file.path
        }
    }
    
    //Adding new battery to database
    Battery.addBattery(newBattery).then(output =>{
        //Add quotation info to database if quotation was uploaded
        if(req.file){
            Quotation.addQuotation(newQuotation);

        }

        req.flash('success_msg',  output);
        res.redirect("/consumables/add");
           
    }).catch(err =>{
        req.flash('error_msg', JSON.stringify(err));
        res.redirect("/consumables/add");
    
    })
   
});

/**
 * Express route to add a new brake in database
 * Route takes brake and quotation data from user input 
 */
router.post('/add/brake', Quotation.uploadFile().single('upload'), (req,res,next) => {
    //Creating new brake variable to be added to database
    const newBrake = {
        category: req.body.brakeCategory,
        carBrand: req.body.brakeCBrand,
        carYear: req.body.brakeCYear,
        bBrand: req.body.brakeBrand,
        preferredBrand: req.body.brakePBrand,
        chassis: req.body.brakeChassis,
        singleCost: req.body.brakePrice,
        quantity: req.body.quantityBrakes,
        minQuantity: req.body.minQuantityBrakes,
        supplierId: req.body.brakeSupplierName,
        quotationNumber: req.body.quotation
        
    }

    //Declaring new quotation to be added to database
    var newQuotation;
    //Creating quotation variable quotation was selected
    if(req.file){
        newQuotation = {
            quotationNumber: req.body.quotation,
            quotationPath: req.file.path
        }
    
    }
    
    //Adding new brake to database
    Brake.addBrake(newBrake).then(output =>{
        //Add quotation info to database if quotation was uploaded
        if(req.file){
            Quotation.addQuotation(newQuotation);
        
        }
        
        req.flash('success_msg', output);
        res.redirect("/consumables/add");

    }).catch(err =>{
        req.flash('error_msg', err);
        res.redirect("/consumables/add");

    });
            
 });

/**
 * Express route to update brake data
 * Route takes the id and action from the req paramaters and quantity from user input  
 */
router.post('/update-brake/:action/:id', (req,res,next) => {
    //Creating new brake variable to update
    const newBrake = {
        id: req.params.id,
        quantity: req.body.newQuantity
    };

    //Updating brake in database
    Brake.updateBrake(newBrake, req.params.action).then(output => {
        req.flash('success_msg', output);
        res.redirect("back");
    
    }).catch(err => {
        req.flash('error_msg', "Error " + err);
        res.redirect("back");
    
    });

});

/**
 * Express route to display selected vehicle
 */
router.get('/display-vehicle/:id', (req, res, next) => {
    //Get vehicle information if a user is logged in
    if(req.user){
        //Getting vehicle data from database by the vehicle plate number
        Vehicle.getVehicleByPlate(req.params.id).then(foundVehicle => {
            //Declating variable to select the type of icon to display with vehicle information
            var iconType;
            //Different vehicle icon options
            if(foundVehicle.category.includes("PICKUP") || foundVehicle.category === "4X4"){
                iconType = "pickup";

            }else if(foundVehicle.category.includes("TROLLY")){
                iconType = "trolly"

            }else{
                iconType = foundVehicle.category.toLowerCase();

            }
            
            //Loading the display vehicle page
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

/**
 * Express route to add a new filter in database
 * Route takes filter and quotation data from user input 
 */
router.post('/add/filter', Quotation.uploadFile().single('upload'), (req, res, next) => { 
    //Creating new filter variable to be added to database   
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
        minQuantity: req.body.minFilterQuantity,
        supplierId: req.body.filterSupplierName,
        quotationNumber: req.body.quotation

    };

    //Declaring new quotation to be added to database
    var newQuotation;
    //Creating quotation variable quotation was selected
    if(req.file){
        newQuotation = {
            quotationNumber: req.body.quotation,
            quotationPath: req.file.path
        }
    }
    
    //Adding new filter to database
    Filter.addFilter(newFilter).then(output => {    
        //Add quotation info to database if quotation was uploaded
        if(req.file){
            Quotation.addQuotation(newQuotation);
        
        }
        
        req.flash('success_msg', output);
        res.redirect("/consumables/add");

    }).catch(err =>{
        req.flash('error_msg', err);
        res.redirect("/consumables/add");

    });

});

/**
 * Express route to update filter data
 * Route takes the id and action from the req paramaters and quantity from user input  
 */
router.post('/update-filter/:action/:id', (req,res,next) => {
    //Creating new filter variable to update
    const newFilter = {
        id: req.params.id,
        quantity: req.body.newQuantity
    };

    //Updating filter in database
    Filter.updateFilter(newFilter, req.params.action).then(output => {
        req.flash('success_msg', output);
        res.redirect("back");

    }).catch(err => {
        req.flash('error_msg', err);
        res.redirect("back");

    });

})

/**
 * Express route to add a new grease in database
 * Route takes grease and quotation data from user input 
 */
router.post('/add/grease',Quotation.uploadFile().single('upload'), (req, res, next) => {
    //Creating new grease variable to be added to database
    const newGrease = {
        greaseSpec: req.body.greaseSpec,
        typeOfGrease: req.body.greaseType,
        carBrand: req.body.greaseCarBrand,
        carYear: req.body.greaseCarYear,
        volume: req.body.quantityGrease,
        minVolume: req.body.quantityMinGrease,
        supplierId: req.body.greaseSupplierName,
        quotationNumber: req.body.quotation,
        price_per_litter: req.body.greasePrice

    };

    //Declaring new quotation to be added to database
    var newQuotation;
    //Creating quotation variable quotation was selected
    if(req.file){
        newQuotation = {
            quotationNumber: req.body.quotation,
            quotationPath: req.file.path

        }

    }

    //Adding new grease to database
    Grease.addGrease(newGrease).then(output => {
        //Add quotation info to database if quotation was uploaded
        if(req.file){
            Quotation.addQuotation(newQuotation);

        }

        req.flash('success_msg', output);
        res.redirect("/consumables/add");
        
    }).catch(err =>{
        req.flash('error_msg', err);
        res.redirect("/consumables/add");

    });

});

/**
 * Express route to update grease data
 * Route takes the id and action from the req paramaters and quantity from user input  
 */
router.post('/update-grease/:action/:id', (req,res,next) =>{
    //Creating new grease variable to update
    const newGrease = {
        id: req.params.id,
        volume: req.body.newQuantity
    };

    //Updating grease in database
    Grease.updateGrease(newGrease, req.params.action).then(output => {
        req.flash('success_msg', output);
        res.redirect("back");
        
    }).catch(err =>{
        req.flash('error_msg', err);
        res.redirect("back");

    });

})

/**
 * Express route to add a new oil in database
 * Route takes oil and quotation data from user input 
 */
router.post('/add/oil', Quotation.uploadFile().single('upload'), (req, res, next) => {
    //Creating new oil variable to be added to database   
    const newOil = { 
        oilSpec: req.body.oilSpec,
        typeOfOil: req.body.oilType,
        preferredBrand: req.body.preferredOilBrand,
        volume: req.body.quantityOil,
        minVolume: req.body.quantityMinOil,
        oilPrice: req.body.oilPrice,
        supplierId: req.body.oilSupplierName,
        quotationNumber: req.body.quotation
    };

    //Declaring new quotation to be added to database
    var newQuotation;
    //Creating quotation variable quotation was selected
    if(req.file){
        newQuotation = {
            quotationNumber: req.body.quotation,
            quotationPath: req.file.path

        }

    }

    //Adding new oil to database
    Oil.addOil(newOil).then(output => {
        //Add quotation info to database if quotation was uploaded
        if(req.file){
            Quotation.addQuotation(newQuotation);

        }

        req.flash('success_msg', output);
        res.redirect("/consumables/add");

    }).catch(err =>{
        req.flash('error_msg', err);
        res.redirect("/consumables/add");

    });

});

/**
 * Express route to update oil data
 * Route takes the id and action from the req paramaters and quantity from user input  
 */
router.post('/update-oil/:action/:id', (req,res,next) => {
    //Creating new oil variable to update
    const newOil = { 
        id: req.params.id,
        volume: req.body.newQuantity
    };

    //Updating oil in database
    Oil.updateOil(newOil, req.params.action).then(output => {
        req.flash('success_msg', output);
        res.redirect("back");

    }).catch(err =>{
        req.flash('error_msg', err +  " could not be added to");
        res.redirect("back");

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

/**
 * Express route to display all consumable info
 */
router.get('/', (req, res, next) => 
{
    //Check if a user is logged in to the system
    if (req.user){
        //Getting all consumables from database
        Consumable.findAndCountAll().then(consumables => {
            //Loading consumables display page
            res.render("displayConsumables", {
                title: "Consumables",
                jumbotronDescription: "View all consumables in the system.",
                consumables: consumables.rows,
                msgType: req.flash()

            });

        });

    }

    else{
        res.redirect('/');

    }

});

/**
 * Express route to display specific consumable category info
 */
router.get('/:category', (req, res, next) => {
    console.log(req.params.category);
    //Check if a user is logged in to the system
    if(req.user){
        //Variable to set the title of page as the selected consumable category
        var title = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
        //Creating the appropriate consumable category model
        const model = getConsumableModel(req.params.category);
        //Grouping consumable category by the suppliers
        if(model.type){
            model.type.groupSupplier(req.params.category).then(consumables => {
                //Loading page to display consumable category info by supplier 
                res.render("displaySpecificConsumables", {
                    title: title,
                    typeOf: "other",
                    jumbotronDescription: "View all " + req.params.category + " in the system.",
                    consumables: consumables.rows,
                    page: "view",
                    msgType: req.flash()
    
                });
            });

        }else{
            model.groupSupplier().then(consumables => {
                //Loading page to display consumable category info by supplier 
                res.render("displaySpecificConsumables", {
                    title: title,
                    typeOf: req.params.category,
                    jumbotronDescription: "View all " + req.params.category + " in the system.",
                    consumables: consumables.rows,
                    page: "view",
                    msgType: req.flash()
    
                });
    
            });
        }

    }

});

/**
 * Express route to display consumable category info of selected supplier
 */
router.get('/:category/:supplier', (req, res, next) => {
    //Check if a user is logged in
    if(req.user){
        //Set page title to selected consumable category
        var title = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1);
        //Creating the appropriate consumable category model
        const model = getConsumableModel(req.params.category);
        //Getting consumable category info
        if(model.type){
            model.type.getWithSupplier(req.params.category, req.params.supplier).then(foundModel => {
                console.log(foundModel);
                //Loading selected consumable category of selected supplier
                res.render("displaySpecificConsumables", {
                    title: title,
                    typeOf: "other",
                    jumbotronDescription: "View all " + title + " from " + foundModel[0].supplierName + " in the system.",
                    consumables: foundModel,
                    page: "add",
                    specfic: true,
                    msgType: req.flash()
    
                });

            });

        }else{
            model.getWithSupplier(req.params.supplier).then(foundModel => {
                //Loading selected consumable category of selected supplier
                res.render("displaySpecificConsumables", {
                    title: title,
                    typeOf: req.params.category,
                    jumbotronDescription: "View all " + title + " from " + foundModel[0].supplierName + " in the system.",
                    consumables: foundModel,
                    page: "add",
                    specfic: true,
                    msgType: req.flash()
    
                });
    
            });

        }
        
    }

});

/**
 * Express Route to download consumable quotation
 */
router.get('/:category/download/:quotationNumber', (req,res,next) => {
    //Setting directory location of selected quotation
    const path = `${__dirname}`;
    //Setting the location of the selected quotation
    var tempFile = path.replace('/dist/routes', `/server/uploads/${req.params.quotationNumber}.pdf`);
    //Downloading selected quotation
    res.download(tempFile, function(err){
        if(err) {
            req.flash("error_msg", "File Does Not Exist!");
            res.redirect("back");

        }

    });
    
});

/**
 * Express Route to view consumable quotation
 */
router.get('/:category/view/:quotationNumber', (req,res,next) => {
    //Setting directory location of selected quotation
    const path = `${__dirname}`;
    //Setting the location of the selected quotation
    var tempFile=path.replace('/dist/routes', `/server/uploads/${req.params.quotationNumber}.pdf`);
    //Opening selected quotation
    fs.readFile(tempFile, function (err,data){
        if(err) {
            req.flash("error_msg", "File Does Not Exist!");
            res.redirect("back");

        }
        
        res.contentType("application/pdf");
        res.send(data);

    });
    
});

/**
 * Express Route to close the current window
 */
router.get('/close', (req,res,next)=>{
    res.render("closeWindow");

})

/**
 * Function to set the selected consumable category model
 * @param {*} consumableModel 
 * @returns consumable category model
 */
function getConsumableModel(consumableModel) {
    if (consumableModel === "brake"){
        return Brake;

    }else if(consumableModel === "filter"){
        return Filter;

    }else if(consumableModel === "grease"){
        return Grease;

    }else if(consumableModel === "oil"){
        return Oil;

    }else if(consumableModel === "battery"){
        return Battery;

    }else{
        return {type: Other, continue: true};
    }

};

export default router;