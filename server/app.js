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
import bodyParser from 'body-parser';
import passportConfig from './passport';
import sequelize from './mySQLDB';
import breadcrumbs from 'express-breadcrumbs';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import signInRouter from './routes/sign-in';
import usersRouter from './routes/users';
import homePageRouter from './routes/homePage';
import signOutRouter from './routes/sign-out';
import vehicleRouter from './routes/vehicles';
import consumableRouter from './routes/consumables';
import supplierRouter from './routes/supplier';
import mainRouter from './routes/main';
import User from './models/User';
require('./models/Session');
require('dotenv').config

handlebars.registerHelper("counter", function (index){
    return index + 1;
});

handlebars.registerHelper("getElement", function (array, index, property){
    return array[parseInt(index)][property];
});

handlebars.registerHelper("makeObject", function (id, action){
    var value = {id: id, action: action};
    return value;
})

handlebars.registerHelper('isdefined', function (value, compare) {
    return value === compare;
  });

handlebars.registerHelper('ifOr', function (item){
    if(item.singleCost || item.price_per_litter || item.oilPrice){
        return true
    }
})
 handlebars.registerHelper('formatDisctiption', function(values){
    return values.replace(",", "\n-");
 })
handlebars.registerHelper('lowerCase', function (value){
    return value.toLowerCase();
})

handlebars.registerHelper('changeValue', function(variable, value){
    variable = value;
    return variable = value;
})

handlebars.registerHelper('roundToTwo', function(x,y){
    return (x*y).toFixed(2);
});

handlebars.registerHelper('console', function (value){
    return console.log("Outputting " + JSON.stringify(value));
})

handlebars.registerHelper('convertToString', function (value){
    return JSON.stringify(value);
})

handlebars.registerDecorator('checkOption', function(){
    return console.log(document.getElementById("category").value)
})

handlebars.registerHelper('getVehicles', function(vehicles, plate){
    return console.log(plate.get('15204'));
})

handlebars.registerHelper('moreThanOne', function(items){
    return parseInt(items.length) > 1;
})

handlebars.registerHelper('multiply', function (x, y){
    console.log("Look here*************")
    console.log(typeof x)
    console.log(typeof y)
  
})

handlebars.registerHelper('add', function (x, y){
    console.log("Look here*************")
    console.log(typeof x)
    console.log(typeof y)
    return parseFloat(x) + parseFlaot(y);
})

handlebars.registerHelper('greaterThan', function(x, y){
    console.log("Look here*************")
    console.log((x))
    console.log((y))
    console.log  (parseFloat(x) > parseFloat(y));
    return (parseFloat(x) > parseFloat(y))
})
const app = express();

const multiHelpers = hbshelpers()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({helpers: multiHelpers, extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/', handlebars: allowInsecurePrototypeAccess(handlebars)}))
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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


app.use(function (req, res, next){
    app.locals.user = req.user;
    next();
})


app.use('/login', signInRouter);
app.use('/users', usersRouter);
app.use('/', homePageRouter);
app.use('/logout', signOutRouter);
app.use('/vehicles', vehicleRouter);
app.use('/consumables', consumableRouter);
app.use('/suppliers', supplierRouter);
app.use('/maintanence', mainRouter);

app.use((req, res, next) =>
{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.validation_error_msg = req.flash('validation_error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(breadcrumbs.init());
app.use(breadcrumbs.setHome({name: 'Dashboard', url: '/'}));

app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use('/file-saver', express.static(path.join(__dirname,'../node_modules/file-saver/dist')));
app.use('/xlsx', express.static(path.join(__dirname,'../node_modules/xlsx/dist')));
app.use('/exceljs', express.static(path.join(__dirname,'../node_modules/exceljs/dist')));

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


var newUser = {
    eID:"100944655",
    firstName:"Saleem",
    lastName:"Karkabi",
    username:"skarkabi",
    password:"123456789",
    userType:"admin"
}

export default app;
