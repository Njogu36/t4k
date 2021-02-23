const mongoose = require('mongoose')
const IndividualSchema = mongoose.Schema({
course_title:String,
course_id:String,
task_title:String,
task_id:String,
completed:Boolean,
fellow_id:String,
task_type:String
})
const Individual = mongoose.model('Individual',IndividualSchema)
module.exports = Individual