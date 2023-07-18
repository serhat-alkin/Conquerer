const postsDao = require('../daos/postsDao');
const { v4: uuidv4 } = require('uuid');

const deletePosts = async (userId, client) => {
  return await postsDao.deletePosts(userId, client);
};

const createBlogPost = async (blogPostData) => {
  const id = uuidv4();
  return await postsDao.createBlogPost(blogPostData, id);
};

const updatePost = async (postId, title, body) => {
  return await postsDao.updatePost(postId, title, body);
};

const softDeletePost = async (postId, client) => {
  return await postsDao.softDeletePost(postId, client);
};

module.exports = {
  deletePosts,
  createBlogPost,
  updatePost,
  softDeletePost,
};
