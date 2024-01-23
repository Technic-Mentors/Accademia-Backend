const mongoose = require("mongoose")
const { Schema } = mongoose

const teacherSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    number: {
        type: String,
        require: true
    },
    qualification: {
        type: String,
        require: true
    },
    experience: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("Teacher", teacherSchema)