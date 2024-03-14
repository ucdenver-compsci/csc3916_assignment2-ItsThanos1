var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./Users');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("JWT Payload received:", jwt_payload);
    User.findById(jwt_payload.id, function(err, user) {
        if (err) {
            console.error("Error during user lookup:", err);
            return done(err, false);
        }
        if (user) {
            console.log("User found:", user);
            return done(null, user);
        } else {
            console.log("No user found with ID from JWT payload:", jwt_payload.id);
            return done(null, false);
        }
    });
}));
exports.isAuthenticated = passport.authenticate('jwt', { session : false });
exports.secret = opts.secretOrKey ;