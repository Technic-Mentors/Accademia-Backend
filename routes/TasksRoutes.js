import express from "express"
import errorHandling from "../MidleWares/ErrorHandling.js"
import Tasks from "../Schema/Tasks.js"
import upload from "../MidleWares/AllFileFilter.js";
import cloudinaryV2 from "../Cloudinary.js";
const router = express.Router()

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

router.post("/assignTasks", upload.single("file"), errorHandling(async (req, res) => {
    const { title, description, lessonId, courseId, dueDate, userId, totalMarks } = req.body

    if (!title || !description) return res.status(400).json({ message: "Fields with * are required" })

    const existingTask = await Tasks.findOne({ title, lessonId })
    if (existingTask) return res.status(400).json({ message: "Task with this title for this lesson already assigned" })

    let fileUrl;
    if (req.file) {
        if (req.file.mimetype.startsWith('video')) {
            const fileUpload = await cloudinaryV2.uploader.upload(req.file.path, {
                resource_type: "video"
            });
            fileUrl = fileUpload.secure_url;
        } else if (req.file.mimetype === 'application/pdf') {
            const fileUpload = await cloudinaryV2.uploader.upload(req.file.path, {
                resource_type: "raw"
            });
            fileUrl = fileUpload.secure_url;
        } else {
            const fileUpload = await cloudinaryV2.uploader.upload(req.file.path);
            fileUrl = fileUpload.secure_url;
        }
    }

    const Task = await Tasks.create({
        title,
        description,
        courseId,
        lessonId,
        userId,
        dueDate,
        file: fileUrl,
        status: "N",
        totalMarks
    })
    res.json(Task)
}))

router.get("/getTasks", errorHandling(async (req, res) => {
    const tasks = await Tasks.find().populate("lessonId").populate("courseId").populate("userId")
    if (!tasks) return res.status(400).json({ message: "Not find any assigned tasks" })
    res.json(tasks)
}))

router.get("/getTask/:id", errorHandling(async (req, res) => {
    const tasks = await Tasks.findById(req.params.id).populate("lessonId").populate("userId")
    if (!tasks) return res.status(400).json({ message: "Task not found" })
    res.json(tasks)
}))

router.put("/assignedTasks/:id", upload.single("file"), errorHandling(async (req, res) => {
    const { title, description, dueDate } = req.body;

    const newTask = {}
    if (title) newTask.title = title
    if (description) newTask.description = description
    if (dueDate) newTask.dueDate = dueDate
    if (req.file) {
        if (req.file.mimetype.startsWith('video')) {
            const fileUpload = await cloudinaryV2.uploader.upload(req.file.path, {
                resource_type: "video"
            });
            newTask.file = fileUpload.secure_url
        } else {
            const fileUpload = await cloudinaryV2.uploader.upload(req.file.path)
            newTask.file = fileUpload.secure_url
        }
    }

    const updateLesson = await Tasks.findByIdAndUpdate(req.params.id, { $set: newTask }, { new: true })
    if (!updateLesson) return res.status(400).json({ message: "Task not found" })
    res.json(updateLesson)
}))

router.put("/updateStatus/:id", errorHandling(async (req, res) => {
    const getTask = await Tasks.findById(req.params.id)
    if (!getTask) return res.status(404).json({ message: "Task not found" })

    const statusUpdate = getTask.status === "N" ? "Y" : "N"
    const updateTask = await Tasks.findByIdAndUpdate(req.params.id, { $set: { status: statusUpdate } }, { new: true })
    res.json(updateTask)
}))

router.delete("/delTask/:id", errorHandling(async (req, res) => {
    const delTask = await Tasks.findByIdAndDelete(req.params.id)
    if (!delTask) return res.status(400).json({ message: "Task not found" })
    res.send({ message: "Task deleted successfully" })
}))

export default router;