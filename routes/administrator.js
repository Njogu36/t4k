const express= require('express');
var multer = require('multer');

const route = express.Router();
const auth_user = function (req, res, next) {
    if (!req.user) {
        req.flash('info', 'You are logged out, Please Log In')
        res.redirect('/administrator/')
    } else {
        next()
    }
}

// Functions

const auth =  require('../functions/auth2.js');
const home = require('../functions/home.js');
const tag = require('../functions/tags.js');
const user = require('../functions/users.js')
const dashboard = require('../functions/dashboard.js')
const fellow = require('../functions/fellows.js')
const modules = require('../functions/modules.js')
const topic = require('../functions/topic.js')

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

// Modules Images
var storageModule = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/modules');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var uploadModule = multer({ storage: storageModule })

// Fellow Images
var storageFellow = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/fellows');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var uploadFellow = multer({ storage: storageFellow })


// Routes

// Login Page
route.get('/',auth.login_page)
route.post('/login_post',auth.login_post)
route.get('/log_out',auth_user,auth.log_out)


// Home Page
route.get('/home',auth_user,home.home_page)
route.post('/add_new_cohort',auth_user,home.add_new_cohort)
route.get('/delete_cohort/:id',auth_user,home.delete_cohort)
route.get('/edit_cohort_page/:id',auth_user,home.edit_cohort_page)
route.post('/edit_cohort_post/:id',auth_user,home.edit_cohort_post)

// Tags
route.get('/tags',auth_user,tag.tags_page)
route.post('/add_new_tag',auth_user,tag.add_new_tag)
route.get('/edit_tag_page/:id',auth_user,tag.edit_tag_page)
route.post('/edit_tag_post/:id',auth_user,tag.edit_tag_post)
route.get('/delete_tag/:id',auth_user,tag.delete_tag)


// Users
route.get('/users',auth_user,user.users_page)
route.post('/add_new_user',auth_user,user.add_new_user)
route.get('/edit_user_page/:id',auth_user,user.edit_user_page)
route.post('/edit_user_post/:id',auth_user,user.edit_user_post)
route.post('/edit_user_password/:id',auth_user,user.edit_user_password)
route.get('/delete_user/:id',auth_user,user.delete_user)


//Cohort
route.get('/cohort/:id',auth_user,dashboard.dashboard_page)
route.get('/reading_list/:id',auth_user,dashboard.reading_list_page)
route.post('/reading_list_link/:id',auth_user,dashboard.reading_list_link)
route.post('/reading_list_file/:id',auth_user,uploadFile.single('file'),dashboard.reading_list_file)
route.get('/delete_article/:id/:id2',auth_user,dashboard.delete_article)


// Fellows
route.get('/view_fellows/:id',auth_user,fellow.fellows_page)
route.get('/add_fellow/:id',auth_user,fellow.add_new_fellow)
route.get('/view_fellow/:id/:id2',auth_user,fellow.view_fellow)
route.get('/view_bold_questions/:id',auth_user,fellow.view_bold_questions)
route.get('/view_kpis/:id',auth_user,fellow.view_kpis)
route.get('/view_assignments/:id',auth_user,fellow.view_assignments)
route.get('/delete_fellow/:id/:id2',auth_user,fellow.delete_fellow)
route.get('/view_answer/:id/:id2/:id3',auth_user,fellow.view_answer)

route.post('/add_feedback/:id/:id2/:id3/:id4',auth_user,fellow.add_feedback)
route.post('/edit_fellow/:id/:id2',auth_user,fellow.edit_fellow_post)
route.post('/update_image_fellow/:id/:id2',auth_user,uploadFellow.single('file'),fellow.edit_fellow_image)
route.post('/add_new_fellow_post/:id',auth_user,uploadFellow.single('file'),fellow.add_new_fellow_post)


// Modules

route.get('/view_modules/:id',auth_user,modules.modules_page)
route.get('/add_module/:id',auth_user,modules.add_module_page)
route.get('/import_modules/:id',auth_user,modules.import_modules)
route.get('/view_module/:id/:id2',auth_user,modules.view_module_page)
route.get('/view_module2/:id/:id2',auth_user,modules.view_module_page2)
route.get('/delete_module/:id/:id2',auth_user,modules.delete_module)
route.get('/lock_course/:id/:id2',auth_user,modules.lock_course)
route.get('/unlock_course/:id/:id2',auth_user,modules.unlock_course)
route.get('/edit_week/:id/:id2/:id3',auth_user,modules.edit_week);
route.get('/delete_week/:id/:id2/:id3',auth_user,modules.delete_week)
route.get('/delete_task/:id/:id2/:id3',auth_user,modules.delete_task)

route.post('/add_new_sub_module/:id/:id2',auth_user,uploadModule.single('file'),modules.add_new_sub_module)
route.post('/edit_week_post/:id/:id2/:id3',auth_user,modules.edit_week_post)
route.post('/edit_course/:id/:id2',auth_user,modules.edit_course)
route.post('/add_new_week/:id/:id2',auth_user,modules.add_new_week)
route.post('/add_new_topic/:id/:id2',auth_user,modules.add_new_topic)
route.post('/add_new_task/:id/:id2',auth_user,modules.add_new_task)
route.post('/update_image/:id/:id2',auth_user,uploadModule.single('file'),modules.update_image)
route.post('/add_new_module_post/:id',auth_user,uploadModule.single('file'),modules.add_new_module_post)


// Topics
route.get('/view_topic/:id/:id2/:id3/:id4',auth_user,topic.view_topic)
route.get('/delete_topic/:id/:id2/:id3/:id4',auth_user,topic.delete_topic)
route.get('/load_form_data/:id/:id2/:id3/:id4',auth_user,topic.load_form_data);

route.post('/add_form_data/:id/:id2/:id3/:id4',auth_user,topic.add_form_data)
route.post('/add_data/:id/:id2/:id3/:id4',auth_user,topic.add_data)
route.post('/edit_topic/:id/:id2/:id3/:id4',auth_user,topic.edit_topic)


module.exports = route;