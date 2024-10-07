import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
const mongoURI = process.env.MONGODB_URI

const connectToMongo = async () => {
    try {
        mongoose.connect(mongoURI)
        console.log('Successfuly connected with mongodb')
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

export default connectToMongo;