const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  if (user) {
    return res.status(201).json("created user");
  } else {
    return res.status(400).json("error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const passOk = await user.comparePassword(password);
    if (!passOk) {
      return res.status(401).json({ msg: "Error, invalid credentials" });
    } else {
      const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      });
      const oneDay = 1000 * 60 * 60 * 24;
      res.cookie("token", "Bearer " + token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
        signed: true,
        secret: process.env.COOKIE_SECRET,
        sameSite: "none",
      });
      const { email, name, _id } = user;
      return res.status(200).json({ email, name, _id });
    }
  } else {
    return res.status(401).json({ msg: "Error, invalid credentials" });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    secret: process.env.COOKIE_SECRET,
    sameSite: "none",
  });
  return res.status(200).json(true);
};

module.exports = {
  register,
  login,
  logout,
};
