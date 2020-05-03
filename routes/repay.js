const express = require("express");
const Auth = require("../mw/auth");
const Repay = require("../models/repay");

const init = (app) => {
  const router = express.Router();
  app.use("/repays", router);

  router.post("/", Auth.requiredStaff, async (req, res, next) => {
    const user = req.User;
    const { amount, date } = req.body;
    try {
      const repay = new Repay({
        amount,
        date,
        loaner: user,
      });
      await repay.save();
      user.repays.push(repay._id);
      await user.save();
      res.json({
        data: {
          _id: repay._id,
          amount: repay.amount,
          date: repay.date,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.get("/", Auth.requiredStaff, async (req, res, next) => {
    const user = req.User;
    try {
      const repays = await Repay.find({
        loaner: user.id,
      }).exec();
      res.json({
        data: repays.map(({ _id, amount, date }) => ({ _id, amount, date })),
      });
    } catch (e) {
      next(e);
    }
  });

  router.patch("/:id", Auth.requiredStaff, async (req, res, next) => {
    const id = req.params.id;
    const { amount, date } = req.body;
    try {
      const repay = await Repay.findById(id).exec();
      if (amount) {
        repay.amount = amount;
      }
      if (date) {
        repay.date = date;
      }
      await repay.save();
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", Auth.requiredStaff, async (req, res, next) => {
    const id = req.params.id;
    try {
      await Repay.deleteOne({ _id: id }).exec();
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });
};

module.exports = {
  init,
};
