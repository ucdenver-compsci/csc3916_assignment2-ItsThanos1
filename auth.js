var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('./Users');

passport.use(new BasicStrategy(
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
 
            // Assuming your User model has a method to compare passwords
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
 
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
 ));


exports.isAuthenticated = passport.authenticate('basic', { session: false });
