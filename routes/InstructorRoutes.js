import express from "express"
import cloudinary from "../Cloudinary.js"

import errorHandling from "../MidleWares/ErrorHandling.js"
import upload from "../MidleWares/ImageFilter.js"

import Teacher from "../Schema/Teacher.js"
import signUp from "../Schema/Signup.js"

const router = express.Router()

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

router.post("/addTeacher", upload.single("image"), errorHandling(async (req, res) => {
    const { name, email, number, qualification, experience, description, website, userId, youtube, twitterUrl, fbUrl, instaUrl, experties } = req.body

    const [checkTeacherEmail, checkUser] = await Promise.all([
        Teacher.findOne({ email }),
        signUp.findById(userId)
    ])
    if (checkTeacherEmail) return res.status(400).json({ message: "Instructor with this email already exists" })
    if (!checkUser) return res.status(400).json({ message: "user not found" })

    let statusCheck = checkUser.role === "admin" ? "Approved" : "Not Approved"

    let img_url;
    if (req.file) {
        const upload = await cloudinary.uploader.upload(req.file.path);
        img_url = upload.secure_url
    }

    const newTeacher = await Teacher.create({
        name, email, number, qualification, experience, description, userId, image: img_url, status: statusCheck, website, youtube, instaUrl, experties, fbUrl, twitterUrl
    })
    res.json(newTeacher)
}))

// {get techers}
router.get("/getAllTeachers", errorHandling(async (req, res) => {
    const allTeachers = await Teacher.find()
    res.json(allTeachers)
}))

// {get by id}
router.get("/getteacher/:id", errorHandling(async (req, res) => {
    const teacherId = await Teacher.findById(req.params.id)
    if (!teacherId) {
        res.status(400).json({ message: "course not exists" })
    }
    res.json(teacherId)
}))

// {check teacher}
router.get("/checkteacher/:id", async (req, res) => {
    const TeacherId = await Teacher.find({ userId: req.params.id })
    if (!TeacherId) {
        return res.status(400).json({ message: "not find any teacher against this id" })
    }
    res.json(TeacherId)
})

// {update}
router.put("/acceptTeacher/:id", async (req, res) => {
    const AcceptedTeacher = await Teacher.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true })

    if (!AcceptedTeacher) {
        return res.status(400).json({ message: "School not found" })
    }
    res.json({ message: "Teacher status updated to approve", AcceptedTeacher })
})

// {reject}
router.put("/rejectTeacher/:id", async (req, res) => {
    const RejectTeacher = await Teacher.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true })

    if (!RejectTeacher) {
        return res.status(400).json({ message: "School not found" })
    }
    res.json({ message: "Teacher request rejected", RejectTeacher })
})

// {update}
router.put("/updateteacher/:id", upload.single("image"), async (req, res) => {
    const { name, number, qualification, experience, description, website, youtube, instaUrl,
        fbUrl, twitterUrl, experties } = req.body

    const newTeacher = ({})
    if (name) newTeacher.name = name
    if (number) newTeacher.number = number
    if (qualification) newTeacher.qualification = qualification
    if (experience) newTeacher.experience = experience
    if (description) newTeacher.description = description
    if (website) newTeacher.website = website
    if (experties) newTeacher.experties = experties
    if (youtube) newTeacher.youtube = youtube
    if (instaUrl) newTeacher.instaUrl = instaUrl
    if (fbUrl) newTeacher.fbUrl = fbUrl
    if (twitterUrl) newTeacher.twitterUrl = twitterUrl

    if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        newTeacher.image = uploadResult.secure_url;
    }

    let teacherId = await Teacher.findById(req.params.id)
    if (!teacherId) {
        res.status(400).json({ message: "teacher not exists" })
    }

    teacherId = await Teacher.findByIdAndUpdate(req.params.id, { $set: newTeacher }, { new: true })
    res.json(teacherId)
})

// {delete}
router.delete("/deleteteacher/:id", async (req, res) => {
    const teacherId = await Teacher.findByIdAndDelete(req.params.id)
    if (!teacherId) {
        res.status(400).json({ message: "course not exists" })
    }
    res.json({ message: "course deleted successfully" })
})

// {count}
router.get("/countteacher", async (req, res) => {
    const countTeacher = await Teacher.countDocuments()
    res.json({ count: countTeacher })
})

export default router;