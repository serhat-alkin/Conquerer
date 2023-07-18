const listingsService = require('../services/listingsService');
const { userIdSchema, categorySchema } = require('../schemas/validationSchemas');

const myComments = async (req, res) => {
  try {
    const validation = userIdSchema.validate(req.params);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }

    const { userId } = req.params;
    const comments = await listingsService.getCommentsByUserId(userId);

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const myPosts = async (req, res) => {
  try {
    const validation = userIdSchema.validate(req.params);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }

    const { userId } = req.params;
    const posts = await listingsService.getPostsByUserId(userId);
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lastPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await listingsService.getLastPosts(page, limit);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const postsByCategory = async (req, res) => {
  try {
    const validation = categorySchema.validate(req.body);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }

    const { category } = req.body;
    const posts = await listingsService.getPostsByCategory(category);
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  myComments,
  myPosts,
  lastPosts,
  postsByCategory,
};