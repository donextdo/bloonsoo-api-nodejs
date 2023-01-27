import { Router } from 'express'
import userController from '../controllers/user.js'
import multer from 'multer'
import { profileStorage } from '../middleware/multerStorage.js'
import { AuthenticatedMiddleware, AuthenticatedUserMiddleware } from '../middleware/authenticated.js'

const router = Router()
const uploadOptions = multer({storage: profileStorage})


router.patch('/:id', AuthenticatedUserMiddleware, userController.updateUser)

router.patch(
    '/profilepic/:id', 
    AuthenticatedUserMiddleware, 
    uploadOptions.single('profilePic'),
    userController.setProfilePic
)

export default router