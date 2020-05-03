const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  username: { type: String, index: true, unique: true },
  password: String,
  refreshToken: { type: String, index: true, unique: true },
  role: String,
  loans: [{ type: Schema.Types.ObjectId, ref: "Loan" }],
  repays: [{ type: Schema.Types.ObjectId, ref: "Repay" }],
});

module.exports = mongoose.model("User", UserSchema);
