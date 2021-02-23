const express= require('express');
const route = express.Router();
var multer = require('multer');


// Functions
const auth_user = function (req, res, next) {
    if (!req.user) {
        req.flash('info', 'You are logged out, Please Log In')
        res.redirect('/')
    } else {
        next()
    }
}

const auth =  require('../functions/auth1.js');
const account = require('../functions/account.js')
const course = require('../functions/course.js')
const topic = require('../functions/topic2.js')
// Fellows
var storageFellow = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/fellows');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var uploadFellow = multer({ storage: storageFellow })
// Files
var storageFile = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/files');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var uploadFile = multer({ storage: storageFile })


// Routes

// Login Page

route.get('/',auth.login_page)
route.post('/login_post',auth.login_post)
route.get('/forgot_password',auth.forgot_password)
route.post('/forgot_password',auth.forgot_password_post)
route.get('/log_out',auth_user,auth.log_out)

// Account

// Dashboard

route.get('/dashboard',auth_user,account.dashboard_page)
route.get('/achieved/:id',auth_user,account.achieved)
route.get('/edit_kpi/:id',auth_user,account.edit_kpi)
route.get('/view_fellow/:id',auth_user,account.view_fellow)
route.get('/delete_article/:id',auth_user,account.delete_article)
route.get('/delete_kpi/:id',auth_user,account.delete_kpi)

route.post('/add_tag',auth_user,account.add_tag)
route.post('/my_journey/false/:id',auth_user,account.my_journey_false)
route.post('/my_journey/true/:id',auth_user,account.my_journey_true)
route.post('/update_image',auth_user,uploadFellow.single('file'),account.update_image)
route.post('/edit_password',auth_user,account.edit_password)
route.post('/edit_kpi_post/:id',auth_user,account.edit_kpi_post)
route.post('/add_new_kpi',auth_user,account.add_new_kpi);
route.post('/add_bold_question',auth_user,account.add_bold_question)
route.post('/reading_list_file',auth_user,uploadFile.single('file'),account.reading_list_file)
route.post('/reading_list_link',auth_user,account.reading_list_link)


// Courses

route.get('/view_module/:id',auth_user,course.view_module)


// Topics
route.get('/view_topic/:id/:id2/:id3',auth_user,topic.view_topic)
route.get('/topic_next/:id/:id2/:id3',auth_user,topic.topic_next)
route.get('/topic_previous/:id/:id2/:id3',auth_user,topic.topic_previous)
route.get('/complete_week/:id/:id2/:id3',auth_user,topic.complete_week)
route.get('/view_answer/:id/:id2',auth_user,topic.view_answer)
route.post('/answer/:id/:id2/:id3',auth_user,topic.answer)







module.exports = route;