import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
//import { body, validationResult } from 'express-validator';
import User from '../models/User';

const router = express.Router();

/** 
 * Displays login page.
 */
router.get('/', async (req, res, next) => 
{
    if (req.user)
    {
        return Bluebird.resolve().then( 
            async() => {
            const users = await User.findAndCountAll();
            console.log("here: " + JSON.stringify(users.count));
            var entriesNum = []; 
            for(var i = 0; i < users.count; i++){
                entriesNum[0] = i + 1;
                
            }
            res.render("displayUsers", {
                title: "Users",
                jumbotronDescription: "View all user accounts for professors, students and admins registered in the university's system.",
                users: users.rows
            });
        });
    }
    else
    {
        res.redirect('/');
    }
});





/* 
* Models
import Utils from '../Utils';
import CourseInstance from '../models/CourseInstance';
import Grade from '../models/Grade';
import Faculty from '../models/Faculty';

import EmailSender from '../EmailSender'
import ErrorHandler from '../errorHandler';
import Counter from '../models/IdCounter';
*/


/**
 * We will have 3 different types of users as following
 * Admin
 * professor
 * Student
 */



/**
 * Allows users to login to system.
 */
/*
router.post('/users/login', (req, res, next) =>
{
    var firstName = req.body.fName;
    const newUser = new User(
        {
            firstName: req.body.fName,
            lastName: req.body.lName
        }
    );

    User.addUser(newUser).then(result =>
        {
            console.log(`You successfully added user ${result.firstName}.`);
        }).catch(err =>
        {
            console.log(err);
        });

    // Make sure that we are not showing the user login page, if the user already logged in.
    if (req.user)
    {
        console.log("AAAAAA1");
        res.render('/');
    }
    else
    {
        console.log("AAAAAAAAAA");
        res.render('login', { title: 'Login', landingPage: true });
    }
});

/**
 * Allows users to logout from the system.
 */
/*
router.get('/logout', (req, res) =>
{
    req.logout();
    res.redirect('/users/login');
});
*/
export default router;

