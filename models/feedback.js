const mongoose = require('mongoose');
const feedbackSchema = mongoose.Schema({
    topic_id:String,
    topic_title:String,
    fellow_id:String,
    message:String,
    date:String,
    by:String
});
const Feedback = mongoose.model('Feedback',feedbackSchema);
module.exports = Feedback