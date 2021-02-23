//Libraties
const date = require('../functions/date.js')
const bcrypt = require('bcryptjs')


// Models
const Log = require('../models/log.js');
const KPI = require('../models/kpi.js');
const Fellow = require('../models/fellow.js');
const Tag = require('../models/tag.js');
const Topic = require('../models/topic.js')
const Article = require('../models/article.js');
const Week = require('../models/week.js');
const Task = require('../models/task.js')
const Individual = require('../models/individual_task.js')
const Course = require('../models/course.js')
const Cohort = require('../models/cohort.js')



// FUnctions



const dashboard_page = (req, res) => {
    const id = req.user.id
    Fellow.find({ cohort_id: req.user.cohort_id }, (err, fellows) => {
        Course.find({ cohort_id: req.user.cohort_id, sub_module: false }, (err, courses) => {

            Article.find({ cohort_id: req.user.cohort_id }, (err, articles) => {
                KPI.find({ fellow_id: id }, (err, kpis) => {
                    Course.findOne({ cohort_id: req.user.cohort_id, status: 'Ongoing' }, (err, course) => {
                        Task.find({ cohort_id: req.user.cohort_id }, (err, tasks) => {
                          
                           
                                tasks.map((item) => {

                                    Individual.findOne({ fellow_id: req.user.id, task_id: item._id }, (err, one) => {
                                        if (one) {
                                        }
                                        else {
                                                let data = new Individual();
                                                data.course_title = item.course.title,
                                                data.course_id = item.course_id,
                                                data.task_title = item.title,
                                                data.task_id = item.id,
                                                data.task_type = item.type
                                                data.completed = false,
                                                data.fellow_id = req.user.id
                                                data.save(() => {

                                            })
                                        }
                                    })


                                })
                                setTimeout(() => {
                                    Individual.find({ fellow_id: req.user.id }, (err, Individuals) => {
                                        Course.find({ cohort_id: req.user.cohort_id,enabled:true,tasks:{$gt:0}}, (err, courses2) => {
                                            Tag.find({},(err,tags)=>{
                                        res.render('./fellow/account/dashboard.jade', {
                                            user: req.user,
                                            fellows: fellows,
                                            reads: articles,
                                            courses: courses,
                                            courses2:courses2,
                                            tasks: Individuals,
                                            kpis: kpis,
                                            tags:tags,
                                            course: course,
                                            year: date.year
                                        })
                                    })
                                    })
                                    }).sort({_id:1})
                                }, 2500)


                        })

                    })

                })
            })
        }).sort({ no: 1 })
    })

}

const add_bold_question = (req, res) => {
    const id = req.user.id;
    let query = {
        _id: id
    }
    let data = {};
    data.bold_question = req.body.bold_question;
    Fellow.update(query, data, (err) => {
        req.flash('info', 'Bold question updated successfully.');
        res.redirect('/dashboard')
    })

}
const add_new_kpi = (req, res) => {
    const { title } = req.body;
    const id = req.user.id
    KPI.findOne({ title: title, fellow_id: id }, (err, kpi) => {
        if (kpi) {
            req.flash('danger', 'KPI already exists.');
            res.redirect('/dashboard')
        }
        else {
            let data = new KPI();
            data.title = title;
            data.achieved = false
            data.date = date.today
            data.fellow_id = id
            data.cohort_id = req.user.cohort_id
            data.fullname = req.user.first_name +' ' + req.user.last_name
            data.save(() => {
                req.flash('info', 'KPI added successfully.');
                res.redirect('/dashboard')
            })

        }
    })

}
const reading_list_file = (req, res) => {
    const { title } = req.body

    const path = '/files/' + req.file.filename
    Article.findOne({ title: title }, (err, article) => {
        if (article) {
            req.flash('danger', 'Article already exists.');
            res.redirect('/dashboard')
        }
        else {
            let data = new Article();
            data.by = req.user.first_name + ' ' + req.user.last_name;
            data.type = 'file'
            data.created_on = new Date();
            data.url = ''
            data.file = path
            data.date = date.today
            data.cohort_id = req.user.cohort_id
            data.title = title
            data.save(() => {
                req.flash('info', 'Article added successfully.');
                res.redirect('/dashboard')
            })
        }
    })
}

const reading_list_link = (req, res) => {
    const { title, url } = req.body

    Article.findOne({ title: title }, (err, article) => {
        if (article) {
            req.flash('danger', 'Article already exists.');
            res.redirect('/dashboard')
        }
        else {
            let data = new Article();
            data.by = req.user.first_name + ' ' + req.user.last_name;
            data.type = 'link'
            data.created_on = new Date();
            data.url = url
            data.file = ''
            data.date = date.today
            data.cohort_id = req.user.cohort_id
            data.title = title
            data.save(() => {
                req.flash('info', 'Article added successfully.');
                res.redirect('/dashboard')
            })
        }
    })
}
const achieved = (req, res) => {
    const id = req.params.id;
    KPI.findById(id, (err, kpi) => {
        let query = {
            _id: id
        }
        let data = {};
        data.achieved = !kpi.achieved
        KPI.update(query, data, (err) => {
            req.flash('info', 'KPI updated successfully.')
            res.redirect('/dashboard')
        })
    })

}

const edit_kpi = (req, res) => {
    const id = req.params.id
    KPI.findById(id, (err, kpi) => {
        res.render('./fellow/account/edit_kpi.jade', {
            user: req.user,
            kpi: kpi
        })
    })

}
const edit_kpi_post = (req, res) => {
    const id = req.params.id
    let query = {
        _id: id
    }
    let data = {}
    data.title = req.body.kpi;
    KPI.update(query, data, (err) => {
        req.flash('info', 'KPI updated successfully.')
        res.redirect('/edit_kpi/' + id)
    })

}
const delete_kpi = (req,res)=>{
    const id =  req.params.id;
    KPI.findByIdAndRemove(id,(err)=>{
        req.flash('danger','KPI deleted successfully.')
        res.redirect('/dashboard')
    })
}

const view_fellow = (req, res) => {
    const id = req.params.id;

    Fellow.findById(id, (err, fellow) => {
        const fullname = fellow.first_name + ' ' + fellow.last_name
        Article.find({ by: fullname }, (err, reads) => {
            KPI.find({ fellow_id: id }, (err, kpis) => {
                Course.find({ cohort_id: fellow.cohort_id, sub_module: false, enabled: true }, (err, courses) => {
                    Course.findOne({ cohort_id: fellow.cohort_id, status: 'Ongoing' }, (err, course) => {
                        res.render('./fellow/account/fellow.jade', {
                            user: req.user,
                            kpis: kpis,
                            reads: reads,
                            fellow: fellow,
                            courses: courses,
                            course: course

                        })
                    })

                })

            })
        })
    })
}
const update_image = (req, res) => {
    const path = '/fellows/' + req.file.filename
    let query = {
        _id: req.user.id
    }
    let data = {};
    data.profile_image = path
    Fellow.update(query, data, (err) => {
        req.flash('info', 'Fellow updated successfully.');
        res.redirect('/dashboard')
    })
}

const edit_password = (req, res) => {
    const { password, password2 } = req.body;
    if (password !== password2) {
        req.flash('danger', 'Passwords do not match.')
        res.redirect('/dashboard')
    }
    else {
        let query = {
            _id: req.user.id
        }
        let data = {};
        data.password = password
        data.pass =  password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                data.password = hash
                Fellow.update(query, data, (err) => {
                    req.flash('info', 'Password updated successfully.');
                    res.redirect('/dashboard')
                })
            })
        });
    }


}

const delete_article = (req, res) => {
    Article.findOneAndRemove(req.params.id, (err) => {
        req.flash('danger', 'Article deleted successfully.')
        res.redirect('/dashboard')
    })
}
const my_journey_false = (req,res)=>{
const id = req.params.id
let query = {
    _id:id
}
let data = {}
data.completed = false
Individual.update(query,data,(err)=>{
    res.redirect('/dashboard')
})
}
const my_journey_true = (req,res)=>{
    const id = req.params.id
    let query = {
        _id:id
    }
    let data = {}
    data.completed = true
    Individual.update(query,data,(err)=>{
        res.redirect('/dashboard')
    })
}
const add_tag = (req,res)=>{
    if (Array.isArray(req.body.tag) === true) {
        if(req.body.tag.length > 3 )
        {
            req.flash('danger', 'You can only choose 3 tags.');
            res.redirect('/dashboard')
        }
        else
        {
            let query = {
                _id: req.user.id
              }
              let data = {}
              let arr = req.body.tag;
              data.tags = arr
              Fellow.update(query, data, () => {
                req.flash('info', 'Tags saved successfully.');
                res.redirect('/dashboard')
              })
        }
       
      }
      else if (Array.isArray(req.body.tag) === false) {
        let query = {
          _id: req.user.id
        }
        let data = {}
        let arr = [req.body.tag];
        data.tags = arr
        Fellow.update(query, data, () => {
          req.flash('info', 'Tag saved successfully.');
          res.redirect('/dashboard')
        })
      }

}
//Export module
module.exports = {
    dashboard_page: dashboard_page,
    add_bold_question: add_bold_question,
    add_new_kpi: add_new_kpi,
    reading_list_link: reading_list_link,
    reading_list_file: reading_list_file,
    achieved: achieved,
    edit_kpi: edit_kpi,
    delete_kpi:delete_kpi,
    edit_kpi_post: edit_kpi_post,
    view_fellow: view_fellow,
    update_image: update_image,
    edit_password: edit_password,
    delete_article: delete_article,
    my_journey_false:my_journey_false,
    my_journey_true:my_journey_true,
    add_tag:add_tag

}