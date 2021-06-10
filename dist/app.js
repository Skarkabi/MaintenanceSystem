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

var _passport = _interopRequireDefault(require("passport"));

var _connectSessionSequelize = _interopRequireDefault(require("connect-session-sequelize"));

var _passport2 = _interopRequireDefault(require("./passport"));

var _mySQLDB = _interopRequireDefault(require("./mySQLDB"));

var _expressBreadcrumbs = _interopRequireDefault(require("express-breadcrumbs"));

var _allowPrototypeAccess = require("@handlebars/allow-prototype-access");

var _User = _interopRequireDefault(require("./models/User"));

var _Vehicle = _interopRequireDefault(require("./models/Vehicle"));

var _Consumables = _interopRequireDefault(require("./models/Consumables"));

var _signIn = _interopRequireDefault(require("./routes/sign-in"));

var _users = _interopRequireDefault(require("./routes/users"));

var _homePage = _interopRequireDefault(require("./routes/homePage"));

var _signOut = _interopRequireDefault(require("./routes/sign-out"));

var _vehicles = _interopRequireDefault(require("./routes/vehicles"));

var _consumables = _interopRequireDefault(require("./routes/consumables"));

require('./models/Session');

_handlebars["default"].registerHelper("counter", function (index) {
  return index + 1;
});

_handlebars["default"].registerHelper('isdefined', function (value, compare) {
  console.log("I am in this function " + value + " " + compare);
  return value === compare;
});

var app = (0, _express["default"])();
var multiHelpers = (0, _handlebarsHelpers["default"])(); // view engine setup

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
var SequelizeStore = (0, _connectSessionSequelize["default"])(_expressSession["default"].Store);
app.use((0, _expressSession["default"])({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 120 * 60 * 1000
  },
  store: new SequelizeStore({
    db: _mySQLDB["default"],
    table: 'Session'
  })
}));
app.use((0, _expressFlash["default"])());
app.use(function (req, res, next) {
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});
(0, _passport2["default"])(_passport["default"]);
app.use(_passport["default"].initialize());
app.use(_passport["default"].session());
app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
app.use('/login', _signIn["default"]);
app.use('/users', _users["default"]);
app.use('/', _homePage["default"]);
app.use('/logout', _signOut["default"]);
app.use('/vehicles', _vehicles["default"]);
app.use('/consumables', _consumables["default"]);
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.validation_error_msg = req.flash('validation_error_msg');
  res.locals.error = req.flash('error');
  next();
});

function taskDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = dd + '/' + mm + '/' + yyyy;
  console.log(today);
  return today;
}

var datemilli = Date.parse('Sun May 11,2014');
console.log(taskDate(datemilli));
var newVehicle = {
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
/*
Oil.findAndCountAll().then(foundBatteries =>{
    var count = foundBatteries.count;
    var newBatteris = foundBatteries.rows;
    var totalQuant = 0;
    var i;
    for(i = 0; i < count; i++){
       totalQuant += newBatteris[i].volume;
    }
    Consumable.addConsumable({category: "Oil", quantity: totalQuant})
})
*/

app.use(_expressBreadcrumbs["default"].init());
app.use(_expressBreadcrumbs["default"].setHome({
  name: 'Dashboard',
  url: '/'
}));
app.use('/bootstrap', _express["default"]["static"](_path["default"].join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery', _express["default"]["static"](_path["default"].join(__dirname, '../node_modules/jquery/dist')));
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