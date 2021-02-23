const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
no:Number,
title:String,
type:String,
cohort_id:String,
cohort:{},
course_id:String,
course:{},
created_on:Date
});
const Task = mongoose.model('Task',taskSchema);
module.exports = Task