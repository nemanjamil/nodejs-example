const express = require("express");
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');

let User = require('../models/users');
var bcrypt = require('bcrypt');

let bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

const passport = require('passport');


// ROUTERS 

router.get('/register', function (req, res) {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', urlencodedParser, function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out')
    res.render('login');
})

router.post('/register', urlencodedParser, [

    check('name', "Name must be a string and not empty").not().isEmpty(),
    check('email', "Email must be a string and not empty").isEmail(),
    check('username', "UserName must be a string and not empty").not().isEmpty(),
    check('password', "Passsword must be a string and not empty").isLength({
        min: 5
    }),
    check('passwordto', "Password Confirm must be a string and not empty").isLength({
        min: 5
    }),

    check("password", "invalid password")
    .isLength({
        min: 4
    })
    .custom((value, {
        req,
        loc,
        path
    }) => {
        if (value !== req.body.passwordto) {
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })

], function (req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const passwordto = req.body.passwordto;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.array() });
        res.render('register', {
            title: "Add User",
            errors: errors.array()
        })
        console.log(errors.array());
        return;
    }

    let user = new User();
    user.name = name;
    user.email = email;
    user.username = username;
    user.password = password;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            console.log(hash);

            if (err) {
                console.log("error hash");
                return;
            }
            user.password = hash;

            user.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'User is added')
                    res.redirect('/user/login');
                }
            });

        });
    });
})


module.exports = router;