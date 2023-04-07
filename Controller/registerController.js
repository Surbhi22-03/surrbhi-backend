const register = require("../registerSchema")
const bcrypt = require("bcrypt")
const saltRounds = 10
const jwt = require("jsonwebtoken")


//Register .................................................................


exports.addregister = (async (req, res) => {

    // const token = '';
    // jwt.verify(token, 'secret', function (err, decoded) {
    //     if (err) {
    //         console.log('Token verification failed');
    //     } else {
    //         console.log(decoded);
    //     }
    // });

    const { name,
        email,
        password,
        confirmpassword,
        mobnumber } = req.body

    let hashpassword = await bcrypt.hash(password, saltRounds)
    register.create({
        name: name,
        email: email,
        password: hashpassword,
        confirmpassword: hashpassword,
        mobnumber: mobnumber
    })
        .then(() => {
            res.send("registered successfully")
        }).catch(() => {
            res.send("error")
        })
})


//Login ............................................................................................


exports.addlogin = (async (req, res) => {

    const secert = "myseceretkey"
    let { email, password } = req.body
    try {
        let data = await register.findOne({ email })

        if (!data) {
            res.send("User is not found")
        } else {
            bcrypt.compare(password, data.password).then(function (result) {
                const token = jwt.sign({ _id: data._id }, secert);
                result ? res.send({
                    msg: " Login successfuly", data: data, token
                })
                    : res.send({ msg: "Can Not login" })
            })

        }

    } catch (error) {
        res.send({
            msg: "an error",

        })
        console.log(error)
    }
})

