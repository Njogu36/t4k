const mongoose = require('mongoose');
const tagSchema = mongoose.Schema({
title:String,
created_on:Date
});
const Tag = mongoose.model('Tag',tagSchema);
module.exports = Tag