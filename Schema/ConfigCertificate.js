import mongoose from "mongoose";
const { Schema } = mongoose

const confCertificateSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    description: String,
    configureDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true })

export default mongoose.model("configureCertificate", confCertificateSchema)