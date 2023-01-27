import multer from "multer"
import { v4 as uuidV4 } from 'uuid'

const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images')
    },

    filename: function(req, file, cb) {
        const filename = uuidV4()
        console.log(file.mimetype)
        const extention = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${filename}.${extention}`)
    }
})

export const profileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/profile')
    },

    filename: function(req, file, cb) {
        const filename = uuidV4()
        console.log(file.mimetype)
        const extention = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${filename}.${extention}`)
    }
})

export default storage