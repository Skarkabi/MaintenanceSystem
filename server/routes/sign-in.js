import express from 'express';
import Bluebird from 'bluebird';
import passport from 'passport';
import { Authenticate, Login, RegenerateSession, SaveSession } from '../authenticator';
import errorHandler from '../errorHandler';
const router = express.Router();


/**
  * HTTP handler for sign in.
  *
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
*/

router.get('/', async (req, res, next) => 
 {
    if (req.user)
    {
      res.redirect('/');
    }
    else
    {
      res.render('login', { title: 'Login', landingPage: true });
    }

  }
);


router.post('/', async (req, res, next) => 
  Bluebird.resolve().then(async () => {
    const user = await Authenticate(req, res, next);
    if (user)
    {
      await Login(req, user);
      const temp = req.session.passport;
     
      await RegenerateSession(req);
      req.session.passport = temp;
     
      await SaveSession(req);
      // Make sure that we are not showing the user login page, if the user already logged in.
      res.redirect('/');
      
    }
    else
    {
      res.render('login', { error_msg: "Invalid Username or password" ,title: 'Login', landingPage: true }, );
    }

  }).catch(next)
);



export default router;