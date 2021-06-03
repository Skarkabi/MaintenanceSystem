const Session = require('../models/Session').getModel();
 
exports.getSessionById = sessionId => User.findOne({
  where: { sessionId },
});
