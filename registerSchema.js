const mongoose = require("mongoose")
const register = mongoose.Schema({
    name: String,
    email:String,
    password: String,
    confirmpassword: String,
    mobnumber: String
})
module.exports = mongoose.model("register", register)