import express from 'express';
//import passport from 'passport';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

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
const router = express.Router();

/**
 * We will have 3 different types of users as following
 * Admin
 * professor
 * Student
 */

/**
 * Displays login page.
 */
router.get('/', async (req, res, next) =>
{
    if (req.user)
    {
        console.log("I am here")
        res.redirect('/');
    }
    else
    {
        console.log("No Actually I am here")
        res.render('login', { title: 'Login', landingPage: true });
    }
});

/**
 * Allows users to login to system.
 */
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
router.get('/logout', (req, res) =>
{
    req.logout();
    res.redirect('/users/login');
});

export default router;
