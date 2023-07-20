const pool = require('../db/connection');

const deletePosts = async (userId, client = pool) => {
  try {
    const query = {
      text: 'DELETE FROM posts WHERE user_id = $1',
      values: [userId],
    };

    await client.query(query);
    return true;
  } catch (error) {
    console.error('Error deleting posts:', error);
    throw error;
  }
};


const createBlogPost = async (blogPostData, id) => { 
  try {
    const { user_id, title, body, category } = blogPostData;
    const query = `
      INSERT INTO posts (id, user_id, title, body, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [id, user_id, title, body, category];

    const { rows } = await pool.query(query, values);
    return rows[0];
} catch (error) {
  console.error('Error deleting posts:', error);
  throw error;
}
};


const updatePost = async (postId, title, body) => {
  try {
    const query = {
      text: 'UPDATE posts SET title = $1, body = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND deleted = false RETURNING *',
      values: [title, body, postId],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

const softDeletePost = async (postId, client = pool) => {
  try {
    const query = {
      text: 'UPDATE posts SET deleted = TRUE WHERE id = $1 RETURNING *',
      values: [postId],
    };

    const { rows } = await client.query(query);
    return rows[0] ? true : false;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

const getPostsByUserId = async (userId) => {
  try {
    const query = {
      text: 'SELECT * FROM posts WHERE user_id = $1 AND deleted = FALSE ORDER BY created_at DESC ',
      values: [userId],
    };

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};


const getLastPosts = async (offset, limit) => {
  try {
    const query = `
    SELECT posts.title, users.full_name as username, COUNT(comments.id) as comment_count, posts.category 
    FROM posts 
    INNER JOIN users ON posts.user_id = users.id 
    LEFT JOIN comments ON posts.id = comments.post_id 
    WHERE posts.deleted = FALSE 
    GROUP BY posts.id, users.full_name 
    ORDER BY posts.created_at DESC 
    LIMIT $1 OFFSET $2
  `;
  const values = [limit, offset];
  const { rows } = await pool.query(query, values);
  return rows;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};


const getPostsByCategory = async (category) => {
  try {
    const query = {
      text: 'SELECT * FROM posts WHERE category = $1 AND deleted = FALSE ORDER BY created_at DESC ',
      values: [category],
    };

    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};



module.exports = {
  deletePosts,
  createBlogPost,
  updatePost,
  softDeletePost,
  getPostsByUserId,
  getLastPosts,
  getPostsByCategory,
};
