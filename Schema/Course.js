const mongoose = require("mongoose")
const { Schema } = mongoose

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image:{
        type: String
    }
})

module.exports = mongoose.model("Course", courseSchema)