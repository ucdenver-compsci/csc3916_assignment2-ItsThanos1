var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

mongoose.Promise = global.Promise;

// Connect to MongoDB - Removed deprecated options
try {
    mongoose.connect(process.env.DB, () => console.log("connected"));
}catch (error) {
    console.log("could not connect:", error);
}

// User schema
var UserSchema = new Schema({
    name: String,
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true, select: false }
});

UserSchema.pre('save', function(next) {
    var user = this;

    // Hash the password
    if (!user.isModified('password')) return next();

    // bcrypt.hash's first argument is the data to hash, second is the salt to use.
    // In this case, we're using the genSalt function to generate the salt.
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // Change the password to the hashed version
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// Return the model to server
module.exports = mongoose.model('User', UserSchema);
