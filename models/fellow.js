const mongoose = require('mongoose');
const fellowSchema = mongoose.Schema({
 first_name:String,
 last_name:String,
 username:String,
 phone_no:String,
 profile_image:String,
 banner_image:String,
 country:String,
 city:String,
 bold_question:String,
 answered_questions:[],
 current_topic:String,
 current_topic_id:String,
 cohort:{},
 tags:[],
 dob:String,
 cohort_id:String,
 password:String,
 pass:String
 
})
const Fellow = mongoose.model('Fellow',fellowSchema);
module.exports = Fellow