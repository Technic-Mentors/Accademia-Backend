import multer from "multer";

// Video filter
const videoConfig = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, `video-${Date.now()}.${file.originalname}`);
    }
});
const isVideo = (req, file, callback) => {
    if (file.mimetype.startsWith("video")) {
        callback(null, true);
    } else {
        callback(new Error("Only videos are allowed"));
    }
};

const videoUpload = multer({
    storage: videoConfig,
    fileFilter: isVideo
});

export default videoUpload;