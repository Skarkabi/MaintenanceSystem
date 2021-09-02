import express from 'express';
import Vehicle from '../models/Vehicle';
import ExcelExporter from '../ExcelExporter';

const router = express.Router();

router.get('/add', (req, res, next) =>
{
    if(req.user){
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

router.post('/add', (req, res, next) => {
    Vehicle.addVehicle(req.body).then(() => {
        req.flash('success_msg', req.body.brand + " " + req.body.model + " " + req.body.plate + " added successfully.")
        res.redirect('/vehicles')

    }).catch(err => {
        req.flash('error_msg', "Vehicle could not be add (Error: " + err+ ") ");
        req.session.save(function() {
            res.redirect("back");
        });
       

    });

});

router.get('/display-vehicle/:id', (req, res, next) => {
    if(req.user){
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

router.get('/delete/:plate/:chassis', (req, res, next) => {
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

router.get('/', (req, res, next) => {
    if (req.user) {
        Vehicle.findAndCountAll().then(vehicles => {
            res.render("displayVehicles", {
                title: "Vehicles",
                jumbotronDescription: "View all user vehicles in the system.",
                users: vehicles.rows,
                msgType: req.flash()

            });

        });

    }else{
        res.redirect('/');

    }

});

router.get('/exportExcel/newTable', (req,res,next) => {
    Vehicle.getStock().then(vehicles => {
        var headerValues = [["#", "Category", "Brand", "Model", "Year", "Plate#", "Chassis#", "Driven", "Change"]]
        var tableValues = []
        var count = 1
        vehicles.rows.map(values => {
            tableValues.push([
                count, values.category, values.brand, values.model, values.year,
                values.plate, values.chassis, values.kmDriven, values.kmForOilChange
            ]);
            count++;
        });
        ExcelExporter.getExcelTable(headerValues, tableValues).then( output => {
            const fileData = output;
            const fileName = `Vehicles (${new Date().toISOString().slice(0,10)}).xlsx`
            const fileType = 'application/octet-stream'

            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Type': fileType,
            })

            const download = Buffer.from(fileData, 'base64')
            res.end(download);    
        })
    })
});

export default router;