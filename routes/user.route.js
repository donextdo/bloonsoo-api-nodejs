import { Router } from 'express'
import userController from '../controllers/user.js'
import multer from 'multer'
import { profileStorage } from '../middleware/multerStorage.js'
import { AuthenticatedMiddleware, AuthenticatedAdminMiddleware, AuthenticatedHotelAdminMiddleware, AuthenticatedUserMiddleware } from '../middleware/authenticated.js'

const router = Router()
const uploadOptions = multer({storage: profileStorage})

const path = '/user'

router.patch(`${path}/:id`,
AuthenticatedHotelAdminMiddleware,
  userController.updateUser)

router.get(
    `${path}/get-all-users`,
    AuthenticatedAdminMiddleware ,
    userController.getAllUsers
)

router.get(
    `${path}/:id`,
    AuthenticatedUserMiddleware ,
    userController.getOneUser
)

router.patch(
    `${path}/profilepic/:id`, 
    AuthenticatedUserMiddleware, 
    uploadOptions.single('profilePic'),
    userController.setProfilePic
)

router.post(
    `${path}/create-hotel-admin`,
    AuthenticatedAdminMiddleware,
    userController.addHotelAdmin
)

router.get(
    `${path}/active-users`,
    AuthenticatedHotelAdminMiddleware ,
    userController.totalUsers
)

router.get(
    `${path}/active-users/count`,
    AuthenticatedHotelAdminMiddleware ,
    userController.activeUserCount
)



router.post(
    `${path}/search-user`,
    AuthenticatedAdminMiddleware ,
    userController.searchUser
)

router.patch(
    `${path}/hotels/assign-hotels`,
    AuthenticatedAdminMiddleware,
    userController.assignHotels
)

router.post(
    `${path}/wishList/:id`,
    // AuthenticatedAdminMiddleware ,
    userController.addWishList
)

router.delete(
    `${path}/:id/wishList/:hotelId`,
    // AuthenticatedAdminMiddleware ,
    userController.deleteFromWishList
)

router.patch(
    `${path}/user-admin/:id`,
    AuthenticatedAdminMiddleware,
    userController.setAdminUser
)

router.patch(
    `${path}/user-hotel-admin/:id`,
    AuthenticatedAdminMiddleware,
    userController.setHotelAdminUser
)

router.patch(
    `${path}/activeUser/:id`,
    AuthenticatedHotelAdminMiddleware,
    userController.activeUser
)

router.patch(
    `${path}/inactiveUser/:id`,
    AuthenticatedHotelAdminMiddleware,
    userController.inactiveUser
)

router.delete(
    `${path}/deleteUser/:id`,
    AuthenticatedHotelAdminMiddleware,
    userController.deleteUser
)

export default router