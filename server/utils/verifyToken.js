const jwt = require("jsonwebtoken");

function getUserDataFromToken(req) {
  const { token } = req.signedCookies;
  if (!token) return null;
  const verifyToken = token.split(" ")[1];
  return jwt.verify(verifyToken, process.env.JWT_SECRET);
}

module.exports = { getUserDataFromToken };
