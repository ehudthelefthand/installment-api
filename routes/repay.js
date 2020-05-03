const express = require("express");

const init = (app) => {
  const router = express.Router();
  app.use("/repays", router);
};

module.exports = {
  init,
};
