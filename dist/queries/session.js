"use strict";

var Session = require('../models/Session').getModel();

exports.getSessionById = function (sessionId) {
  return User.findOne({
    where: {
      sessionId: sessionId
    }
  });
};