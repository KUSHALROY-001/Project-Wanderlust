const Joi = require("joi");

const ListingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string()/*.uri()*/.optional(),
  price: Joi.number().min(0).required(),
  country: Joi.string().required(),
  location: Joi.string().required(),
});

const ReviewSchema = Joi.object({
  comment: Joi.string().required().min(1).max(500),
  rating: Joi.number().min(1).max(5).required(),
})
module.exports = { ListingSchema, ReviewSchema };
