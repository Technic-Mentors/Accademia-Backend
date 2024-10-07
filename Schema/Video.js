import mongoose from "mongoose";
const { Schema } = mongoose;

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  video: {
    type: String,
    required: true
  }
});

export default mongoose.model("Video", videoSchema);
