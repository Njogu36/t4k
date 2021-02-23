// Libraries

const date = require('./date.js')

// Models
const Cohort = require('../models/cohort.js')
const Course = require('../models/course.js')
const Log = require('../models/log.js')
const Article = require('../models/article.js')

// Functions
const dashboard_page = (req, res) => {
    const id = req.params.id
    Cohort.findById(id, (err, cohort) => {
        Course.find({ cohort_id: id }, (err, courses) => {
            Log.find({ cohort_id: id }, (err, logs) => {
                Course.findOne({ cohort_id: id, status: 'Ongoing' }, (err, course) => {
                    res.render('./administrator/account/cohort/dashboard.jade', {
                        user: req.user,
                        cohort: cohort,
                        courses: courses,
                        course: course,
                        logs: logs,
                        year: date.year
                    })
                })

            }).sort({_id:-1})

        })

    })

}

const reading_list_page = (req, res) => {
    const id = req.params.id
    Article.find({ cohort_id: id }, (err, articles) => {
        Cohort.findById(id, (err, cohort) => {
            res.render('./administrator/account/cohort/reading_list.jade', {
                user: req.user,
                cohort: cohort,
                year: date.year,
                articles: articles
            })
        })
    })
}

const reading_list_link = (req, res) => {
    const { title, url } = req.body
    const id = req.params.id
    Article.findOne({ title: title }, (err, article) => {
        if (article) {
            req.flash('danger', 'Article already exists.');
            res.redirect('/administrator/reading_list/' + id)
        }
        else {
            let data = new Article();
            data.by = req.user.first_name + ' ' + req.user.last_name;
            data.type = 'link'
            data.created_on = new Date();
            data.url = url
            data.file = ''
            data.date = date.today
            data.cohort_id = id
            data.title = title
            data.save(() => {
                req.flash('info', 'Article added successfully.');
                res.redirect('/administrator/reading_list/' + id)
            })
        }
    })
}

const reading_list_file = (req, res) => {
    const { title } = req.body
    const id = req.params.id
    const path = '/files/'+req.file.filename
    Article.findOne({ title: title }, (err, article) => {
        if (article) {
            req.flash('danger', 'Article already exists.');
            res.redirect('/administrator/reading_list/' + id)
        }
        else {
            let data = new Article();
            data.by = req.user.first_name + ' ' + req.user.last_name;
            data.type = 'file'
            data.created_on = new Date();
            data.url = ''
            data.file = path
            data.date = date.today
            data.cohort_id = id
            data.title = title
            data.save(() => {
                req.flash('info', 'Article added successfully.');
                res.redirect('/administrator/reading_list/' + id)
            })
        }
    })
}
const delete_article = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    Article.findByIdAndRemove(id2, (err) => {
        req.flash('danger', 'Article deleted successfully.');
        res.redirect('/administrator/reading_list/' + id)
    })
}

// Export
module.exports = {
    dashboard_page: dashboard_page,
    reading_list_page: reading_list_page,
    reading_list_link: reading_list_link,
    reading_list_file: reading_list_file,
    delete_article: delete_article
}