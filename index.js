import express from 'express'
import cors from "cors"
import connectToMongo from "./db.js"
import userRoutes from "./routes/UserRoutes.js"
import courseRoutes from "./routes/CourseRoutes.js"
import categoryRoutes from "./routes/CategoryRoutes.js"
import teacherRoutes from "./routes/InstructorRoutes.js"
import schoolRoutes from "./routes/SchollRoutes.js"
import enrollRoutes from "./routes/EnrollmentCourseRoutes.js"
import videoRoutes from "./routes/VideoRoutes.js"
import lessonRoutes from "./routes/LessonsRoutes.js"
import taskRoutes from './routes/TasksRoutes.js'
import submitTaskRoutes from './routes/SubmitTaskRoutes.js'
import resultRoutes from './routes/ResultRoutes.js'
import configCertiRouter from './routes/ConfigureCertificateRoutes.js'

connectToMongo()
const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/user', userRoutes)
app.use('/api/course', courseRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/teacher', teacherRoutes)
app.use('/api/school', schoolRoutes)
app.use('/api/enrollCourse', enrollRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/lesson', lessonRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/submit', submitTaskRoutes)
app.use('/api/result', resultRoutes)
app.use('/api/configCerti', configCertiRouter)

app.listen(8000, () => {
    console.log('App listing at http://localhost:8000')
})

