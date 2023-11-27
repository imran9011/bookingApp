const express = require("express");
const router = express.Router();
const { getUserProfile, bookAccomodation, getUserBookings } = require("../controllers/userController.js");

router.get("/profile", getUserProfile);
router.get("/bookings", getUserBookings);
router.post("/booking", bookAccomodation);

module.exports = router;
