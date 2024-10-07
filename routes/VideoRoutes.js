import express from "express"
import cloudinary from "../Cloudinary.js"

import videoUpload from "../MidleWares/VideoFilter.js"
import errorHandling from "../MidleWares/ErrorHandling.js";

import Video from "../Schema/Video.js";

const router = express.Router()

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

router.post("/addVideo", videoUpload.single("video"), errorHandling(async (req, res) => {
    const { userId, title, name } = req.body;

    const uniqueTitle = await Video.findOne({ title });
    if (uniqueTitle) return res.status(400).json({ message: "Video with this title already exists" });

    let videoUrl;
    if (req.file) {
        const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" });
        videoUrl = upload.secure_url;
    }

    const video = await Video.create({
        name, title, userId, video: videoUrl,
    });
    res.json(video);
}));

// {get}
router.get("/getVideo", errorHandling(async (req, res) => {
    const videoLectures = await Video.find()
    res.json(videoLectures)
}))

// {get by id}
router.get("/getVideo/:id", errorHandling(async (req, res) => {
    const videoLectures = await Video.findById(req.params.id)
    if (!videoLectures) {
        return res.status(400).json({ message: "Not found any video" })
    }
    res.json(videoLectures)
}))

// {update}
router.put("/updateVideo/:id", videoUpload.single("video"), errorHandling(async (req, res) => {
    const { title } = req.body
    const checkVideo = await Video.findById(req.params.id)
    if (!checkVideo) {
        return res.status(400).json({ message: "Video not found" })
    }

    let newVideo = {}
    if (title) newVideo.title = title

    if (req.file) {
        const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" });
        newVideo.video = upload.secure_url;
    }

    const updateVideo = await Video.findByIdAndUpdate(req.params.id, { $set: newVideo }, { new: true })
    res.json(updateVideo)
}))

export default router;