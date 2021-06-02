"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _handlebarsHelpers = _interopRequireDefault(require("handlebars-helpers"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _expressSessionSequelize = _interopRequireDefault(require("express-session-sequelize"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _expressBreadcrumbs = _interopRequireDefault(require("express-breadcrumbs"));

var _allowPrototypeAccess = require("@handlebars/allow-prototype-access");

var _users = _interopRequireDefault(require("./routes/users"));

var _User = _interopRequireDefault(require("./models/User"));

//import passport from 'passport';
//import passportConfig from './pasport-config';
//import dashboardRouter from './routes/dashboard';
//import coursesRouter from './routes/courses';
//import facultiesRouter from './routes/faculties';
//import gradeBooksRouter from './routes/gradeBooks';
//import centralRouter from './routes/central';
//import termsRouter from './routes/terms';
var multiHelpers = (0, _handlebarsHelpers["default"])();
var app = (0, _express["default"])(); // view engine setup

app.set('views', _path["default"].join(__dirname, 'views'));
app.engine('hbs', (0, _expressHandlebars["default"])({
  helpers: multiHelpers,
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/',
  handlebars: (0, _allowPrototypeAccess.allowInsecurePrototypeAccess)(_handlebars["default"])
}));
app.set('view engine', 'hbs');
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public')));
app.use((0, _expressSession["default"])({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 120 * 60 * 1000
  }
}));
app.use((0, _expressFlash["default"])());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.validation_error_msg = req.flash('validation_error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.use(_expressBreadcrumbs["default"].init());
app.use(_expressBreadcrumbs["default"].setHome({
  name: 'Dashboard',
  url: '/users/login'
})); // Find all users

var jane = new _User["default"]({
  firstName: "Jane",
  lastName: "Karkabi"
});
/** 
User.addUser(jane).then(result =>
{
    console.log(`You successfully created course ${result.code}.`);
}).catch(err =>
{
    console.log(err);
});
*/

console.log(jane instanceof _User["default"]); // true

console.log(jane.firstName); // "Jane"

_User["default"].findUsers().then(function (result) {
  console.log("All users:", JSON.stringify(result, null, 2));
})["catch"](function (err) {
  console.log(err);
});

console.log('Jane was saved to the database!');
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

app.use('/bootstrap', _express["default"]["static"](_path["default"].join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery', _express["default"]["static"](_path["default"].join(__dirname, '../node_modules/jquery/dist'))); //app.use('/', dashboardRouter);

app.use('/', _users["default"]);
/** 
app.use('/courses', coursesRouter);
app.use('/faculties', facultiesRouter);
app.use('/gradeBooks', gradeBooksRouter);
app.use('/central', centralRouter);
app.use('/terms', termsRouter);
*/
// catch 404 and forward to error handler.

app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
});
/**
 * Error handler
 */

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
var _default = app;
exports["default"] = _default;