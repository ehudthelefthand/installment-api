const User = require("../models/user");

const init = (app) => {
  // app.post("/login", async (req, res, next) => {
  //   const { username, password } = req.body;
  //   try {
  //     let user = await userDB.getByUsername(username);
  //     if (!user) {
  //       return res.status(401).json({
  //         message: "Username or Password is incorrect",
  //       });
  //     }
  //     const valid = await bcrypt.compare(password, user.password);
  //     if (!valid) {
  //       return res.status(401).json({
  //         message: "Username or Password is incorrect",
  //       });
  //     }
  //     const refreshToken = token.generateRefreshToken({
  //       user_id: user.id,
  //       role: user.role,
  //     });
  //     user = { ...user, refreshToken };
  //     user = await userDB.update(user);
  //     const accessToken = token.generateAccessToken({
  //       user_id: user.id,
  //       role: user.role,
  //     });
  //     res.json({
  //       data: {
  //         username: user.username,
  //         refreshToken,
  //         accessToken,
  //       },
  //     });
  //   } catch (e) {
  //     next(e);
  //   }
  // });
  // app.post("/sessions", async (req, res, next) => {
  //   const { refreshToken } = req.body;
  //   try {
  //     const user = await userDB.getByRefreshToken(refreshToken);
  //     if (!user) {
  //       return res.sendStatus(401);
  //     }
  //     const accessToken = token.generateAccessToken({
  //       user_id: user.id,
  //       role: user.role,
  //     });
  //     res.json({
  //       data: {
  //         username: user.username,
  //         accessToken,
  //       },
  //     });
  //   } catch (e) {
  //     next(e);
  //   }
  // });
  // app.post("/logout", auth.requiredUser, async (req, res, next) => {
  //   let user = req.User;
  //   user.refreshToken = undefined;
  //   try {
  //     await userDB.update(user);
  //   } catch (e) {
  //     next(e);
  //   }
  // });
};

module.exports = {
  init,
};
