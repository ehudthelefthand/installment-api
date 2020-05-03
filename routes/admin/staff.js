const express = require("express");
const bcrypt = require("bcrypt");
const Token = require("../../token");
const User = require("../../models/user");
const cost = 12;

const ROLE = {
  ADMIN: "admin",
  STAFF: "staff",
};

const init = (app) => {
  const router = express.Router();
  app.use("/staffs", router);

  router.post("/", async (req, res, next) => {
    const { name, username, password } = req.body;
    try {
      const passwordHash = await bcrypt.hash(password, cost);
      const staff = new User({
        name,
        username,
        password: passwordHash,
        role: ROLE.STAFF,
      });
      await staff.save();
      const refreshToken = Token.generateRefreshToken({
        userID: staff._id,
        role: ROLE.STAFF,
      });
      staff.refreshToken = refreshToken;
      await staff.save();

      const accessToken = Token.generateAccessToken({
        userID: staff._id,
        role: ROLE.STAFF,
      });
      res.json({
        data: {
          name: staff.name,
          role: staff.role,
          refreshToken: staff.refreshToken,
          accessToken,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const staff = await User.findById(id).exec();
      res.json({
        data: {
          _id: staff._id,
          name: staff.name,
          role: staff.role,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/", async (req, res, next) => {
    try {
      const staffs = await User.find({ role: ROLE.STAFF }).exec();
      res.json({
        data: staffs.map(({ _id, name, role }) => ({ _id, name, role })),
      });
    } catch (e) {
      next(e);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    const staffID = req.params["id"];
    const { password } = req.body;
    try {
      await userDB.updatePassword({ id: staffID, password });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    const staffID = req.params["id"];
    try {
      await userDB.remove(staffID);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });
};

module.exports = {
  init,
};
