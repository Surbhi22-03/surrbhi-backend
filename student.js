const mongoose = require("mongoose");
const student = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    mobileNumber: String,
    whatsappnum: String,
    gender: String,
    dob: String,
    add: String,
    working: String,
    company: String,
    coursename: String,
    fees: String,
    createdBy: String

})
module.exports = mongoose.model('student', student)
