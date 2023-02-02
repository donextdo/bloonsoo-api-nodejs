import { Router } from 'express'

import {  createCheckout,getCheckouts,getCheckout,updateCheckout,deleteCheckout } from '../controllers/checkout.js'



const router = Router();

router.post('/checkout', createCheckout);

router.get('/checkouts', getCheckouts);

router.get('/checkout/:id', getCheckout);

router.patch('/checkout/:id', updateCheckout);

router.delete('/checkout/:id', deleteCheckout);

export default router;
