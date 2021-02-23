const mongoose = require('mongoose');
const articleSchema = mongoose.Schema({
 title:String,
 type:String,
 created_on:Date,
 date:String,
 by:String,
 url:String,
 file:String,
 cohort_id:String
})
const Article = mongoose.model('Article',articleSchema);
module.exports = Article