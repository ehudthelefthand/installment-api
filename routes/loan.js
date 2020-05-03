const express = require("express");

const init = (app) => {
  const router = express.Router();
  app.use("/loans", router);

  // router.post("/", auth.requiredUser, async (req, res, next) => {
  //   const user = req.User;
  //   const { amount, date } = req.body;
  //   let loan = {
  //     staffID: user.id,
  //     amount,
  //     date,
  //   };
  //   try {
  //     loan = await loanDB.create(loan);
  //     res.json({
  //       data: { ...loan },
  //     });
  //   } catch (e) {
  //     next(e);
  //   }
  // });

  // router.patch("/:id", auth.requiredUser, async (req, res, next) => {
  //   const user = req.User;
  //   const loanID = req.params.id;
  //   const { amount, date } = req.body;
  //   const loan = {
  //     staffID: user.id,
  //     loanID,
  //     amount,
  //     date,
  //   };
  //   try {
  //     await loanDB.update(loan);
  //     res.sendStatus(204);
  //   } catch (e) {
  //     next(e);
  //   }
  //   res.json({ data: [] });
  // });

  // router.get("/", auth.requiredUser, async (req, res, next) => {
  //   const user = req.User;
  //   try {
  //     const loans = await loanDB.listByStaffID(user.id);
  //     res.json({
  //       data: loans,
  //     });
  //   } catch (e) {
  //     next(e);
  //   }
  // });

  // router.delete("/:id", auth.requiredUser, async (req, res, next) => {
  //   const user = req.User;
  //   const loanID = req.params.id;
  //   try {
  //     await loanDB.remove({ staffID: user.id, loanID });
  //   } catch (e) {
  //     next(e);
  //   }
  // });
};

module.exports = {
  init,
};
