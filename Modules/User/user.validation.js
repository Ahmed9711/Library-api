import Joi from "joi";

export const SignUpValidation = {
    body:Joi.object().required().keys({
        name: Joi.string().min(3).max(20).required().messages({
            "string.min":"Name must be at least 3 characters"
        }),
        email: Joi.string().email({tlds: {allow: ['com','net']}}).required().messages({
            "string.email":"Email format is In-valid",
            "any.required":"Email is required, please enter your email"
        }),
        mobile: Joi.number(),
        password: Joi.string().required().min(4).max(12).messages({
            "string.min":"password must be at least 4 characters"
        }),
        cpassword: Joi.string().valid(Joi.ref('password')).messages({
            "any.only":"Confirmation password must match password"
        })
    })
}

export const LoginValidation = {
    body: Joi.object({
        email: Joi.string().email({tlds: {allow: ['com','net']}}).required().messages({
            "string.email":"Email format is In-valid",
            "any.required":"Email is required, please enter your email"
        }),
        password: Joi.string().required().min(4).max(12).messages({
            "string.min":"password must be at least 4 characters"
        })
    }).required()
}

export const updateValidation = {
    body: Joi.object({
        name: Joi.string().min(3).max(20).required().messages({
            "string.min":"Name must be at least 3 characters"
        }),
        mobile: Joi.number().required()
    }).required()
}

export const changePasswordValidation = {
    body: Joi.object({
        oldpassword: Joi.string().required().min(4).max(12).messages({
            "string.min":"Old password must be at least 4 characters"
        }),
        password: Joi.string().required().min(4).max(12).messages({
            "string.min":"password must be at least 4 characters"
        }),
        cpassword: Joi.string().valid(Joi.ref('password')).messages({
            "any.only":"Confirmation password must match password"
        })
    })
}

export const forgotPasswordValidation = {
    body: Joi.object({
        email: Joi.string().email({tlds: {allow: ['com','net']}}).required().messages({
            "string.email":"Email format is In-valid",
            "any.required":"Email is required, please enter your email"
        })
    }).required()
}

export const resetPasswordValidation = {
    body: Joi.object({
        code: Joi.string().required().messages({
            "any.required":"Code is required"
        }),
        email: Joi.string().email({tlds: {allow: ['com','net']}}).required().messages({
            "string.email":"Email format is In-valid",
            "any.required":"Email is required, please enter your email"
        }),
        newpassword: Joi.string().required().min(4).max(12).messages({
            "string.min":"password must be at least 4 characters"
        }),
        cpassword: Joi.string().valid(Joi.ref('newpassword')).messages({
            "any.only":"Confirmation password must match password"
        })
    })
}