const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const { users } = require("./store");

const cost = 12;

const create = async ({ username, password, role }) => {
  try {
    const passwordHash = await bcrypt.hash(password, cost);
    const user = {
      id: uuid(),
      username,
      password: passwordHash,
      role,
    };
    users.push(user);

    return user;
  } catch (e) {
    throw e;
  }
};

const updatePassword = async ({ id, password }) => {
  try {
    const passwordHash = await bcrypt.hash(password, cost);
    const index = users.findIndex((user) => {
      return user.id === id;
    });
    if (index === -1) {
      throw new Error("User no found");
    }
    users[index] = { ...users[index], password: passwordHash };
    return users[index];
  } catch (e) {
    throw e;
  }
};

const update = async (newUser) => {
  const index = users.findIndex((user) => {
    return user.id === newUser.id;
  });
  if (index !== -1) {
    users[index] = newUser;
    return users[index];
  }
};

const list = async (role) => {
  return users.filter((user) => user.role === role);
};

const remove = async (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    throw new Error("User not found");
  }
  users.splice(index, 1);
};

const getByID = async (id) => {
  return users.find((user) => user.id === id);
};

const getByRefreshToken = async (token) => {
  return users.find((user) => user.refreshToken === token);
};

const getByUsername = async (username) => {
  return users.find((user) => user.username === username);
};

module.exports = {
  create,
  update,
  updatePassword,
  list,
  remove,
  getByID,
  getByRefreshToken,
  getByUsername,
};
