const mongoose = require("mongoose")
const { Schema } = mongoose

const cateSchema = new Schema({
    category: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Category", cateSchema)