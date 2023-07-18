

const commentsService = require('../services/commentsService');
const { createCommentSchema } = require('../schemas/validationSchemas');

const createComment = async (req, res) => {
  try {
    const validation = createCommentSchema.validate(req.body);
    if (validation.error) {
      res.status(400).json({ error: validation.error.details[0].message });
      return;
    }
    
    const comment = await commentsService.createComment(req.body);

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createComment,
};

