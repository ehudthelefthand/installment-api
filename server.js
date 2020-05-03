const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoute = require("./routes/user");
const loanRoute = require("./routes/loan");
const repayRoute = require("./routes/repay");
const adminRoute = require("./routes/admin");

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
// const url = `mongodb://localhost/vuejsclass`;
mongoose.connect(url, {
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

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ok");
});

userRoute.init(app);
loanRoute.init(app);
repayRoute.init(app);
adminRoute.init(app);

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(port, () => console.log(`server started at port ${port}`));
