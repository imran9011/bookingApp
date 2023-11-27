const Booking = require("../models/Booking");
const User = require("../models/User");
const { getUserDataFromToken } = require("../utils/verifyToken");

const getUserProfile = async (req, res) => {
  const userData = getUserDataFromToken(req);
  if (!userData) {
    return res.status(401).json(null);
  }
  const { name, email, _id } = await User.findById(userData.id);
  return res.status(200).json({ name, email, _id });
};

const bookAccomodation = async (req, res) => {
  const userData = getUserDataFromToken(req);
  if (!userData) {
    return res.json("Error invalid credentials");
  }
  const { place, checkIn, checkOut, numberOfGuests, name, mobile, price } = req.body;
  const book = await Booking.create({ place, checkIn, checkOut, numberOfGuests, name, mobile, price, user: userData.id });
  res.status(201).json(book);
};

const getUserBookings = async (req, res) => {
  const userData = getUserDataFromToken(req);
  if (!userData) {
    return res.status(401).json("Error invalid credentials");
  }
  const bookings = await Booking.find({ user: userData.id }).populate("place").sort({ createdAt: -1 });
  res.status(200).json(bookings);
};

module.exports = {
  getUserProfile,
  bookAccomodation,
  getUserBookings,
};
