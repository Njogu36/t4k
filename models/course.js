const mongoose = require('mongoose');
const courseSchema = mongoose.Schema({
no:Number,
title:String,
profile_image:String,
cohort:{},
cohort_id:String,
status:String,
start_date:String,
duration:String,
type:String,
sub_module:Boolean,
module_id:String,
module_title:String,
sub_modules:Number,
tasks:Number,
year:String,
enabled:Boolean,
description:String,
end_date:String,
created_on:Date
})
const Course = mongoose.model('Course',courseSchema);
module.exports = Course