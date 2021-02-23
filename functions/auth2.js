// Administrator Authentincation Functions

// Libraries
const bcrypt = require('bcryptjs')
const passport = require('passport')
// Models

const Admin = require('../models/admin.js')


// Functions



const login_page = (req, res) => {
 
    Admin.findOne({username:'admin@teachforkenya.org'},(err,admin)=>{
        if(admin)
        {
            res.render('./administrator/auth/login.jade')
        }
        else
        {
            let data = new Admin();
            data.first_name = 'admin'
            data.last_name = 'admin'
            data.username = 'admin@teachforkenya.org'
            data.type = 'super admin'
            data.password = 'teach4kenya'
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash('teach4kenya', salt, function (err, hash) {
                    data.password = hash
                    data.save(() => {
                         res.render('./administrator/auth/login.jade')
                    })
                })
            });
        }
    })
}

const login_post = passport.authenticate('Admin', {
    successRedirect: '/administrator/home',
    failureRedirect: '/administrator/',
    failureFlash: true,
    session: true

})

const log_out = (req,res) =>{
  req.logout();
  res.redirect('/administrator/')
}





// Export

module.exports = {
login_page:login_page,
login_post:login_post,
log_out:log_out
}