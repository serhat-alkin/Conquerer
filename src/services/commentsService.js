const commentsDao = require('../daos/commentsDao');
const { v4: uuidv4 } = require('uuid');

const deleteComments = async (userId, client) => {
  return await commentsDao.deleteComments(userId, client);
};

const createComment = async (commentData) => {
  const id = uuidv4();
  return await commentsDao.createComment(commentData, id);
};

const softDeleteComments = async (postId, client) => {
  return await commentsDao.softDeleteComments(postId, client);
};

module.exports = {
  deleteComments,
  createComment,
  softDeleteComments,
};