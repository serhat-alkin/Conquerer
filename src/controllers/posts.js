const postsService = require('../services/postsService');
const commentsService = require('../services/commentsService');
const { createPostSchema, updatePostSchema, postIdSchema } = require('../schemas/validationSchemas');
const pool = require('../db/connection');

const createBlogPost = async (req, res) => {
  try {
    const validation = createPostSchema.validate(req.body);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }

    const blogPost = await postsService.createBlogPost(req.body);
    res.status(200).json(blogPost);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const paramValidation = postIdSchema.validate(req.params);
    if (paramValidation.error) {
      res.status(400).json({ error: paramValidation.error.details[0].message });
      return;
    }

    const bodyValidation = updatePostSchema.validate(req.body);
    if (bodyValidation.error) {
      res.status(400).json({ error: bodyValidation.error.details[0].message });
      return;
    }

    const { postId } = req.params;
    const { title, body } = req.body;
    const updatedPost = await postsService.updatePost(postId, title, body);
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

const deleteBlogPost = async (req, res) => {
  let client;
  try {
    const validation = postIdSchema.validate(req.params);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }
    client = await pool.connect();

    await client.query('BEGIN');
    const { postId } = req.params;
    await commentsService.softDeleteComments(postId, client); 
    const deleted = await postsService.softDeletePost(postId, client);
    
    if (!deleted) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Post not found' });
    }

    await client.query('COMMIT');
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    await client?.query('ROLLBACK');
    res.status(500).json({ message: 'An error occurred', error: error.message });
  } finally {
    client?.release();
  }
};

module.exports = {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};

