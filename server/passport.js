import Bluebird from 'bluebird';
const LocalStrategy = require('passport-local').Strategy;

import userQueries from './models/User';

console.log("I got into the passpott");

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => Bluebird.resolve()
    .then(async () => {
        console.log("this is my ID: " + id);
      const user = await userQueries.getUserById(id);

      done(null, user);
    })
    .catch(done));

  passport.use('local', new LocalStrategy(
    {
      usernameField: 'fName',
      passwordField: 'lName',
      passReqToCallback: true,
    },
    (req, firstName, lastName, done) => Bluebird.resolve()
      .then(async () => {
        const user = await userQueries.getUserByFirstName(firstName);
        console.log("mine is: " + JSON.stringify(user));
        if (!user || !await user.comparePassword(lastName)) {
          return done(null, null);
        }

        return done(null, user);
      })
      .catch(done),
  ));
};