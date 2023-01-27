import { Router } from 'express'

import multer from 'multer'
import storage from '../middleware/multerStorage.js'

import { 
    createHotel, 
    setCoverPhoto, 
    addGalleryPhotos, 
    getAllHotels, 
    addFacilities, 
    addPolicies, 
    finalize, 
    getHotelById,
    deleteHotel, 
    approveHotel,
    publishHotel,
    unPublishHotel,
    getHotels,
    getMyHotels
} from '../controllers/hotel.js'

import { 
    AuthenticatedMiddleware, 
    AuthenticatedAdminMiddleware, 
    AuthenticatedHotelAdminMiddleware 
} from '../middleware/authenticated.js'

const uploadOptions = multer({storage: storage})

const router = Router()

router.get('/', getAllHotels)

router.get('/:id', getHotelById)

router.post('/create', AuthenticatedMiddleware, createHotel)

router.patch('/facilities/:id', AuthenticatedMiddleware, addFacilities)

router.patch('/coverphoto/:id', AuthenticatedMiddleware, uploadOptions.single('cover_img'), setCoverPhoto)

router.patch('/gallery/:id', AuthenticatedMiddleware, uploadOptions.single('gallery_img'), addGalleryPhotos)

router.patch('/policies/:id', AuthenticatedMiddleware, addPolicies)

router.patch('/finalize/:id', AuthenticatedMiddleware, finalize)

router.patch('/approve/:id', AuthenticatedAdminMiddleware, approveHotel)

router.delete('/:id', AuthenticatedAdminMiddleware, deleteHotel)

router.patch('/publish/:id', AuthenticatedHotelAdminMiddleware, publishHotel)

router.patch('/unpublish/:id', AuthenticatedHotelAdminMiddleware, unPublishHotel)

router.get('/get/all', AuthenticatedAdminMiddleware, getHotels)

router.get('/get/my', AuthenticatedMiddleware, getMyHotels)

export default router