const mongoose = require("mongoose");
const { Schema } = mongoose;

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true
  },
  userId:{
    type: String,
    required: true
  },
  video:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Video", videoSchema);
