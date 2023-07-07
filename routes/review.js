import { Router } from 'express'
import reviewController from '../controllers/review.js'


const router = Router()

const path = '/review'

let reviewController = require("../controllers/review");

router.post(`${path}/insert`, reviewController.addReview);
router.get("/", reviewController.getAllReview);
router.get("/:id", reviewController.getReviewById);
router.get("/getReview/:productId", reviewController.getOneReviewByProductId);
router.get("/getRating/:productId", reviewController.getRating);
router.put("/:id", reviewController.updateReviews);
router.delete("/:id", reviewController.deleteReviews);
export default router
