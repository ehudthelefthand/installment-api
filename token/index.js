const jwt = require("jsonwebtoken");

// In real world product, the key should be injected via configuration or enviroment variable
const key = "secret";

const generateToken = ({ userID, role, type }, exp) => {
  const claims = { userID, role, type };
  const options = {};
  if (exp) {
    options.expiresIn = exp;
  }
  return jwt.sign(claims, key, options);
};

const generateRefreshToken = ({ userID, role }) => {
  return generateToken({ userID, role, type: "refresh" });
};

const generateAccessToken = ({ userID, role }) => {
  return generateToken({ userID, role, type: "access" }, 60 * 5); // 300s = 5 mins
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, key);
  } catch (e) {
    console.error(e);
    return;
  }
};

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  verifyToken,
};
