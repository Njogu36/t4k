const mongoose = require('mongoose');
const kpiSchema = mongoose.Schema({
    title:String,
    achieved:Boolean,
    date:String,
    fellow_id:String,
    fullname:String,
    cohort_id:String
})
const KPI = mongoose.model('KPI',kpiSchema);
module.exports = KPI