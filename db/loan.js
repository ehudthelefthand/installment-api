const { v4: uuid } = require("uuid");
const { users, loanMap } = require("./store");

const create = async ({ staffID, amount, date }) => {
  if (!loanMap[staffID]) {
    loanMap[staffID] = [];
  }
  const loan = {
    id: uuid(),
    amount,
    date,
  };
  loanMap[staffID].push(loan);

  return loan;
};

const remove = async ({ staffID, loanID }) => {
  if (!loanMap[staffID]) {
    return;
  }
  const index = loanMap[staffID].findIndex((loan) => loan.id === loanID);
  if (index === -1) {
    throw new Error("Loan no found");
  }
  loanMap[staffID].splice(index, 1);
};

const update = async ({ staffID, loanID, amount, date }) => {
  if (!loanMap[staffID]) {
    return;
  }
  const index = loanMap[staffID].findIndex((loan) => loan.id === loanID);
  if (index === -1) {
    return;
  }
  loanMap[staffID][index].amount = amount;
  loanMap[staffID][index].date = date;
};

const listByStaffID = async (staffID) => {
  const loans = loanMap[staffID];
  if (!loans) {
    return [];
  }
  return loans;
};

const listAll = async () => {
  const staffs = users.filter((user) => user.role !== "admin");
  for (let staff of staffs) {
    staff.loan = loanMap[staff.id];
  }
  return staffs;
};

module.exports = {
  create,
  remove,
  update,
  listByStaffID,
  listAll,
};
