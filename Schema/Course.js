
import mongoose from "mongoose"
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
    name: {
        type: String
    },
    description: {
        type: String
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    outcome: {
        type: [String]
    },
    prereqs: [{
        type: String
    }],
    target: [{
        type: String
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "SignUp"
    },
    image: {
        type: String
    },
    lessons: [{
        type: Schema.Types.ObjectId,
        ref: "Lesson"
    }]
})

export default mongoose.model("Course", courseSchema);
