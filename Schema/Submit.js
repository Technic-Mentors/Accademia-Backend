import mongoose from "mongoose";
const { Schema } = mongoose

const submitTasksSchema = new Schema({
    description: String,
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: "Lesson"
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: "Tasks"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "SignUp"
    },
    instId: {
        type: Schema.Types.ObjectId,
        ref: "SignUp"
    }
}, { timestamps: true })

export default mongoose.model("Submit Task", submitTasksSchema)