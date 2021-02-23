const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Models

const Admin = require('../models/admin.js');
const Learner = require('../models/fellow.js')

module.exports = function (passport) {

    //local strategy
    passport.use('Admin',new LocalStrategy(function (username, password, done) {
        //match Username
        let query = {
            username: username
        };
        Admin.findOne(query, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return done(null, false, {
                    message: 'No User Found'
                });
            }
            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }
            });
        });

    }));

    passport.use('learner',new LocalStrategy(function (username, password, done) {
        //match Username
        let query = {
            username: username
        };
        Learner.findOne(query, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return done(null, false, {
                    message: 'No User Found'
                });
            }
            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }
            });
        });

    }));

    function SessionConstructor(userId, userGroup, details) {
        this.userId = userId;
        this.userGroup = userGroup;
        this.details = details;
    }

    passport.serializeUser(function (userObject, done) {
        let userPrototype =  Object.getPrototypeOf(userObject);

        if (userPrototype === Admin.prototype) {
            userGroup = "model1";
        } else if (userPrototype === Learner.prototype) {
            userGroup = "model2";
        }

        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
    });

    passport.deserializeUser(function (sessionConstructor, done) {

        if (sessionConstructor.userGroup == 'model1') {
            Admin.findOne({
                _id: sessionConstructor.userId
            },'-Admin', function (err, user) {
                done(err, user);
            });
        } else if (sessionConstructor.userGroup == 'model2') {
            Learner.findOne({
                _id: sessionConstructor.userId
            },'-learner', function (err, user) {
                done(err, user);
            });
        }


    });
}
