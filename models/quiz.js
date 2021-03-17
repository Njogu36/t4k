const mongoose = require('mongoose');
const quizSchema = mongoose.Schema({
    answers:[],
    fellow:String,
    fellow_id:String,
    topic:String,
    


})
const Quiz = mongoose.model("Quiz",quizSchema);
module.exports =Quiz