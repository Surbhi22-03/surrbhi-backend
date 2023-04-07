const mongoose= require ("mongoose")
const studentSchema= mongoose.Schema({
    studentsname:"string",
    studentnumber:"string",
    coursename:"string",
    feedback:"string"

})


module.exports=mongoose.model("studentSchema",studentSchema)