import { Router } from "express";

import {addOffer, getAllOffer} from "../controllers/offer.js"

const router = Router()

const path = '/offer'

router.post(`${path}/insert`, addOffer)

router.get(`${path}/all`, getAllOffer)


export default router