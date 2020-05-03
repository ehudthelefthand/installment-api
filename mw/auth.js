const Token = require("../token");
const User = require("../models/user");

const requiredAdmin = async (req, res, next) => {
  const claims = validateReq(req);
  if (claims.role !== "admin" || claims.type !== "access") {
    return res.sendStatus(401);
  }
  try {
    const user = await User.findById(claims.userID).exec();
    if (!user) {
      return res.sendStatus(401);
    }
    req.User = user;
    next();
  } catch (e) {
    console.error(e);
    return res.sendStatus(401);
  }
};

const requiredStaff = async (req, res, next) => {
  const claims = validateReq(req);
  if (claims.role !== "staff" || claims.type !== "access") {
    return res.sendStatus(401);
  }
  try {
    const user = await User.findById(claims.userID).exec();
    if (!user) {
      return res.sendStatus(401);
    }
    req.User = user;
    next();
  } catch (e) {
    console.error(e);
    return res.sendStatus(401);
  }
};

const requiredUser = async (req, res, next) => {
  const claims = validateReq(req);
  if (claims.type !== "access") {
    return res.sendStatus(401);
  }
  try {
    const user = await User.findById(claims.userID).exec();
    if (!user) {
      return res.sendStatus(401);
    }
    req.User = user;
    next();
  } catch (e) {
    console.error(e);
    return res.sendStatus(401);
  }
};

const validateReq = (req) => {
  const tk = getToken(req);
  if (!tk) {
    return res.sendStatus(401);
  }
  const claims = Token.verifyToken(tk);
  if (!claims) {
    return res.sendStatus(401);
  }
  return claims;
};

const getToken = (req) => {
  const prefix = "Bearer ";
  const auth = req.headers["authorization"];
  if (auth && auth.startsWith(prefix)) {
    const tk = auth.substring(prefix.length);
    return tk;
  }
};

module.exports = {
  requiredAdmin,
  requiredStaff,
  requiredUser,
};
