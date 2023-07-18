
const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/users');

router.post('/users/register', register);
router.get('/users/login', login);
router.post('/users/changePassword', changePassword);

module.exports = router;