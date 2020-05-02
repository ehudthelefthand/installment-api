const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./mw/auth");
const userDB = require("./db/user");
const loanDB = require("./db/loan");
const token = require("./token");
const bcrypt = require("bcrypt");

const app = express();
const port = 3001;

// CAUTION!
// The code showed here is not for production ready
// It is used for illustrate the simple structure of the appliction
// And authentication flow

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Init Route
app.post("/init", async (req, res) => {
  let staff, admin, refreshToken, accessToken;

  // Staff
  staff = await userDB.create({
    username: "staff1",
    password: "password",
    role: "staff",
  });
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

  // Admin
  admin = await userDB.create({
    username: "admin",
    password: "password",
    role: "admin",
  });
  refreshToken = token.generateRefreshToken({
    user_id: admin.id,
    role: "admin",
  });
  admin = { ...admin, refreshToken };
  admin = await userDB.update(admin);
  accessToken = token.generateAccessToken({
    user_id: admin.id,
    role: "admin",
  });
  admin = { ...admin, accessToken };

  res.json({
    data: {
      admin,
      staff,
    },
  });
});

// All User Route
app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    let user = await userDB.getByUsername(username);
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
    const refreshToken = token.generateRefreshToken({
      user_id: user.id,
      role: user.role,
    });
    user = { ...user, refreshToken };
    user = await userDB.update(user);
    const accessToken = token.generateAccessToken({
      user_id: user.id,
      role: user.role,
    });

    res.json({
      data: {
        username: user.username,
        refreshToken,
        accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
});

app.post("/sessions", async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    const user = await userDB.getByRefreshToken(refreshToken);
    if (!user) {
      return res.sendStatus(401);
    }
    const accessToken = token.generateAccessToken({
      user_id: user.id,
      role: user.role,
    });
    res.json({
      data: {
        username: user.username,
        accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
});

app.post("/logout", auth.requiredUser, async (req, res, next) => {
  let user = req.User;
  user.refreshToken = undefined;
  try {
    await userDB.update(user);
  } catch (e) {
    next(e);
  }
});

app.post("/loans", auth.requiredUser, async (req, res, next) => {
  const user = req.User;
  const { amount, date } = req.body;
  let loan = {
    staffID: user.id,
    amount,
    date,
  };
  try {
    loan = await loanDB.create(loan);
    res.json({
      data: { ...loan },
    });
  } catch (e) {
    next(e);
  }
});

app.update("/loans/:id", auth.requiredUser, async (req, res, next) => {
  const user = req.User;
  const loanID = req.params.id;
  const { amount, date } = req.body;
  const loan = {
    staffID: user.id,
    loanID,
    amount,
    date,
  };
  try {
    await loanDB.update(loan);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
  res.json({ data: [] });
});

app.get("/loans", auth.requiredUser, async (req, res, next) => {
  const user = req.User;
  try {
    const loans = await loanDB.listByStaffID(user.id);
    res.json({
      data: loans,
    });
  } catch (e) {
    next(e);
  }
});

app.delete("/loans/:id", auth.requiredUser, async (req, res, next) => {
  const user = req.User;
  const loanID = req.params.id;
  try {
    await loanDB.remove({ staffID: user.id, loanID });
  } catch (e) {
    next(e);
  }
});

// Admin Route
const router = express.Router();

app.use("/admin", auth.requiredAdmin, router);

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

router.get("/loans", async (req, res, next) => {
  try {
    const loans = await loanDB.listAll();
    res.json({
      data: loans,
    });
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(port, () => console.log(`server started at port ${port}`));
