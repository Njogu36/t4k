// Libraries
const date = require('../functions/date.js')
const bcrypt = require('bcryptjs')

// Models
const Admin = require('../models/admin.js')

// Functions
const users_page = (req, res) => {
    Admin.find({}, (err, admins) => {
        res.render('./administrator/account/home/users.jade', {
            user: req.user,
            year: date.year,
            admins: admins
        })
    })
}

const add_new_user = (req, res) => {
    const { first_name, last_name, username, type, password, password2 } = req.body;
    if (password !== password2) {
        req.flash('danger', 'Passwords do not match.')
        res.redirect('/administrator/users')
    }
    else {
        Admin.findOne({ username: username }, (err, admin) => {
            if (admin) {
                req.flash('danger', 'Administrator already exists.')
                res.redirect('/administrator/users')
            }
            else {
                let data = new Admin();
                data.first_name = first_name;
                data.last_name = last_name;
                data.username = username;
                data.type = type;
                data.password = password
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        data.password = hash
                        data.save(() => {
                            req.flash('info', 'Administrator added successfully.')
                            res.redirect('/administrator/users')
                        })
                    })
                });
            }
        })


    }

}

const edit_user_page = (req, res) => {
    const id = req.params.id
    Admin.findById(id, (err, admin) => {
        res.render('./administrator/account/home/edit_user.jade', {
            user: req.user,
            admin: admin
        })
    })
}

const edit_user_post = (req, res) => {
    const { first_name, last_name, username, type } = req.body;
    const id = req.params.id
    const query = {
        _id: id
    }
   
            let data = {};
            data.first_name = first_name;
            data.last_name = last_name;
            data.username = username;
            data.type = type;
            Admin.update(query, data, () => {
                req.flash('info', 'Administrator updated successfully.')
                res.redirect('/administrator/users')
            })


}

const edit_user_password = (req, res) => {
    const { password, password2 } = req.body;
    const id = req.params.id
    const query = {
        _id: id
    }
    if (password !== password2) {
        req.flash('danger', 'Passwords do not match.')
        res.redirect('/administrator/edit_user_page/' + id)
    }
    else {
        let data = {}
        data.password = password;
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                data.password = hash
                Admin.update(query, data, () => {
                    req.flash('info', 'Administrator password  updated successfully.')
                    res.redirect('/administrator/users')
                })
            })
        });


    }
}

const delete_user = (req, res) => {
    const id = req.params.id;
    Admin.findByIdAndRemove(id, (err) => {
        req.flash('danger', 'User deleted successfully.');
        res.redirect('/administrator/users')
    })

}

// Export Function
module.exports = {
    users_page: users_page,
    add_new_user: add_new_user,
    edit_user_page: edit_user_page,
    edit_user_post: edit_user_post,
    edit_user_password: edit_user_password,
    delete_user: delete_user
}


