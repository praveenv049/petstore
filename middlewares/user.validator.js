const Joi = require("joi");
class userSchema {
  constructor() {}
  static createSchema = Joi.object({
    username: Joi.string().messages({
      "any.required": "username field is required.",
    }),
    firstname: Joi.string().messages({
      "any.required": "firstname field is required.",
    }),
    lastname: Joi.string().messages({
      "any.required": "lastname field is required.",
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        "any.required": "email field is required.",
      }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).messages({
      "string.pattern.base":
        "Password should be between 3 to 30 characters and contain letters or numbers only",
      "string.empty": "Password cannot be empty",
      "any.required": "password field is required",
    }),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .messages({
        "any.required": "phone field is required.",
      }),
  })
    .options({ presence: "required" })
    .required();

  static userLogin = Joi.object({
    username: Joi.string().messages({
      "any.required": "username field is required.",
    }),
    password: Joi.string().messages({
      "any.required": "password field is required.",
    }),
  })
    .options({ presence: "required" })
    .required();
}
module.exports = userSchema;
