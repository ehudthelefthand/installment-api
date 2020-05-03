const express = require("express");
const staffRoute = require("./staff");

const init = (app) => {
  const router = express.Router();
  app.use("/admin", router);
  staffRoute.init(router);

  // router.post("/init", async (req, res) => {
  //   let staff, admin, refreshToken, accessToken;

  //   // Staff
  //   staff = await userDB.create({
  //     username: "staff1",
  //     password: "password",
  //     role: "staff",
  //   });
  //   refreshToken = token.generateRefreshToken({
  //     user_id: staff.id,
  //     role: "staff",
  //   });
  //   staff = { ...staff, refreshToken };
  //   staff = await userDB.update(staff);
  //   accessToken = token.generateAccessToken({
  //     user_id: staff.id,
  //     role: "staff",
  //   });
  //   staff = { ...staff, accessToken };

  //   // Admin
  //   admin = await userDB.create({
  //     username: "admin",
  //     password: "password",
  //     role: "admin",
  //   });
  //   refreshToken = token.generateRefreshToken({
  //     user_id: admin.id,
  //     role: "admin",
  //   });
  //   admin = { ...admin, refreshToken };
  //   admin = await userDB.update(admin);
  //   accessToken = token.generateAccessToken({
  //     user_id: admin.id,
  //     role: "admin",
  //   });
  //   admin = { ...admin, accessToken };

  //   res.json({
  //     data: {
  //       admin,
  //       staff,
  //     },
  //   });
  // });

  // router.get("/loans", async (req, res, next) => {
  //   try {
  //     const loans = await loanDB.listAll();
  //     res.json({
  //       data: loans,
  //     });
  //   } catch (e) {
  //     next(e);
  //   }
  // });
};

module.exports = {
  init,
};
