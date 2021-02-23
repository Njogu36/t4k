// Fellow Authentincation Functions

// Libraries
const bcrypt = require('bcryptjs')
const passport = require('passport')
const nodemailer = require("nodemailer")
const config = require('../config/keys.js')
// Models

const Log = require('../models/log.js')
const Fellow = require('../models/fellow.js')

// Functions
const dat = new Date();
const year = dat.getFullYear();
const day = ('0' + dat.getDate()).slice(-2);
const month = ('0' + (dat.getMonth() + 1)).slice(-2);
const today = year + "-" + month + "-" + day;
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
const hour = addZero(dat.getHours());
const minute = addZero(dat.getMinutes());
const second = addZero(dat.getSeconds());


const login_page = (req, res) => {

    res.render('./fellow/auth/login.jade')

}

const forgot_password = (req, res) => {
    res.render('./fellow/auth/forgot_password.jade')
}

const login_post = (req, res, next) => {
    passport.authenticate('learner', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.flash('danger', info.message)
            res.redirect('/');
        }
        if (user) {
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                if (user) {

                    let data = new Log();
                    data.fellow_id = req.user.id;
                    data.fullname = req.user.first_name + ' ' + req.user.last_name
                    data.cohort_id = req.user.cohort_id
                    data.status = 'User logged in to system.'
                    data.topic = '';
                    data.course = '';
                    data.date = today
                    data.time = hour + ':' + minute + ':' + second
                    data.created_on = new Date();
                    data.save(() => {
                        res.redirect('/dashboard')

                    })
                }

            });
        }
    })(req, res, next);
}

const log_out = (req, res) => {
    let data = new Log();
    data.fellow_id = req.user.id;
    data.fullname = req.user.first_name + ' ' + req.user.last_name
    data.cohort_id = req.user.cohort_id
    data.status = 'User logged out from system.'
    data.topic = '';
    data.course = '';
    data.date = today
    data.time = hour + ':' + minute + ':' + second
    data.created_on = new Date();
    data.save(() => {
        req.logout();
        res.redirect('/')
    })
}

const forgot_password_post = (req,res)=>{
    Fellow.findOne({ username: req.body.username }, (err, fellow) => {
        if (!fellow) {
          req.flash('danger', 'Invalid email address')
          res.redirect('/forgot_password')
        }
        else {
          // NodeMailer
    
          var transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
              user: config.teachforkenya_email.email,
              pass: config.teachforkenya_email.password
            }
          });
    
          var mailOptions = {
            from: config.teachforkenya_email.email,
            to: req.body.username,
            subject: 'Teach For Kenya Login credentials',
            text: 'Hi ' + fellow.first_name + ',  Your login credentials are email: ' + req.body.username + ', password: ' + fellow.pass,
          };
    
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              req.flash('danger','Networtk error.Try again later');
              res.redirect('/forgot_password')

            } else {
              console.log('Email sent: ' + info.response);
              req.flash('info', 'You login credentials have been sent to your email.')
              res.redirect('/forgot_password')
            }
          });
    
        }
      })

}







// Export

module.exports = {
    login_page: login_page,
    forgot_password: forgot_password,
    forgot_password_post:forgot_password_post,
    login_post: login_post,
    log_out: log_out
}