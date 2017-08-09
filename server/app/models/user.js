var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var userSchema = mongoose.Schema({
    email: {
        type: String, 
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
}, 
{
    timestamps: true
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.login = function(email, password, callback) {
    var User = this.model('User');
    User.findOne({ 'email': email }, (err, user) => {
        if (err) return callback(false, { error: err });
        if (!user) return callback(false, { error: 'User not found' });
        if (!user.validPassword(password)) return callback(false, { error: 'Wrong password' });
        return callback(true, { 
            id: user._id,
            email: user.email,
            token: generateToken(user.email) 
        });
    });
};

userSchema.statics.signup = function(email, password, callback) {
    var User = this.model('User');
    User.findOne({ 'email': email }, (err, user) => {
        if (err) return callback(false, { error: err });
        if (user) return callback(false, { error: 'That email is already taken.' });
        var newUser = new User;
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.save((err) => {
            if (err) { 
                return callback(false, { error: err });
            } else {
                return callback(true, { 
                    id: newUser._id,
                    email: newUser.email,
                    token: generateToken(newUser.email) 
                });
            }
        });
    });
}

function generateToken(email) {
    var payload = { email };
    var token = jwt.sign(payload, process.env.SECRET);
    return token;
}

module.exports = mongoose.model('User', userSchema);

