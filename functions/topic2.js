// Libraries
const nodemailer = require('nodemailer')


// Models
const Course = require('../models/course.js');
const Topic = require('../models/topic.js')
const Week = require('../models/week.js');
const Log = require('../models/log.js')
const Fellow = require('../models/fellow.js')
const Answer = require('../models/answer.js')

// Functions
const date = require('../functions/date.js')
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

// Functions
const view_topic = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    const id3 = req.params.id3;
    Course.findById(id, (err, course) => {
        Week.findById(id2, (err, week) => {
            Topic.findById(id3, (err, topic) => {
                let data = new Log({
                    fellow_id: req.user.id,
                    fullname: req.user.first_name + ' ' + req.user.last_name,
                    cohort_id: req.user.cohort_id,
                    status: 'Current Topic: ' + topic.title,
                    topic: topic,
                    course: course,
                    time: hour + ':' + minute,
                    date: today,
                    created_on: dat
                })
                data.save(() => {
                    let query = {
                        _id: req.user.id
                    }
                    let data = {
                        current_topic: topic.title,
                        current_topic_id: topic.id,
                    }
                    Fellow.update(query, data, (err) => {
                        res.render("./fellow/topic/view_topic.jade", {
                            user: req.user,
                            topic: topic,
                            week: week,
                            course: course,
                            complete:false
                        })
                    })


                })
            })
        })
    })
}

const topic_next = (req,res)=>{
    const id = req.params.id;
    const id2 = req.params.id2;
    const id3 = req.params.id3;
    Course.findById(id,(err,course)=>{
        Week.findById(id2,(err,week)=>{
            Topic.findById(id3,(err,topic)=>{
                const no = topic.no
                const next_no =  topic.no + 1
                Topic.findOne({no:next_no,week_id:id2,course_id:id},(err,next_topic)=>{
                    if(next_topic)
                    {
                       let query = {
                           _id:req.user.id
                       }
                       let data = {};
                       data.current_topic = next_topic.title
                       data.current_topic_id = next_topic.id
                       Fellow.update(query,data,(err)=>{
                        let data = new Log({
                            fellow_id: req.user.id,
                            fullname: req.user.first_name + ' ' + req.user.last_name,
                            cohort_id: req.user.cohort_id,
                            status: 'Current Topic: ' + next_topic.title,
                            topic: next_topic,
                            course: course,
                            time: hour + ':' + minute,
                            date: today,
                            created_on: dat
                        })
                        data.save((err)=>{
                            res.render("./fellow/topic/view_topic.jade", {
                                user: req.user,
                                topic: next_topic,
                                week: week,
                                course: course,
                                complete:false
                            })
                        })
                       })
                    }
                    else
                    {
                        res.render("./fellow/topic/view_topic.jade", {
                            user: req.user,
                            topic: topic,
                            week: week,
                            course: course,
                            complete:true
                        })
                    }
                })
            })
        })
    })

}
const topic_previous = (req,res)=>{
    const id = req.params.id;
    const id2 = req.params.id2;
    const id3 = req.params.id3;
    Course.findById(id,(err,course)=>{
        Week.findById(id2,(err,week)=>{
            Topic.findById(id3,(err,topic)=>{
                const no = topic.no
                const next_no =  topic.no - 1
                Topic.findOne({no:next_no,week_id:id2,course_id:id},(err,previous_topic)=>{
                    if(previous_topic)
                    {
                       let query = {
                           _id:req.user.id
                       }
                       let data = {};
                       data.current_topic =  previous_topic.title
                       data.current_topic_id =  previous_topic.id
                       Fellow.update(query,data,(err)=>{
                        let data = new Log({
                            fellow_id: req.user.id,
                            fullname: req.user.first_name + ' ' + req.user.last_name,
                            cohort_id: req.user.cohort_id,
                            status: 'Current Topic: ' + previous_topic.title,
                            topic: previous_topic,
                            course: course,
                            time: hour + ':' + minute,
                            date: today,
                            created_on: dat
                        })
                        data.save((err)=>{
                            res.render("./fellow/topic/view_topic.jade", {
                                user: req.user,
                                topic: previous_topic,
                                week: week,
                                course: course,
                                complete:false
                            })
                        })
                       })
                    }
                    else
                    {
                        res.render("./fellow/topic/view_topic.jade", {
                            user: req.user,
                            topic: topic,
                            week: week,
                            course: course,
                            complete:false
                        })
                    }
                })
            })
        })
    })
}
const complete_week = (req,res)=>{
    const id = req.params.id;
    const id2 = req.params.id2;
    const id3 = req.params.id3;
    Course.findById(id,(err,course)=>{
        Week.findById(id2,(err,week)=>{
            Topic.findById(id3,(err,topic)=>{
                const no = topic.no
                const next_no =  topic.no + 1
                Topic.findOne({no:next_no,week_id:id2,course_id:id},(err,complete_topic)=>{
                    if(!complete_topic)
                    {
                        let data = new Log({
                            fellow_id: req.user.id,
                            fullname: req.user.first_name + ' ' + req.user.last_name,
                            cohort_id: req.user.cohort_id,
                            status: 'Completed Topic: ' + topic.title,
                            topic: topic,
                            course: course,
                            time: hour + ':' + minute,
                            date: today,
                            created_on: dat
                        })
                        data.save((err)=>{
                            res.redirect('/view_module/'+id+"/#nav-content" )
                        })
                    }
                   
                })
            })
        })
    })
}

const answer = (req,res)=>{
    const id = req.params.id;
    const id2 = req.params.id2;
    const id3 = req.params.id3
    let proceed = true;
    let array = req.user.answered_questions
    Course.findById(req.params.id, (err, course) => {
          Week.findById(req.params.id2, (err, week) => {
            Topic.findById(req.params.id3, (err, topic) => {
                array.map((item) => {
                    if (item.id === req.params.id3) {
                      proceed = false
                    }
                })
                if (proceed) {
                    // Answer
                    let data = new Answer({
                        fellow_id: req.user.id,
                        course_id: id,
                        course_title:course.title,
                        cohort_id:req.user.cohort_id,
                        time:date.time,
                        week_id: id2,
                        fullname: req.user.first_name + ' ' + req.user.last_name,
                        topic_id: id3,
                        topic_title: topic.title,
                        feedback: '',
                        answers: req.body,
                        date: date.today
                    });
                    data.save((err)=>{
                         // Log
                         let data = new Log({
                            fellow_id: req.user.id,
                            fullname: req.user.first_name + ' ' + req.user.last_name,
                            cohort_id: req.user.cohort_id,
                            status: 'Submitted ' + topic.title,
                            topic: topic,
                            course: course,
                            time: hour + ':' + minute,
                            date: today,
                            created_on: dat
                         })
                         data.save(()=>{
                           // Fellow
                           let query = {
                               _id:req.user.id
                           }
                           let data = {};
                           let arr = [{
                            id: topic.id,
                            title: topic.title
                          }]
                          data.answered_questions = array.concat(arr);
                          Fellow.update(query,data,(err)=>{
                           req.flash('info','Answer(s) submitted successfully.')
                           res.redirect('/view_topic/'+id+'/'+id2+'/'+id3)
                          })
                         })
                    })
                }
                else
                {
                    req.flash('danger', 'You have already submitted this question(s).');
                    res.redirect('/view_topic/' + id + '/' + id2 + '/' +id3)
                }
            })
        })
    })
}
const view_answer =(req,res)=>{
       Answer.findById(req.params.id2,(err,answer)=>{
           Topic.findById(answer.topic_id,(err,topic)=>{
            Course.findById(req.params.id,(err,course)=>{
                const object = answer.answers
                         
                let array = topic.questions[0].json
                
                let arr = []
                
                Object.keys(object).map(function(key,value, index) {
                  array.map((item)=>{
                    if(item.name ===key)
                    {
                      let ob = {
                        id:answer.id,
                        label:key,
                        type:item.type,
                        answer:object[key]
                    }
                    
                    arr.push(ob)
                    }
                  })
                   
                  });
                 
                  
                res.render('./fellow/modules/view_answer.jade',{
                    user:req.user,
                    course:course,
                    topic:topic,
                    answers:arr,
                    answer:answer,
                    questions:array,
          
                })
              })
           })
        })
}

//Exported Function
module.exports = {
    view_topic: view_topic,
    topic_next:topic_next,
    topic_previous:topic_previous,
    complete_week:complete_week,
    answer:answer,
    view_answer:view_answer

}