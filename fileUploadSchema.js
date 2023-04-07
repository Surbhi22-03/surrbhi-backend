const mongoose = require("mongoose");
const fileUploadSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    }

    // image: {
    //     data: Buffer,
    //     contentType: String
    // }

})
module.exports = mongoose.model('fileUploadSchema', fileUploadSchema)       