import mongoose from "mongoose"
const { Schema } = mongoose

const signUpSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    institute: {
        type: String
    }
})

export default mongoose.model("SignUp", signUpSchema);