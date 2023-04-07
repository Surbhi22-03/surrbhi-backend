const course = require("../course")
exports.addCourse = (async (req, res) => {
    const { coursename } = req.body;
    let courseToInsert = { coursename }
    try {
        let courses = await course.create(courseToInsert)

        res.send({ status: "ok", msg: "added", data: courses });
    }

    catch (e) {
        res.send({ status: "err", msg: "error", data: null })
    }
})

exports.getCourse = (async (req, res) => {
    try {
        const courses = await course.find({})
        res.send({ status: "ok", msg: "data fechted successfully", data: courses })
    } catch (e) {
        res.send({ status: "err", msg: "error", data:null })
    }
})
