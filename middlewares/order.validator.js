const Joi = require("joi");

const orderSchema = Joi.object({
  petId: Joi.number().messages({
    "any.required": "petId field is required.",
  }),
  quantity: Joi.number().greater(0).messages({
    "any.required": "quantity field is required.",
  }),
  shipDate: Joi.date().iso().greater('now').options({ convert: true }).messages({
    "any.required": "shipDate field is required.",
  }),
  complete: Joi.boolean().messages({
    "any.required": "complete field is required.",
  }),
})
  .options({ presence: "required" })
  .required();

module.exports = orderSchema;
