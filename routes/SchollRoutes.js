import express from "express"
import cloudinary from "../Cloudinary.js"

import errorHandling from "../MidleWares/ErrorHandling.js";
import upload from "../MidleWares/ImageFilter.js"

import signUp from "../Schema/Signup.js"
import School from "../Schema/School.js"

const router = express.Router();

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

const checkExistingSchool = async (req, res, next) => {
    const { name, email, number, fpNumber } = req.body;

    const [emailExists, numberExists, fpNumberExists, nameExists] = await Promise.all([
        School.findOne({ email }),
        School.findOne({ number }),
        School.findOne({ fpNumber }),
        School.findOne({ name })
    ])

    if (emailExists) return res.status(400).json({ message: "School with this email already exists" });
    if (numberExists) return res.status(400).json({ message: "This number already exists" });
    if (fpNumberExists) return res.status(400).json({ message: "Focal Person number already exists" });
    if (nameExists) return res.status(400).json({ message: "School already registered with this name" });

    next();
};

// {Add}
router.post("/addSchool", upload.single("image"), checkExistingSchool, errorHandling(async (req, res) => {
    const { name, email, number, city, address, detail, category, fpNumber, userId } = req.body;
    if (!name || !email || !number || !city || !address || !detail || !category || !fpNumber) return res.status(400).json({ message: "Fields with * should be filled" })
    const checkUser = await signUp.findById(userId);
    if (!checkUser) {
        return res.status(400).json({ message: "user not found" });
    }
    let statusCheck = checkUser.role === "admin" ? "Approved" : "Not Approved";

    let img_url;
    if (req.file) {
        const upload = await cloudinary.uploader.upload(req.file.path);
        img_url = upload.secure_url;
    }

    const newSchool = await School.create({
        name, email, number, image: img_url, city, address, detail, category, fpNumber, userId, status: statusCheck
    });

    res.json(newSchool);
}));

// {Get schools}
router.get("/getAllSchools", errorHandling(async (req, res) => {
    const allSchools = await School.find();
    res.json(allSchools);
}));

// {Get by id}
router.get("/getschool/:id", errorHandling(async (req, res) => {
    const schoolId = await School.findById(req.params.id);
    if (!schoolId) {
        res.status(400).json({ message: "school not exists" });
    }
    res.json(schoolId);
}));

// {Get by name}
router.get("/getschol/:name", errorHandling(async (req, res) => {
    const schoolName = await School.findOne({ name: req.params.name });
    if (!schoolName) {
        return res.status(400).json({ message: "school not exists" });
    }
    res.json(schoolName);
}));

// {Accept}
router.put("/acceptSchool/:id", errorHandling(async (req, res) => {
    const AcceptedSchool = await School.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true });
    if (!AcceptedSchool) {
        return res.status(400).json({ message: "School not found" });
    }
    res.json({ message: "School status updated to approved", AcceptedSchool });
}));

// {Reject}
router.put("/rejectSchool/:id", errorHandling(async (req, res) => {
    const RejectSchool = await School.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true });
    if (!RejectSchool) {
        return res.status(400).json({ message: "School not found" });
    }
    res.json({ message: "School approval request rejected", RejectSchool });
}));

// {Update}
router.put("/updateschool/:id", upload.single("image"), errorHandling(async (req, res) => {
    const { name, number, city, address, detail, category, fpNumber } = req.body;

    const updatedSchool = {};
    if (name) updatedSchool.name = name;
    if (number) updatedSchool.number = number;
    if (city) updatedSchool.city = city;
    if (address) updatedSchool.address = address;
    if (detail) updatedSchool.detail = detail;
    if (category) updatedSchool.category = category;
    if (fpNumber) updatedSchool.fpNumber = fpNumber;

    if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        updatedSchool.image = uploadResult.secure_url;
    }

    let schoolId = await School.findById(req.params.id);
    if (!schoolId) {
        return res.status(400).json({ message: "school not exists" });
    }

    schoolId = await School.findByIdAndUpdate(req.params.id, { $set: updatedSchool }, { new: true });
    res.json(schoolId);
}));

// {Delete}
router.delete("/deleteschool/:id", errorHandling(async (req, res) => {
    const schoolId = await School.findByIdAndDelete(req.params.id);
    if (!schoolId) {
        res.status(400).json({ message: "school not exists" });
    }
    res.json({ message: "school deleted successfully" });
}));

// {count}
router.get("/countschool", async (req, res) => {
    try {
        const countSchool = await School.countDocuments()
        res.json({ count: countSchool })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})

export default router;
