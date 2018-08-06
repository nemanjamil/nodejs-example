const LocalStrategy = require("passport-local").Strategy;
const UserPassport = require("../models/users");
const config = require("../config/database");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true
    }, function (username, password, done) {
        let query = {
            username: username
        };
        UserPassport.findOne(query, function (err, usermoj) {
            if (err) throw err;
            if (!usermoj) {
                return done(null, false, {
                    message: "No user found"
                });
            }

            bcrypt.compare(password, usermoj.password, function (err, isMatch) {
                if (err) throw err;

                if (isMatch) {
                    return done(null, usermoj);
                } else {
                    return done(null, false, {
                        message: 'No user found'
                    })
                }
            })
        })
    }));

    passport.serializeUser(function (usermoj, done) {
        done(null, usermoj.id);
    });

    passport.deserializeUser(function (id, done) {
        UserPassport.findById(id, function (err, usermoj) {
            done(err, usermoj);
        });
    });
}