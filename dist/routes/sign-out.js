"use strict";

/**
 * HTTP handler for sign out.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports = function (req, res) {
  req.logout();
  res.send();
};