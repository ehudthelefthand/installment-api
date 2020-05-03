const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoanSchema = new Schema({
  amount: Number,
  date: Date,
  loaner: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Loan", LoanSchema);
