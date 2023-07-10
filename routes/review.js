import { Router } from 'express'


import {
    addReview,
    getAllReview,
    getReviewById,
    getOneReviewByhotelId ,
    getRating,
    updateReviews,
    deleteReviews
  } from "../controllers/review.js";

const router = Router()

const path = '/review'


router.post(`${path}/insert`, addReview);
router.get(path, getAllReview);
router.get(`${path}/:id`, getReviewById);
router.get(`${path}/getReview/:hotelId`, getOneReviewByhotelId);
router.get(`${path}/getRating/:productId`, getRating);
router.put(`${path}/:id`, updateReviews);
router.delete(`${path}/:id`, deleteReviews);
export default router
