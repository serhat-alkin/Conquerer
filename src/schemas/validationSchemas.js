const Joi = require('joi');

const changePasswordSchema = Joi.object({
    user_id: Joi.string().required(),
    old_password: Joi.string()
    .pattern(/^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    new_password: Joi.string()
    .pattern(/^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
});

const userRegistrationSchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
  .pattern(/^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .message('Password must be at least 8 characters long and contain at least one special character (@, $, !, %, *, ?, or &)'),
  confirm_password: Joi.any().valid(Joi.ref('password')).required().options({ messages: {'any.only': 'passwords does not match'} }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const createPostSchema = Joi.object({
  user_id: Joi.string().required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  category: Joi.string().valid('Artificial Intelligence', 'Business', 'Money', 'Technology').required(),
});

const createCommentSchema = Joi.object({
  user_id: Joi.string().required(),
  post_id: Joi.string().required(),
  body: Joi.string().required(),
});


const updatePostSchema = Joi.object({
  title: Joi.string().min(1).required(),
  body: Joi.string().min(1).required(),
}).or('title', 'content').required();

const postIdSchema = Joi.object({
  postId: Joi.string().required()
});

const userIdSchema = Joi.object({
  userId: Joi.string().required()
});

const categorySchema = Joi.object({
  category: Joi.string().required()
});

module.exports = {
  changePasswordSchema,
  loginSchema,
  userRegistrationSchema,
  createPostSchema,
  updatePostSchema,
  postIdSchema,
  createCommentSchema,
  userIdSchema,
  categorySchema,
};

