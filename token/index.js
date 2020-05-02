const jwt = require("jsonwebtoken");

// In real world product, the key should be injected via configuration or enviroment variable
const key = "secret";

const generateToken = ({ user_id, role, type }, exp) => {
  const claims = { user_id, role, type };
  const options = {};
  if (exp) {
    options.expiresIn = exp;
  }
  return jwt.sign(claims, key, options);
};

const generateRefreshToken = ({ user_id, role }) => {
  return generateToken({ user_id, role, type: "refresh" });
};

const generateAccessToken = ({ user_id, role }) => {
  return generateToken({ user_id, role, type: "access" }, "1h");
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
