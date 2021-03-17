// Libraries


// Models
const Cohort = require('../models/cohort.js')
const Course = require('../models/course.js')
const Week = require('../models/week.js')
const Topic = require('../models/topic.js');
const date = require('./date.js')

//Functions
const view_topic = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    const id3 = req.params.id3;
    const id4 = req.params.id4
    Cohort.findById(id, (err, cohort) => {
        Course.findById(id2, (err, course) => {
            Week.findById(id3, (err, week) => {
                Topic.findById(id4, (err, topic) => {
                    res.render('./administrator/account/topic/view_topic.jade', {
                        user: req.user,
                        topic: topic,
                        cohort: cohort,
                        course: course,
                        week: week,
                        year: date.year
                    })
                })
            })
        })
    })
}

const add_data = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    const id3 = req.params.id3
    const id4 = req.params.id4
    const { editor } = req.body
    let query = {
        _id: id4
    }
    let data = {};
    data.description = editor
    Topic.update(query, data, (err) => {
        req.flash('info', 'Content saved successfully')
        res.redirect('/administrator/view_topic/' + id + '/' + id2 + '/' + id3 + '/' + id4)
    })
}

const edit_topic = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    const id3 = req.params.id3
    const id4 = req.params.id4
    const { title } = req.body
    let query = {
        _id: id4
    }
    let data = {};
    data.title = title
    Topic.update(query, data, (err) => {
        req.flash('info', 'Topic updated successfully')
        res.redirect('/administrator/view_topic/' + id + '/' + id2 + '/' + id3 + '/' + id4)
    })
}

const delete_topic = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    const id3 = req.params.id3
    const id4 = req.params.id4
    Topic.findById(id4, (err, topic) => {
        const no = topic.no;
        Topic.find({ course_id: id2, week_id: id3 }, (err, topics) => {
            topics.map((item) => {
                if (item.no > no) {
                    let query = {
                        _id: item.id
                    }
                    let data = {};
                    data.no = item.no - 1
                    Topic.update(query, data, (err) => {

                    })
                }
            })
        })
    })

    setTimeout(() => {
        Topic.findByIdAndRemove(id4, (err) => {
            
            Course.findById(id2, (err, course) => {
                if (course.sub_module === true) {
                    req.flash('danger', 'Topic deleted successfully.')
            res.redirect('/administrator/view_module2/' + id + '/' + id2)
                }
                else {
                    req.flash('danger', 'Topic deleted successfully.')
            res.redirect('/administrator/view_module/' + id + '/' + id2)
                }
            })
        })
    }, 1500)

}
const load_form_data = (req, res) => {
    Topic.findById(req.params.id4, (err, topic) => {
        if (topic.questions.length > 0) {
            res.send({ success: true, formData: topic.questions[0].json })
        }
        else if (topic.questions.length < 1) {
            res.send({ success: true, formData: [] })
        }

    })
}

const add_form_data = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    const id3 = req.params.id3
    const id4 = req.params.id4
    const { json, html } = req.body;
    let questions = [{
        json: JSON.parse(json),
        html: html
    }];
    var arrayTable = []
    JSON.parse(json).map((item) => {
        const name = item.name;
        arrayTable.push(name)
    })
    setTimeout(() => {
        let query = {
            _id: id4
        }
        let data = {}
        data.questions = questions;
        data.table_headers = arrayTable;

        Topic.update(query, data, (err, results) => {
            res.send({ success: true, message: 'Form saved successfully.' })
        })

    }, 200)

}

const view_answers = (req,res)=>{

}
//Export Functions
module.exports = {
    view_topic: view_topic,
    add_data: add_data,
    edit_topic: edit_topic,
    load_form_data: load_form_data,
    add_form_data: add_form_data,
    delete_topic: delete_topic,
    view_answers:view_answers

}