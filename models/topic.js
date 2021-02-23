const mongoose = require('mongoose');
const topicSchema = mongoose.Schema({
  no:Number,
  title:String,
  week_id:String,
  week_title:String,
  cohort_id:String,
  cohort:{},
  course:{},
  course_id:String,
  type:String,
  description:String,
  questions:[],
  table_headers:[],
  created_on:Date
});
const Topic = mongoose.model('Topic',topicSchema);
module.exports = Topic