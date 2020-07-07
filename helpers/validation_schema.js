// * Third party libraries
const Joi = require('@hapi/joi')

const authSchema = Joi.object({
    firstname: Joi.string().max(150).required(),
    lastname: Joi.string().max(150).required(),
    email: Joi.string().email().max(250).lowercase().required(),
    phone: Joi.string().max(30).required(),
    password: Joi.string().min(6).required()
})

module.exports = {
    authSchema
}