import Joi from 'joi';
const schemas = {
    code: Joi.object({
        code: Joi.string()
            .pattern(/^\d{4}$/) // exactly 4 digits
            .required(),
        email: Joi.string()
            .email({ tlds: { allow: false } }) // valid email format
            .required() // make it mandatory
    }),
    login: Joi.object({
        login: Joi.string().min(3).max(20).required(),
        password: Joi.string().min(3).max(20).required(),
    }),
    register: Joi.object({
        login: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),

        password: Joi.string()
            .min(4)
            .max(20)
            .pattern(new RegExp('^[0-9a-zA-Z!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?]*$'))
            .required(),

        fullName: Joi.string()
            .min(3)
            .max(30)
            .required(),

        email: Joi.string()
            .email({ tlds: { allow: false } }) // allow any TLD
            .required(),

        country: Joi.string()
            .min(2)
            .max(50)
            .required(),

        birthday: Joi.date()
            .less('now')               // must be in the past
            .iso()                     // ISO format: YYYY-MM-DD
            .required()
    }),
    getSentences:Joi.object({
    level: Joi.string()
        .valid('A1', 'A2', 'B1', 'B2', 'C1', 'C2')
        .required(),
    know: Joi.string()
        .valid('en', 'am', 'ru', 'hw')
        .required(),
    learn: Joi.string()
        .valid('en', 'am', 'ru', 'hw')
        .required(),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .default(5)
})
};
const validate = (schemaName, target = 'body') => {
    return (req, res, next) => {
        const schema = schemas[schemaName];

        if (!schema) {
            return next(new Error(`Schema ${schemaName} not found`));
        }

        const {error} = schema.validate(req[target]);

        if (error) {
            return res.status(400).send({
                code: 400,
                status: 'Bad request',
                message: error.details[0].message,
                path: req.path
            });
        }

        return next();
    }
}
export default validate;
