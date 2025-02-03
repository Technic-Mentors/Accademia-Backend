import multer from "multer"

const fileconfig = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, `file-${Date.now()}.${file.originalname}`)
    }
});

// img filter
const isFile = (req, file, callback) => {
    callback(null, true)
}

const upload = multer({
    storage: fileconfig,
    fileFilter: isFile
})
export default upload;