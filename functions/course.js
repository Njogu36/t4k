// Librabries

const Course = require('../models/course.js')
const Topic = require('../models/topic.js');
const Week = require('../models/week.js')
const Log = require('../models/log.js')
const Answer = require('../models/answer.js')


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

const view_module = (req,res)=>{
    const id = req.params.id;
    Course.findById(id,(err,course)=>{
        Topic.find({cohort_id:req.user.cohort_id,course_id:id},(err,topics)=>{
            Week.find({cohort_id:req.user.cohort_id,course_id:id},(err,weeks)=>{
                Course.find({module_id:id},(err,subs)=>{
                    Answer.find({course_id:id},(err,answers)=>{
                        res.render('./fellow/modules/view_module.jade',{
                            course:course,
                            user:req.user,
                            weeks:weeks,
                            topics:topics,
                            subs:subs,
                            answers:answers
                        })
                    })
                   
                })
               
            })
        })
       
    })

}


// Export module
module.exports = {
    view_module:view_module

}