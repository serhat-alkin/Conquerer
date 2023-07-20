
const usersService = require('../services/usersService');
const postsService = require('../services/postsService');
const commentsService = require('../services/commentsService');
const { userRegistrationSchema, changePasswordSchema, loginSchema, userIdSchema } = require('../schemas/validationSchemas');
const { generateJWT, hashPassword } = require("../utils/crypto");
const pool = require('../db/connection');

const register = async (req, res) => {
  try {
    const validation = userRegistrationSchema.validate(req.body);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }

    const hashedPassword = await hashPassword(req.body.password);
    const newUser = await usersService.createUser(req.body, hashedPassword);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const login = async (req, res) => {
  try {
    const validation = loginSchema.validate(req.body);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }
   
    const user = await usersService.getUser(req.body);
    if(!user){
      return res.status(401).json({
        error: "User not found with given email",
      });
    }

    const isValidPassword = await usersService.isValidPassword(req.body.password, user.password);
    if(!isValidPassword){
      return res.status(400).json({
        error: "Incorrect password",
      });
    }

    const token = await generateJWT(user.id);
    await usersService.invalidateOldSessions(user.id);
    await usersService.updateSessionToken(token, user.id);

    res.cookie('token', token, { httpOnly: true });
    
    res.json({
      message: "Login successful!",
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const paramValidation = userIdSchema.validate(req.params);
    if (paramValidation.error) {
      res.status(400).json({ error: paramValidation.error.details[0].message });
      return;
    }

    const bodyValidation = changePasswordSchema.validate(req.body);
    if (bodyValidation.error) {
      res.status(400).json({ error: bodyValidation.error.details[0].message });
      return;
    }

    const { userId } = req.params;
    
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to change password' });
    }

    const { current_password, new_password } = req.body;
    const user = await usersService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await usersService.isValidPassword(current_password, user.password);
    if(!isValidPassword){
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    const hashedPassword = await hashPassword(new_password);
    await usersService.changePassword(userId, hashedPassword);
    await usersService.invalidateOldSessions(userId);

    return res.status(200).json({ message: 'Password changed successfully. Please log in again.' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


const deleteUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const validation = userIdSchema.validate(req.params);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }
    
    const { userId } = req.params;

    if (userId !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this user' });
    }

    await client.query('BEGIN');

    await commentsService.deleteComments(userId, client);
    await postsService.deletePosts(userId, client);
    await usersService.deleteUser(userId, client);

    await client.query('COMMIT');

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  } finally {
    client.release();
  }
};


module.exports = {
  register,
  login,
  changePassword,
  deleteUser,
};

