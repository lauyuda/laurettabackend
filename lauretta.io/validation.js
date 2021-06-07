const Joi = require('@hapi/joi');

const loginValidation = data => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
