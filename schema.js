const Joi = require('joi');

const ListingSchema = Joi.object({
    Listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().optional()/*.uri()*/,
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required()
    })
});
module.exports = ListingSchema;