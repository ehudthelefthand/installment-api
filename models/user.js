const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  username: String,
  password: String,
  refreshToken: String,
  role: String,
  loans: [{ type: Schema.Types.ObjectId, ref: "Loan" }],
  repay: [{ type: Schema.Types.ObjectId, ref: "Repay" }],
});

module.exports = mongoose.model("User", UserSchema);
