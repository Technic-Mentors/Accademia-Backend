import express from "express"
import errorHandling from "../MidleWares/ErrorHandling.js"
import Submit from "../Schema/Submit.js";
const router = express.Router()

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

router.post("/submitTask", errorHandling(async (req, res) => {
    const { description, lessonId, courseId, userId, taskId, instId } = req.body

    if (!description) return res.status(400).json({ message: "Description is required" })
    const checkIsTask = await Submit.findOne({ userId, taskId })
    if (checkIsTask) return res.status(400).json({ message: "Task already submitted" })

    const submitTask = await Submit.create({
        description,
        courseId,
        lessonId,
        userId,
        taskId,
        instId
    })
    res.json(submitTask)
}))

router.get("/getSubmitTasks", errorHandling(async (req, res) => {
    const submitTask = await Submit.find().populate("lessonId").populate("courseId").populate("userId").populate("taskId").populate("instId")
    if (!submitTask) return res.status(400).json({ message: "Not find any submit task" })
    res.json(submitTask)
}))

router.get("/getSubmitTask/:id", errorHandling(async (req, res) => {
    const tasks = await Submit.findById(req.params.id).populate("lessonId").populate("courseId").populate("userId").populate("taskId").populate("instId")
    if (!tasks) return res.status(400).json({ message: "Task not found" })
    res.json(tasks)
}))

router.delete("/delSubmitTask/:id", errorHandling(async (req, res) => {
    const submitTask = await Submit.findByIdAndDelete(req.params.id)
    if (!submitTask) return res.status(400).json({ message: "Not found any submit task" })
    res.json({ message: "Task deleted successfully" })
}))

export default router;