var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('./Users');

passport.use(new BasicStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        // Assuming your User model has a comparePassword method
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    });
}));


exports.isAuthenticated = passport.authenticate('basic', { session: false });
