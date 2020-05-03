const express = require("express");
const Auth = require("../mw/auth");
const Loan = require("../models/loan");

const init = (app) => {
  const router = express.Router();
  app.use("/loans", router);

  router.post("/", Auth.requiredStaff, async (req, res, next) => {
    const user = req.User;
    const { amount, date } = req.body;
    try {
      const loan = new Loan({
        amount,
        date,
        loaner: user._id,
      });
      await loan.save();
      user.loans.push(loan._id);
      await user.save();
      res.json({
        data: {
          _id: loan._id,
          amount: loan.amount,
          date: loan.date,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  router.patch("/:id", Auth.requiredStaff, async (req, res, next) => {
    const id = req.params.id;
    const { amount, date } = req.body;
    try {
      const loan = await Loan.findById(id).exec();
      if (amount) {
        loan.amount = amount;
      }
      if (date) {
        loan.date = date;
      }
      await loan.save();
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });

  router.get("/", Auth.requiredStaff, async (req, res, next) => {
    const user = req.User;
    try {
      const loans = await Loan.find({
        loaner: user.id,
      }).exec();
      res.json({
        data: loans.map(({ _id, amount, date }) => ({ _id, amount, date })),
      });
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", Auth.requiredStaff, async (req, res, next) => {
    const id = req.params.id;
    try {
      await Loan.deleteOne({ _id: id }).exec();
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });
};

module.exports = {
  init,
};
