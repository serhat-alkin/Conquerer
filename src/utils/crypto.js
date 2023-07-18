const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();

const generateJWT = async (user_id) => {
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
};


const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

module.exports = {
  generateJWT,
  hashPassword,
};
