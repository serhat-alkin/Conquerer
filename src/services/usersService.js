
const usersDao = require('../daos/usersDao');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const createUser = async (user, hashedPassword) => {
  const id = uuidv4();
  return await usersDao.createUser({
      ...user,
      id,
      password: hashedPassword,
      username: user.full_name.split(' ').join('_').toLowerCase(),
  });
};


const getUser = async (userData) => {
  const user = await usersDao.getUserByEmail(userData.email);
  if (!user) {
    return null;
  }
  return user;
};

const isValidPassword = async (passwordFromBody, password) => {
  return await bcrypt.compare(passwordFromBody, password);
};


const updateSessionToken = async (sessionToken, userId) => {
  const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
  return await usersDao.updateSessionToken(
      sessionToken,
      userId,
      expirationTime,
  );
};

const invalidateOldSessions = async (userId) => {
  return await usersDao.invalidateOldSessions(userId);
};

const changePassword = async (userId, hashedPassword) => { 
  return await usersDao.changePassword(userId, hashedPassword);
};

const getUserById = async (id) => {
  return await usersDao.getUserById(id);
};

const deleteUser = async (userId, client) => {
  await usersDao.deleteUser(userId, client);
};

module.exports = {
  createUser,
  getUser,
  updateSessionToken,
  isValidPassword,
  invalidateOldSessions,
  changePassword,
  getUserById,
  deleteUser,
};
