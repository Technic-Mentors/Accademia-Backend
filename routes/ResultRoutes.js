import express from "express"
import errorHandling from "../MidleWares/ErrorHandling.js"
import Result from "../Schema/Result.js";
const router = express.Router()

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

router.post("/uploadResult", errorHandling(async (req, res) => {
    const { lessonId, courseId, taskId, results } = req.body

    const checkPreviousResult = await Result.findOne({ taskId })

    const formattedResults = results.map(result => {
        return {
            userId: result.userId,
            submitTaskId: result.submitTaskId,
            obtainedMarks: result.obtainedMarks
        }
    })

    if (checkPreviousResult) {
        const updateResult = await Result.findOneAndUpdate({ taskId }, { students: formattedResults }, { new: true })
        return res.json(updateResult)
    } else {
        const submitTask = await Result.create({
            courseId,
            lessonId,
            taskId,
            students: formattedResults
        })
        res.json(submitTask)
    }

}))

router.get("/getResults", errorHandling(async (req, res) => {
    const submitTask = await Result.find().populate("lessonId").populate("courseId").populate("students.userId").populate("taskId").populate("students.submitTaskId")
    if (!submitTask) return res.status(400).json({ message: "No result find" })
    res.json(submitTask)
}))

router.get("/getResult/:id", errorHandling(async (req, res) => {
    const tasks = await Result.findById(req.params.id).populate("lessonId").populate("courseId").populate("students.userId").populate("taskId").populate("students.submitTaskId")
    if (!tasks) return res.status(400).json({ message: "No result find" })
    res.json(tasks)
}))

router.delete("/delResult/:id", errorHandling(async (req, res) => {
    const submitTask = await Result.findByIdAndDelete(req.params.id)
    if (!submitTask) return res.status(400).json({ message: "Not found any submit task" })
    res.json({ message: "Task deleted successfully" })
}))

export default router;