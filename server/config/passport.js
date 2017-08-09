var User = require('../app/models/user');
var passportJWT = require('passport-jwt');

module.exports = (passport) => {
    var ExtractJwt = passportJWT.ExtractJwt;
    var JwtStrategy = passportJWT.Strategy; 
    let jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: process.env.SECRET
    };

    passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        User.findOne({ 'email': jwt_payload.email }, (err, user) => {
            if (err) return done(err, false);
            if (!user) return done(null, false);
            return done(null, user);
        });
    }));
};