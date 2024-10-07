import mongoose from "mongoose"
const { Schema } = mongoose

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    videoUrls: {
        type: [String],
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }
});

export default mongoose.model("Lesson", lessonSchema);
