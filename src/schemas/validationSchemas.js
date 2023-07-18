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



module.exports = {
  changePasswordSchema,
  loginSchema,
  userRegistrationSchema,
};

