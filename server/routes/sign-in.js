import express from 'express';
import passport from 'passport';
import Bluebird from 'bluebird';

const router = express.Router();
/**
  * Authenticate with passport.
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  */
const authenticate = (req, res, next) => new Bluebird((resolve, reject) => {
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
const login = (req, user) => new Bluebird((resolve, reject) => {
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
const regenerateSession = req => new Bluebird((resolve, reject) => {
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
const saveSession = req => new Bluebird((resolve, reject) => {
  req.session.save((err) => {
    if (err) {
      return reject(err);
    }
 
    return resolve();
  });
});
 
/**
  * HTTP handler for sign in.
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
*/

router.get('/', async (req, res, next) => 
  Bluebird.resolve().then(async () => {
    console.log("Please be here");
    const user = await authenticate(req.body, res, next);
    if (user)
    {
      await login(req, user);
      const temp = req.session.passport;
   
      await regenerateSession(req);
      req.session.passport = temp;
   
      await saveSession(req);
      console.log("I am here")
      res.redirect('/');
    }
    else
    {
      console.log("No Actually I am here")
      res.render('login', { title: 'Login', landingPage: true });
    }

  }).catch(next)
);


router.post('/users/login', async (req, res, next) => 
  Bluebird.resolve().then(async () => {
    const user = await authenticate(req, res, next);
    //console.log(req);
    if (user)
    {
      console.log("AAAAAA1");
      await login(req, user);
      const temp = req.session.passport;
     
      await regenerateSession(req);
      req.session.passport = temp;
     
      await saveSession(req);
      console.log("I am here")
      // Make sure that we are not showing the user login page, if the user already logged in.
      res.render('layout');
    }
    else
    {
      console.log("AAAAAAAAAA");
      res.render('login', { title: 'Login', landingPage: true }, );
    }

  }).catch(next)
);

export default router;