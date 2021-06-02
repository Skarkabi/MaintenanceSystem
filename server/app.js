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
import sessionStore from 'express-session-sequelize';
import sequelize from 'sequelize';

//import passport from 'passport';
//import passportConfig from './pasport-config';
import breadcrumbs from 'express-breadcrumbs';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

//import dashboardRouter from './routes/dashboard';
import usersRouter from './routes/users';
//import coursesRouter from './routes/courses';
//import facultiesRouter from './routes/faculties';
//import gradeBooksRouter from './routes/gradeBooks';
//import centralRouter from './routes/central';
//import termsRouter from './routes/terms';
import User from './models/User';

const multiHelpers = hbshelpers()


var app = express();


const SessionStore = sessionStore(session.Store);


const myDatabase = new sequelize('calendar', 'root', 'mosjsfskmo1', {
    host: 'localhost',
    dialect: 'mysql',
});
 
const sequelizeSessionStore = new SessionStore({
    db: myDatabase,
});
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({helpers: multiHelpers, extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/', handlebars: allowInsecurePrototypeAccess(handlebars)}))
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(session(
{
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    store: sequelizeSessionStore,
    cookie : {maxAge: 120 * 60 * 1000}
}));

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

User.sync().then(function () {
	// Table created
	return User.create({
  		firstName: 'Saleem',
  		lastName: 'Karkabi'
	});
});
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
