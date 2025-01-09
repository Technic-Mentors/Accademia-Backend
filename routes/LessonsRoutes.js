import express from "express"
import Lessons from "../Schema/Lessons.js";
import Course from "../Schema/Course.js"
import errorHandling from "../MidleWares/ErrorHandling.js"

const router = express.Router()

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

router.post("/addLesson", errorHandling(async (req, res) => {
    const { title, description, videoUrls, courseId } = req.body
    const checkCourse = await Course.findById(courseId)
    if (!checkCourse) return res.status(400).json({ message: "Course not found" })

    const newLesson = await Lessons.create({
        title, description, videoUrls, courseId
    })

    checkCourse.lessons.push(newLesson._id)
    const updateCourse = await checkCourse.save()
    console.log(updateCourse);
    res.json(newLesson)
}))

router.get("/allLessons", errorHandling(async (req, res) => {
    const lessons = await Lessons.find().populate("courseId", "title userId")
    res.json(lessons)
}))

router.get("/get/:id", errorHandling(async (req, res) => {
    const getLessonById = await Lessons.findById(req.params.id)
    if (!getLessonById) return res.status(400).json({ message: "Course not found" })
    res.json(getLessonById)
}))

router.put("/update/:id", errorHandling(async (req, res) => {
    const { title, description, videoUrls } = req.body;

    const newLesson = {}
    if (title) newLesson.title = title
    if (description) newLesson.description = description
    if (videoUrls) newLesson.videoUrls = videoUrls

    const updateLesson = await Lessons.findByIdAndUpdate(req.params.id, { $set: newLesson }, { new: true })
    if (!updateLesson) return res.status(400).json({ message: "Lesson not found" })
    res.json(updateLesson)
}))

router.delete("/delete/:id", errorHandling(async (req, res) => {
    const getLessonById = await Lessons.findByIdAndDelete(req.params.id)
    if (!getLessonById) return res.status(400).json({ message: "Course not found" })
    res.json({ message: "lesson successfully deleted" })
}))

export default router;