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

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _passport2 = _interopRequireDefault(require("./passport"));

var _mySQLDB = _interopRequireDefault(require("./mySQLDB"));

var _expressBreadcrumbs = _interopRequireDefault(require("express-breadcrumbs"));

var _allowPrototypeAccess = require("@handlebars/allow-prototype-access");

var _signIn = _interopRequireDefault(require("./routes/sign-in"));

var _users = _interopRequireDefault(require("./routes/users"));

var _homePage = _interopRequireDefault(require("./routes/homePage"));

var _signOut = _interopRequireDefault(require("./routes/sign-out"));

var _vehicles = _interopRequireDefault(require("./routes/vehicles"));

var _consumables = _interopRequireDefault(require("./routes/consumables"));

var _supplier = _interopRequireDefault(require("./routes/supplier"));

var _main = _interopRequireDefault(require("./routes/main"));

var _NonStockConsumables = _interopRequireDefault(require("./models/consumables/NonStockConsumables"));

require('./models/Session');

require('./models/MaintenanceOrder');

_handlebars["default"].registerHelper("counter", function (index) {
  return index + 1;
});

_handlebars["default"].registerHelper("makeObject", function (id, action) {
  var value = {
    id: id,
    action: action
  };
  console.log("Returning " + JSON.stringify(value));
  return value;
});

_handlebars["default"].registerHelper('isdefined', function (value, compare) {
  console.log("I am in this function " + value + " " + compare);
  return value === compare;
});

_handlebars["default"].registerHelper('lowerCase', function (value) {
  return value.toLowerCase();
});

_handlebars["default"].registerHelper('changeValue', function (variable, value) {
  variable = value;
  console.log("Value is now " + variable);
  return variable = value;
});

_handlebars["default"].registerHelper('roundToTwo', function (x, y) {
  return (x * y).toFixed(2);
});

_handlebars["default"].registerHelper('console', function (value) {
  return console.log("Outputting " + JSON.stringify(value));
});

_handlebars["default"].registerHelper('convertToString', function (value) {
  return JSON.stringify(value);
});

_handlebars["default"].registerDecorator('checkOption', function () {
  return console.log(document.getElementById("category").value);
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
  limit: '50mb',
  extended: true
}));
app.use((0, _cookieParser["default"])());
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public')));
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
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
app.use(function (req, res, next) {
  app.locals.user = req.user;
  next();
});
app.use('/login', _signIn["default"]);
app.use('/users', _users["default"]);
app.use('/', _homePage["default"]);
app.use('/logout', _signOut["default"]);
app.use('/vehicles', _vehicles["default"]);
app.use('/consumables', _consumables["default"]);
app.use('/suppliers', _supplier["default"]);
app.use('/maintanence', _main["default"]);
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
  url: '/'
}));
app.use('/bootstrap', _express["default"]["static"](_path["default"].join(__dirname, '../node_modules/bootstrap/dist')));
app.use('/jquery', _express["default"]["static"](_path["default"].join(__dirname, '../node_modules/jquery/dist')));
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