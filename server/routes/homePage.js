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
        res.render('dashboardForAdmins', {title: 'Home Page',
        jumbotronDescription: "Welcome! This is your dashboard and you can access everything from here easily.",
        msgType: req.flash() });
    }
    else
    {
       res.redirect('/login');
    }
});

export default router;

