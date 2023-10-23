import multer from 'multer';
import path from "path";

let storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
  }
});

const upload = multer({
  storage : storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== 'image/png'  
    && file.mimetype !== 'image/gif' 
    && file.mimetype !== 'image/jpeg') {
        return cb('This file type is not supported', false);
    } else {
        cb(null, true);
    }
  },
});

export default upload;