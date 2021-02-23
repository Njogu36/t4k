// Libraries


// Models
const Cohort = require('../models/cohort.js')
const Course = require('../models/course.js')
const Week = require('../models/week.js')
const Topic = require('../models/topic.js');
const Task = require('../models/task.js')
const date = require('./date.js')

//Functions
const modules_page = (req, res) => {
    const id = req.params.id
    Cohort.findById(id, (err, cohort) => {
        Course.find({ cohort_id: id, sub_module: false }, (err, courses) => {
            Cohort.find({}, (err, cohorts) => {
                res.render('./administrator/account/modules/modules.jade', {
                    cohort: cohort,
                    courses: courses,
                    cohorts: cohorts,
                    user: req.user,
                    year: date.year
                })
            })

        }).sort({ no: 1 })
    })
}

const add_module_page = (req, res) => {
    const id = req.params.id
    Cohort.findById(id, (err, cohort) => {
        res.render('./administrator/account/modules/add_module.jade', {
            cohort: cohort,
            user: req.user,
            year: date.year
        })
    })
}

const add_new_module_post = (req, res) => {
    const { title, start_date, end_date, duration, year, description, type } = req.body;
    const id = req.params.id
    const path = '/modules/' + req.file.filename

    Course.findOne({ 'title': title, cohort_id: id, sub_module: false }, (err, course) => {
        if (course) {
            req.flash('danger', 'Module already exists.');
            res.redirect('/administrator/add_module/' + id)
        }
        else {
            Course.find({ cohort_id: id, sub_module: false }, (err, courses) => {
                Cohort.findById(id, (err, cohort) => {
                    let data = new Course();
                    data.no = courses.length + 1
                    data.title = title;
                    data.profile_image = path;
                    data.cohort = cohort;
                    data.cohort_id = id;
                    data.status = '';
                    data.duration = duration
                    data.year = year
                    data.enabled = false
                    data.tasks =0
                    if (type === 'with') {
                        data.type = 'with'
                        data.sub_module = false
                        data.module_id = ''
                        data.sub_modules = 0
                    }
                    if (type === 'without') {

                        data.type = 'without'
                        data.sub_module = false
                        data.module_id = ''

                    }

                    data.start_date = start_date;
                    data.end_date = end_date;
                    data.description = description
                    data.created_on = new Date()
                    data.save(() => {
                        req.flash('info', 'Module added successfully.');
                        res.redirect('/administrator/add_module/' + id)
                    })
                })
            })

        }

    })
}

const add_new_sub_module = (req, res) => {
    const { title, start_date, end_date, duration, year, description } = req.body;
    const id = req.params.id
    const id2 = req.params.id2
    const path = '/modules/' + req.file.filename

    Course.findOne({ 'title': title, module_id: id2, sub_module: true }, (err, course) => {
        if (course) {
            req.flash('danger', 'Module already exists.');
            res.redirect('/administrator/view_module/' + id + '/' + id2)
        }
        else {
            Course.findById(id2, (err, course2) => {
                Course.find({ module_id: id2 }, (err, courses) => {
                    Cohort.findById(id, (err, cohort) => {
                        let data = new Course();
                        data.no = courses.length + 1
                        data.title = title;
                        data.profile_image = path;
                        data.cohort = cohort;
                        data.cohort_id = id;
                        data.status = '';
                        data.duration = duration
                        data.year = year
                        data.enabled = false
                        data.tasks =0
                        data.type = ''
                        data.sub_module = true
                        data.module_id = id2
                        data.module_title = course2.title
                        data.start_date = start_date;
                        data.end_date = end_date;
                        data.description = description
                        data.created_on = new Date()
                        data.save(() => {
                            req.flash('info', 'Module added successfully.');
                            res.redirect('/administrator/view_module/' + id + '/' + id2)
                        })
                    })
                })
            })

            setTimeout(() => {
                Course.find({ module_id: id2 }, (err, courses) => {
                    let query = {
                        _id: id2
                    }
                    let data = {};
                    data.sub_modules = courses.length
                    Course.update(query, data, (err) => {

                    })
                })
            }, 1000)
        }

    })
}

const import_modules = (req, res) => {
    const id = req.params.id;
    Cohort.findById(id, (err, cohort) => {
        const no = cohort.no;
        const previosNo = parseInt(no) - 1;

        Cohort.findOne({ no: previosNo }, (err, cohort2) => {
            if (cohort2) {
                const id2 = cohort2.id;
                Course.find({ cohort_id: id2, sub_module: false }, (err, courses) => {
                    if (courses.length < 1) {
                        req.flash('danger', 'No previous modules found.');
                        res.redirect('/administrator/view_modules/' + id)
                    }
                    else if (courses.length > 0) {
                        courses.map((item) => {
                            if (item.sub_module === false) {
                                let data = new Course();
                                data.no = item.no
                                data.title = item.title;
                                data.profile_image = item.profile_image;
                                data.cohort = cohort;
                                data.cohort_id = id;
                                data.status = '';
                                data.duration = ''
                                data.year = 0
                                data.tasks =item.tasks
                                data.enabled = false
                                data.type = item.type
                                data.sub_module = false
                                data.module_id = ''
                                data.sub_modules = item.sub_modules
                                data.start_date = '';
                                data.end_date = '';
                                data.description = item.description
                                data.created_on = new Date()
                                data.save((err, result) => {
                                    if (result.type === 'with') {

                                        // Course
                                        Course.findOne({ cohort_id: id2, title: result.title, sub_module: false }, (err, course) => {
                                            Course.find({ cohort_id: id2, module_id: course.id }, (err, finals) => {
                                                finals.map((item) => {
                                                    let data = new Course()
                                                    data.no = item.no
                                                    data.title = item.title;
                                                    data.profile_image = item.profile_image;
                                                    data.cohort = cohort;
                                                    data.cohort_id = id;
                                                    data.status = '';
                                                    data.duration = ''
                                                    data.year = 0
                                                    data.enabled = false
                                                    data.type = ''
                                                    data.tasks =item.tasks
                                                    data.sub_module = true
                                                    data.module_id = result.id
                                                    data.module_title = result.title
                                                    data.start_date = '';
                                                    data.end_date = '';
                                                    data.description = item.description
                                                    data.created_on = new Date()
                                                    data.save((err, result) => {
                                                        // Tasks
                                                        Course.findOne({ cohort_id: id2, title: result.title, sub_module: true }, (err, course) => {
                                                            Task.find({ cohort_id: id2, course_id: course.id }, (err, tasks) => {
                                                                tasks.map((item) => {
                                                                    let data = new Task()
                                                                    data.no = item.no,
                                                                        data.title = item.title,
                                                                        data.type = item.type
                                                                    data.cohort_id = id,
                                                                        data.cohort = cohort,
                                                                        data.course_id = result.id,
                                                                        data.course = result,
                                                                        data.created_on = new Date();
                                                                    data.save(() => {

                                                                    })
                                                                })
                                                            })


                                                        })


                                                        // Weeks
                                                        Course.findOne({ cohort_id: id2, title: result.title, sub_module: true }, (err, course) => {

                                                            Week.find({ cohort_id: id2, course_id: course.id }, (err, weeks) => {
                                                                weeks.map((item) => {
                                                                    let data = new Week();
                                                                    data.no = item.no,
                                                                        data.title = item.title,
                                                                        data.topics = item.topics,
                                                                        data.start_date = '',
                                                                        data.end_date = ''
                                                                    data.cohort_id = id,
                                                                        data.cohort = cohort,
                                                                        data.course_id = result.id,
                                                                        data.course = result,
                                                                        data.created_on = new Date()
                                                                    data.save((err, result) => {

                                                                        // Topics 

                                                                        Topic.find({ cohort_id: id2, course_id: course.id, week_id: item.id }, (err, topics) => {
                                                                            topics.map((item) => {
                                                                                let data = new Topic();
                                                                                data.no = item.no,
                                                                                    data.title = item.title,
                                                                                    data.week_id = result.id,
                                                                                    data.week_title = item.week_title,
                                                                                    data.cohort_id = result.cohort_id,
                                                                                    data.course_id = result.course_id,
                                                                                    data.course = result.course
                                                                                data.cohort = result.cohort,
                                                                                    data.description = item.description
                                                                                data.type = item.type,
                                                                                    data.questions = item.questions,
                                                                                    data.table_headers = item.table_headers,
                                                                                    data.created_on = new Date()
                                                                                data.save(() => {

                                                                                })
                                                                            })
                                                                        })





                                                                    })

                                                                })
                                                            })
                                                        })


                                                    })
                                                })



                                            })
                                        })

                                    }
                                    else if (result.type === 'without') {
                                        // Course
                                       Course.findOne({cohort_id: id2, title: result.title, sub_module: false },(err,course)=>{
                                           // Task
                                            Task.find({course_id:course.id},(err,tasks)=>{
                                                tasks.map((item)=>{
                                                        let data = new Task()
                                                        data.no = item.no,
                                                        data.title = item.title,
                                                        data.type = item.type
                                                        data.cohort_id = id,
                                                        data.cohort = cohort,
                                                        data.course_id = result.id,
                                                        data.course = result,
                                                        data.created_on = new Date();
                                                        data.save(() => {
        
                                                        })
                                                })
                                            })
                                           

                                           // Weeks
                                           Week.find({course_id:course.id},(err,weeks)=>{
                                               weeks.map((item)=>{
                                                    let data = new Week();
                                                    data.no = item.no,
                                                    data.title = item.title,
                                                    data.topics = item.topics,
                                                    data.start_date = '',
                                                    data.end_date = ''
                                                    data.cohort_id = id,
                                                    data.cohort = cohort,
                                                    data.course_id = result.id,
                                                    data.course = result,
                                                    data.created_on = new Date()
                                                    data.save((err,result)=>{
                                                     Topic.find({course_id:course.id,week_title:result.title},(err,topics)=>{
                                                         topics.map((item)=>{
                                                            let data = new Topic();
                                                            data.no = item.no,
                                                            data.title = item.title,
                                                            data.week_id = result.id,
                                                            data.week_title = item.week_title,
                                                            data.cohort_id = result.cohort_id,
                                                            data.course_id = result.course_id,
                                                            data.course = result.course
                                                            data.cohort = result.cohort,
                                                            data.description = item.description
                                                            data.type = item.type,
                                                            data.questions = item.questions,
                                                            data.table_headers = item.table_headers,
                                                            data.created_on = new Date()
                                                            data.save(()=>{
                                                                
                                                            })
                                                         })

                                                     })
                                                        

                                                    })
                                               })
                                           })
                                           

                                           // Topics
                                           
                                       })

                                    }
                                })
                            }


                        })
                        setTimeout(() => {
                            req.flash('info', courses.length + ' modules added successfully.');
                            res.redirect('/administrator/view_modules/' + id)
                        }, 2000)


                    }
                })
            }
            else {
                req.flash('danger', 'No previous cohort found.');
                res.redirect('/administrator/view_modules/' + id)
            }

        })
    })

}

const view_module_page = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    Cohort.findById(id, (err, cohort) => {
        Course.findById(id2, (err, course) => {
            Week.find({ course_id: id2 }, (err, weeks) => {
                Topic.find({ course_id: id2 }, (err, topics) => {
                    Task.find({ course_id: id2 }, (err, tasks) => {
                        Course.find({ module_id: id2 }, (err, subs) => {
                            res.render('./administrator/account/modules/view_module.jade', {
                                user: req.user,
                                cohort: cohort,
                                course: course,
                                weeks: weeks,
                                topics: topics,
                                tasks: tasks,
                                subs: subs,
                                year: date.year
                            })
                        }).sort({ no: 1 })

                    }).sort({ no: 1 })
                }).sort({ no: 1 })
            }).sort({ no: 1 })

        })
    })

}
const view_module_page2 = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    Cohort.findById(id, (err, cohort) => {
        Course.findById(id2, (err, course) => {
            Week.find({ course_id: id2 }, (err, weeks) => {
                Topic.find({ course_id: id2 }, (err, topics) => {
                    Task.find({ course_id: id2 }, (err, tasks) => {
                        Course.find({ module_id: id2 }, (err, subs) => {
                            res.render('./administrator/account/modules/view_module2.jade', {
                                user: req.user,
                                cohort: cohort,
                                course: course,
                                weeks: weeks,
                                topics: topics,
                                tasks: tasks,
                                subs: subs,
                                year: date.year
                            })
                        })

                    }).sort({ no: 1 })
                }).sort({ no: 1 })
            }).sort({ no: 1 })

        })
    })

}

const delete_module = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    Course.findById(id2, (err, course) => {
        const no = course.no;

        if (course.sub_module === false) {
            Course.find({ cohort_id: id, sub_module: false }, (err, courses) => {
                courses.map((item) => {
                    if (item.no > no) {
                        let query = {
                            _id: item.id
                        }
                        let data = {};
                        data.no = item.no - 1
                        Course.update(query, data, (err) => {

                        })
                    }
                })
            })
            if (course.type === 'with') {
                Course.remove({ module_id: course.id }, (err) => {

                })
            }

        }

        if (course.sub_module === true) {
            const id3 = course.module_id
            Course.findById(id3, (err, course) => {
                let query = {
                    _id: id3
                }
                let data = {};
                data.sub_modules = course.sub_modules - 1
                Course.update(query, data, (err) => {

                })
            })

            Course.find({ cohort_id: id, module_id: course.module_id, sub_module: true }, (err, courses) => {
                courses.map((item) => {
                    if (item.no > no) {
                        let query = {
                            _id: item.id
                        }
                        let data = {};
                        data.no = item.no - 1
                        Course.update(query, data, (err) => {

                        })
                    }
                })
            })
        }


    })


    setTimeout(() => {
        Task.remove({ course_id: id2 }, (err) => {
            Topic.remove({ course_id: id2 }, (err) => {
                Week.remove({ course_id: id2 }, (err) => {
                    Course.findByIdAndRemove(id2, (err) => {
                        req.flash('danger', 'Module deleted successfully');
                        res.redirect('/administrator/view_modules/' + id)
                    })
                })
            })
        })
    }, 1500)


}

const unlock_course = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    let query = {
        _id: id2
    }
    let data = {}
    data.enabled = false;
    Course.update(query, data, (err) => {
        Course.findById(id2, (err, course) => {
            if (course.sub_module === true) {
                req.flash('info', 'Module locked')
                res.redirect('/administrator/view_module2/' + id + '/' + id2)
            }
            else {
                req.flash('info', 'Module locked')
                res.redirect('/administrator/view_module/' + id + '/' + id2)
            }
        })

    })

}
const lock_course = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    let query = {
        _id: id2
    }
    let data = {}
    data.enabled = true;
    Course.update(query, data, (err) => {

        Course.findById(id2, (err, course) => {
            if (course.sub_module === true) {
                req.flash('info', 'Module unlocked')
                res.redirect('/administrator/view_module2/' + id + '/' + id2)
            }
            else {
                req.flash('info', 'Module unlocked')
                res.redirect('/administrator/view_module/' + id + '/' + id2)
            }
        })
    })
}

const edit_course = (req, res) => {
    const { title, duration, year, start_date, end_date, description } = req.body;
    let id = req.params.id;
    let id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.title = title;
    data.duration = duration
    data.year = year
    data.start_date = start_date;
    data.end_date = end_date;
    data.description = description
    Course.update(query, data, (err) => {
        Course.findById(id2, (err, course) => {
            if (course.sub_module === true) {
                req.flash('info', 'Module updated successfully')
                res.redirect('/administrator/view_module2/' + id + '/' + id2)
            }
            else {
                req.flash('info', 'Module updated successfully')
                res.redirect('/administrator/view_module/' + id + '/' + id2)
            }
        })

    })


}

const update_image = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    const path = '/modules/' + req.file.filename;
    let query = {
        _id: id2
    }
    let data = {};
    data.profile_image = path;
    Course.update(query, data, () => {
        Course.findById(id2, (err, course) => {
            if (course.sub_module === true) {
                req.flash('info', 'Module updated successfully')
                res.redirect('/administrator/view_module2/' + id + '/' + id2)
            }
            else {
                req.flash('info', 'Module updated successfully')
                res.redirect('/administrator/view_module/' + id + '/' + id2)
            }
        })

    })
}

const add_new_week = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    const { title, start_date, end_date } = req.body
    Cohort.findById(id, (err, cohort) => {
        Course.findById(id2, (err, course) => {
            Week.find({ course_id: id2 }, (err, weeks) => {
                Topic.find({ course_id: id2 }, (err, topics) => {
                    Week.findOne({ course_id: id2, title: title }, (err, week) => {
                        if (week) {
                            Course.findById(id2, (err, course) => {
                                if (course.sub_module === true) {
                                    req.flash('danger', 'Week already exists.')
                                    res.redirect('/administrator/view_module2/' + id + '/' + id2)
                                }
                                else {
                                    req.flash('danger', 'Week already exists.')
                                    res.redirect('/administrator/view_module/' + id + '/' + id2)
                                }
                            })

                        }
                        else {
                            let data = new Week();
                            data.no = weeks.length + 1,
                                data.title = title,
                                data.topics = topics.length,
                                data.start_date = start_date,
                                data.end_date = end_date
                            data.cohort_id = id,
                                data.cohort = cohort,
                                data.course_id = id2,
                                data.course = course,
                                data.created_on = new Date()
                            data.save(() => {

                                Course.findById(id2, (err, course) => {
                                    if (course.sub_module === true) {
                                        req.flash('info', 'Week added successfully.');
                                        res.redirect('/administrator/view_module2/' + id + '/' + id2)
                                    }
                                    else {
                                        req.flash('info', 'Week added successfully.');
                                        res.redirect('/administrator/view_module/' + id + '/' + id2)
                                    }
                                })
                            })
                        }
                    })

                })
            })
        })
    })
}

const add_new_topic = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    const { title, type } = req.body;
    Cohort.findById(id, (err, cohort) => {
        Course.findById(id2, (err, course) => {
            Week.findOne({ course_id: id2, title: req.body.week }, (err, week) => {
                Topic.find({ week_id: week.id }, (err, topics) => {
                    Topic.findOne({ course_id: id2, week_id: week.id, title: title }, (err, topic) => {
                        if (topic) {

                            Course.findById(id2, (err, course) => {
                                if (course.sub_module === true) {
                                    req.flash('danger', 'Topic already exists.')
                                    res.redirect('/administrator/view_module2/' + id + '/' + id2)
                                }
                                else {
                                    req.flash('danger', 'Topic already exists.')
                                    res.redirect('/administrator/view_module/' + id + '/' + id2)
                                }
                            })
                        }
                        else {
                            let data = new Topic();
                            data.no = topics.length + 1,
                                data.title = title,
                                data.week_id = week.id,
                                data.week_title = week.title,
                                data.cohort_id = id,
                                data.course_id = id2,
                                data.course = course
                            data.cohort = cohort,
                                data.description = ''
                            data.type = type,
                                data.questions = [],
                                data.table_headers = [],
                                data.created_on = new Date()
                            data.save(() => {

                                Course.findById(id2, (err, course) => {
                                    if (course.sub_module === true) {
                                        req.flash('info', 'Topic added successfully.');
                                        res.redirect('/administrator/view_module2/' + id + '/' + id2)
                                    }
                                    else {
                                        req.flash('info', 'Topic added successfully.');
                                        res.redirect('/administrator/view_module/' + id + '/' + id2)
                                    }
                                })
                            })
                        }
                    })


                })
            })
        })
    })
}

const add_new_task = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    const { title, type } = req.body;
    Cohort.findById(id, (err, cohort) => {
        Course.findById(id2, (err, course) => {
            Task.findOne({ title: title, course_id: id2 }, (err, task) => {
                if (task) {


                    Course.findById(id2, (err, course) => {
                        if (course.sub_module === true) {
                            req.flash('danger', 'Task already exists.');
                            res.redirect('/administrator/view_module2/' + id + '/' + id2)
                        }
                        else {
                            req.flash('danger', 'Task already exists.');
                            res.redirect('/administrator/view_module/' + id + '/' + id2)
                        }
                    })
                }
                else {
                    Task.find({ course_id: id2 }, (err, tasks) => {
                        let data = new Task()
                        data.no = tasks.length + 1,
                            data.title = title,
                            data.type = type
                        data.cohort_id = id,
                            data.cohort = cohort,
                            data.course_id = id2,
                            data.course = course,
                            data.created_on = new Date();
                        data.save(() => {

                            let query = {
                                _id:id2
                            }
                            let data = {}
                            data.tasks = tasks.length +1
                            Course.update(query,data,(err)=>{
                                Course.findById(id2, (err, course) => {
                                    if (course.sub_module === true) {
                                        req.flash('info', 'Task added successfully.');
                                        res.redirect('/administrator/view_module2/' + id + '/' + id2)
                                    }
                                    else {
                                        req.flash('info', 'Task added successfully.');
                                        res.redirect('/administrator/view_module/' + id + '/' + id2)
                                    }
                                })
                            })
                           
                        })
                    })
                }
            })
        })
    })
}


const edit_week = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    const id3 = req.params.id3
    Cohort.findById(id, (err, cohort) => {
        Course.findById(id2, (err, course) => {
            Week.findById(id3, (err, week) => {
                res.render('./administrator/account/modules/edit_week.jade', {
                    user: req.user,
                    week: week,
                    cohort: cohort,
                    course: course
                })
            })
        })
    })

}
const edit_week_post = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    const id3 = req.params.id3
    let query = {
        _id: id3
    }
    let data = {};
    data.title = req.body.title
    data.start_date = req.body.start_date
    data.end_date = req.body.end_date;
    Week.update(query, data, (err) => {
        Topic.find({ week_title: req.body.title, week_id: id3 }, (err, topics) => {
            topics.map((item) => {
                let query = {
                    _id: item.id
                }
                let data = {}
                data.week_title = req.body.title
                Topic.update({ query, data }, () => {

                })
            })
        })
        Course.findById(id2, (err, course) => {
            if (course.sub_module === true) {
                req.flash('info', 'Week updated successfully.')
                res.redirect('/administrator/view_module2/' + id + '/' + id2)
            }
            else {
                req.flash('info', 'Week updated successfully.')
                res.redirect('/administrator/view_module/' + id + '/' + id2)
            }
        })

    })


}

const delete_week = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    const id3 = req.params.id3;
    Week.findById(id3, (err, week) => {
        const no = week.no;
        Week.find({ course_id: id2 }, (err, weeks) => {
            weeks.map((item) => {
                if (item.no > no) {
                    let query = {
                        _id: item.id
                    }
                    let data = {};
                    data.no = item.no - 1
                    Week.update(query, data, (err) => {

                    })
                }
            })
        })
    })

    Topic.remove({ week_id: id3 }, (err) => {

        Week.findByIdAndRemove(id3, (err) => {


            Course.findById(id2, (err, course) => {
                if (course.sub_module === true) {
                    req.flash('danger', 'Week deleted successfully.')
                    res.redirect('/administrator/view_module2/' + id + '/' + id2)
                }
                else {
                    req.flash('danger', 'Week deleted successfully.')
                    res.redirect('/administrator/view_module/' + id + '/' + id2)
                }
            })
        })
    })

}

const delete_task = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    const id3 = req.params.id3;
    Course.findById(id2,(err,course)=>{
        let query = {
            _id:id2
        }
        let data = {};
        data.tasks = course.tasks - 1
        Course.update(query,data,(err)=>{

        })
    })
    setTimeout(()=>{
        Task.findByIdAndRemove(id3, (err) => {

            Course.findById(id2, (err, course) => {
                if (course.sub_module === true) {
                    req.flash('danger', 'Task deleted successfully.')
                    res.redirect('/administrator/view_module2/' + id + '/' + id2)
                }
                else {
                    req.flash('danger', 'Task deleted successfully.')
                    res.redirect('/administrator/view_module/' + id + '/' + id2)
                }
            })
        })
    },1000)
  

}


//Export Functions
module.exports = {
    modules_page: modules_page,
    add_module_page: add_module_page,
    add_new_sub_module: add_new_sub_module,
    add_new_module_post: add_new_module_post,
    import_modules: import_modules,
    view_module_page: view_module_page,
    view_module_page2: view_module_page2,
    delete_module: delete_module,
    unlock_course: unlock_course,
    lock_course: lock_course,
    edit_course: edit_course,
    update_image: update_image,
    add_new_week: add_new_week,
    add_new_topic: add_new_topic,
    add_new_task: add_new_task,
    edit_week: edit_week,
    edit_week_post: edit_week_post,
    delete_week: delete_week,
    delete_task: delete_task,


}