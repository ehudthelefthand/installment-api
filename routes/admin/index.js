const express = require("express");
const staffRoute = require("./staff");
const User = require("../../models/user");

const init = (app) => {
  const router = express.Router();
  app.use("/admin", router);
  staffRoute.init(router);

  router.get("/loans", async (req, res, next) => {
    try {
      const staffs = await User.find({ role: "staff" })
        .populate("loans")
        .exec();
      res.json({
        data: staffs.map(({ _id, name, loans, repays }) => {
          return {
            _id,
            name,
            loans: loans.map(({ _id, amount, date }) => ({
              _id,
              amount,
              date,
            })),
          };
        }),
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/repays", async (req, res, next) => {
    try {
      const staffs = await User.find({ role: "staff" })
        .populate("repays")
        .exec();
      res.json({
        data: staffs.map(({ _id, name, loans, repays }) => {
          return {
            _id,
            name,
            repays: repays.map(({ _id, amount, date }) => ({
              _id,
              amount,
              date,
            })),
          };
        }),
      });
    } catch (e) {
      next(e);
    }
  });
};

module.exports = {
  init,
};
