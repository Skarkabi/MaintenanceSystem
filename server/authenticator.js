import passport from 'passport';
import Bluebird from 'bluebird';

/**
  * Authenticate with passport.
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  */



exports.Authenticate = (req, res, next) => new Bluebird((resolve, reject) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return reject(err);
    }
    return resolve(user);
  })(req, res, next);
});
 
/**
  * Login
  * @param {Object} req
  * @param {Object} user
  */
exports.Login = (req, user) => new Bluebird((resolve, reject) => {
  req.login(user, (err) => {
    if (err) {
      return reject(err);
    }
 
    return resolve();
  });
});
 
/**
 * Regenerate user session.
 * @param {Object} req
*/
exports.RegenerateSession = req => new Bluebird((resolve, reject) => {
  req.session.regenerate((err) => {
    if (err) {
      return reject(err);
    }
 
    return resolve();
  });
});
 
/**
  * Save user session.
  * @param {Object} req
  */
exports.SaveSession = req => new Bluebird((resolve, reject) => {
  req.session.save((err) => {
    if (err) {
      return reject(err);
    }
 
    return resolve();
  });
});