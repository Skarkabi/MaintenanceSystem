import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';
//import { Authenticated, IsAdmin, IsStudent, IsOwnPage } from '../authentication';
//import { body, validationResult } from 'express-validator';
import User from '../models/User';
import fs from 'fs'

const router = express.Router();

/** 
 * Displays login page.
 */


 var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

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

