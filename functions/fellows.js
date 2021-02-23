// Library
const date = require('./date.js')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const config = require('../config/keys.js')

// Models

const Fellow = require('../models/fellow.js')
const Cohort = require('../models/cohort.js')
const Course = require('../models/course.js')
const Topic = require('../models/topic.js')
const KPI = require('../models/kpi.js')
const Task = require('../models/individual_task.js')
const Answer = require('../models/answer.js')


// Functions
const fellows_page = (req, res) => {
    const id = req.params.id
    Cohort.findById(id, (err, cohort) => {
        Fellow.find({ cohort_id: id }, (err, fellows) => {
            res.render('./administrator/account/fellows/fellows.jade', {
                user: req.user,
                fellows: fellows,
                cohort: cohort,
                year: date.year
            })
        }).sort({ first_name: 1 })
    })
}

const add_new_fellow = (req, res) => {
    const id = req.params.id
    Cohort.findById(id, (err, cohort) => {
        res.render('./administrator/account/fellows/add_fellow.jade', {
            user: req.user,
            cohort: cohort,
            year: date.year
        })
    })
}

const view_bold_questions = (req, res) => {
    const id = req.params.id
    Cohort.findById(id, (err, cohort) => {
        Fellow.find({ cohort_id: id }, (err, fellows) => {
            res.render('./administrator/account/fellows/view_bold_questions.jade', {
                user: req.user,
                cohort: cohort,
                year: date.year,
                fellows: fellows
            })
        }).sort({ first_name: 1 })
    })
}

const view_kpis = (req, res) => {
    const id = req.params.id
    Cohort.findById(id, (err, cohort) => {
        KPI.find({ cohort_id: id }, (err, kpis) => {
            res.render('./administrator/account/fellows/view_kpis.jade', {
                user: req.user,
                cohort: cohort,
                year: date.year,
                kpis: kpis
            })
        })

    })
}

const view_assignments = (req, res) => {
    const id = req.params.id
    Cohort.findById(id, (err, cohort) => {
        res.render('./administrator/account/fellows/view_assignments.jade', {
            user: req.user,
            cohort: cohort,
            year: date.year
        })
    })

}

const add_new_fellow_post = (req, res) => {
    const { first_name, last_name, username, phone_no, city, country, dob } = req.body;
    const id = req.params.id
    Fellow.findOne({ username: username ,cohort_id:id}, (er, fellow) => {
        Cohort.findById(id, (err, cohort) => {
            if (fellow) {
                req.flash('danger', 'Fellow already exists.');
                res.redirect('/administrator/add_fellow/' + id)
            }
            else {
                let query = {
                    _id: id
                }
                let data = {};
                data.fellows = cohort.fellows + 1;
                Cohort.update(query, data, (err) => {
                    console.log('Fellow Updated')
                })
                if (req.file) {
                    let path = '/fellows/' + req.file.filename
                    let data = new Fellow();
                    data.first_name = first_name
                    data.last_name = last_name;
                    data.username = username;
                    data.phone_no = phone_no;
                    data.profile_image = path;
                    data.banner_image = '/fellows/banner_image.png';
                    data.country = country;
                    data.city = city;
                    data.dob = dob;
                    data.bold_question = '';
                    data.answered_questions = [];
                    data.current_topic = '';
                    data.current_topic_id = ''
                    data.cohort = cohort;
                    data.cohort_id = id;
                    data.password = 'teach4kenya'
                    data.pass =  'teach4kenya'
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash('teach4kenya', salt, function (err, hash) {
                            data.password = hash
                            data.save(() => {
                                req.flash('info', 'Fellow added successfully.');
                                res.redirect('/administrator/add_fellow/' + id)
                            })
                        })
                    });
                }
                else if (!req.file) {
                    let data = new Fellow();
                    data.first_name = first_name
                    data.last_name = last_name;
                    data.username = username;
                    data.phone_no = phone_no;
                    data.profile_image = '/user.png';
                    data.banner_image = '/fellows/banner_image.png';
                    data.country = country;
                    data.city = city;
                    data.dob = dob;
                    data.bold_question = '';
                    data.answered_questions = [];
                    data.current_topic = '';
                    data.current_topic_id = ''
                    data.cohort = cohort;
                    data.cohort_id = id;
                    data.pass =  'teach4kenya'
                    data.password = 'teach4kenya'
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash('teach4kenya' , salt, function (err, hash) {
                            data.password = hash
                            data.save(() => {
                                req.flash('info', 'Fellow added successfully.');
                                res.redirect('/administrator/add_fellow/' + id)
                            })
                        })
                    });
                }

                // Nodemailer
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
                    to: username,
                    subject:'Teach For Kenya Login credentials',
                    text:  'Hi '+req.body.first_name+', welcome to Teach For Kenya elearning management system. Your login credentials are email: ' +username+ ', password: teach4kenya',
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });

            }
        })
    })
}

const view_fellow = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    Cohort.findById(id, (err, cohort) => {
        Topic.find({ cohort_id: id, type: 'Do' }, (err, topics) => {
            Fellow.findById(id2, (err, fellow) => {
                KPI.find({ fellow_id: id2 }, (err, kpis) => {
                    Task.find({ fellow_id: id2 }, (err, tasks) => {
                        console.log(tasks)
                        res.render('./administrator/account/fellows/view_fellow.jade', {
                            user: req.user,
                            cohort: cohort,
                            fellow: fellow,
                            year: date.year,
                            topics: topics,
                            kpis: kpis,
                            tasks: tasks
                        })
                    })

                })

            })
        }).sort({ _id: 1 })

    })
}

const edit_fellow_post = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    const { first_name, last_name, username, phone_no, dob, country, city } = req.body;
    let query = {
        _id: id2
    }
    let data = {};
    data.first_name = first_name;
    data.last_name = last_name;
    data.username = username;
    data.phone_no = phone_no;
    data.dob = dob;
    data.country = country;
    data.city = city;
    Fellow.update(query, data, (err) => {
        req.flash('info', 'Fellow updated successfully.')
        res.redirect('/administrator/view_fellow/' + id + '/' + id2)
    })

}

const edit_fellow_image = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    let path = '/fellows/' + req.file.filename
    let query = {
        _id: id2
    }
    let data = {};
    data.profile_image = path;
    Fellow.update(query, data, (err) => {
        req.flash('info', 'Fellow updated successfully.')
        res.redirect('/administrator/view_fellow/' + id + '/' + id2)
    })

}
const delete_fellow = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2;
    Cohort.findById(id, (err, cohort) => {
        let query = {
            _id: id
        }
        let data = {};
        data.fellows = cohort.fellows - 1
        Cohort.update(query, data, (err) => {
            Fellow.findByIdAndRemove(id2, (err) => {
                req.flash('danger', 'Fellow deleted successfully.');
                res.redirect('/administrator/view_fellows/' + id)
            })
        })
    })
}
const view_answer = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    const id3 = req.params.id3
    Cohort.findById(id, (err, cohort) => {
        Fellow.findById(id2, (err, fellow) => {
            Topic.findById(id3, (err, topic) => {
                Answer.findOne({ fellow_id: id2, topic_id: id3 }, (err, answer) => {
                    if (answer) {
                        const object = answer.answers

                        let array = topic.questions[0].json;
                        let arr = []
                        Object.keys(object).map(function (key, value, index) {
                            let ob = {
                                label: key,
                                answer: object[key]
                            }

                            arr.push(ob)
                        });
                        console.log(answer)
                        res.render('./administrator/account/fellows/view_answer.jade', {
                            user: req.user,
                            cohort: cohort,
                            fellow: fellow,
                            topic: topic,
                            answers: arr,
                            answer: answer,
                            questions: array,
                            view: true
                        })


                    }
                    else {
                       
                        res.render('./administrator/account/fellows/view_answer.jade', {
                            user: req.user,
                            topic: topic,
                            cohort: cohort,
                            fellow: fellow,

                            view: false
                        })
                    }

                })
            })
        })
    })

}

const add_feedback =(req,res)=>{
    const id = req.params.id;
    const id2 = req.params.id2;
    const id3 = req.params.id3;
    const id4 = req.params.id4
    let query = {
        _id:id4
    }
    let data = {};
    data.feedback = req.body.feedback;
    Answer.update(query,data,(err)=>{
        req.flash('info','Feedback added successfully.')
        res.redirect('/administrator/view_answer/'+id+'/'+id2+'/'+id3)
    })

}
// Exported Functions
module.exports = {
    fellows_page: fellows_page,
    add_new_fellow: add_new_fellow,
    view_bold_questions: view_bold_questions,
    view_kpis: view_kpis,
    view_fellow: view_fellow,
    view_assignments: view_assignments,
    add_new_fellow_post: add_new_fellow_post,
add_feedback:add_feedback,
    edit_fellow_image: edit_fellow_image,
    edit_fellow_post: edit_fellow_post,
    delete_fellow: delete_fellow,
    view_answer: view_answer

}