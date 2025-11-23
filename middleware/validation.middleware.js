import Joi from "joi";

const schemas = {
    register: Joi.object({
        login: Joi.string().alphanum().min(3).max(50).required(),
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().max(100).required(),
        phone: Joi.string().pattern(/^[0-9+\-() ]{7,20}$/).required(),
        password: Joi.string().min(4).max(64).required(),
        role: Joi.string().valid("user", "admin").default("user"),
    }),

    login: Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required(),
    }),

    changePassword: Joi.object({
        params: Joi.object({
            login: Joi.string().required(), // validate login param
        }),
        newPassword: Joi.string().min(4).max(64).required(),
    }),
    verification: Joi.object({
        email: Joi.string().email().max(100).required(),
        code: Joi.string().length(4).pattern(/^\d+$/).required(), // "4486"
        newPassword: Joi.string().min(4).max(64)
    })
};

const validation = (schemaName, target = "body") => {
    return (req, res, next) => {
        const schema = schemas[schemaName];

        if (!schema) {
            return next(new Error(`Schema ${schemaName} not found`));
        }

        const { error } = schema.validate(req[target], { abortEarly: false });

        if (error) {
            return res.status(400).send({
                code: 400,
                status: "Bad request",
                message: error.details.map(d => d.message), // show all errors
                path: req.path,
            });
        }

        return next();
    };
};

// export { schemas, validation };
export default validation;
