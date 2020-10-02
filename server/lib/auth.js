const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserModel = require('../models/User.Model');
const logger = require('./logger');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (username, password, done) => {
      logger.log('silly', `logging in ${username}`);

      try {
        const user = await UserModel.findOne({ email: username }).exec();
        if (!user) {
          console.log(`Invalid Username`);
          return done(null, false, { message: 'Invalid Username.' });
        }
        const passwordOK = await user.comparePassword(password);
        if (!passwordOK) {
          logger.log(`silly`, `Invalid Password`);
          return done(null, false, { message: 'Invalid Password.' });
        }
        return done(null, user);
      } catch (err) {
        logger.log(`error`, `error logging in: ${err}`);
        return done(null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id).exec();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  setUser: (req, res, next) => {
    res.locals.user = req.user;
    return next();
  },
};