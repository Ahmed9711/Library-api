import Joi from "joi";

export const createBookValidation = {
    body: Joi.object({
        name: Joi.string().min(3).max(20).required().messages({
            "string.min":"Name must be at least 3 characters"
        }),
        category: Joi.string().min(3).max(20).required().messages({
            "string.min":"Category must be at least 3 characters"
        }),
        author: Joi.string().min(5).max(20).required().messages({
            "string.min":"author must be at least 3 characters"
        }),
        num: Joi.number()
    }).required()
}