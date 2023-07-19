
const express = require('express');
const router = express.Router();
const { register, login, changePassword, deleteUser } = require('../controllers/users');
const { createBlogPost, updateBlogPost, deleteBlogPost } = require('../controllers/posts');
const { createComment } = require('../controllers/comments');
const { myComments, myPosts, lastPosts, postsByCategory } = require('../controllers/listings');
const { categoryRates, getUserStats, getPostsThisWeek, getPostsThisMonth , getPostsThisYear} = require('../controllers/elastic');

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
router.get('/search/category_rates', categoryRates);
router.get('/search/user_stats', getUserStats);
router.get('/search/posts/this_week', getPostsThisWeek);
router.get('/search/posts/this_month', getPostsThisMonth);
router.get('/search/posts/this_year', getPostsThisYear);

module.exports = router;