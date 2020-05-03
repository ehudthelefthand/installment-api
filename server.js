const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const auth = require("./mw/auth");
// const userDB = require("./db/user");
// const loanDB = require("./db/loan");
// const token = require("./token");
// const bcrypt = require("bcrypt");

const userRoute = require("./routes/user");
const loanRoute = require("./routes/loan");
const repayRoute = require("./routes/repay");
const adminRoute = require("./routes/admin");

mongoose.connect("mongodb://localhost/vuejsdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

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

userRoute.init(app);
loanRoute.init(app);
repayRoute.init(app);
adminRoute.init(app);

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(port, () => console.log(`server started at port ${port}`));
