const mongoose = require("mongoose")
const { Schema } = mongoose

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
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
    learning: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    userId: {
        type: String,
        ref: "User"
    },
    image: {
        type: String
    }
})

module.exports = mongoose.model("Course", courseSchema)