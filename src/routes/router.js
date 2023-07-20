
const express = require('express');
const router = express.Router();
const { register, login, changePassword, deleteUser } = require('../controllers/users');
const { createBlogPost, updateBlogPost, deleteBlogPost } = require('../controllers/posts');
const { createComment } = require('../controllers/comments');
const { myComments, myPosts, lastPosts, postsByCategory } = require('../controllers/listings');
const { categoryRates, getUserStats, getPostsThisWeek, getPostsThisMonth , getPostsThisYear} = require('../controllers/elastic');
const { validateToken } = require('../middleware/auth');

router.post('/users/register', register);
router.get('/users/login', login);
router.post('/users/:userId/changePassword',validateToken, changePassword);
router.delete('/users/:userId', validateToken, deleteUser);
router.post('/posts/create', validateToken, createBlogPost);
router.patch('/posts/update/:postId', validateToken, updateBlogPost);
router.patch('/posts/delete/:postId', validateToken, deleteBlogPost);
router.post('/comments/create/', validateToken, createComment);
router.get('/users/:userId/comments', validateToken, myComments);
router.get('/users/:userId/posts', validateToken, myPosts);
router.get('/posts', validateToken, lastPosts);
router.get('/posts/by_category', validateToken, postsByCategory);
router.get('/search/category_rates', validateToken, categoryRates);
router.get('/search/user_stats', validateToken, getUserStats);
router.get('/search/posts/this_week',validateToken, getPostsThisWeek);
router.get('/search/posts/this_month', validateToken, getPostsThisMonth);
router.get('/search/posts/this_year', validateToken, getPostsThisYear);

module.exports = router;