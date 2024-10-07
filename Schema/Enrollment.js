import mongoose from "mongoose"
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
        type: String
    },
    status: {
        type: String
    }
})

export default mongoose.model("Enroll", enrollSchema);