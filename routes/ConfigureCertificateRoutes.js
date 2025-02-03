import express from "express"
import errorHandling from "../MidleWares/ErrorHandling.js"
import ConfigCertificate from "../Schema/ConfigCertificate.js"
const router = express.Router()

router.post("/confCertificate", errorHandling(async (req, res) => {
    const { courseId, description, configureDate } = req.body

    if (!courseId || !description) return res.status(400).json({ message: "Fields with * should be filled" })
    const checkCerti = await ConfigCertificate.findOne({ courseId })
    if (checkCerti) return res.status(409).json({ message: "Course certificate already submit" })

    const configCer = await ConfigCertificate.create({
        courseId,
        description,
        configureDate
    })
    res.json(configCer)
}))

router.get("/getConfCerti", errorHandling(async (req, res) => {
    const getConfigCer = await ConfigCertificate.find().populate("courseId")
    if (!getConfigCer) return res.status(400).json({ message: "Configure certificate not found" })
    res.json(getConfigCer)
}))

router.get("/getConfCertiById/:id", errorHandling(async (req, res) => {
    const getConfigCer = await ConfigCertificate.findById(req.params.id).populate("courseId")
    if (!getConfigCer) return res.status(400).json({ message: "Configure certificate not found" })
    res.json(getConfigCer)
}))

router.put("/updateConfCerti/:id", errorHandling(async (req, res) => {
    const { description, configureDate } = req.body
    const newCertiData = {}
    if (description) {
        newCertiData.description = description
    }
    if (configureDate) {
        newCertiData.configureDate = configureDate
    }
    const updatedConfigCerti = await ConfigCertificate.findByIdAndUpdate(req.params.id, { $set: newCertiData }, { new: true })
    if (!updatedConfigCerti) return res.status(400).json({ message: "Configure certificate not found" })
    res.json(updatedConfigCerti)
}))

router.delete("/delConfCerti/:id", errorHandling(async (req, res) => {
    const delConfigCerti = await ConfigCertificate.findByIdAndDelete(req.params.id)
    if (!delConfigCerti) return res.status(400).json({ message: "Configure certificate not found" })
    res.json({ message: "Configure Certificate deleted successfully" })
}))

export default router;