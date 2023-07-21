const Joi = require("joi");

const petSchema = Joi.object({
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

module.exports = petSchema;
