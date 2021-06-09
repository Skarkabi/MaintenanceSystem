import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import handlebars from 'handlebars';
import hbs from 'express-handlebars';
import hbshelpers from 'handlebars-helpers';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import sequelizeStore from 'connect-session-sequelize'

import passportConfig from './passport';
import sequelize from './mySQLDB';

import breadcrumbs from 'express-breadcrumbs';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import User from './models/User';
import Vehicle from './models/Vehicle';
require('./models/Session');
import signInRouter from './routes/sign-in';
import usersRouter from './routes/users';
import homePageRouter from './routes/homePage';
import signOutRouter from './routes/sign-out';
import vehicleRouter from './routes/vehicles';

handlebars.registerHelper("counter", function (index){
    return index + 1;
});

handlebars.registerHelper('isdefined', function (value, compare) {
    console.log("I am in this function " + value + " " + compare);
    return value === compare;
  });

const app = express();

const multiHelpers = hbshelpers()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({helpers: multiHelpers, extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/', handlebars: allowInsecurePrototypeAccess(handlebars)}))
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

const SequelizeStore = sequelizeStore(session.Store);




app.use(session(
    {
        secret: 'secret',
        saveUninitialized: false,
        resave: false,
        cookie : {maxAge: 120 * 60 * 1000},
        store: new SequelizeStore({ db: sequelize, table: 'Session'}),
    })
);
app.use(flash());

app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) =>
{
    res.locals.user = req.user || null;
    next();
})

app.use('/login', signInRouter);
app.use('/users', usersRouter);
app.use('/', homePageRouter);
app.use('/logout', signOutRouter);
app.use('/vehicles', vehicleRouter);

app.use((req, res, next) =>
{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.validation_error_msg = req.flash('validation_error_msg');
    res.locals.error = req.flash('error');
    next();
});

function taskDate() {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 

    today = dd+'/'+mm+'/'+yyyy;
    console.log(today);
    return today;
}

var datemilli = Date.parse('Sun May 11,2014');
console.log(taskDate(datemilli));

const newVehicle = {
    dateAdded: taskDate(),
    cateogry: "Tester",
    brand: "tester",
    model: "tester",
    year: "2019",
    plate: "12232398",
    chassis: "23234Ad3",
    kmDrive: 0,
    kmForOilChange: 1000,
    oilType: "Disel"

};


app.use(breadcrumbs.init());
app.use(breadcrumbs.setHome({name: 'Dashboard', url: '/'}));

app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
    /** 
    app.post('/sign-in', require('./routes/sign-in'));
    app.post('/sign-out', require('./routes/sign-out'));
    app.get('/sign-in', async (req, res, next) =>
    {
        console.log(req);
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
    */
    
    

    /*
const multiHelpers = hbshelpers()





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({helpers: multiHelpers, extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/', handlebars: allowInsecurePrototypeAccess(handlebars)}))
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));



app.use(flash());
app.use((req, res, next) =>
{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.validation_error_msg = req.flash('validation_error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(breadcrumbs.init());
app.use(breadcrumbs.setHome({name: 'Dashboard', url: '/users/login'}));



// Find all users

    /** 
User.addUser(jane).then(result =>
    {
        console.log(`You successfully created course ${result.code}.`);
    }).catch(err =>
    {
        console.log(err);
    });
    */

/**
 * Passport initiliaziation and config

passportConfig(passport, email => User.findOne({email: email}), id => User.findOne({ _id: id }));
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) =>
{
    res.locals.user = req.user || null;
    next();
})
**/

/*
app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));


//app.use('/', dashboardRouter);
app.use('/', usersRouter);
/** 
app.use('/courses', coursesRouter);
app.use('/faculties', facultiesRouter);
app.use('/gradeBooks', gradeBooksRouter);
app.use('/central', centralRouter);
app.use('/terms', termsRouter);
*/

// catch 404 and forward to error handler.

app.use((req, res, next) =>
{
    next(createError(404));
});

/**
 * Error handler
 */

app.use((err, req, res, next) =>
{
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
