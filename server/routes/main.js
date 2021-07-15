import express from 'express';
import Consumable from '../models/Consumables';

const router = express.Router();

router.get('/', (req, res,next) => {
    res.render('displayMains', {
    title: (`Maintanence Requestds`),
    jumbotronDescription: `All Maintantence Requests`,
});
})

router.get('/create', (req,res,next) => {
    res.render('createUpdateMain', {
    title: (`New Maintanence Request`),
    jumbotronDescription: `Create a New Maintanence Request`,
});
})

router.get('/:req', (req, res, next) => {
    Consumable.getFullStock().then(consumablesToSelect => {
        var consumables = [];
        var employees = [];
        var c1 = {mr: "Stock", material: "Filter", cost: "23.2", supplier: "T.M.I.", quantity:"2"};
        var e1 = {eId: "T11538", firstName: "Wissam", lastName: "Hnien"};
        consumables[0] = c1;
        employees[0] = e1;
    
        var newMain = {
            status:"Not Started",
            req: "TMC6938",
            dateCreated: "24/06/2021",
            division: "Metal Doors",
            plate: "68734",
            category: "CAR",
            brand: "FORD",
            model: "MUSTANG",
            year: "2020",
            discription: "This is a test maintanence job order",
            remarks: "This is a test maintenance remark",
            consumables: consumables,
            employees: employees,
            hourCost: "12",
            materialCost: "46.4",
            totalCost: "58.4"
        }
    
        res.render('displayMain', {
            title: (`Maintanence Request # ${newMain.req}`),
            jumbotronDescription: `Reques # ${newMain.req} for division ${newMain.division}`,
            existingMain: newMain,
            mainConsumable: consumables,
            mainEmployee: employees,
            consumableTable: consumablesToSelect,
        });
        console.log(consumablesToSelect);
    })

})
export default router;