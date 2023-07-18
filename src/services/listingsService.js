const commentsDao = require('../daos/commentsDao');
const postsDao = require('../daos/postsDao');


const getCommentsByUserId = async (userId) => {
  return await commentsDao.getCommentsByUserId(userId);
};

const getPostsByUserId = async (userId) => {
  return await postsDao.getPostsByUserId(userId);
};

const getLastPosts = async (page, limit) => {
  const offset = (page - 1) * limit;
  return await postsDao.getLastPosts(offset, limit);
};

const getPostsByCategory = async (category) => {
  return await postsDao.getPostsByCategory(category);
};


module.exports = {
  getCommentsByUserId,
  getPostsByUserId,
  getLastPosts,
  getPostsByCategory,
};