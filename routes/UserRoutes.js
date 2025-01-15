import express from "express"
import bcrypt from "bcrypt"
import signUp from "../Schema/Signup.js"
import errorHandling from "../MidleWares/ErrorHandling.js"
import upload from "../MidleWares/ImageFilter.js"
import cloudinary from "../Cloudinary.js"
const router = express.Router()

router.use((err, req, res, next) => {
    console.error(err.stack);
    next(err)
});

router.post("/adduser", upload.single("image"), errorHandling(async (req, res) => {
    const { email, password, role, confirmPassword, name, number } = req.body

    const checkUserr = await signUp.findOne({ email })
    if (checkUserr) {
        return res.status(400).json({ message: "user with this email already exists" })
    }
    const checkNumber = await signUp.findOne({ number })
    if (checkNumber) {
        return res.status(400).json({ message: "This number already exists" })
    }
    // confirm password
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password does not match" })
    }

    let img_url;
    if (req.file) {
        const uploadImage = await cloudinary.uploader.upload(req.file.path)
        img_url = uploadImage.secure_url
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUserr = await signUp.create({
        name,
        email,
        password: hashPassword,
        role,
        number,
        image: img_url
    })
    res.json(newUserr)
}))

// Api for signup
router.post("/signup", upload.single("image"), errorHandling(async (req, res) => {
    const { email, password, confirmPassword, name, role, number, institute } = req.body;

    const [checkEmail, checkNumber] = await Promise.all([
        signUp.findOne({ email }),
        signUp.findOne({ number })
    ])

    if (checkEmail) return res.status(400).json({ message: "user with this email already exists" })

    if (checkNumber) return res.status(400).json({ message: "This number already used" })

    if (password !== confirmPassword) return res.status(400).json({ message: "Password does not match" })

    const hashPasword = await bcrypt.hash(password, 10)
    let img_url;
    if (req.file) {
        const uploadImage = await cloudinary.uploader.upload(req.file.path)
        img_url = uploadImage.secure_url
    }

    const newSignUser = await signUp.create({
        name,
        email,
        password: hashPasword,
        role,
        number,
        institute,
        image: img_url
    })
    res.status(200).json(newSignUser);
}))

// create default user
const defaultUser = async () => {
    const defaultEmail = "mentorsacademia@gmail.com"
    const defaultName = "Mentors Admin"
    const defaultPassword = "Mentors@@345"

    const checkDefaultEmail = await signUp.findOne({ email: defaultEmail })

    if (checkDefaultEmail) {
        return;
    }

    if (!checkDefaultEmail) {
        const hashPassword = await bcrypt.hash(defaultPassword, 10);
        const defaultUser = await signUp.create({
            name: defaultName, email: defaultEmail, password: hashPassword, role: "admin"
        });
        console.log("Default user created:", defaultUser);
    }
}

defaultUser()

// {login}
router.post("/signin", errorHandling(async (req, res) => {
    const { email, password } = req.body
    const checkUser = await signUp.findOne({ email })
    if (!checkUser) {
        return res.status(400).json({ message: "user with this email not found" })
    }
    const checkPassword = await bcrypt.compare(password, checkUser.password)
    if (!checkPassword) {
        return res.status(400).json({ message: "user with this password not found" })
    }
    res.json(checkUser)
}))

//  {sigin with email}
router.get("/signin/:email", errorHandling(async (req, res) => {
    const checkUser = await signUp.findOne({ email: req.params.email })
    if (!checkUser) {
        return res.status(400).json({ message: "user with this email not found" })
    }
    res.json(checkUser)
}))

// {forgot password} 
router.put("/forgotPassword", errorHandling(async (req, res) => {
    const { email, password } = req.body
    const checkUser = await signUp.findOne({ email })
    if (!checkUser) {
        return res.status(400).json({ message: "Not found any user with this email" })
    }
    let newPassword = {}
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        newPassword.password = hashedPassword
    }
    const changePassword = await signUp.findByIdAndUpdate(checkUser.id, { $set: newPassword }, { new: true })
    res.json(changePassword)
}))

// {get users}
router.get("/allusers", errorHandling(async (req, res) => {
    const allusers = await signUp.find()
    res.json(allusers)
}))

// {get by id}
router.get("/getuser/:id", errorHandling(async (req, res) => {
    const userId = await signUp.findById(req.params.id)
    if (!userId) {
        res.status(400).json({ message: "user not exists" })
    }
    res.json(userId)
}))

// {update}
router.put("/updateUser/:id", upload.single("image"), errorHandling(async (req, res) => {
    const { password, name, role, number } = req.body;
    const checkUser = await signUp.findById(req.params.id)
    if (!checkUser) {
        return res.status(400).json({ message: "User not found" })
    }

    let newUser = {}
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        newUser.password = hashedPassword;
    }
    if (name) newUser.name = name
    if (role) newUser.role = role
    if (number) newUser.number = number
    if (req.file) {
        const uploadImage = await cloudinary.uploader.upload(req.file.path)
        newUser.image = uploadImage.secure_url
    }

    const updateUser = await signUp.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true })
    res.json(updateUser)
}))

// {delete}
router.delete("/deleteuser/:id", errorHandling(async (req, res) => {
    const userId = await signUp.findByIdAndDelete(req.params.id)
    if (!userId) {
        res.status(400).json({ message: "user not exists" })
    }
    res.json({ message: "user deleted successfully" })
}))

// {count}
router.get("/countuser", errorHandling(async (req, res) => {
    const countUser = await signUp.countDocuments()
    res.json({ count: countUser })
}))

export default router;