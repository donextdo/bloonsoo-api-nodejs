import { Router } from 'express'
import multer from 'multer'
import storage from '../middleware/multerStorage.js'

import {  createCheckout,getCheckouts,getCheckout,updateCheckout,deleteCheckout } from '../controllers/checkout'


const uploadOptions = multer({storage: storage})

const router = Router();

router.post('/checkout', createCheckout);

router.get('/checkouts', getCheckouts);

router.get('/checkout/:id', getCheckout);

router.patch('/checkout/:id', updateCheckout);

router.delete('/checkout/:id', deleteCheckout);

export default router;
