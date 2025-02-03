import mongoose from "mongoose";
const { Schema } = mongoose

const generateCertificateSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    status: String,
    candidateId: [{
        type: Schema.Types.ObjectId,
        ref: "SignUp"
    }],
    generateDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true })

export default mongoose.model("GenerateCertificate", generateCertificateSchema)