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
    const { name, username, password, isAdmin } = req.body;
    try {
      const passwordHash = await bcrypt.hash(password, cost);
      const staff = new User({
        name,
        username,
        password: passwordHash,
        role: isAdmin ? ROLE.ADMIN : ROLE.STAFF,
      });
      await staff.save();
      const refreshToken = Token.generateRefreshToken({
        userID: staff._id,
        role: staff.role,
      });
      staff.refreshToken = refreshToken;
      await staff.save();

      const accessToken = Token.generateAccessToken({
        userID: staff._id,
        role: staff.role,
      });
      res.json({
        data: {
          _id: staff._id,
          name: staff.name,
          username: staff.username,
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
    const id = req.params.id;
    const { name, password } = req.body;
    try {
      const passwordHash = await bcrypt.hash(password, cost);
      const user = await User.findById(id).exec();
      user.name = name;
      user.password = passwordHash;
      await user.save();
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await User.deleteOne({ _id: id });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });
};

module.exports = {
  init,
};
