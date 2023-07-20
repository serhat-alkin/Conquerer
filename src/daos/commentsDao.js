const pool = require('../db/connection');

const deleteComments = async (userId, client = pool) => {
  try {
    const query = {
      text: 'DELETE FROM comments WHERE user_id = $1',
      values: [userId],
    };

    await client.query(query);
    return true;
  } catch (error) {
    console.error('Error deleting comments:', error);
    throw error;
  }
};


const getCommentsByUserId = async (userId) => {
  try {
    const query = {
      text: 'SELECT * FROM comments WHERE user_id = $1 AND deleted = FALSE ORDER BY created_at DESC ',
      values: [userId],
    };

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

const createComment = async (commentData, id) => {
  const { user_id, post_id, body } = commentData;
  const query = `
    INSERT INTO comments (id, user_id, post_id, body)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [id, user_id, post_id, body];

  const { rows } = await pool.query(query, values);
  return rows[0];
};


const softDeleteComments = async (postId, client = pool) => {
  try {
    const query = {
      text: 'UPDATE comments SET deleted = TRUE WHERE post_id = $1 RETURNING *',
      values: [postId],
    };

    const { rows } = await client.query(query);
    return rows[0] ? true : false;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};


module.exports = {
  deleteComments,
  createComment,
  softDeleteComments,
  getCommentsByUserId,
};
