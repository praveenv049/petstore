const Joi = require("joi");

class petSchema {
  constructor() {}
  static createSchema = Joi.object({
    name: Joi.string().messages({
      "any.required": "name field is required.",
    }),
    tags: Joi.string().messages({
      "any.required": "tags field is required.",
    }),
    category: Joi.string().messages({
      "any.required": "category field is required.",
    }),
    status: Joi.string().valid("available", "pending", "sold").messages({
      "any.required": "status field is required.",
    }),
  })
    .options({ presence: "required" })
    .required();

  static updateSchema = Joi.object({
    status: Joi.string()
      .valid("available", "pending", "sold")
      .required()
      .messages({
        "any.required": "status field is required.",
      }),
  });
}

module.exports = petSchema;
