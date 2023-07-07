const express = require("express");

const router = express.Router();

let subscribeController = require("../controllers/subscribe");

router.post("/insert", subscribeController.addSubscribe);
router.get("/getAll/", subscribeController.getAllCoupen);

module.exports = router;