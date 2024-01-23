const mongoose = require("mongoose")
const { Schema } = mongoose

const schoolSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true
    },
    number: {
        type: String,
        require: true
    },
    website:{
        type: String
    }
})

module.exports = mongoose.model("School", schoolSchema)