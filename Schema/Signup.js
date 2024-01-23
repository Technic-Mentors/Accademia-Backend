const mongoose = require("mongoose")
const { Schema } = mongoose

const signUpSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("SignUp", signUpSchema)