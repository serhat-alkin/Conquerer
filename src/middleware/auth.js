const usersService = require('../services/usersService');
const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await usersService.getUserById(decodedToken.user);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const sessionToken = user.session_token;
    const sessionTokenExpiration = user.session_token_expiration;

    if (!sessionToken || sessionToken !== token) {
      return res.status(401).json({ error: 'Token is invalid' });
    }

    if (sessionTokenExpiration && sessionTokenExpiration < new Date()) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    req.userId = decodedToken.user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while validating the token' });
  }
};

module.exports = {
  validateToken,
};
