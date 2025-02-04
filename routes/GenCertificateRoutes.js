import express from "express"
import errorHandling from "../MidleWares/ErrorHandling.js";
import GenCertificate from "../Schema/GenCertificate.js";
import Enrollment from "../Schema/Enrollment.js";
const router = express.Router()

router.post("/generateCertificate", errorHandling(async (req, res) => {
    const { courseId, status, generateDate } = req.body;

    if (!courseId || !generateDate) return res.status(400).json({ message: "Please select * fields" });

    const enrolledCourses = await Enrollment.find({ courseId, status: "Y" });
    const candidateId = enrolledCourses.map(course => course.studentId);

    if (candidateId.length === 0) {
        return res.status(400).json({ message: "No student enrolled for this course" });
    }

    const updatedCertificate = await GenCertificate.findOneAndUpdate(
        { courseId },
        { $set: { candidateId, generateDate, status } },
        { new: true, upsert: true }
    );

    res.json(updatedCertificate);
}));


router.get("/generatedCertificate", errorHandling(async (req, res) => {
    const generatedCertificates = await GenCertificate.find().populate("courseId").populate("candidateId")
    if (!generatedCertificates) return res.status(404).json({ message: "Not found any generated certificate" })
    res.json(generatedCertificates)
}))

export default router;