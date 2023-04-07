const mongoose = require("mongoose")
const course = mongoose.Schema({
    coursename: String,

},
{timestamps:true}
);
module.exports=mongoose.model('course',course)