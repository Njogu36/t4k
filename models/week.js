const mongoose = require('mongoose');
const weekSchema = mongoose.Schema({
no:Number,
title:String,
topics:Number,
cohort_id:String,
start_date:String,
end_date:String,
cohort:{},
course_id:String,
course:{},
created_on:Date
});
const Week = mongoose.model('Week',weekSchema);
module.exports = Week