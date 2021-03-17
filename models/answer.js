const mongoose = require('mongoose');
const answerSchema = mongoose.Schema({
    fellow_id: String,
    fellow:{},
    course_id: String,
    course_title:String,
    week_id: String,
    topic_id: String,
    topic_title:String,
    time:String,
    feedback:String,
    answers: {},
    date:String,
    file:String
})

const Answer = mongoose.model('Answer',answerSchema);
module.exports = Answer