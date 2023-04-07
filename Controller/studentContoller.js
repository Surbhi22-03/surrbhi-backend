const student = require("../student")
const jwt = require("jsonwebtoken")



//Add Enqueries.......................................................

exports.addEnqueries = (async (req, res) => {
    const secret = "myseceretkey";
    try {
        const token = req.headers.token
        console.log(token)
        const { name,
            email,
            mobileNumber,
            whatsappnum,
            gender,
            dob,
            add,
            qualification,
            working,
            company,
            coursename,
            fees,
            createdBy
        } = req.body

        let insertToStudent = {
            name,
            email,
            mobileNumber,
            whatsappnum,
            gender,
            dob,
            add,
            qualification,
            working,
            company,
            coursename,
            fees,
            createdBy
        }

        let data = await student.create(insertToStudent)
        res.send({ status: "ok", msg: "data created", data: data })
    } catch (err) {
        res.send("somthing went wrong ")
    }
})


//Get Enqueries.......................................................


exports.getEnqueries = (async (req, res) => {

    try {
        let data = await student.find({})
        res.send(data)
    } catch (err) {
        console.log(err)
    }
})


//Get One Enquery.............................................................


exports.getOneEnqueries = async (req, res) => {
    try {
        let { apid } = req.params
        console.log(apid)
        let datas = await student.findById({ _id: apid })
        res.send(datas)
    } catch (e) {
        res.send({ status: "err", msg: "error", data })
    }
}



//Update One .........................................................................


exports.getOneUpdate = async (req, res) => {
    const { name, email } = req.body
    let { apid } = req.params
    try {
        let datas = await student.findOneAndUpdate(apid, { $set: { name, email } })
        res.send({ status: "OK", msg: "Data updated successfuly", data: null })

    }
    catch (err) {
        res.send({ status: "err", msg: "Somthing went wrong while updation." })
    }
}


//Sort Limit Search .......................................................................


exports.sortSearch = (async (req, res) => {

    try {


        let { query, page, limit, sortBy, sortType } = req.body
        page = page ? page : 1
        limit = limit ? limit : 2
        sortBy = sortBy ? sortBy : 'name'
        sortType = sortType ? sortType : 'ASC'

        let searchNameQuerry = []
        let key = ["name"]
        let value = { $regex: `.*${query}.*`, $options: "i" }
        searchNameQuerry.push({ [key]: value })

        let students = await student.aggregate([
            { $match: { $or: searchNameQuerry } },
            { $sort: { [sortBy]: sortType === 'ASC' ? 1 : -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ])

        let count = await student.aggregate([
            { $match: {} },
            { $count: "totalRecord" }
        ])
        res.send({ status: "ok", msg: "student Get successfully", data: { students, count } })
        console.log(students)
    }
    catch (e) {
        res.send({ status: "error", msg: "something went wrong", data: null })
        console.log(e)
    }
})


//filter fees ,course......................................

exports.filter = async (req, res) => {

    const { courses, min, max, dateFrom, dateTo } = req.body;
    try {
        const datas = await student.aggregate([
            {
                $match: {
                    $and: [
                        { coursename: { $in: courses } },
                         { fees: { $lt: "min", $gt:" max" } }
                    ]
                }
            }
        ])
        res.send({ status: "ok", msg: "student feched successfully", data: datas })
    }
    catch (e) {
        res.send({ status: "err", msg: "error", data: null })
        console.log(e)
    }


}