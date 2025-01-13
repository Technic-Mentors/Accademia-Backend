import express from "express"

import signUp from "../Schema/Signup.js"
import Course from "../Schema/Course.js"
import Enroll from "../Schema/Enrollment.js"

const router = express.Router()

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

router.get("/nametitle/:id", async (req, res) => {
    const signUpName = await signUp.findById(req.params.id, "name role")
    const titleCourse = await Course.find({}, "title")
    res.json({ signUpName, titleCourse })
})
// Enroll courses 
router.post('/enrollments', async (req, res) => {
    const { courseId, studentId, description } = req.body
    console.log(courseId, studentId, description);

    const [studentExists, courseExists] = await Promise.all([
        signUp.findById(studentId),
        Course.findById(courseId)
    ])

    if (!studentExists || !courseExists) {
        return res.status(400).json({ error: "Student or Course not found" })
    }
    const newEnroll = await Enroll.create({
        courseId, studentId, description, status: "A"
    })
    res.json(newEnroll)
});

router.get("/enrlRequests", async (req, res) => {
    const requests = await Enroll.find()
        .populate('studentId', 'name')
        .populate('courseId', 'title');

    res.json(requests);
});

router.put("/acceptStatus/:id", async (req, res) => {
    const AcceptStatus = await Enroll.findByIdAndUpdate(req.params.id, { status: "Y" }, { new: true })
    if (!AcceptStatus) {
        return res.status(404).json({ error: "Enrollment not found" });
    }
    res.json({ message: "Enrollment status updated to 'y' (Accepted)", AcceptStatus });
})

router.put("/rejectStatus/:id", async (req, res) => {
    try {
        const RejectStatus = await Enroll.findByIdAndUpdate(req.params.id, { status: "N" }, { new: true })
        if (!RejectStatus) {
            return res.status(404).json({ error: "Enrollment not found" });
        }
        res.json({ message: "Enrollment status updated to 'n' (Accepted)", RejectStatus });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get("/getenrol/:id", async (req, res) => {
    const enrollCourse = await Enroll.find({ studentId: req.params.id })
    if (!enrollCourse || enrollCourse.length === 0) {
        return res.status(400).json({ message: "Not found any enroll course" })
    }
    const enrollStudentId = enrollCourse[0].studentId.toString()
    const SignUser = await signUp.findById(req.params.id)
    if (!SignUser) {
        return res.status(400).json({ message: "not find any user" })
    }
    if (enrollStudentId !== SignUser.id) {
        return res.status(400).json({ message: "No enrollments found for this student" })
    }

    const enrollStatus = await Promise.all(enrollCourse.map(async (Enroll) => {
        if (Enroll.status === "A") {
            return { message: "Your request pending" };
        } else if (Enroll.status === "N") {
            return { message: "Your request for enrollment rejected" };
        } else if (Enroll.status === "Y") {
            const enrollCourseId = Enroll.courseId.toString()
            const course = await Course.findById(enrollCourseId);
            console.log(course);

            return { course };
        }
    }))
    res.json(enrollStatus)
})

export default router;