const mongoose = require("mongoose")
const { Schema } = mongoose

const enrollSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "SignUp",
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String
    }
})

module.exports = mongoose.model("Enroll", enrollSchema)