import mongoose from "mongoose"
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
    },
    website: {
        type: String
    },
    userId: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    experties: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
    resume: {
        type: String
    },
    youtube: {
        type: String
    },
    fbUrl: {
        type: String
    },
    instaUrl: {
        type: String
    },
    twitterUrl: {
        type: String
    }
})

export default mongoose.model("Teacher", teacherSchema)