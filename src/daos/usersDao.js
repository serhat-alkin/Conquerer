const pool = require('../db/connection');

const createUser = async (user) => {
    const { id, full_name, address, lat, long, email, username, password } = user;
    const query = `
        INSERT INTO users (id, full_name, address, lat, long, email, username, password) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [id, full_name, address, lat, long, email, username, password];

    const { rows } = await pool.query(query, values);
    return rows[0];
};


const getUserByEmail = async (email) => {
  try {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };

    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error('Error retrieving user by email:', error);
    throw error;
  }
};

const updateSessionToken = async (sessionToken, userId, expirationTime) => {
  try {
    const query = {
      text: 'UPDATE users SET session_token = $1, session_token_expiration = $2 WHERE id = $3',
      values: [sessionToken, expirationTime, userId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating session token:', error);
    throw error;
  }
};

const invalidateOldSessions = async (userId) => {
  try {
    const query = {
      text: 'UPDATE users SET session_token = NULL WHERE id = $1',
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error('Error invalidating old sessions:', error);
    throw error;
  }
};

const changePassword = async (userId, hashedPassword) => {
  try {
    const query = {
      text: 'UPDATE users SET password = $1 WHERE id = $2',
      values: [hashedPassword, userId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};


const getUserById = async (id) => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0];
};


module.exports = {
    createUser,
    getUserByEmail,
    updateSessionToken,
    invalidateOldSessions,
    changePassword,
    getUserById,
};
