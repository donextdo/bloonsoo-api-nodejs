import { Router } from 'express'

import multer from 'multer'
import storage from '../middleware/multerStorage.js'

import { createHotel, setCoverPhoto, getAllHotels, addFacilities, addPolicies, finalize } from '../controllers/hotel.js'

const uploadOptions = multer({storage: storage})

const router = Router()

router.get('/', getAllHotels)

router.post('/create', createHotel)

router.patch('/facilities/:id', addFacilities)

router.patch('/coverphoto/:id', uploadOptions.single('cover_img'), setCoverPhoto)

router.patch('/policies/:id', addPolicies)

router.patch('/finalize/:id', finalize)

export default router