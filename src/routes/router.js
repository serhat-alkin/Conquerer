
const express = require('express');
const router = express.Router();
const { register, login, changePassword, deleteUser } = require('../controllers/users');
const { createBlogPost, updateBlogPost, deleteBlogPost } = require('../controllers/posts');
const { createComment } = require('../controllers/comments');
const { myComments, myPosts, lastPosts, postsByCategory } = require('../controllers/listings');


router.post('/users/register', register);
router.get('/users/login', login);
router.post('/users/changePassword', changePassword);
router.delete('/users/:userId', deleteUser);
router.post('/posts/create', createBlogPost);
router.patch('/posts/update/:postId', updateBlogPost);
router.patch('/posts/delete/:postId', deleteBlogPost);
router.post('/comments/create/', createComment);
router.get('/users/:userId/comments', myComments);
router.get('/users/:userId/posts', myPosts);
router.get('/posts', lastPosts);
router.get('/posts/by_category', postsByCategory);

module.exports = router;