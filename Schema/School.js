import mongoose from "mongoose"
const { Schema } = mongoose

const schoolSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true
    },
    number: {
        type: String,
        require: true
    },
    detail: {
        type: String
    },
    category: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
    fpNumber: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        ref: "User"
    },
    status: {
        type: String,
        require: true
    }
})

export default mongoose.model("School", schoolSchema);