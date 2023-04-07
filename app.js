const express = require("express")
const mongoos = require("mongoose")
const multer = require('multer')
const joi = require("joi")
const bodyParser = require("body-parser")
const student = require("./student")
const cors = require("cors")
const course = require("./course")
const addCourse = require("./Controller/courseController")
const addEnqueries = require("./Controller/studentContoller")
const addregister = require("./Controller/registerController")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const fileUploadSchema = require("./fileUploadSchema")
const path = require("path")
const fs = require("fs")


const app = express()
app.use("/uploads", express.static('uploads'))

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const URL = 'mongodb+srv://surbhisharma8634:sharma02surbhi22@cluster0.rhycx8s.mongodb.net/data?retryWrites=true&w=majority'
mongoos.connect(URL).then(() => {
    console.log("data connected  ")
}).catch((err) => {
    console.log(err)
    console.log("some error")
})

// console.log(__dirname)
// console.log(__filename)


//validation.............................................................................


const validation = (req, res, next) => {
    const Schema = Joi.object().keys({
        name: joi.string().min(3).required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        mobileNumber: Joi.string().required().min(3).max(10),
        whatsappnum: Joi.string().required().min(3).max(10),
        gender: Joi.string().required(),
        dob: Joi.string().required(),
        add: Joi.string().required(),
        working: Joi.string().required(),
        company: Joi.string().required(),
        coursename: Joi.string().required(),
        fees: Joi.string().required(),
        createdBy: Joi.string().required()
    })
    const { error } = Schema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(200).json(error)
    } else {
        next();
    }
}


//validation on registration.........................................................

const validationRegister = (req, res, next) => {
    const regSchema = Joi.object().keys({
        name: joi.string().min(3).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
        confirmpassword: Joi.string().valid(Joi.ref('password')).required(),
        mobnumbe: Joi.string().required().min(3).max(10),
    })
    const { error } = regSchema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(200).json(error)
    } else {
        next();
    }
}


//validation on login........................................................

const validationLogin = (req, res, next) => {
    const loginSchema = Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),

    })
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(200).json(error)
    } else {
        next();
    }
}

const verifyToken = (async (req, res, next) => {
    try {
        const token = await req.headers.token
        console.log(token)
        if (token === null) {
            console.log("no token provided")
        } else {
            let decoded = jwt.verify(token, 'myseceretkey')
            req.addregister = decoded;
            console.log(decoded)
            next()
        }
    } catch {
        res.send({ staus: "err", msg: "token is invalid" })
    }
})

app.post("/student", verifyToken, validation, addEnqueries.addEnqueries)

app.get("/students", verifyToken, addEnqueries.getEnqueries)

app.get("/students/:apid", verifyToken, addEnqueries.getOneEnqueries)

app.put("/students/:apid", addEnqueries.getOneUpdate)

app.post('/get-students', addEnqueries.sortSearch)


app.post("/course", addCourse.addCourse)

app.get("/courses", addCourse.getCourse)



app.post("/filter", addEnqueries.filter)



//app.post('/student', async (req, res) => {
//     try {
//         const { query, page, limit, sortBy, sortType } = req.body
//         const params = ["name", "Email", "Mobile Number", "Whatsapp", "Gender", "dob", "Address", "workingExp", "Company"]

//         console.log(query)
//         let searchQuery = []
//         for (let each in params) {
//             let key = params[each]
//             let value = { $regex: `.*${query}.*`, $option: "i" }
//             searchQuery.push({ [key]: value })
//         }
//         console.log(searchQuery)

//         // const page = req.query.page?parseInt(req.query.page) :1
//         // const limit=parseInt(req.query.limit)
//         // const skip=(page-1)*limit
//         // const total=await student.countDocument()


//         let datas = await student.aggregate([
//             { $match: { $or: searchQuery } }

//             //  {$limit:2},
//             // {$sort:{[sortBy]:sortType === 'ASC'?1:-1}},
//             //  {$skip:(page-1)*limit},
//             //  {$limit:limit},
//               {$lookup:()}

//         ])

//         res.send({ status: "ok", msg: "student added successfully", data: datas })

//     } catch {

//         res.send({ status: "error", msg: "something went wrong", data: null })

//     }
// })


app.delete("/students/:apid", verifyToken, async (req, res) => {
    let { apid } = req.params
    try {
        let datas = await student.findByIdAndDelete({ _id: apid })
        res.send({ status: "OK", msg: "Data deleted succsessfuly", data: datas })
    } catch (err) {
        res.send({ staus: "err", msg: "Somthing went wrong while deletation", data: null })
    }
})

// //Enquires Added to database....
// app.get("/followup-by-enquiry/:studentId", async (req, res) => {
//     let { studentId } = req.params
//     const {
//         enqueries_id,
//         is_communicated,
//         summary,
//         next_follow_enqueries,
//         next_follow_enqueries_date_time

//     } = req.body

//     let enquerieToInserted = {
//         enqueries_id,
//         is_communicated,
//         summary,
//         next_follow_enqueries,
//         next_follow_enqueries_date_time
//     }
//     try {
//         await enqueries.create(enquerieToInserted)
//         res.send({ status: "OK", msg: "Data Posted Successfully", data: null });
//     } catch (err) {
//         res.send({ status: "ERR", msg: "Something went wrong" })
//     }
// })

// // Add followup
// app.post("/add-followup", async (req, res) => {
//     let { studentId } = req.params
//     console.log(studentId)
//     const {
//         enqueries_id,
//         is_communicated,
//         summary,
//         next_follow_enqueries,
//         next_follow_enqueries_date_time
//     } = req.body

//     let addFollowupToInsert = {
//         enqueries_id,
//         is_communicated,
//         summary,
//         next_follow_enqueries,
//         next_follow_enqueries_date_time
//     }
//     try {
//         await followUp.create(addFollowupToInsert)
//         res.send({ status: "OK", msg: "Data Save successfully", data: null })
//     }
//     catch (err) {
//         res.send({ status: "ERR", msg: "SOMETHING WENT WRONG" })
//         console.log(err)
//     }
// })

// //.............................................................................................................


app.post("/register", validationRegister, addregister.addregister)

app.post("/login", validationLogin, addregister.addlogin)

// const storageEngine = multer.diskStorage({
//     destination: "./uploads",
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}--${file.originalname}`);
//     },
// });
// const upload = multer({
//     storage: storageEngine,
//     limits: { fileSize: 1000000},
//     fileFilter: (req, file, cb) => {
//         checkFileType(file, cb)
//     },
// });
// const checkFileType = function (file, cb) {

//     const fileTypes = /jpeg|jpg|png|gif|svg/;
//     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimeType = fileTypes.test(file.mimeType)

//     if (mimeType && extName) {
//         return cb(null, true);
//     } else {
//         cb("error")
//     }
// }


//validation on file upload


const storageEngine = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});


const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

const checkFileType = function (file, cb) {

    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    //const fileTypes = /jpeg||jpg/;

    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload Images!!");
    }
};


app.post('/profile', upload.single('pics'), async (req, res, next) => {

    // try {
    //     const file = req.file.path
    //     const profile = await fileUploadSchema.create({ file })
    //     if (req.file) {
    //         res.send(req.file)
    //     } else {
    //         res.status(400).send("please upload a valid image")
    //     }
    // } catch (error) {
    //     res.send({ status: "ERR", msg: "Error while uploading" })
    //     console.log(error)
    // }

    try {
        const name = req.file.path
        const file = req.file
        await fileUploadSchema.create({ name })
        res.send({ status: "ERR", msg: "uploaded", data: { name, file } })
        console.log(file)
    } catch {

    }
})



app.listen(2244, () => {
    console.log("server is running")
})
