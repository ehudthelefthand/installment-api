const bcrypt = require("bcrypt");
const Token = require("../token");
const Auth = require("../mw/auth");
const User = require("../models/user");

const init = (app) => {
  app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username }).exec();
      if (!user) {
        return res.status(401).json({
          message: "Username or Password is incorrect",
        });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({
          message: "Username or Password is incorrect",
        });
      }
      const refreshToken = Token.generateRefreshToken({
        userID: user.id,
        role: user.role,
      });
      user.refreshToken = refreshToken;
      await user.save();
      const accessToken = Token.generateAccessToken({
        userID: user.id,
        role: user.role,
      });
      res.json({
        data: {
          name: user.name,
          role: user.role,
          refreshToken,
          accessToken,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  app.get("/profile", Auth.requiredUser, async (req, res, next) => {
    res.json({
      name: req.User.name,
      role: user.role,
    });
  });

  app.post("/sessions", async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
      const user = await User.findOne({ refreshToken }).exec();
      if (!user) {
        return res.sendStatus(401);
      }
      const accessToken = Token.generateAccessToken({
        userID: user.id,
        role: user.role,
      });
      res.json({
        data: {
          name: user.name,
          accessToken,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  app.post("/logout", Auth.requiredUser, async (req, res, next) => {
    const user = req.User;
    try {
      user.refreshToken = undefined;
      await user.save();
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });
};

module.exports = {
  init,
};
