const token = require("../token");
const userDB = require("../db/user");

const getToken = (req) => {
  const prefix = "Bearer ";
  const auth = req.headers["authorization"];
  if (auth && auth.startsWith(prefix)) {
    const tk = auth.substring(prefix.length);
    return tk;
  }
};

const requiredAdmin = async (req, res, next) => {
  const tk = getToken(req);
  if (!tk) {
    return res.sendStatus(401);
  }
  const claims = token.verifyToken(tk);
  if (!claims) {
    return res.sendStatus(401);
  }
  if (claims.role !== "admin" && claims.type !== "access") {
    return res.sendStatus(401);
  }

  try {
    const user = await userDB.getByID(claims.user_id);
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

const requiredUser = (req, res, next) => {
  const tk = getToken(req);
  if (!tk) {
    return res.sendStatus(401);
  }
  const claims = token.verifyToken(tk);
  if (!claims) {
    return res.sendStatus(401);
  }
  if (claims.type !== "access") {
    return res.sendStatus(401);
  }

  try {
    const user = await userDB.getByID(claims.user_id);
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

module.exports = {
  requiredAdmin,
  requiredUser,
};
