"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _authentication = require("../authentication");

var _User = _interopRequireDefault(require("../models/User"));

var _CourseInstance = _interopRequireDefault(require("../models/CourseInstance"));

var _Term = _interopRequireDefault(require("../models/Term"));

var _lodash = _interopRequireDefault(require("lodash"));

var _errorHandler = _interopRequireDefault(require("../errorHandler"));

var router = _express["default"].Router();
/* GET home page. */


router.get('/', _authentication.Authenticated, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _User["default"].findUsers({
              _id: req.user._id
            }, ["courses", "type"]).then(function (users) {
              var user = users[0]; // Render courses that students taking

              if (user.type === "Student") {
                renderStudentDashboard(user, req, res);
              } else if (user.type === "Professor") {
                renderProfessorDashboard(user, req, res);
              } else if (user.type === "Admin") {
                renderAdminDashboard(res);
              } else {
                (0, _errorHandler["default"])(req, res, "/access-denied", "Sorry, we could not find the user", err);
              }
            })["catch"](function (err) {
              (0, _errorHandler["default"])(req, res, "/", "Sorry, we could not find the user", err);
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get('/access-denied', _authentication.Authenticated, function (req, res, next) {
  res.render('accessDenied', {
    title: 'Access Denied',
    jumbotronDescription: "Your permission is not enough to see this content. If you think this is wrong, please contact with administrator."
  });
});
/**
 * Renders student dashboard.
 * @param {*} user 
 * @param {*} req 
 * @param {*} res 
 */

function renderStudentDashboard(user, req, res) {
  _CourseInstance["default"].findCourseInstances({
    _id: user.courses
  }, ["code", "section", "description", "term", "instructor", "scheduleTime", "scheduleDay"]).then( /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(result) {
      var courseInstances, courseTermIds, instructorsIds, terms, instructors, courseInstancesByTerm, hbsCourseInstances;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              courseInstances = JSON.parse(JSON.stringify(result));
              courseTermIds = [];
              instructorsIds = [];
              courseInstances.forEach(function (instance) {
                courseTermIds.push(instance.term);
                instructorsIds.push(instance.instructor);
              });
              _context2.next = 6;
              return _Term["default"].get({
                _id: courseTermIds
              })["catch"](function (err) {
                return (0, _errorHandler["default"])(req, res, "/error", "Something awful happened.", err);
              });

            case 6:
              terms = _context2.sent;
              _context2.next = 9;
              return _User["default"].findUsers({
                _id: instructorsIds
              }, ["firstName", "lastName"])["catch"](function (err) {
                return (0, _errorHandler["default"])(req, res, "/error", "Something awful happened.", err);
              });

            case 9:
              instructors = _context2.sent;
              courseInstances.forEach(function (instance) {
                var courseTerm = terms.find(function (term) {
                  return term._id == instance.term;
                });
                var courseInstructor = instructors.find(function (instructor) {
                  return instructor._id == instance.instructor;
                });

                if (courseTerm) {
                  instance.termName = courseTerm.name;
                }

                if (courseInstructor) {
                  instance.instructorFullName = "".concat(courseInstructor.firstName, " ").concat(courseInstructor.lastName);
                }
              });
              courseInstancesByTerm = _lodash["default"].groupBy(courseInstances, 'termName');
              hbsCourseInstances = [];
              Object.keys(courseInstancesByTerm).forEach(function (key) {
                var data = {
                  "term": key,
                  instances: courseInstancesByTerm[key]
                };
                hbsCourseInstances.push(data);
              });
              res.render('dashboard', {
                title: 'Dashboard',
                jumbotronDescription: "Welcome! This is your dashboard and you can access everything from here easily.",
                courses: hbsCourseInstances
              });

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x4) {
      return _ref2.apply(this, arguments);
    };
  }());
}
/**
 * Renders professor dashboard.
 * @param {*} user 
 * @param {*} req 
 * @param {*} res 
 */


function renderProfessorDashboard(user, req, res) {
  _CourseInstance["default"].findCourseInstances({
    instructor: user._id
  }, ["code", "section", "description", "term", "instructor", "scheduleTime", "scheduleDay"]).then( /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(result) {
      var courseInstances, courseTermIds, instructorsIds, terms, instructors, courseInstancesByTerm, hbsCourseInstances;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log(result);
              courseInstances = JSON.parse(JSON.stringify(result));
              courseTermIds = [];
              instructorsIds = [];
              courseInstances.forEach(function (instance) {
                courseTermIds.push(instance.term);
                instructorsIds.push(instance.instructor);
              });
              _context3.next = 7;
              return _Term["default"].get({
                _id: courseTermIds
              })["catch"](function (err) {
                return (0, _errorHandler["default"])(req, res, "/error", "Something awful happened.", err);
              });

            case 7:
              terms = _context3.sent;
              _context3.next = 10;
              return _User["default"].findUsers({
                _id: instructorsIds
              }, ["firstName", "lastName"])["catch"](function (err) {
                return (0, _errorHandler["default"])(req, res, "/error", "Something awful happened.", err);
              });

            case 10:
              instructors = _context3.sent;
              courseInstances.forEach(function (instance) {
                var courseTerm = terms.find(function (term) {
                  return term._id == instance.term;
                });
                var courseInstructor = instructors.find(function (instructor) {
                  return instructor._id == instance.instructor;
                });

                if (courseTerm) {
                  instance.termName = courseTerm.name;
                }

                if (courseInstructor) {
                  instance.instructorFullName = "".concat(courseInstructor.firstName, " ").concat(courseInstructor.lastName);
                }
              });
              courseInstancesByTerm = _lodash["default"].groupBy(courseInstances, 'termName');
              hbsCourseInstances = [];
              Object.keys(courseInstancesByTerm).forEach(function (key) {
                var data = {
                  "term": key,
                  instances: courseInstancesByTerm[key]
                };
                hbsCourseInstances.push(data);
              });
              res.render('dashboard', {
                title: 'Dashboard',
                jumbotronDescription: "Welcome! This is your dashboard and you can access everything from here easily.",
                courses: hbsCourseInstances
              });

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x5) {
      return _ref3.apply(this, arguments);
    };
  }());
}
/**
 * Renders admin dashboard.
 * @param {*} res 
 */


function renderAdminDashboard(res) {
  res.render('dashboard', {
    title: 'Dashboard',
    jumbotronDescription: "Welcome! This is your dashboard and you can access everything from here easily."
  });
}

var _default = router;
exports["default"] = _default;