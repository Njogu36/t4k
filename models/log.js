const mongoose = require('mongoose');
const LogSchema = mongoose.Schema({
  fellow_id:String,
  fullname:String,
  cohort_id:String,
  status:String,
  topic:String,
  course:String,
  time:String,
  date:String,
  created_on:Date
});
const Log = mongoose.model('Log', LogSchema);
module.exports = Log