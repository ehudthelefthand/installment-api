const express = require("express");

const init = (app) => {
  const router = express.Router();
  app.use("/staffs", router);

  router.post("/staffs", async (req, res, next) => {
    const { username, password } = req.body;
    try {
      let staff = await userDB.create({ username, password, role: "staff" });
      refreshToken = token.generateRefreshToken({
        user_id: staff.id,
        role: "staff",
      });
      staff = { ...staff, refreshToken };
      staff = await userDB.update(staff);
      accessToken = token.generateAccessToken({
        user_id: staff.id,
        role: "staff",
      });
      staff = { ...staff, accessToken };
      res.json({ data: staff });
    } catch (e) {
      next(e);
    }
  });

  router.get("/staffs", async (req, res, next) => {
    try {
      let staffs = await userDB.list("staff");
      staffs = staffs.map(({ id, username, role }) => ({ id, username, role }));
      res.json({ data: staffs });
    } catch (e) {
      next(e);
    }
  });

  router.patch("/staffs/:id", async (req, res, next) => {
    const staffID = req.params["id"];
    const { password } = req.body;
    try {
      await userDB.updatePassword({ id: staffID, password });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });

  router.delete("/staffs/:id", async (req, res, next) => {
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
