const mongoose = require('mongoose');
const cohortSchema = mongoose.Schema({
no:Number,
title:String,
fellows:Number,
created_on:Date,
})
const Cohort = mongoose.model('Cohort',cohortSchema);
module.exports = Cohort