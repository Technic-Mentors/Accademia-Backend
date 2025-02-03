import mongoose from "mongoose";

const { Schema } = mongoose

const tasksSchema = new Schema({
    title: String,
    description: String,
    dueDate: Date,
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: "Lesson"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "SignUp"
    },
    totalMarks: Number,
    status: String,
    file: String
}, { timestamps: true })

export default mongoose.model("Tasks", tasksSchema)