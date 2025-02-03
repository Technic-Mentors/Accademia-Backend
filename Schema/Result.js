import { mongoose } from "mongoose";
const { Schema } = mongoose

const resultSchema = new Schema({
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
    students: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "SignUp"
        },
        submitTaskId: {
            type: Schema.Types.ObjectId,
            ref: "Submit Task"
        },
        obtainedMarks: {
            type: Number
        }
    }]
}, { timestamps: true })

export default mongoose.model("Result", resultSchema)