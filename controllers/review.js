const { request } = require("express");
const Review = require("../models/review");
const jwt = require("jsonwebtoken");
const User = require("../models/user");



const addReview = async (req, res) => {
  const hotelId = req.body.hotelId;
  const userId = req.body.userId;
  const name = req.body.name;
  const email = req.body.email;
  const rating = req.body.rating;
  const title = req.body.title;
  const body = req.body.body;
  const submittedDate = req.body.submittedDate;
  const verifiedPurchase = req.body.verifiedPurchase;
  const imagesOrVideos = req.body.imagesOrVideos;

  const reviewStatus = req.body.reviewStatus;
  const isHelpfulFeedback = req.body.isHelpfulFeedback;

  const review = new Review({
    hotelId,
    userId,
    name,
    email,
    rating,
    title,
    body,
    submittedDate,
    verifiedPurchase,
    imagesOrVideos,
    reviewStatus,
    isHelpfulFeedback,
  });
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userEmail = decodedToken.data;

    // Find the user based on the email
     let user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    let response = await review.save();
    if (response) {
      return res.status(201).send({ message: "New Review Inserted" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while saving review" });
  }
};

const getAllReview = async (req, res) => {
  try {
    let reviews = await Review.find();
    if (reviews) {
      return res.json(reviews);
    } else {
      return res
        .status(404)
        .send({ message: "Error occured when retrieving reviews" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getReviewById = async (req, res) => {
  const product = req.params.id;
  try {
    let response = await Review.findById(product);

    if (response) {
      return res.json(response);
    } else {
      return res.status(404).send({ message: "No such product found" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getOneReviewByProductId = async (req, res) => {
  const productId = req.params.productId;

  try {
    let review = await Review.find({
      productId: productId,
    });
    if (review) {
      return res.json(review);
    } else {
      return res.status(404).send({ message: "No such user found" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const getRating = async (req, res) => {
  const productId = req.params.productId;

  try {
    let review = await Review.find({
      productId: productId,
    });

    if (review.length > 0) {
      //   console.log("Rating:", review[0].rating); // add this line to log the rating
      return res.json(review[0].rating);
    } else {
      return res.status(404).send({ message: "No such review found" });
    }
  } catch (err) {
    console.error(err); // add this line to log the error
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const updateReviews = async (req, res) => {
  const reviewId = req.params.id;

  const reviews = await Review.findOne({ _id: reviewId });

  let reviewUpdate = {
    Id: reviewId,
    productId: reviews.productId,
    userId: reviews.userId,
    name: reviews.name,
    email: reviews.email,
    rating: req.body.rating,
    title: req.body.title,
    body: req.body.body,
    submittedDate: reviews.submittedDate,
    verifiedPurchase: req.body.verifiedPurchase,
    imagesOrVideos: req.body.imagesOrVideos,
    reviewStatus: req.body.reviewStatus,
    isHelpfulFeedback: req.body.isHelpfulFeedback,
  };
  try {
    const response = await Review.findOneAndUpdate(
      { _id: reviewId },
      reviewUpdate
    );
    if (response) {
      return res
        .status(200)
        .send({ message: "Successfully updated Reviewa Details" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Unable to update recheck riview ID" });
  }
};

const deleteReviews = async (req, res) => {
  const Id = req.params.id;
  try {
    const response = await Product.findByIdAndDelete({ _id: Id });
    if (response) {
      return res
        .status(204)
        .send({ message: "Successfully deleted a Reviews" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({ message: "Could not delete the request" });
  }
};

module.exports = {
  addReview,
  getAllReview,
  getReviewById,
  getOneReviewByProductId,
  getRating,
  updateReviews,
  deleteReviews,
};
