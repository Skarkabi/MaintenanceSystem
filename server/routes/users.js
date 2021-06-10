import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const router = express.Router();

/** 
 * Displays login page.
 */

router.get('/display-user/:id', (req,res,next) =>
{
    if(req.user)
    {
        let msg = req.flash();
        User.getUserById(req.params.id).then(foundUser => {
            res.render('displayUser', {
                title: (`${foundUser.firstName} ${foundUser.lastName}'s Page`),
                jumbotronDescription: `This is ${foundUser.firstName} ${foundUser.lastName}'s profile page.`,
                existingUser: foundUser,
                showPii: req.user.admin || req.user.id == req.params.id,
                msgType: msg
            });
        });
    }
});

router.get('/', async (req, res, next) => 
{
    if (req.user.admin)
    {
        User.findAndCountAll().then(users => {
            console.log("here: " + JSON.stringify(users.count));
            var entriesNum = []; 
            for(var i = 0; i < users.count; i++){
                entriesNum[0] = i + 1;
                
            }
            res.render("displayUsers", {
                title: "Users",
                jumbotronDescription: "View all user accounts for professors, students and admins registered in the university's system.",
                users: users.rows,
                user: req.user,
                msgType: req.flash()
            });
        });
    }
    else
    {
        req.flash('error_msg', "You do not have access to this page.");
        res.render("accessDenied", {
            title: "Access Denied",
            msgType: req.flash()
        });
    }
});


/**
 * Displays create user page.
 */
 router.get('/create', async (req, res, next) =>
 {
     if(req.user){
        res.render('createUpdateUser', {
            title: 'Create New User',
            jumbotronDescription: `Register a new user account.`,
            submitButtonText: 'Create',
            action: "/users/create",
            msgType: req.flash()

        });
     }
        
    
 });

 router.get('/delete/:id', (req, res, next) =>
{
    if(req.user){
        User.deleteUserById(req.params.id).then(() => 
        {
            req.flash('success_msg', "User with Employee ID: " + req.params.id + " deleted successfully.");
            res.redirect(`/users`);
        }).catch(err =>
        {
            req.flash('error_msg', "Something happened while deleting the user (Error: " + err +").");
            res.redirect(`/users/display-user/${req.params.id}`);
        });
    }
    
});
 
 /**
  * Creates an user.
  */
 router.post('/create', [
     body('eID', "Employee ID field is mandatory").not().isEmpty(),
     body('firstName', "First name field is mandatory").not().isEmpty(),
     body('lastName', "Last name field is mandatory").not().isEmpty(),
     body('username', "Username field is mandatory").not().isEmpty(),
     body('password', "Password lenght should be at least 6 chars long").isLength({ min: 5 })
 ], (req, res, next) =>{   
        User.createUser(req.body).then(() => {
            req.flash('success_msg', "User " + req.body.username + " created successfully.");
            res.redirect('/users/create')

        }).catch(err => {
            req.flash('error_msg', "User could not be created (Error: " + err+ ") ");
            res.redirect('/users/create')
            
        });
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

