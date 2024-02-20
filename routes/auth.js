const express = require("express")
const router = express.Router()
const signUp = require("../Schema/Signup")
const Course = require("../Schema/Course")
const Teacher = require("../Schema/Teacher")
const School = require("../Schema/School")
const Enroll = require("../Schema/Enrollment")
const Video = require("../Schema/Video")
const bcrypt = require("bcrypt")
const Signup = require("../Schema/Signup")
const Category = require("../Schema/Category")
const multer = require("multer");
const cloudinary = require("../Cloudinary");
// img storage path
const imgconfig = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
});

// img filter
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true)
    } else {
        callback(new Error("only images is allow"))
    }
}

const upload = multer({
    storage: imgconfig,
    fileFilter: isImage
})


const videoConfig = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, `video-${Date.now()}.${file.originalname}`);
    }
});

// Video filter
const isVideo = (req, file, callback) => {
    if (file.mimetype.startsWith("video")) {
        callback(null, true);
    } else {
        callback(new Error("Only videos are allowed"));
    }
};

const videoUpload = multer({
    storage: videoConfig,
    fileFilter: isVideo
});

// Api for adding user
router.post("/adduser", async (req, res) => {
    try {

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

        const hashPassword = await bcrypt.hash(password, 10)

        const newUserr = await signUp.create({
            name,
            email,
            password: hashPassword,
            role,
            number
        })

        res.json(newUserr)

    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

// Api for signup
router.post("/signup", async (req, res) => {
    try {
        const { email, password, confirmPassword, name, role, number, institute } = req.body;
        // check email
        const checkEmail = await signUp.findOne({ email })
        if (checkEmail) {
            return res.status(400).json({ message: "user with this email already exists" })
        }
        // confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match" })
        }
        // hash password
        const hashPasword = await bcrypt.hash(password, 10)
        // create new user
        const newSignUser = await signUp.create({
            name,
            email,
            password: hashPasword,
            role,
            number,
            institute
        })


        res.status(200).json(newSignUser);
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occred")
    }

})

// create default user
const defaultUser = async () => {
    try {
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
                name: defaultName,
                email: defaultEmail,
                password: hashPassword,
                role: "admin"
            });

            console.log("Default user created:", defaultUser);
        }
    } catch (error) {
        console.log(error)
        console.log("Erorr occured during creating default user")
    }
}

defaultUser()

//  api for login user
router.post("/signin", async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

// get all users
router.get("/allusers", async (req, res) => {
    try {
        const allusers = await signUp.find()
        res.json(allusers)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

// get user throgh id
router.get("/getuser/:id", async (req, res) => {
    try {
        const userId = await signUp.findById(req.params.id)
        if (!userId) {
            res.status(400).json({ message: "user not exists" })
        }
        res.json(userId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// update user through id
router.put("/updateUser/:id", async (req, res) => {
    try {
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
        if (name) {
            newUser.name = name
        }
        if (role) {
            newUser.role = role
        }
        if (number) {
            newUser.number = number
        }

        const updateUser = await signUp.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true })
        res.json(updateUser)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// delete user throgh id
router.delete("/deleteuser/:id", async (req, res) => {
    try {
        const userId = await signUp.findByIdAndDelete(req.params.id)
        if (!userId) {
            res.status(400).json({ message: "user not exists" })
        }
        res.json({ message: "user deleted successfully" })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// get user throgh id
router.get("/getuser/:id", async (req, res) => {
    try {
        const userId = await signUp.findById(req.params.id)
        if (!userId) {
            res.status(400).json({ message: "user not exists" })
        }
        res.json(userId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// count user
router.get("/countuser", async (req, res) => {
    try {
        const countUser = await signUp.countDocuments()
        res.json({ count: countUser })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})

// add category
router.post("/addcategory", async (req, res) => {
    try {
        const { category } = req.body;
        const previousCategory = await Category.find()
        const categories = previousCategory.map((data) => {
            return data.category.toLowerCase()
        })
        if (categories.includes(category.toLowerCase())) {
            return res.status(400).json({ message: "This category already added" })
        }
        const newCategory = await Category.create({
            category
        });

        res.status(200).json(newCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occurred");
    }
});
// get all categories
router.get("/getcategory", async (req, res) => {
    try {
        const allCategories = await Category.find();

        res.json(allCategories);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occurred");
    }
});
// del all categories
router.delete("/delcategory/:id", async (req, res) => {
    try {
        const allCategories = await Category.findByIdAndDelete(req.params.id);
        if (!allCategories) {
            res.status(400).json({ message: "category not exists" })
        }
        res.json({ message: "successfully deleted categories" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occurred");
    }
});
//  get only category
router.get("/getOnlyCategory", async (req, res) => {
    try {
        const allCategory = await Category.find({}, "category")
        res.send(allCategory)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occurred");
    }
})

// add course
router.post("/addcourse", upload.single("image"), async (req, res) => {
    try {
        const { title, duration, level, description, categoryId, learning, content, userId } = req.body;
        const checkCategory = await Category.findById(categoryId)
        if (!checkCategory) {
            return res.status(400).json({ message: "category is not present" })
        }
        const CourseData = await Course.find({})
        const CourseTitle = CourseData.map((data) => {
            return data.title
        })

        if (CourseTitle.includes(title)) {
            return res.status(400).json({ message: "Course with this title already exists" })
        }

        let img_url;
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path);
            img_url = upload.secure_url
        }

        const newCourse = await Course.create({
            title,
            duration,
            level,
            description,
            image: img_url,
            categoryId,
            learning,
            content,
            userId,
        });

        res.json(newCourse);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occurred");
    }
});
// get all courses
router.get("/getAllCourses", async (req, res) => {
    try {
        const allCourses = await Course.find()
        const Catagory = allCourses.map((data) => {
            const cat = data.categoryId.toString()
            const allCat = Category.findById(cat, "category")
            return allCat;
        })
        const onlyCategory = await Promise.all(Catagory)
        res.status(200).json({ allCourses, onlyCategory });
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// check course throgh id
router.get("/checkCourse/:id", async (req, res) => {
    try {
        const courseId = await Course.find({ userId: req.params.id })
        if (!courseId) {
            res.status(400).json({ message: "course not exists" })
        }
        const categoryId = courseId.map((id) => {
            return id.categoryId.toString()
        })
        const categoryy = await Category.find({ _id: categoryId })
        res.json({ courseId, categoryy })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// get course throgh id
router.get("/getcourse/:id", async (req, res) => {
    try {
        const courseId = await Course.findById(req.params.id)
        if (!courseId) {
            res.status(400).json({ message: "course not exists" })
        }
        const categoryId = courseId.categoryId.toString()
        const categoryy = await Category.findById(categoryId)
        res.json({ courseId, categoryy })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// get course throgh title
router.get("/getcorse/:title", async (req, res) => {
    try {
        const courseTitle = await Course.findOne({ title: req.params.title })

        if (!courseTitle) {
            res.status(400).json({ message: "course not exists" })
        }
        const courseId = courseTitle.categoryId.toString()
        const categoryy = await Category.findById(courseId)
        res.json({ courseTitle, categoryy })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// update course throgh id
router.put("/updatecourse/:id", upload.single("image"), async (req, res) => {
    try {
        const { title, duration, level, description, categoryId, learning, content } = req.body

        const newCourse = ({})
        if (title) {
            newCourse.title = title
        }
        if (duration) {
            newCourse.duration = duration
        }
        if (level) {
            newCourse.level = level
        }
        if (description) {
            newCourse.description = description
        }
        if (categoryId) {
            newCourse.categoryId = categoryId
        }
        if (learning) {
            newCourse.learning = learning
        }
        if (content) {
            newCourse.content = content
        }

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            newCourse.image = uploadResult.secure_url;
        }

        let courseId = await Course.findById(req.params.id)
        if (!courseId) {
            res.status(400).json({ message: "course not exists" })
        }

        courseId = await Course.findByIdAndUpdate(req.params.id, { $set: newCourse }, { new: true })
        res.json(courseId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// delete course throgh id
router.delete("/deletecourse/:id", async (req, res) => {
    try {
        const courseId = await Course.findByIdAndDelete(req.params.id)
        if (!courseId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json({ message: "course deleted successfully" })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// count course
router.get("/countcourse", async (req, res) => {
    try {
        const countCourse = await Course.countDocuments()
        res.json({ count: countCourse })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})

// add teacher
router.post("/addteacher", upload.single("image"), async (req, res) => {
    try {
        const { name, email, number, qualification, experience, description, website, userId, youtube, twitterUrl, fbUrl, instaUrl } = req.body

        const checkTeacherEmail = await Teacher.findOne({ email })
        if (checkTeacherEmail) {
            return res.status(400).json({ message: "Instructor with this email already exists" })
        }

        const checkUser = await signUp.findById(userId)
        if (!checkUser) {
            return res.status(400).json({ message: "user not found" })
        }
        let statusCheck;
        if (checkUser.role === "admin") {
            statusCheck = "Approved"
        } else {
            statusCheck = "Not Approved"
        }

        let img_url;
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path);
            img_url = upload.secure_url
        }

        const newTeacher = await Teacher.create({
            name,
            email,
            number,
            qualification,
            experience,
            description,
            userId,
            image: img_url,
            status: statusCheck,
            website,
            youtube,
            instaUrl,
            fbUrl,
            twitterUrl
        })
        res.json(newTeacher)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get all techers
router.get("/getAllTeachers", async (req, res) => {
    try {
        const allTeachers = await Teacher.find()
        res.json(allTeachers)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get teacher throgh id
router.get("/getteacher/:id", async (req, res) => {
    try {
        const teacherId = await Teacher.findById(req.params.id)
        if (!teacherId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json(teacherId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// compare teacher throgh id
router.get("/checkteacher/:id", async (req, res) => {
    try {
        const TeacherId = await Teacher.find({ userId: req.params.id })
        if (!TeacherId) {
            return res.status(400).json({ message: "not find any teacher against this id" })
        }
        res.json(TeacherId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// update teacher status throgh id
router.put("/acceptTeacher/:id", async (req, res) => {
    try {
        const AcceptedTeacher = await Teacher.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true })

        if (!AcceptedTeacher) {
            return res.status(400).json({ message: "School not found" })
        }
        res.json({ message: "Teacher status updated to approve", AcceptedTeacher })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// reject teacher status throgh id
router.put("/rejectTeacher/:id", async (req, res) => {
    try {
        const RejectTeacher = await Teacher.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true })

        if (!RejectTeacher) {
            return res.status(400).json({ message: "School not found" })
        }
        res.json({ message: "Teacher request rejected", RejectTeacher })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// update teacher throgh id
router.put("/updateteacher/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, number, qualification, experience, description, website, youtube, instaUrl,
            fbUrl, twitterUrl } = req.body

        const newTeacher = ({})
        if (name) {
            newTeacher.name = name
        }
        if (number) {
            newTeacher.number = number
        }
        if (qualification) {
            newTeacher.qualification = qualification
        }
        if (experience) {
            newTeacher.experience = experience
        }
        if (description) {
            newTeacher.description = description
        }
        if (website) {
            newTeacher.website = website
        }
        if (youtube) {
            newTeacher.youtube = youtube
        }
        if (instaUrl) {
            newTeacher.instaUrl = instaUrl
        }
        if (fbUrl) {
            newTeacher.fbUrl = fbUrl
        }
        if (twitterUrl) {
            newTeacher.twitterUrl = twitterUrl
        }

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
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// delete teacher throgh id
router.delete("/deleteteacher/:id", async (req, res) => {
    try {
        const teacherId = await Teacher.findByIdAndDelete(req.params.id)
        if (!teacherId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json({ message: "course deleted successfully" })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// count teacher
router.get("/countteacher", async (req, res) => {
    try {
        const countTeacher = await Teacher.countDocuments()
        res.json({ count: countTeacher })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})

// add school
router.post("/addschool", upload.single("image"), async (req, res) => {
    try {
        const { name, email, number, city, address, detail, category, fpNumber, userId } = req.body

        const checkSchoolEmail = await School.findOne({ email })
        if (checkSchoolEmail) {
            return res.status(400).json({ message: "School with this email already exists" })
        }
        const checkSchoolNumber = await School.findOne({ number })
        if (checkSchoolNumber) {
            return res.status(400).json({ message: "This number already exist" })
        }
        const checkSchoolFpNumber = await School.findOne({ fpNumber })
        if (checkSchoolFpNumber) {
            return res.status(400).json({ message: "Focal Person number already exist" })
        }

        const checkUser = await signUp.findById(userId)
        if (!checkUser) {
            return res.status(400).json({ message: "user not found" })
        }
        let statusCheck;
        if (checkUser.role === "admin") {
            statusCheck = "Approved"
        } else {
            statusCheck = "Not Approved"
        }

        const checkName = await School.find()
        const CheckSchoolName = checkName.map((data) => {
            return data.name
        })
        if (CheckSchoolName.includes(name)) {
            return res.status(400).json({ message: "Scholl already regitered with this name" })
        }

        let img_url;
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path);
            img_url = upload.secure_url
        }

        const newSchool = await School.create({
            name,
            email,
            number,
            image: img_url,
            city,
            address,
            detail,
            category,
            fpNumber,
            userId,
            status: statusCheck
        })

        res.json(newSchool)

    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get all schools
router.get("/getAllSchools", async (req, res) => {
    try {
        const allSchools = await School.find()
        res.json(allSchools)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get school throgh id
router.get("/getschool/:id", async (req, res) => {
    try {
        const schoolId = await School.findById(req.params.id)
        if (!schoolId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json(schoolId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// get school throgh name
router.get("/getschol/:name", async (req, res) => {
    try {
        const schoolName = await School.findOne({ name: req.params.name })
        if (!schoolName) {
            return res.status(400).json({ message: "school not exists" })
        }
        res.json(schoolName)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// Accepted request for school
router.put("/acceptSchool/:id", async (req, res) => {
    try {
        const AcceptedSchool = await School.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true })

        if (!AcceptedSchool) {
            return res.status(400).json({ message: "School not found" })
        }
        res.json({ message: "School status uddated to approve", AcceptedSchool })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// reject request for school
router.put("/rejectSchool/:id", async (req, res) => {
    try {
        const RejectSchool = await School.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true })

        if (!RejectSchool) {
            return res.status(400).json({ message: "School not found" })
        }
        res.json({ message: "School approval request rejected", RejectSchool })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// update course throgh id
router.put("/updateschool/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, number, city, address, detail, category, fpNumber } = req.body

        const newSchool = ({})
        if (name) {
            newSchool.name = name
        }
        if (number) {
            newSchool.number = number
        }
        if (city) {
            newSchool.city = city
        }
        if (address) {
            newSchool.address = address
        }
        if (detail) {
            newSchool.detail = detail
        }
        if (category) {
            newSchool.category = category
        }
        if (fpNumber) {
            newSchool.fpNumber = fpNumber
        }

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            newSchool.image = uploadResult.secure_url;
        }

        let schoolId = await School.findById(req.params.id)
        if (!schoolId) {
            return res.status(400).json({ message: "school not exists" })
        }

        schoolId = await School.findByIdAndUpdate(req.params.id, { $set: newSchool }, { new: true })
        res.json(schoolId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// delete teacher throgh id
router.delete("/deleteschool/:id", async (req, res) => {
    try {
        const schoolId = await School.findByIdAndDelete(req.params.id)
        if (!schoolId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json({ message: "course deleted successfully" })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// count teacher
router.get("/countschool", async (req, res) => {
    try {
        const countSchool = await School.countDocuments()
        res.json({ count: countSchool })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})

// name  and title 
router.get("/nametitle/:id", async (req, res) => {
    try {
        const signUpName = await signUp.findById(req.params.id, "name role")
        const titleCourse = await Course.find({}, "title")
        res.json({ signUpName, titleCourse })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// Enroll courses 
router.post('/enrollments', async (req, res) => {
    try {
        const { courseId, studentId, description } = req.body
        const studentExists = await signUp.findById(studentId)
        const courseExists = await Course.findById(courseId)
        if (!studentExists || !courseExists) {
            return res.status(400).json({ error: "Student or Course not found" })
        }
        const newEnroll = await Enroll.create({
            courseId,
            studentId,
            description,
            status: "A"
        })
        res.json(newEnroll)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/enrlRequests", async (req, res) => {
    try {
      const requests = await Enroll.find()
        .populate('studentId', 'name')
        .populate('courseId', 'title');
  
      res.json( requests );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.put("/acceptStatus/:id", async (req, res) => {
    try {
        const AcceptStatus = await Enroll.findByIdAndUpdate(req.params.id, { status: "Y" }, { new: true })
        if (!AcceptStatus) {
            return res.status(404).json({ error: "Enrollment not found" });
        }
        res.json({ message: "Enrollment status updated to 'y' (Accepted)", AcceptStatus });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
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
    try {
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
                return { course };
            }
        }))
        res.json(enrollStatus)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Add pdf books
router.post("/addVideo", videoUpload.single("video"), async (req, res) => {
    try {
        const { userId, title, name } = req.body;

        const uniqueTitle = await Video.findOne({ title });
        if (uniqueTitle) {
            return res.status(400).json({ message: "Video with this title already exists" });
        }

        let videoUrl;
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" });
            videoUrl = upload.secure_url;
        }

        const video = await Video.create({
            name,
            title,
            userId,
            video: videoUrl,
        });

        res.json(video);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/getVideo", async (req, res) => {
    try {
        const videoLectures = await Video.find()
        res.json(videoLectures)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.get("/getVideo/:id", async (req, res) => {
    try {
        const videoLectures = await Video.findById(req.params.id)
        if(!videoLectures){
            return res.status(400).json({message:"Not found any video"})
        }
        res.json(videoLectures)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
router.put("/updateVideo/:id", videoUpload.single("video"), async (req, res) => {
    try {
        const {title} = req.body
        const checkVideo = await Video.findById(req.params.id)
        if(!checkVideo){
            return res.status(400).json({message:"Video not found"})
        }

        let newVideo = {}
        if(title){
            newVideo.title = title
        }

        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" });
            newVideo.video = upload.secure_url;
        }

        const updateVideo = await Video.findByIdAndUpdate(req.params.id, {$set: newVideo}, {new: true})
        res.json(updateVideo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


  
module.exports = router;

